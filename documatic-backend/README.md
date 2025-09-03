# DocuMatic API powered by Payload CMS

A robust backend API built with Payload CMS, PostgreSQL, and Next.js for the DocuMatic platform.

## 🚀 Quick Start

### Prerequisites

- **Node.js**: v18.20.2 or >=20.9.0
- **pnpm**: Package manager
- **Docker**: For local PostgreSQL database
- **PostgreSQL Client Tools**: For database operations (Windows users)

### Installation

1. **Clone and install dependencies**:
   ```bash
   cd documatic-backend
   pnpm install
   ```

2. **Set up environment variables**:
   Create a `.env.local` file in the root directory:
   ```bash
   # Database Configuration
   DATABASE_URI=postgresql://postgres:postgres@localhost:5433/postgres

   # Payload Secret Key (Required for security)
   APP_SECRET=WJogFbINqi5/1EiANp9BhxIwEoU/AG3UkJaRI70HShc=

   # App Configuration
   APP_PROTOCOL=http
   APP_DOMAIN=localhost
   APP_PORT=3000
   APP_CORS_ORIGINS=http://localhost:3000,http://localhost:5173

   # Environment
   NODE_ENV=development
   APP_ENV=local

   # Email Configuration (if using Resend)
   # RESEND_API_KEY=your-resend-api-key

   # Upload Configuration (if using UploadThing)
   # UPLOADTHING_SECRET=your-uploadthing-secret
   # UPLOADTHING_APP_ID=your-uploadthing-app-id
   ```

3. **Start the development server**:
   ```bash
   pnpm dev
   ```

This command will:
- Start PostgreSQL database via Docker on port 5433
- Start the Payload API server on port 3000
- Run database migrations automatically
- Seed the database with initial data
- Start the development server with hot reload

## 📋 Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start API with local database (Docker) |
| `pnpm dev:local` | Start API connected to local database |
| `pnpm dev:remote` | Start API connected to remote database |
| `pnpm docker:up` | Start only the PostgreSQL database |
| `pnpm docker:down` | Stop the PostgreSQL database |
| `pnpm db:reset` | Reset database with fresh migrations |
| `pnpm db:seed` | Seed database with sample data |
| `pnpm db:reseed` | Reset and reseed from remote database |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm lint:fix` | Fix ESLint issues |
| `pnpm type-check` | Run TypeScript type checking |

## 🗄️ Database Setup

### Local Development Database

- **PostgreSQL**: Running on Docker (port 5433)
- **Database**: `postgres`
- **User**: `postgres`
- **Password**: `postgres`

### Database Management

**Reset and seed your local database**:
```bash
# Complete reset with fresh data
pnpm db:reseed

# Or step by step
pnpm db:reset
pnpm db:seed
```

**Run migrations manually**:
```bash
pnpm payload migrate
```

## 🧪 Testing Your API

### 1. Using Bruno (API Testing Tool)

Your project includes Bruno API tests for comprehensive testing:

```bash
# Install Bruno (if not already installed)
npm install -g @bruno/cli

# Run API tests
bruno run .bruno/payload-api
```

### 2. Manual API Testing

**Base URLs**:
- **API Base**: `http://localhost:3000/v0`
- **Admin Panel**: `http://localhost:3000/zelmin`
- **GraphQL**: `http://localhost:3000/v0/graphql`

**Example API calls**:

1. **Login** (POST):
   ```bash
   curl -X POST http://localhost:3000/v0/users/login \
     -H "Content-Type: application/json" \
     -d '{
       "email": "documatic.com+acme.mariafernandez@gmail.com",
       "password": "12345678!,"
     }'
   ```

2. **Get Users** (GET):
   ```bash
   curl -X GET http://localhost:3000/v0/users \
     -H "Authorization: JWT your-jwt-token"
   ```

3. **Create Work Order** (POST):
   ```bash
   curl -X POST http://localhost:3000/v0/work-orders \
     -H "Content-Type: application/json" \
     -H "Authorization: JWT your-jwt-token" \
     -d '{
       "title": "Test Work Order",
       "description": "This is a test work order",
       "priority": "medium",
       "status": "pending"
     }'
   ```

### 3. Using the Admin Panel

1. Visit `http://localhost:3000/zelmin`
2. Login with any of the seeded user credentials (see below)

## 👥 Available Test Users

The system comes pre-seeded with test users for different roles:

### Super Admin
- **Email**: `documatic.com@gmail.com`
- **Password**: `bm$w_a;:_R/g6Z3+*`
- **Role**: Super Admin (full access)

### Acme Corp Inc. Users
- **Max Mustermann** (Owner)
  - Email: `documatic.com+acme.maxmustermann@gmail.com`
  - Password: `12345678!,`
  - Role: Tenant Owner

- **Maria Fernandez** (Manager)
  - Email: `documatic.com+acme.mariafernandez@gmail.com`
  - Password: `12345678!,`
  - Role: Tenant Manager

- **Terry Clarkson** (User)
  - Email: `documatic.com+acme.terryclarkson@gmail.com`
  - Password: `12345678!,`
  - Role: Tenant User

- **Viktor Hofman** (External User)
  - Email: `documatic.com+acme.viktorhofman@gmail.com`
  - Password: `12345678!,`
  - Role: Tenant External User

### The Food Company Users
- **John Doe** (Owner)
  - Email: `documatic.com+thefoodcompany.johndoe@gmail.com`
  - Password: `12345678!,`
  - Role: Tenant Owner

- **Martin Schmidt** (Manager)
  - Email: `documatic.com+thefoodcompany.martinschmidt@gmail.com`
  - Password: `12345678!,`
  - Role: Tenant Manager

- **Teo Soto** (User)
  - Email: `documatic.com+thefoodcompany.teosoto@gmail.com`
  - Password: `12345678!,`
  - Role: Tenant User

- **Vera Fischer** (External User)
  - Email: `documatic.com+thefoodcompany.verafischer@gmail.com`
  - Password: `12345678!,`
  - Role: Tenant External User

## 📊 Available Collections

Your API includes these collections with full CRUD operations:

| Collection | Description | Endpoint |
|------------|-------------|----------|
| **Users** | User management | `/v0/users` |
| **Tenants** | Multi-tenant support | `/v0/tenants` |
| **Organizations** | Organization management | `/v0/organizations` |
| **Teams** | Team management | `/v0/teams` |
| **Assets** | Asset management | `/v0/assets` |
| **Work Orders** | Work order management | `/v0/work-orders` |
| **Service Requests** | Service request management | `/v0/service-requests` |
| **Locations** | Location management | `/v0/locations` |
| **Vendors** | Vendor management | `/v0/vendors` |
| **Sensors** | Sensor management | `/v0/sensors` |
| **Comments** | Comment system | `/v0/comments` |
| **System Events** | System event logging | `/v0/system-events` |
| **Contacts** | Contact management | `/v0/contacts` |
| **Inventories** | Inventory management | `/v0/inventories` |
| **Service Channels** | Service channel management | `/v0/service-channels` |
| **Asset Statuses** | Asset status management | `/v0/asset-statuses` |
| **Uploads** | File upload management | `/v0/uploads` |

## 🔧 Environment Configuration

### Required Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URI` | PostgreSQL connection string | `postgresql://postgres:postgres@localhost:5433/postgres` |
| `APP_SECRET` | Payload secret key for security | `WJogFbINqi5/1EiANp9BhxIwEoU/AG3UkJaRI70HShc=` |
| `APP_PROTOCOL` | Application protocol | `http` |
| `APP_DOMAIN` | Application domain | `localhost` |
| `APP_PORT` | Application port | `3000` |
| `APP_CORS_ORIGINS` | CORS allowed origins | `http://localhost:3000,http://localhost:5173` |

### Optional Environment Variables

| Variable | Description | When to use |
|----------|-------------|-------------|
| `RESEND_API_KEY` | Resend email service API key | For email notifications |
| `UPLOADTHING_SECRET` | UploadThing secret key | For file uploads |
| `UPLOADTHING_APP_ID` | UploadThing app ID | For file uploads |
| `STAGING_DATABASE_URI` | Remote database URI | For db:reseed command |

## 🐛 Troubleshooting

### Common Issues

1. **Port conflicts**:
   - If port 3000 is busy, check your `APP_PORT` environment variable
   - If port 5433 is busy, stop other PostgreSQL instances

2. **Database connection issues**:
   ```bash
   # Check if Docker is running
   docker ps
   
   # Restart database container
   pnpm docker:down
   pnpm docker:up
   ```

3. **CORS issues**:
   - Check your `APP_CORS_ORIGINS` environment variable
   - Ensure frontend URLs are included

4. **Authentication errors**:
   - Verify user credentials in the database
   - Check if `APP_SECRET` is properly set

5. **Missing secret key error**:
   - Ensure `.env.local` file exists with `APP_SECRET`
   - Restart the development server

### Database Reset

If you need to completely reset your database:

```bash
# Stop the server
Ctrl+C

# Reset database
pnpm db:reset

# Seed with fresh data
pnpm db:seed

# Restart server
pnpm dev
```

## 📚 API Documentation

### Authentication

All API endpoints require authentication except for login:

```bash
# Login to get JWT token
curl -X POST http://localhost:3000/v0/users/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password"}'

# Use JWT token in subsequent requests
curl -X GET http://localhost:3000/v0/users \
  -H "Authorization: JWT your-jwt-token"
```

### Multi-Tenant Support

The API supports multi-tenancy with tenant-specific data isolation:

- Users can belong to multiple tenants
- Data is filtered by tenant context
- Admin users can access all tenants

### File Uploads

File uploads are handled through the `/v0/uploads` endpoint:

```bash
curl -X POST http://localhost:3000/v0/uploads \
  -H "Authorization: JWT your-jwt-token" \
  -F "file=@/path/to/file.jpg"
```

## 🚀 Production Deployment

### Build for Production

```bash
# Build the application
pnpm build

# Start production server
pnpm start
```

### Environment Variables for Production

Update your environment variables for production:

```bash
NODE_ENV=production
APP_ENV=production
APP_PROTOCOL=https
APP_DOMAIN=your-domain.com
DATABASE_URI=your-production-database-uri
APP_SECRET=your-production-secret
```

## 📝 Development Workflow

1. **Start development**: `pnpm dev`
2. **Make changes**: Edit files in `src/`
3. **Test API**: Use Bruno or manual requests
4. **Check types**: `pnpm type-check`
5. **Lint code**: `pnpm lint`
6. **Reset database**: `pnpm db:reset` (if needed)

## 🤝 Contributing

1. Follow the existing code style
2. Run linting before committing: `pnpm lint:fix`
3. Test your changes thoroughly
4. Update documentation as needed

---

**DocuMatic API** - Built with ❤️ using Payload CMS, PostgreSQL, and Next.js
