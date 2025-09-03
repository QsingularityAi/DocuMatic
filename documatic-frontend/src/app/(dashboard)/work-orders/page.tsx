'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { WorkOrder } from '@/types'
import { apiService } from '@/services/api'
import { 
  Wrench, 
  Search, 
  Plus, 
  Clock,
  User,
  MapPin,
  Package,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Trash2
} from 'lucide-react'

export default function WorkOrdersPage() {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'in-progress' | 'completed' | 'cancelled' | 'overdue'>('all')
  const [filterPriority, setFilterPriority] = useState<'all' | 'low' | 'medium' | 'high' | 'critical'>('all')

  useEffect(() => {
    fetchWorkOrders()
  }, [])

  const fetchWorkOrders = async () => {
    try {
      const response = await apiService.getWorkOrders()
      setWorkOrders(response.docs || [])
    } catch (error) {
      console.error('Failed to fetch work orders:', error)
      // Set demo data for testing
      setWorkOrders([
        {
          id: '1',
          title: 'HVAC Maintenance',
          description: 'Regular maintenance of HVAC system',
          status: 'in-progress',
          priority: 'medium',
          type: 'preventive',
          assignedTo: { id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com' } as any,
          organization: { id: '1', name: 'Acme Corp Inc.' } as any,
          location: { id: '1', name: 'Main Building' } as any,
          estimatedDuration: 120,
          scheduledDate: '2024-01-20T09:00:00Z',
          dueDate: '2024-01-20T17:00:00Z',
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z',
        },
        {
          id: '2',
          title: 'Generator Repair',
          description: 'Emergency generator needs repair',
          status: 'pending',
          priority: 'high',
          type: 'corrective',
          assignedTo: { id: '2', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com' } as any,
          organization: { id: '1', name: 'Acme Corp Inc.' } as any,
          location: { id: '2', name: 'Basement' } as any,
          estimatedDuration: 240,
          scheduledDate: '2024-01-18T08:00:00Z',
          dueDate: '2024-01-18T16:00:00Z',
          createdAt: '2024-01-14T14:00:00Z',
          updatedAt: '2024-01-14T14:00:00Z',
        },
        {
          id: '3',
          title: 'Security System Check',
          description: 'Monthly security system inspection',
          status: 'completed',
          priority: 'low',
          type: 'inspection',
          assignedTo: { id: '3', firstName: 'Mike', lastName: 'Johnson', email: 'mike@example.com' } as any,
          organization: { id: '1', name: 'Acme Corp Inc.' } as any,
          location: { id: '1', name: 'Main Building' } as any,
          estimatedDuration: 60,
          scheduledDate: '2024-01-10T10:00:00Z',
          dueDate: '2024-01-10T11:00:00Z',
          completedDate: '2024-01-10T10:45:00Z',
          createdAt: '2024-01-05T09:00:00Z',
          updatedAt: '2024-01-10T10:45:00Z',
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const filteredWorkOrders = workOrders.filter(workOrder => {
    const matchesSearch = workOrder.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         workOrder.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'all' || workOrder.status === filterStatus
    const matchesPriority = filterPriority === 'all' || workOrder.priority === filterPriority
    return matchesSearch && matchesStatus && matchesPriority
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />
      case 'in-progress':
        return <Wrench className="h-4 w-4 text-blue-600" />
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-600" />
      case 'overdue':
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'in-progress':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      case 'overdue':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'bg-green-100 text-green-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'high':
        return 'bg-orange-100 text-orange-800'
      case 'critical':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Work Orders</h1>
            <p className="text-muted-foreground">
              Manage maintenance tasks and work orders
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
          <h1 className="text-2xl font-bold tracking-tight">Work Orders</h1>
          <p className="text-muted-foreground">
            Manage maintenance tasks and work orders
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Work Order
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
                placeholder="Search work orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
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
                  variant={filterStatus === 'pending' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('pending')}
                >
                  <Clock className="h-4 w-4 mr-1" />
                  Pending
                </Button>
                <Button
                  variant={filterStatus === 'in-progress' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('in-progress')}
                >
                  <Wrench className="h-4 w-4 mr-1" />
                  In Progress
                </Button>
                <Button
                  variant={filterStatus === 'completed' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('completed')}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Completed
                </Button>
                <Button
                  variant={filterStatus === 'overdue' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('overdue')}
                >
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  Overdue
                </Button>
              </div>
              <div className="flex gap-2">
                <span className="text-sm font-medium text-gray-700">Priority:</span>
                <Button
                  variant={filterPriority === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterPriority('all')}
                >
                  All
                </Button>
                <Button
                  variant={filterPriority === 'low' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterPriority('low')}
                >
                  Low
                </Button>
                <Button
                  variant={filterPriority === 'medium' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterPriority('medium')}
                >
                  Medium
                </Button>
                <Button
                  variant={filterPriority === 'high' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterPriority('high')}
                >
                  High
                </Button>
                <Button
                  variant={filterPriority === 'critical' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterPriority('critical')}
                >
                  Critical
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Work Orders Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredWorkOrders.map((workOrder) => (
          <Card key={workOrder.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{workOrder.title}</CardTitle>
                <div className="flex gap-1">
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(workOrder.status)}`}>
                    {workOrder.status}
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(workOrder.priority)}`}>
                    {workOrder.priority}
                  </div>
                </div>
              </div>
              <CardDescription>{workOrder.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <User className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="font-medium">Assigned:</span>
                  <span className="ml-1 text-gray-600">
                    {workOrder.assignedTo ? `${workOrder.assignedTo.firstName} ${workOrder.assignedTo.lastName}` : 'Unassigned'}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="font-medium">Location:</span>
                  <span className="ml-1 text-gray-600">{workOrder.location?.name}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Clock className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="font-medium">Duration:</span>
                  <span className="ml-1 text-gray-600">{workOrder.estimatedDuration} min</span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="font-medium">Due:</span>
                  <span className="ml-1 text-gray-600">
                    {new Date(workOrder.dueDate).toLocaleDateString()}
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
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredWorkOrders.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Wrench className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No work orders found</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery || filterStatus !== 'all' || filterPriority !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'Get started by creating your first work order.'
              }
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Work Order
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
