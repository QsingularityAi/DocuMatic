'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuthStore } from '@/store/auth'
import { 
  User,
  Bell,
  Shield,
  Globe,
  Palette,
  Save,
  Eye,
  EyeOff,
  Mail,
  Phone
} from 'lucide-react'

export default function SettingsPage() {
  const { user } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    workOrderUpdates: true,
    assetAlerts: true,
    systemMaintenance: false,
  })

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordExpiry: 90,
  })

  const handleProfileUpdate = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Profile updated:', profileData)
    } catch (error) {
      console.error('Failed to update profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleNotificationToggle = (key: keyof typeof notificationSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const handleSecurityToggle = (key: keyof typeof securitySettings) => {
    setSecuritySettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="h-5 w-5 mr-2" />
            Profile Information
          </CardTitle>
          <CardDescription>
            Update your personal information and contact details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-gray-700">First Name</label>
              <Input
                value={profileData.firstName}
                onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                placeholder="Enter your first name"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Last Name</label>
              <Input
                value={profileData.lastName}
                onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                placeholder="Enter your last name"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <Input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Phone</label>
              <Input
                value={profileData.phone}
                onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="Enter your phone number"
              />
            </div>
          </div>
          <Button onClick={handleProfileUpdate} disabled={isLoading}>
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            Notification Preferences
          </CardTitle>
          <CardDescription>
            Configure how you receive notifications and alerts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-sm font-medium">Email Notifications</span>
              </div>
              <Button
                variant={notificationSettings.emailNotifications ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleNotificationToggle('emailNotifications')}
              >
                {notificationSettings.emailNotifications ? 'Enabled' : 'Disabled'}
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Bell className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-sm font-medium">Push Notifications</span>
              </div>
              <Button
                variant={notificationSettings.pushNotifications ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleNotificationToggle('pushNotifications')}
              >
                {notificationSettings.pushNotifications ? 'Enabled' : 'Disabled'}
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-sm font-medium">Work Order Updates</span>
              </div>
              <Button
                variant={notificationSettings.workOrderUpdates ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleNotificationToggle('workOrderUpdates')}
              >
                {notificationSettings.workOrderUpdates ? 'Enabled' : 'Disabled'}
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-sm font-medium">Asset Alerts</span>
              </div>
              <Button
                variant={notificationSettings.assetAlerts ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleNotificationToggle('assetAlerts')}
              >
                {notificationSettings.assetAlerts ? 'Enabled' : 'Disabled'}
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-sm font-medium">System Maintenance</span>
              </div>
              <Button
                variant={notificationSettings.systemMaintenance ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleNotificationToggle('systemMaintenance')}
              >
                {notificationSettings.systemMaintenance ? 'Enabled' : 'Disabled'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Security Settings
          </CardTitle>
          <CardDescription>
            Manage your account security and authentication preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Shield className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-sm font-medium">Two-Factor Authentication</span>
              </div>
              <Button
                variant={securitySettings.twoFactorAuth ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleSecurityToggle('twoFactorAuth')}
              >
                {securitySettings.twoFactorAuth ? 'Enabled' : 'Disabled'}
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium">Session Timeout</span>
                <p className="text-xs text-gray-500">Automatically log out after inactivity</p>
              </div>
              <select
                value={securitySettings.sessionTimeout}
                onChange={(e) => setSecuritySettings(prev => ({ 
                  ...prev, 
                  sessionTimeout: parseInt(e.target.value) 
                }))}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm"
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={60}>1 hour</option>
                <option value={120}>2 hours</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium">Password Expiry</span>
                <p className="text-xs text-gray-500">Require password change after</p>
              </div>
              <select
                value={securitySettings.passwordExpiry}
                onChange={(e) => setSecuritySettings(prev => ({ 
                  ...prev, 
                  passwordExpiry: parseInt(e.target.value) 
                }))}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm"
              >
                <option value={30}>30 days</option>
                <option value={60}>60 days</option>
                <option value={90}>90 days</option>
                <option value={180}>180 days</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appearance Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Palette className="h-5 w-5 mr-2" />
            Appearance
          </CardTitle>
          <CardDescription>
            Customize the look and feel of your interface
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Theme</span>
              <select className="border border-gray-300 rounded-md px-3 py-1 text-sm">
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="auto">Auto</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Language</span>
              <select className="border border-gray-300 rounded-md px-3 py-1 text-sm">
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Time Zone</span>
              <select className="border border-gray-300 rounded-md px-3 py-1 text-sm">
                <option value="UTC">UTC</option>
                <option value="EST">Eastern Time</option>
                <option value="CST">Central Time</option>
                <option value="MST">Mountain Time</option>
                <option value="PST">Pacific Time</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">Danger Zone</CardTitle>
          <CardDescription>
            Irreversible and destructive actions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
            <div>
              <h4 className="text-sm font-medium text-red-900">Delete Account</h4>
              <p className="text-xs text-red-700">
                Permanently delete your account and all associated data
              </p>
            </div>
            <Button variant="destructive" size="sm">
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
