'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Asset } from '@/types'
import { apiService } from '@/services/api'
import { 
  Package, 
  Search, 
  Plus, 
  Filter,
  MapPin,
  Wifi,
  WifiOff,
  Eye,
  Edit,
  Trash2
} from 'lucide-react'

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'online' | 'offline' | 'no-tracking'>('all')

  useEffect(() => {
    fetchAssets()
  }, [])

  const fetchAssets = async () => {
    try {
      const response = await apiService.getAssets()
      setAssets(response.docs || [])
    } catch (error) {
      console.error('Failed to fetch assets:', error)
      // Set demo data for testing
      setAssets([
        {
          id: '1',
          name: 'HVAC Unit 01',
          description: 'Main building HVAC system',
          assetId: 'HVAC-001',
          status: 'online',
          location: { id: '1', name: 'Main Building', description: 'Primary facility' } as any,
          organization: { id: '1', name: 'Acme Corp Inc.' } as any,
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z',
        },
        {
          id: '2',
          name: 'Generator Backup',
          description: 'Emergency power generator',
          assetId: 'GEN-001',
          status: 'offline',
          location: { id: '2', name: 'Basement', description: 'Utility area' } as any,
          organization: { id: '1', name: 'Acme Corp Inc.' } as any,
          createdAt: '2024-01-10T08:00:00Z',
          updatedAt: '2024-01-15T09:30:00Z',
        },
        {
          id: '3',
          name: 'Security Camera System',
          description: 'Building security cameras',
          assetId: 'CAM-001',
          status: 'online',
          location: { id: '1', name: 'Main Building', description: 'Primary facility' } as any,
          organization: { id: '1', name: 'Acme Corp Inc.' } as any,
          createdAt: '2024-01-05T14:00:00Z',
          updatedAt: '2024-01-15T11:00:00Z',
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         asset.assetId.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'all' || asset.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <Wifi className="h-4 w-4 text-green-600" />
      case 'offline':
        return <WifiOff className="h-4 w-4 text-red-600" />
      case 'no-tracking':
        return <Package className="h-4 w-4 text-gray-600" />
      default:
        return <Package className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-100 text-green-800'
      case 'offline':
        return 'bg-red-100 text-red-800'
      case 'no-tracking':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Assets</h1>
            <p className="text-muted-foreground">
              Manage and track your organization's assets
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
          <h1 className="text-2xl font-bold tracking-tight">Assets</h1>
          <p className="text-muted-foreground">
            Manage and track your organization's assets
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Asset
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search assets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterStatus === 'all' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('all')}
              >
                All
              </Button>
              <Button
                variant={filterStatus === 'online' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('online')}
              >
                <Wifi className="h-4 w-4 mr-2" />
                Online
              </Button>
              <Button
                variant={filterStatus === 'offline' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('offline')}
              >
                <WifiOff className="h-4 w-4 mr-2" />
                Offline
              </Button>
              <Button
                variant={filterStatus === 'no-tracking' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('no-tracking')}
              >
                <Package className="h-4 w-4 mr-2" />
                No Tracking
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assets Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredAssets.map((asset) => (
          <Card key={asset.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{asset.name}</CardTitle>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(asset.status)}`}>
                  {asset.status}
                </div>
              </div>
              <CardDescription>{asset.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <Package className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="font-medium">ID:</span>
                  <span className="ml-1 text-gray-600">{asset.assetId}</span>
                </div>
                <div className="flex items-center text-sm">
                  <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="font-medium">Location:</span>
                  <span className="ml-1 text-gray-600">{asset.location?.name}</span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="font-medium">Organization:</span>
                  <span className="ml-1 text-gray-600">{asset.organization?.name}</span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="font-medium">Last Updated:</span>
                  <span className="ml-1 text-gray-600">
                    {new Date(asset.updatedAt).toLocaleDateString()}
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

      {filteredAssets.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No assets found</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery || filterStatus !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'Get started by adding your first asset.'
              }
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Asset
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
