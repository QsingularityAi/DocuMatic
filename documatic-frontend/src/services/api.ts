import { 
  User, 
  Asset, 
  WorkOrder, 
  ServiceRequest, 
  Organization, 
  Location, 
  Vendor, 
  Contact, 
  Comment, 
  Upload, 
  SystemEvent, 
  AssetStatus, 
  Inventory, 
  ServiceChannel,
  Sensor,
  Team,
  Tenant,
  ApiResponse, 
  ApiError, 
  LoginCredentials, 
  AuthResponse,
  DashboardStats 
} from '@/types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/v0'

class ApiErrorClass extends Error {
  constructor(
    message: string,
    public status: number,
    public errors?: Record<string, string[]>
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

class ApiService {
  private baseURL: string
  private token: string | null = null

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL
    this.token = this.getStoredToken()
  }

  private getStoredToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token')
    }
    return null
  }

  private setToken(token: string): void {
    this.token = token
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token)
    }
  }

  private clearToken(): void {
    this.token = null
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    }

    if (this.token) {
      headers.Authorization = `JWT ${this.token}`
    }

    const config: RequestInit = {
      ...options,
      headers,
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new ApiErrorClass(
          errorData.message || `HTTP error! status: ${response.status}`,
          response.status,
          errorData.errors
        )
      }

      return await response.json()
    } catch (error) {
      if (error instanceof ApiErrorClass) {
        throw error
      }
      throw new ApiErrorClass(
        error instanceof Error ? error.message : 'Network error',
        0
      )
    }
  }

  // Authentication
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/users/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
    
    if (response.token) {
      this.setToken(response.token)
    }
    
    return response
  }

  async logout(): Promise<void> {
    try {
      await this.request('/users/logout', { method: 'POST' })
    } finally {
      this.clearToken()
    }
  }

  async getCurrentUser(): Promise<User> {
    return this.request<User>('/users/me')
  }

  // Users
  async getUsers(params?: Record<string, any>): Promise<ApiResponse<User>> {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : ''
    return this.request<ApiResponse<User>>(`/users${queryString}`)
  }

  async getUser(id: string): Promise<User> {
    return this.request<User>(`/users/${id}`)
  }

  async createUser(userData: Partial<User>): Promise<User> {
    return this.request<User>('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  }

  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    return this.request<User>(`/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(userData),
    })
  }

  async deleteUser(id: string): Promise<void> {
    return this.request<void>(`/users/${id}`, { method: 'DELETE' })
  }

  // Assets
  async getAssets(params?: Record<string, any>): Promise<ApiResponse<Asset>> {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : ''
    return this.request<ApiResponse<Asset>>(`/assets${queryString}`)
  }

  async getAsset(id: string): Promise<Asset> {
    return this.request<Asset>(`/assets/${id}`)
  }

  async createAsset(assetData: Partial<Asset>): Promise<Asset> {
    return this.request<Asset>('/assets', {
      method: 'POST',
      body: JSON.stringify(assetData),
    })
  }

  async updateAsset(id: string, assetData: Partial<Asset>): Promise<Asset> {
    return this.request<Asset>(`/assets/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(assetData),
    })
  }

  async deleteAsset(id: string): Promise<void> {
    return this.request<void>(`/assets/${id}`, { method: 'DELETE' })
  }

  // Work Orders
  async getWorkOrders(params?: Record<string, any>): Promise<ApiResponse<WorkOrder>> {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : ''
    return this.request<ApiResponse<WorkOrder>>(`/work-orders${queryString}`)
  }

  async getWorkOrder(id: string): Promise<WorkOrder> {
    return this.request<WorkOrder>(`/work-orders/${id}`)
  }

  async createWorkOrder(workOrderData: Partial<WorkOrder>): Promise<WorkOrder> {
    return this.request<WorkOrder>('/work-orders', {
      method: 'POST',
      body: JSON.stringify(workOrderData),
    })
  }

  async updateWorkOrder(id: string, workOrderData: Partial<WorkOrder>): Promise<WorkOrder> {
    return this.request<WorkOrder>(`/work-orders/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(workOrderData),
    })
  }

  async deleteWorkOrder(id: string): Promise<void> {
    return this.request<void>(`/work-orders/${id}`, { method: 'DELETE' })
  }

  // Service Requests
  async getServiceRequests(params?: Record<string, any>): Promise<ApiResponse<ServiceRequest>> {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : ''
    return this.request<ApiResponse<ServiceRequest>>(`/service-requests${queryString}`)
  }

  async getServiceRequest(id: string): Promise<ServiceRequest> {
    return this.request<ServiceRequest>(`/service-requests/${id}`)
  }

  async createServiceRequest(serviceRequestData: Partial<ServiceRequest>): Promise<ServiceRequest> {
    return this.request<ServiceRequest>('/service-requests', {
      method: 'POST',
      body: JSON.stringify(serviceRequestData),
    })
  }

  async updateServiceRequest(id: string, serviceRequestData: Partial<ServiceRequest>): Promise<ServiceRequest> {
    return this.request<ServiceRequest>(`/service-requests/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(serviceRequestData),
    })
  }

  async deleteServiceRequest(id: string): Promise<void> {
    return this.request<void>(`/service-requests/${id}`, { method: 'DELETE' })
  }

  // Organizations
  async getOrganizations(params?: Record<string, any>): Promise<ApiResponse<Organization>> {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : ''
    return this.request<ApiResponse<Organization>>(`/organizations${queryString}`)
  }

  async getOrganization(id: string): Promise<Organization> {
    return this.request<Organization>(`/organizations/${id}`)
  }

  // Locations
  async getLocations(params?: Record<string, any>): Promise<ApiResponse<Location>> {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : ''
    return this.request<ApiResponse<Location>>(`/locations${queryString}`)
  }

  async getLocation(id: string): Promise<Location> {
    return this.request<Location>(`/locations/${id}`)
  }

  // Vendors
  async getVendors(params?: Record<string, any>): Promise<ApiResponse<Vendor>> {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : ''
    return this.request<ApiResponse<Vendor>>(`/vendors${queryString}`)
  }

  async getVendor(id: string): Promise<Vendor> {
    return this.request<Vendor>(`/vendors/${id}`)
  }

  // Contacts
  async getContacts(params?: Record<string, any>): Promise<ApiResponse<Contact>> {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : ''
    return this.request<ApiResponse<Contact>>(`/contacts${queryString}`)
  }

  async getContact(id: string): Promise<Contact> {
    return this.request<Contact>(`/contacts/${id}`)
  }

  // Comments
  async getComments(parentType: string, parentId: string): Promise<Comment[]> {
    return this.request<Comment[]>(`/comments?where[parentType][equals]=${parentType}&where[parentId][equals]=${parentId}`)
  }

  async createComment(commentData: Partial<Comment>): Promise<Comment> {
    return this.request<Comment>('/comments', {
      method: 'POST',
      body: JSON.stringify(commentData),
    })
  }

  // Uploads
  async uploadFile(file: File): Promise<Upload> {
    const formData = new FormData()
    formData.append('file', file)

    const url = `${this.baseURL}/uploads`
    const headers: Record<string, string> = {}
    
    if (this.token) {
      headers.Authorization = `JWT ${this.token}`
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData,
    })

    if (!response.ok) {
      throw new ApiErrorClass('Upload failed', response.status)
    }

    return response.json()
  }

  // Dashboard Stats
  async getDashboardStats(): Promise<DashboardStats> {
    return this.request<DashboardStats>('/dashboard/stats')
  }

  // Search
  async search(query: string, collections?: string[]): Promise<any> {
    const params = new URLSearchParams({ q: query })
    if (collections) {
      params.append('collections', collections.join(','))
    }
    return this.request(`/search?${params.toString()}`)
  }

  // Health check
  async healthCheck(): Promise<{ status: string }> {
    return this.request<{ status: string }>('/health')
  }
}

// Create and export a singleton instance
export const apiService = new ApiService()
export { ApiErrorClass as ApiError }
