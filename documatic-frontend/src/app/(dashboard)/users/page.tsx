'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { User } from '@/types'
import { apiService } from '@/services/api'
import { 
  Users, 
  Search, 
  Plus, 
  Mail,
  Phone,
  Building,
  Shield,
  UserCheck,
  UserX,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal
} from 'lucide-react'

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterRole, setFilterRole] = useState<'all' | 'super-admin' | 'admin' | 'manager' | 'technician' | 'viewer'>('all')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await apiService.getUsers()
      setUsers(response.docs || [])
    } catch (error) {
      console.error('Failed to fetch users:', error)
      // Set demo data for testing
      setUsers([
        {
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@acme.com',
          phone: '+1-555-0123',
          role: 'admin',
          status: 'active',
          organization: { id: '1', name: 'Acme Corp Inc.' } as any,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z',
        },
        {
          id: '2',
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane.smith@acme.com',
          phone: '+1-555-0124',
          role: 'manager',
          status: 'active',
          organization: { id: '1', name: 'Acme Corp Inc.' } as any,
          createdAt: '2024-01-02T00:00:00Z',
          updatedAt: '2024-01-14T15:30:00Z',
        },
        {
          id: '3',
          firstName: 'Mike',
          lastName: 'Johnson',
          email: 'mike.johnson@acme.com',
          phone: '+1-555-0125',
          role: 'technician',
          status: 'active',
          organization: { id: '1', name: 'Acme Corp Inc.' } as any,
          createdAt: '2024-01-03T00:00:00Z',
          updatedAt: '2024-01-13T09:15:00Z',
        },
        {
          id: '4',
          firstName: 'Sarah',
          lastName: 'Wilson',
          email: 'sarah.wilson@acme.com',
          phone: '+1-555-0126',
          role: 'viewer',
          status: 'inactive',
          organization: { id: '1', name: 'Acme Corp Inc.' } as any,
          createdAt: '2024-01-04T00:00:00Z',
          updatedAt: '2024-01-12T16:45:00Z',
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = filterRole === 'all' || user.role === filterRole
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus
    return matchesSearch && matchesRole && matchesStatus
  })

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super-admin':
        return 'bg-red-100 text-red-800'
      case 'admin':
        return 'bg-purple-100 text-purple-800'
      case 'manager':
        return 'bg-blue-100 text-blue-800'
      case 'technician':
        return 'bg-green-100 text-green-800'
      case 'viewer':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'inactive':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'super-admin':
        return <Shield className="h-4 w-4" />
      case 'admin':
        return <Shield className="h-4 w-4" />
      case 'manager':
        return <Users className="h-4 w-4" />
      case 'technician':
        return <UserCheck className="h-4 w-4" />
      case 'viewer':
        return <UserX className="h-4 w-4" />
      default:
        return <Users className="h-4 w-4" />
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Users</h1>
            <p className="text-muted-foreground">
              Manage user accounts and permissions
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="h-6 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 w-40 bg-gray-200 rounded animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">
            Manage user accounts and permissions
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="flex gap-2">
                <span className="text-sm font-medium text-gray-700">Role:</span>
                <Button
                  variant={filterRole === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterRole('all')}
                >
                  All
                </Button>
                <Button
                  variant={filterRole === 'super-admin' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterRole('super-admin')}
                >
                  <Shield className="h-4 w-4 mr-1" />
                  Super Admin
                </Button>
                <Button
                  variant={filterRole === 'admin' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterRole('admin')}
                >
                  <Shield className="h-4 w-4 mr-1" />
                  Admin
                </Button>
                <Button
                  variant={filterRole === 'manager' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterRole('manager')}
                >
                  <Users className="h-4 w-4 mr-1" />
                  Manager
                </Button>
                <Button
                  variant={filterRole === 'technician' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterRole('technician')}
                >
                  <UserCheck className="h-4 w-4 mr-1" />
                  Technician
                </Button>
                <Button
                  variant={filterRole === 'viewer' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterRole('viewer')}
                >
                  <UserX className="h-4 w-4 mr-1" />
                  Viewer
                </Button>
              </div>
              <div className="flex gap-2">
                <span className="text-sm font-medium text-gray-700">Status:</span>
                <Button
                  variant={filterStatus === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('all')}
                >
                  All
                </Button>
                <Button
                  variant={filterStatus === 'active' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('active')}
                >
                  Active
                </Button>
                <Button
                  variant={filterStatus === 'inactive' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('inactive')}
                >
                  Inactive
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  {user.firstName} {user.lastName}
                </CardTitle>
                <div className="flex gap-1">
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                    {user.role}
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                    {user.status}
                  </div>
                </div>
              </div>
              <CardDescription>{user.email}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <Mail className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="font-medium">Email:</span>
                  <span className="ml-1 text-gray-600">{user.email}</span>
                </div>
                {user.phone && (
                  <div className="flex items-center text-sm">
                    <Phone className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="font-medium">Phone:</span>
                    <span className="ml-1 text-gray-600">{user.phone}</span>
                  </div>
                )}
                <div className="flex items-center text-sm">
                  <Building className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="font-medium">Organization:</span>
                  <span className="ml-1 text-gray-600">{user.organization?.name}</span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="font-medium">Member since:</span>
                  <span className="ml-1 text-gray-600">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button variant="outline" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery || filterRole !== 'all' || filterStatus !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'Get started by adding your first user.'
              }
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
