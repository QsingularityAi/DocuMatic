# DocuMatic API powered by Payload

## Database and migrations

There are two databases: `dev`, which is a remote instance which contains a stable structure and `local` which is a local instance of Postgres running via Docker locally, so we can work on development that might include breaking changes in the data model that won't affect the `dev` version of our database.

- `pnpm dev:local` -> runs Payload connected to the local database running on Docker.
- `pnpm dev:remote` -> runs Payload connected to the remote database.
- `pnpm db:reseed` does:
  - Completely erase your local database.
  - Pulls the schema from the remote database and imports it into your local database.
  - Runs the `src/migrations/fresh-seed.sql` and imports its contents into your local database — The seed data contains 2 tenants and their respective users for each role: `tenant-owner`, `tenant-admin`, `tenant-manager`, `tenant-user`, `tenant-external-user`. All of them with password `12345678!,`.

### Prerequisites for Windows Users

The `db:reseed` command requires PostgreSQL command-line tools (`pg_dump` and `psql`). If you're using Windows, follow these steps to install them:

1. **Install PostgreSQL Client Tools**:

   - Download the PostgreSQL installer from the [official website](https://www.postgresql.org/download/windows/)
   - During installation, you can uncheck the actual database server if you only need the client tools
   - Make sure "Command Line Tools" is checked in the components selection
   - Complete the installation

2. **Add to PATH**:

   - The installer should automatically add the PostgreSQL bin directory to your PATH
   - If commands aren't recognized, add the bin directory manually (typically `C:\Program Files\PostgreSQL\[version]\bin`)
   - You can verify installation by opening a new command prompt and typing `pg_dump --version`

3. **Alternative: Use EDB's Distribution**:
   - You can also download just the command-line tools from [EnterpriseDB](https://www.enterprisedb.com/download-postgresql-binaries)
   - Extract the zip file to a directory of your choice
   - Add that directory to your PATH environment variable

After installing the tools, you should be able to use the `pnpm db:reseed` command successfully.
