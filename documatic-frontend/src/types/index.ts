// Base types
export interface BaseEntity {
  id: string
  createdAt: string
  updatedAt: string
}

// User types
export interface User extends BaseEntity {
  email: string
  firstName: string
  lastName: string
  roles: UserRole[]
  tenants?: UserTenant[]
  avatar?: string
  isActive: boolean
}

export type UserRole = 'super-admin' | 'service-agent' | 'tenant'

export interface UserTenant {
  tenant: Tenant
  roles: TenantRole[]
}

export type TenantRole = 'tenant-owner' | 'tenant-admin' | 'tenant-manager' | 'tenant-user' | 'tenant-external-user'

// Tenant types
export interface Tenant extends BaseEntity {
  name: string
  slug: string
  settings?: TenantSettings
}

export interface TenantSettings {
  workingDays: string[]
  timezone: string
  currency: string
  language: string
}

// Organization types
export interface Organization extends BaseEntity {
  name: string
  description?: string
  tenant: Tenant
  address?: string
  phone?: string
  email?: string
}

// Team types
export interface Team extends BaseEntity {
  name: string
  description?: string
  organization: Organization
  members: User[]
  leader?: User
}

// Asset types
export interface Asset extends BaseEntity {
  name: string
  description?: string
  assetId: string
  status: AssetStatus
  location: Location
  organization: Organization
  qrCode?: string
  sensors?: Sensor[]
  maintenanceHistory?: WorkOrder[]
  specifications?: Record<string, any>
  purchaseDate?: string
  warrantyExpiry?: string
  estimatedLifespan?: number
}

export type AssetStatus = 'online' | 'offline' | 'no-tracking'

// Location types
export interface Location extends BaseEntity {
  name: string
  description?: string
  address?: string
  coordinates?: {
    latitude: number
    longitude: number
  }
  organization: Organization
  parentLocation?: Location
  subLocations?: Location[]
}

// Sensor types
export interface Sensor extends BaseEntity {
  name: string
  type: string
  asset: Asset
  status: 'active' | 'inactive' | 'error'
  lastReading?: {
    value: number
    unit: string
    timestamp: string
  }
  specifications?: Record<string, any>
}

// Work Order types
export interface WorkOrder extends BaseEntity {
  title: string
  description: string
  status: WorkOrderStatus
  priority: WorkOrderPriority
  type: WorkOrderType
  assignedTo?: User
  assignedBy?: User
  organization: Organization
  assets?: Asset[]
  location?: Location
  estimatedDuration?: number
  actualDuration?: number
  scheduledDate?: string
  completedDate?: string
  dueDate?: string
  recurrence?: WorkOrderRecurrence
  procedures?: WorkOrderProcedure[]
  attachments?: Upload[]
  comments?: Comment[]
}

export type WorkOrderStatus = 'pending' | 'in-progress' | 'completed' | 'cancelled' | 'overdue'
export type WorkOrderPriority = 'low' | 'medium' | 'high' | 'critical'
export type WorkOrderType = 'preventive' | 'corrective' | 'emergency' | 'inspection'

export interface WorkOrderRecurrence {
  type: 'daily' | 'weekly' | 'monthly' | 'yearly'
  interval: number
  daysOfWeek?: string[]
  endDate?: string
  maxOccurrences?: number
}

export interface WorkOrderProcedure {
  step: number
  title: string
  description: string
  estimatedTime: number
  isCompleted: boolean
  completedBy?: User
  completedAt?: string
}

// Service Request types
export interface ServiceRequest extends BaseEntity {
  title: string
  description: string
  status: ServiceRequestStatus
  priority: ServiceRequestPriority
  requester: User
  organization: Organization
  serviceChannel: ServiceChannel
  location?: Location
  assets?: Asset[]
  attachments?: Upload[]
  comments?: Comment[]
  convertedToWorkOrder?: WorkOrder
}

export type ServiceRequestStatus = 'open' | 'in-progress' | 'resolved' | 'closed'
export type ServiceRequestPriority = 'low' | 'medium' | 'high' | 'urgent'

// Service Channel types
export interface ServiceChannel extends BaseEntity {
  name: string
  description?: string
  type: 'email' | 'phone' | 'web' | 'mobile'
  isActive: boolean
  organization: Organization
  customFields?: ServiceChannelCustomField[]
}

export interface ServiceChannelCustomField {
  name: string
  type: 'text' | 'number' | 'boolean' | 'select'
  required: boolean
  options?: string[]
}

// Vendor types
export interface Vendor extends BaseEntity {
  name: string
  description?: string
  contactPerson?: string
  email?: string
  phone?: string
  address?: string
  website?: string
  organization: Organization
  services?: string[]
  rating?: number
  isActive: boolean
}

// Contact types
export interface Contact extends BaseEntity {
  firstName: string
  lastName: string
  email?: string
  phone?: string
  organization: Organization
  role?: string
  department?: string
  isActive: boolean
}

// Comment types
export interface Comment extends BaseEntity {
  content: string
  author: User
  parentType: 'work-order' | 'service-request' | 'asset'
  parentId: string
  attachments?: Upload[]
}

// Upload types
export interface Upload extends BaseEntity {
  filename: string
  originalName: string
  mimeType: string
  size: number
  url: string
  uploadedBy: User
}

// System Event types
export interface SystemEvent extends BaseEntity {
  type: string
  description: string
  user?: User
  organization?: Organization
  metadata?: Record<string, any>
  severity: 'info' | 'warning' | 'error' | 'critical'
}

// Asset Status types
export interface AssetStatus extends BaseEntity {
  name: string
  description?: string
  color: string
  isActive: boolean
}

// Inventory types
export interface Inventory extends BaseEntity {
  name: string
  description?: string
  quantity: number
  unit: string
  minQuantity: number
  maxQuantity: number
  location: Location
  organization: Organization
  supplier?: Vendor
  cost?: number
  lastRestocked?: string
  expiryDate?: string
}

// API Response types
export interface ApiResponse<T> {
  docs: T[]
  totalDocs: number
  limit: number
  totalPages: number
  page: number
  pagingCounter: number
  hasPrevPage: boolean
  hasNextPage: boolean
  prevPage?: number
  nextPage?: number
}

export interface ApiError {
  message: string
  status: number
  errors?: Record<string, string[]>
}

// Auth types
export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  user: User
  token: string
  refreshToken?: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

// Dashboard types
export interface DashboardStats {
  totalAssets: number
  activeAssets: number
  pendingWorkOrders: number
  completedWorkOrders: number
  openServiceRequests: number
  overdueTasks: number
}

export interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor?: string
    borderColor?: string
  }[]
}

// Form types
export interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'checkbox' | 'date' | 'file'
  required?: boolean
  options?: { label: string; value: string }[]
  placeholder?: string
  validation?: any
}

// Navigation types
export interface NavItem {
  title: string
  href: string
  icon?: React.ComponentType<{ className?: string }>
  badge?: string
  children?: NavItem[]
}

// Notification types
export interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  timestamp: string
  isRead: boolean
  actionUrl?: string
}
