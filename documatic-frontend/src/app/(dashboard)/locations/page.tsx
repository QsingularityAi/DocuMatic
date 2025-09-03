'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Location } from '@/types'
import { apiService } from '@/services/api'
import { 
  MapPin, 
  Search, 
  Plus, 
  Building,
  Package,
  Users,
  Eye,
  Edit,
  Trash2,
  Navigation
} from 'lucide-react'

export default function LocationsPage() {
  const [locations, setLocations] = useState<Location[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    fetchLocations()
  }, [])

  const fetchLocations = async () => {
    try {
      const response = await apiService.getLocations()
      setLocations(response.docs || [])
    } catch (error) {
      console.error('Failed to fetch locations:', error)
      // Set demo data for testing
      setLocations([
        {
          id: '1',
          name: 'Main Building',
          description: 'Primary office building',
          address: '123 Main Street, City, State 12345',
          organization: { id: '1', name: 'Acme Corp Inc.' } as any,
          assetCount: 15,
          userCount: 25,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z',
        },
        {
          id: '2',
          name: 'Warehouse A',
          description: 'Storage and distribution center',
          address: '456 Industrial Blvd, City, State 12345',
          organization: { id: '1', name: 'Acme Corp Inc.' } as any,
          assetCount: 8,
          userCount: 12,
          createdAt: '2024-01-02T00:00:00Z',
          updatedAt: '2024-01-14T15:30:00Z',
        },
        {
          id: '3',
          name: 'Data Center',
          description: 'Server and IT infrastructure',
          address: '789 Tech Park, City, State 12345',
          organization: { id: '1', name: 'Acme Corp Inc.' } as any,
          assetCount: 22,
          userCount: 8,
          createdAt: '2024-01-03T00:00:00Z',
          updatedAt: '2024-01-13T09:15:00Z',
        },
        {
          id: '4',
          name: 'Branch Office',
          description: 'Regional branch location',
          address: '321 Business Ave, City, State 12345',
          organization: { id: '1', name: 'Acme Corp Inc.' } as any,
          assetCount: 6,
          userCount: 15,
          createdAt: '2024-01-04T00:00:00Z',
          updatedAt: '2024-01-12T16:45:00Z',
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const filteredLocations = locations.filter(location => {
    return location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           location.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
           location.address.toLowerCase().includes(searchQuery.toLowerCase())
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Locations</h1>
            <p className="text-muted-foreground">
              Manage your organization's locations and facilities
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
          <h1 className="text-2xl font-bold tracking-tight">Locations</h1>
          <p className="text-muted-foreground">
            Manage your organization's locations and facilities
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            Grid
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            List
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Location
          </Button>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Locations Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredLocations.map((location) => (
            <Card key={location.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{location.name}</CardTitle>
                  <Button variant="outline" size="sm">
                    <Navigation className="h-4 w-4" />
                  </Button>
                </div>
                <CardDescription>{location.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-gray-600">{location.address}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Building className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="font-medium">Organization:</span>
                    <span className="ml-1 text-gray-600">{location.organization?.name}</span>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <div className="flex items-center">
                      <Package className="h-4 w-4 mr-1 text-gray-500" />
                      <span className="font-medium">{location.assetCount}</span>
                      <span className="ml-1 text-gray-600">Assets</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1 text-gray-500" />
                      <span className="font-medium">{location.userCount}</span>
                      <span className="ml-1 text-gray-600">Users</span>
                    </div>
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
      ) : (
        <div className="space-y-4">
          {filteredLocations.map((location) => (
            <Card key={location.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <Building className="h-8 w-8 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900">{location.name}</h3>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Navigation className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{location.description}</p>
                      <div className="flex items-center mt-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-1" />
                        {location.address}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center">
                      <Package className="h-4 w-4 mr-1 text-gray-500" />
                      <span className="font-medium">{location.assetCount}</span>
                      <span className="ml-1 text-gray-600">Assets</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1 text-gray-500" />
                      <span className="font-medium">{location.userCount}</span>
                      <span className="ml-1 text-gray-600">Users</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredLocations.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <MapPin className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No locations found</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery
                ? 'Try adjusting your search criteria.'
                : 'Get started by adding your first location.'
              }
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Location
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
