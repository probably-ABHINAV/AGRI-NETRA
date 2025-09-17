import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  UserCheck,
  AlertTriangle,
  TrendingUp,
  Database,
  Shield,
  Settings,
  Activity,
  BarChart3,
  MessageSquare,
  Zap,
  Leaf,
} from "lucide-react"

export default function AdminDashboard() {
  const systemStats = {
    totalUsers: 2847,
    activeUsers: 1923,
    totalFarms: 1456,
    activeSensors: 8934,
    totalConsultations: 5672,
    systemUptime: 99.8,
    storageUsed: 67,
    apiCalls: 125000,
  }

  const recentActivity = [
    {
      id: 1,
      type: "user_registration",
      message: "New farmer registered: John Smith",
      time: "2 minutes ago",
      severity: "info",
    },
    { id: 2, type: "system_alert", message: "High API usage detected", time: "15 minutes ago", severity: "warning" },
    {
      id: 3,
      type: "expert_consultation",
      message: "Dr. Sarah Johnson completed consultation",
      time: "1 hour ago",
      severity: "success",
    },
    {
      id: 4,
      type: "sensor_offline",
      message: "Sensor offline: Field A - Monitor 3",
      time: "2 hours ago",
      severity: "error",
    },
    {
      id: 5,
      type: "data_backup",
      message: "Daily backup completed successfully",
      time: "3 hours ago",
      severity: "success",
    },
  ]

  const userGrowth = [
    { month: "Jan", users: 1200, farms: 800 },
    { month: "Feb", users: 1450, farms: 950 },
    { month: "Mar", users: 1680, farms: 1100 },
    { month: "Apr", users: 1920, farms: 1250 },
    { month: "May", users: 2150, farms: 1380 },
    { month: "Jun", users: 2400, farms: 1456 },
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "success":
        return "text-green-600"
      case "warning":
        return "text-yellow-600"
      case "error":
        return "text-red-600"
      default:
        return "text-blue-600"
    }
  }

  const getSeverityIcon = (type: string) => {
    switch (type) {
      case "user_registration":
        return <UserCheck className="h-4 w-4" />
      case "system_alert":
        return <AlertTriangle className="h-4 w-4" />
      case "expert_consultation":
        return <MessageSquare className="h-4 w-4" />
      case "sensor_offline":
        return <Zap className="h-4 w-4" />
      case "data_backup":
        return <Database className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">System overview and management console</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2 bg-transparent">
            <Settings className="h-4 w-4" />
            System Settings
          </Button>
          <Button className="flex items-center gap-2 bg-green-600 hover:bg-green-700">
            <Shield className="h-4 w-4" />
            Security Center
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.activeUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((systemStats.activeUsers / systemStats.totalUsers) * 100)}% engagement rate
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Farms</CardTitle>
            <Leaf className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.totalFarms.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across 45 regions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
            <Activity className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.systemUptime}%</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest system events and user actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-lg">
                      <div className={getSeverityColor(activity.severity)}>{getSeverityIcon(activity.type)}</div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.message}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                      <Badge variant="outline" className={getSeverityColor(activity.severity)}>
                        {activity.severity}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
                <CardDescription>Current system performance metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Storage Usage</span>
                    <span>{systemStats.storageUsed}%</span>
                  </div>
                  <Progress value={systemStats.storageUsed} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>API Rate Limit</span>
                    <span>75%</span>
                  </div>
                  <Progress value={75} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Database Performance</span>
                    <span>92%</span>
                  </div>
                  <Progress value={92} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Active Sensors</span>
                    <span>89%</span>
                  </div>
                  <Progress value={89} />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>User Growth Trend</CardTitle>
              <CardDescription>Monthly user and farm registration statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userGrowth.map((data, index) => (
                  <div key={data.month} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium w-12">{data.month}</span>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">{data.users.toLocaleString()} users</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Leaf className="h-4 w-4 text-green-600" />
                        <span className="text-sm">{data.farms.toLocaleString()} farms</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-600">
                        +
                        {index > 0
                          ? Math.round(((data.users - userGrowth[index - 1].users) / userGrowth[index - 1].users) * 100)
                          : 0}
                        %
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage user accounts, roles, and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">User management interface would be implemented here</p>
                <p className="text-sm text-gray-500 mt-2">
                  Features: User search, role assignment, account status management
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Configuration</CardTitle>
              <CardDescription>Manage system settings and configurations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">System configuration interface would be implemented here</p>
                <p className="text-sm text-gray-500 mt-2">
                  Features: API settings, database config, integration management
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Analytics</CardTitle>
              <CardDescription>Detailed platform usage and performance analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Advanced analytics dashboard would be implemented here</p>
                <p className="text-sm text-gray-500 mt-2">
                  Features: Usage metrics, performance charts, custom reports
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Center</CardTitle>
              <CardDescription>Monitor security events and manage access controls</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Security management interface would be implemented here</p>
                <p className="text-sm text-gray-500 mt-2">
                  Features: Access logs, security alerts, permission management
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
