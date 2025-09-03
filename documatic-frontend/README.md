# DocuMatic Frontend

A modern React frontend application for the DocuMatic Asset Management and Work Order System.

## 🚀 Quick Start

### Prerequisites

- **Node.js**: v18.20.2 or >=20.9.0
- **npm** or **pnpm**: Package manager
- **Backend API**: DocuMatic backend running on `http://localhost:3000`

### Installation

1. **Install dependencies**:
   ```bash
   cd documatic-frontend
   npm install
   ```

2. **Set up environment variables**:
   Create a `.env.local` file in the root directory:
   ```bash
   # Backend API Configuration
   NEXT_PUBLIC_API_URL=http://localhost:3000/v0
   NEXT_PUBLIC_ADMIN_URL=http://localhost:3000/zelmin

   # App Configuration
   NEXT_PUBLIC_APP_NAME=DocuMatic
   NEXT_PUBLIC_APP_VERSION=1.0.0

   # Feature Flags
   NEXT_PUBLIC_ENABLE_QR_SCANNING=true
   NEXT_PUBLIC_ENABLE_REAL_TIME_UPDATES=true
   NEXT_PUBLIC_ENABLE_OFFLINE_MODE=false

   # Development
   NODE_ENV=development
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3001` (or the next available port).

## 📋 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Run TypeScript type checking |

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication routes
│   │   └── login/         # Login page
│   ├── (dashboard)/       # Protected dashboard routes
│   │   ├── dashboard/     # Main dashboard
│   │   ├── assets/        # Asset management
│   │   ├── work-orders/   # Work order management
│   │   ├── service-requests/ # Service request management
│   │   ├── users/         # User management
│   │   └── settings/      # Settings page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   ├── layout/           # Layout components
│   └── forms/            # Form components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── services/             # API services
├── store/                # State management (Zustand)
├── types/                # TypeScript type definitions
└── utils/                # Helper utilities
```

## 🎨 UI Components

The application uses a modern component library built with:

- **Radix UI**: Accessible, unstyled UI primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Beautiful icons
- **Class Variance Authority**: Component variant management

### Key Components

- **Button**: Multiple variants (default, destructive, outline, etc.)
- **Card**: Content containers with header, content, and footer
- **Input**: Form input fields with validation
- **Sidebar**: Collapsible navigation with role-based menu
- **Header**: Top navigation with search and notifications

## 🔐 Authentication

The application uses JWT-based authentication with:

- **Zustand**: State management for auth
- **Persistent storage**: Tokens stored in localStorage
- **Protected routes**: Automatic redirect to login
- **Role-based access**: Different menus based on user roles

### User Roles

- **Super Admin**: Full system access
- **Tenant Owner**: Full tenant administration
- **Tenant Admin**: User and configuration management
- **Tenant Manager**: Operational management
- **Tenant User**: Day-to-day operations
- **Tenant External User**: Limited external access

## 📊 Dashboard Features

### Main Dashboard
- **Real-time stats**: Asset counts, work orders, service requests
- **Quick actions**: Common tasks and shortcuts
- **Recent activity**: Latest system events
- **Performance metrics**: Visual charts and indicators

### Asset Management
- **Asset catalog**: Complete asset inventory
- **QR code generation**: Asset tracking and identification
- **Status monitoring**: Real-time asset status
- **Location tracking**: Asset location management

### Work Order Management
- **Work order creation**: Comprehensive work order forms
- **Assignment system**: User assignment and tracking
- **Status workflow**: Pending → In Progress → Completed
- **Recurring tasks**: Automated maintenance scheduling

### Service Request Management
- **Request portal**: User-friendly request submission
- **Approval workflow**: Multi-step approval process
- **Communication trail**: Complete request history
- **Work order conversion**: Convert requests to work orders

## 🔧 API Integration

The frontend connects to the DocuMatic backend API with:

- **RESTful endpoints**: Standard CRUD operations
- **JWT authentication**: Secure token-based auth
- **Error handling**: Comprehensive error management
- **Type safety**: Full TypeScript integration

### API Service Structure

```typescript
// Example API usage
import { apiService } from '@/services/api'

// Get assets
const assets = await apiService.getAssets()

// Create work order
const workOrder = await apiService.createWorkOrder({
  title: 'Maintenance Task',
  description: 'Regular maintenance',
  priority: 'medium',
  status: 'pending'
})
```

## 🎯 Key Features

### Multi-Tenant Support
- **Tenant isolation**: Complete data separation
- **Role-based permissions**: Granular access control
- **Organization management**: Multi-organization support

### Real-time Updates
- **Live status updates**: Real-time asset status
- **Notification system**: Email and in-app notifications
- **Activity feeds**: Live activity tracking

### Mobile Responsive
- **Mobile-first design**: Responsive across all devices
- **Touch-friendly**: Optimized for mobile interaction
- **Progressive Web App**: Offline capabilities

### Advanced Features
- **QR code scanning**: Asset identification
- **File uploads**: Document and image management
- **Search functionality**: Global search across entities
- **Export capabilities**: Data export in multiple formats

## 🚀 Deployment

### Build for Production

```bash
# Build the application
npm run build

# Start production server
npm run start
```

### Environment Variables for Production

```bash
NEXT_PUBLIC_API_URL=https://api.documatic.com/v0
NEXT_PUBLIC_ADMIN_URL=https://admin.documatic.com
NODE_ENV=production
```

## 🧪 Testing

### Manual Testing

1. **Login**: Use test credentials from the login page
2. **Navigation**: Test all sidebar menu items
3. **CRUD operations**: Create, read, update, delete records
4. **Responsive design**: Test on different screen sizes

### Test Accounts

- **Super Admin**: `documatic.com@gmail.com` / `bm$w_a;:_R/g6Z3+*`
- **Manager**: `documatic.com+acme.mariafernandez@gmail.com` / `12345678!,`
- **User**: `documatic.com+acme.terryclarkson@gmail.com` / `12345678!,`

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Errors**:
   - Ensure backend is running on `http://localhost:3000`
   - Check `.env.local` configuration
   - Verify network connectivity

2. **Authentication Issues**:
   - Clear browser localStorage
   - Check token expiration
   - Verify user credentials

3. **Build Errors**:
   - Run `npm install` to ensure dependencies
   - Check TypeScript errors with `npm run type-check`
   - Verify environment variables

### Development Tips

- Use React Query DevTools for API debugging
- Check browser console for errors
- Use browser dev tools for responsive testing
- Monitor network tab for API calls

## 📚 Next Steps

### Planned Features

1. **Advanced Analytics**: Business intelligence dashboards
2. **IoT Integration**: Real-time sensor data
3. **Mobile App**: Native mobile application
4. **Advanced Reporting**: Custom report builder
5. **AI Features**: Predictive maintenance insights

### Contributing

1. Follow the existing code style
2. Add TypeScript types for new features
3. Test thoroughly before submitting
4. Update documentation as needed

---

**DocuMatic Frontend** - Built with ❤️ using Next.js, React, and TypeScript
