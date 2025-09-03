'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DashboardStats } from '@/types'
import { apiService } from '@/services/api'
import { 
  Package, 
  Wrench, 
  MessageSquare, 
  AlertTriangle,
  TrendingUp,
  Users
} from 'lucide-react'

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await apiService.getDashboardStats()
        setStats(data)
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error)
        // Set default stats for demo
        setStats({
          totalAssets: 156,
          activeAssets: 142,
          pendingWorkOrders: 23,
          completedWorkOrders: 89,
          openServiceRequests: 7,
          overdueTasks: 5,
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const statCards = [
    {
      title: 'Total Assets',
      value: stats?.totalAssets || 0,
      description: 'Assets in system',
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Active Assets',
      value: stats?.activeAssets || 0,
      description: 'Currently online',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Pending Work Orders',
      value: stats?.pendingWorkOrders || 0,
      description: 'Awaiting action',
      icon: Wrench,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Open Service Requests',
      value: stats?.openServiceRequests || 0,
      description: 'Needs attention',
      icon: MessageSquare,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Overdue Tasks',
      value: stats?.overdueTasks || 0,
      description: 'Past due date',
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      title: 'Completed Work Orders',
      value: stats?.completedWorkOrders || 0,
      description: 'This month',
      icon: Users,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to DocuMatic. Here's an overview of your system.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">
                {card.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest system events and updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Work Order #WO-001 completed</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New asset registered: HVAC-Unit-03</p>
                  <p className="text-xs text-muted-foreground">4 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Service request created: Equipment malfunction</p>
                  <p className="text-xs text-muted-foreground">6 hours ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <Package className="h-6 w-6 mb-2 text-blue-600" />
                <p className="text-sm font-medium">Add Asset</p>
              </button>
              <button className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <Wrench className="h-6 w-6 mb-2 text-orange-600" />
                <p className="text-sm font-medium">Create Work Order</p>
              </button>
              <button className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <MessageSquare className="h-6 w-6 mb-2 text-purple-600" />
                <p className="text-sm font-medium">New Service Request</p>
              </button>
              <button className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <Users className="h-6 w-6 mb-2 text-green-600" />
                <p className="text-sm font-medium">Add User</p>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
