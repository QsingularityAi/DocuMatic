// scripts/db-reseed.js
// This script reseeds the local database with the schema from a remote database
// and then applies a seed file with initial data

import { exec, spawn } from 'child_process';
import * as dotenv from 'dotenv';
import { promises as fs } from 'fs';
import path from 'path';
import { promisify } from 'util';

// Make exec return a promise
const execPromise = promisify(exec);

// Load environment variables
dotenv.config();

const LOCAL_DB_URI = process.env.DATABASE_URI;
const REMOTE_DB_URI = process.env.STAGING_DATABASE_URI;
const SEED_FILE_PATH = path.join(
  process.cwd(),
  'src',
  'migrations',
  'fresh-seed.sql',
);

// Parsing database connection strings to extract credentials
function parseDbUri(uri) {
  try {
    const match = uri.match(
      /postgre(?:s|sql):\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/,
    );
    if (!match) throw new Error(`Invalid PostgreSQL connection string: ${uri}`);

    return {
      user: match[1],
      password: match[2],
      host: match[3],
      port: match[4],
      database: match[5],
    };
  } catch (error) {
    console.error('Error parsing database URI:', error.message);
    process.exit(1);
  }
}

// Run a command and capture output
async function runCommand(command, args = [], options = {}) {
  return new Promise((resolve, reject) => {
    const proc = spawn(command, args, {
      ...options,
      shell: true,
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';

    proc.stdout.on('data', (data) => {
      const output = data.toString();
      stdout += output;
      if (!options.silent) {
        console.log(output);
      }
    });

    proc.stderr.on('data', (data) => {
      const output = data.toString();
      stderr += output;
      if (!options.silent) {
        console.error(output);
      }
    });

    proc.on('close', (code) => {
      if (code === 0) {
        resolve({ stdout, stderr });
      } else {
        reject(new Error(`Process exited with code ${code}: ${stderr}`));
      }
    });

    proc.on('error', (err) => {
      reject(err);
    });
  });
}

// Main function
async function reseedDatabase() {
  console.log('🔄 Starting database reseed process...');

  try {
    if (!LOCAL_DB_URI || !REMOTE_DB_URI) {
      throw new Error(
        'Missing database connection strings. Make sure LOCAL_DATABASE_URI and REMOTE_DATABASE_URI are set in your .env file.',
      );
    }

    const remoteDb = parseDbUri(REMOTE_DB_URI);
    const localDb = parseDbUri(LOCAL_DB_URI);

    // Step 1: Export remote schema to a temporary file
    console.log('📤 Exporting schema from remote database...');
    const schemaFile = path.join(process.cwd(), 'temp_schema.sql');

    await runCommand(
      'pg_dump',
      [
        `-h${remoteDb.host}`,
        `-p${remoteDb.port}`,
        `-U${remoteDb.user}`,
        '-s', // schema-only
        '--exclude-table=payload_migrations', // Exclude the payload_migrations table
        `-d${remoteDb.database}`,
        `-f${schemaFile}`,
      ],
      {
        env: { ...process.env, PGPASSWORD: remoteDb.password },
      },
    );

    console.log('✅ Remote schema exported successfully.');

    // Step 2: Handle local database cleanup
    console.log('🗑️  Cleaning local database...');

    // Special handling for 'postgres' database - don't drop it, just clean schemas
    if (localDb.database === 'postgres') {
      console.log(
        '⚠️  Target database is "postgres". Will clean schemas without dropping the database.',
      );

      // Create a cleanup SQL file instead of running inline SQL
      const cleanupSqlFile = path.join(process.cwd(), 'temp_cleanup.sql');
      const cleanupSql = `
-- Terminate all other connections
SELECT pg_terminate_backend(pid) FROM pg_stat_activity 
WHERE pid <> pg_backend_pid() AND datname = '${localDb.database}';

-- Drop all schemas except system schemas
DO $$ 
DECLARE
  r RECORD;
BEGIN
  FOR r IN (SELECT schema_name FROM information_schema.schemata 
           WHERE schema_name NOT IN ('pg_catalog', 'information_schema', 'pg_toast') 
           AND schema_name NOT LIKE 'pg_%') 
  LOOP
    EXECUTE 'DROP SCHEMA IF EXISTS ' || quote_ident(r.schema_name) || ' CASCADE';
  END LOOP;
END $$;

-- Recreate public schema
DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO public;
`;

      // Write the SQL to a file
      await fs.writeFile(cleanupSqlFile, cleanupSql);

      // Execute the SQL file
      await runCommand(
        'psql',
        [
          `-h${localDb.host}`,
          `-p${localDb.port}`,
          `-U${localDb.user}`,
          `-d${localDb.database}`,
          `-f${cleanupSqlFile}`,
        ],
        {
          env: { ...process.env, PGPASSWORD: localDb.password },
        },
      );

      // Clean up the temporary SQL file
      await fs.unlink(cleanupSqlFile);

      console.log('✅ Database schemas cleaned successfully.');
    } else {
      // Normal case - drop and recreate the database
      // Connect to postgres database to drop and recreate the target database
      const dropDbCmd = `
        PGPASSWORD=${localDb.password} psql -h ${localDb.host} -p ${localDb.port} -U ${localDb.user} -d template1 -c "
          SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '${localDb.database}';
          DROP DATABASE IF EXISTS ${localDb.database};
          CREATE DATABASE ${localDb.database};
        "
      `;

      await execPromise(dropDbCmd);
      console.log('✅ Local database dropped and recreated.');
    }

    // Step 3: Import schema to local database
    console.log('📥 Importing schema to local database...');
    await runCommand(
      'psql',
      [
        `-h${localDb.host}`,
        `-p${localDb.port}`,
        `-U${localDb.user}`,
        `-d${localDb.database}`,
        `-f${schemaFile}`,
      ],
      {
        env: { ...process.env, PGPASSWORD: localDb.password },
      },
    );

    console.log('✅ Schema imported successfully.');

    // Step 4: Run seed file
    console.log('🌱 Running seed file...');
    await runCommand(
      'psql',
      [
        `-h${localDb.host}`,
        `-p${localDb.port}`,
        `-U${localDb.user}`,
        `-d${localDb.database}`,
        `-f${SEED_FILE_PATH}`,
      ],
      {
        env: { ...process.env, PGPASSWORD: localDb.password },
      },
    );

    console.log('✅ Seed file executed successfully.');

    // Step 5: Update sequences to match the maximum ID values
    console.log('🔄 Updating sequences...');
    const updateSequencesSql = `
    DO $$
    DECLARE
      r RECORD;
    BEGIN
      FOR r IN (SELECT 
                  table_name, 
                  column_name,
                  pg_get_serial_sequence(table_name::text, column_name::text) as seq_name
                FROM 
                  information_schema.columns
                WHERE 
                  table_schema = 'public'
                  AND column_name = 'id'
                  AND pg_get_serial_sequence(table_name::text, column_name::text) IS NOT NULL)
      LOOP
        IF r.seq_name IS NOT NULL THEN
          EXECUTE format('SELECT setval(%L, COALESCE((SELECT MAX(id) FROM %I), 1), true)', 
                        r.seq_name, r.table_name);
        END IF;
      END LOOP;
    END $$;
    `;

    // Create a temporary SQL file for sequence updates
    const updateSequencesFile = path.join(
      process.cwd(),
      'temp_update_sequences.sql',
    );
    await fs.writeFile(updateSequencesFile, updateSequencesSql);

    // Execute the sequence update SQL
    await runCommand(
      'psql',
      [
        `-h${localDb.host}`,
        `-p${localDb.port}`,
        `-U${localDb.user}`,
        `-d${localDb.database}`,
        `-f${updateSequencesFile}`,
      ],
      {
        env: { ...process.env, PGPASSWORD: localDb.password },
      },
    );

    // Clean up the temporary file
    await fs.unlink(updateSequencesFile);

    console.log('✅ Sequences updated successfully.');

    // Step 6: Clean up temporary files
    await fs.unlink(schemaFile);
    console.log('🧹 Temporary files cleaned up.');

    console.log('✨ Database reseed completed successfully!');
  } catch (error) {
    console.error('❌ Error during database reseed:', error.message);
    process.exit(1);
  }
}

// Run the script
reseedDatabase();
