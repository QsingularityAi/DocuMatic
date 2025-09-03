'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Calendar,
  Filter,
  Package,
  Wrench,
  Users,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react'

export default function ReportsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d')

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setIsLoading(false), 1000)
  }, [])

  const stats = {
    totalAssets: 156,
    activeAssets: 142,
    offlineAssets: 14,
    totalWorkOrders: 89,
    completedWorkOrders: 67,
    pendingWorkOrders: 22,
    totalUsers: 45,
    activeUsers: 42,
    totalLocations: 8,
    maintenanceCost: 12500,
    uptime: 98.5,
    efficiency: 87.2
  }

  const recentActivity = [
    {
      id: '1',
      type: 'work-order',
      title: 'HVAC Maintenance Completed',
      description: 'Regular maintenance completed on HVAC Unit 01',
      status: 'completed',
      timestamp: '2024-01-15T14:30:00Z',
      user: 'John Doe'
    },
    {
      id: '2',
      type: 'asset',
      title: 'Generator Backup Offline',
      description: 'Generator backup system went offline',
      status: 'alert',
      timestamp: '2024-01-15T13:15:00Z',
      user: 'System'
    },
    {
      id: '3',
      type: 'user',
      title: 'New User Added',
      description: 'Sarah Wilson added to the system',
      status: 'info',
      timestamp: '2024-01-15T11:00:00Z',
      user: 'Admin'
    },
    {
      id: '4',
      type: 'work-order',
      title: 'Security System Check',
      description: 'Monthly security system inspection scheduled',
      status: 'pending',
      timestamp: '2024-01-15T09:45:00Z',
      user: 'Mike Johnson'
    }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'alert':
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />
      case 'info':
        return <Users className="h-4 w-4 text-blue-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'alert':
        return 'bg-red-100 text-red-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'info':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground">
            View detailed reports and analytics for your organization
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
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
          <h1 className="text-2xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground">
            View detailed reports and analytics for your organization
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            {selectedPeriod === '7d' ? '7 Days' : 
             selectedPeriod === '30d' ? '30 Days' : 
             selectedPeriod === '90d' ? '90 Days' : '1 Year'}
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Period Selector */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <Button
              variant={selectedPeriod === '7d' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod('7d')}
            >
              7 Days
            </Button>
            <Button
              variant={selectedPeriod === '30d' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod('30d')}
            >
              30 Days
            </Button>
            <Button
              variant={selectedPeriod === '90d' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod('90d')}
            >
              90 Days
            </Button>
            <Button
              variant={selectedPeriod === '1y' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod('1y')}
            >
              1 Year
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAssets}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeAssets} active, {stats.offlineAssets} offline
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Work Orders</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalWorkOrders}</div>
            <p className="text-xs text-muted-foreground">
              {stats.completedWorkOrders} completed, {stats.pendingWorkOrders} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalUsers} total users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Locations</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLocations}</div>
            <p className="text-xs text-muted-foreground">
              Managed locations
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">System Uptime</CardTitle>
            <CardDescription>Overall system availability</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.uptime}%</div>
            <div className="mt-2 h-2 bg-gray-200 rounded-full">
              <div 
                className="h-2 bg-green-600 rounded-full" 
                style={{ width: `${stats.uptime}%` }}
              ></div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Excellent uptime performance
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Maintenance Efficiency</CardTitle>
            <CardDescription>Work order completion rate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{stats.efficiency}%</div>
            <div className="mt-2 h-2 bg-gray-200 rounded-full">
              <div 
                className="h-2 bg-blue-600 rounded-full" 
                style={{ width: `${stats.efficiency}%` }}
              ></div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Good efficiency rating
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Maintenance Cost</CardTitle>
            <CardDescription>Total maintenance expenses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${stats.maintenanceCost.toLocaleString()}</div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-sm text-green-600">+12% from last period</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Within budget expectations
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Activity</CardTitle>
          <CardDescription>Latest system activities and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {getStatusIcon(activity.status)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <span className="text-xs text-gray-500">
                      {new Date(activity.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{activity.description}</p>
                  <div className="flex items-center mt-1">
                    <span className="text-xs text-gray-500">by {activity.user}</span>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                      {activity.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
          <CardDescription>Generate specific reports and exports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="h-auto p-4 flex-col">
              <BarChart3 className="h-6 w-6 mb-2" />
              <span>Asset Performance</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex-col">
              <TrendingUp className="h-6 w-6 mb-2" />
              <span>Maintenance Trends</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex-col">
              <Users className="h-6 w-6 mb-2" />
              <span>User Activity</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex-col">
              <Download className="h-6 w-6 mb-2" />
              <span>Export Data</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
