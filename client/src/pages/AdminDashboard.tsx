import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, CheckCircle, Clock, BarChart3, Users, Package, Image, Settings, FileText, Zap } from "lucide-react";
import { trpc } from "@/lib/trpc";
import AuditLogs from "./AuditLogs";
import AIInsights from "./AIInsights";
import AdminWebsiteSettings from "./AdminWebsiteSettings";
import AdminUsers from "./AdminUsers";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  
  // All hooks must be called before any conditional returns
  const { data: stats } = trpc.admin.getStats.useQuery(undefined, { enabled: user?.role === "admin" });
  const { data: orders } = trpc.orders.list.useQuery(undefined, { enabled: user?.role === "admin" });
  const { data: clients } = trpc.admin.getClients.useQuery(undefined, { enabled: user?.role === "admin" });

  // Check if user is admin
  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Access Denied
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              You do not have permission to access the admin dashboard. Please contact an administrator.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground mt-1">Manage collections, orders, clients, and platform settings</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Welcome, {user?.name}</p>
              <p className="text-xs text-muted-foreground">Admin Access</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalOrders || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Pending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats?.pendingOrders || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Awaiting approval</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Approved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats?.approvedOrders || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Confirmed orders</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="w-4 h-4" />
                Clients
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalClients || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Registered users</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-8 mb-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              <span className="hidden sm:inline">Orders</span>
            </TabsTrigger>
            <TabsTrigger value="clients" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Clients</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Users</span>
            </TabsTrigger>
            <TabsTrigger value="media" className="flex items-center gap-2">
              <Image className="w-4 h-4" />
              <span className="hidden sm:inline">Media</span>
            </TabsTrigger>
            <TabsTrigger value="collections" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              <span className="hidden sm:inline">Collections</span>
            </TabsTrigger>
            <TabsTrigger value="audit" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Audit</span>
            </TabsTrigger>
            <TabsTrigger value="ai" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span className="hidden sm:inline">AI</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Dashboard Overview</CardTitle>
                <CardDescription>Key metrics and platform health status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h3 className="font-semibold text-green-900 mb-2">✓ System Status</h3>
                    <p className="text-sm text-green-700">All systems operational</p>
                  </div>
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-2">📊 Last Updated</h3>
                    <p className="text-sm text-blue-700">Just now</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <OrdersManagement orders={orders} />
          </TabsContent>

          {/* Clients Tab */}
          <TabsContent value="clients" className="space-y-6">
            <ClientsManagement clients={clients} />
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <AdminUsers />
          </TabsContent>

          {/* Media Tab */}
          <TabsContent value="media" className="space-y-6">
            <MediaManagement />
          </TabsContent>

          {/* Collections Tab */}
          <TabsContent value="collections" className="space-y-6">
            <CollectionsManagement />
          </TabsContent>

          {/* Audit Tab */}
          <TabsContent value="audit" className="space-y-6">
            <AuditLogs />
          </TabsContent>

          {/* AI Insights Tab */}
          <TabsContent value="ai" className="space-y-6">
            <AIInsights />
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <AdminWebsiteSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Orders Management Component
function OrdersManagement({ orders }: { orders: any[] | undefined }) {
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const approveOrderMutation = trpc.orders.approve.useMutation();
  const rejectOrderMutation = trpc.orders.reject.useMutation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Management</CardTitle>
        <CardDescription>View, approve, and manage customer orders</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders && orders.length > 0 ? (
            orders.map((order: any) => (
              <div key={order.id} className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold">{order.customerName}</h4>
                    <p className="text-sm text-muted-foreground">Order #{order.id}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    order.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                    order.status === "approved" ? "bg-green-100 text-green-800" :
                    "bg-red-100 text-red-800"
                  }`}>
                    {order.status.toUpperCase()}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div>
                    <p className="text-muted-foreground">Product</p>
                    <p className="font-medium">{order.productName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Color</p>
                    <p className="font-medium">{order.selectedColor}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Size</p>
                    <p className="font-medium">{order.size}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Location</p>
                    <p className="font-medium">{order.city}, {order.country}</p>
                  </div>
                </div>
                {order.status === "pending" && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => approveOrderMutation.mutate({ orderId: order.id })}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => rejectOrderMutation.mutate({ orderId: order.id, reason: "Admin decision" })}
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-center py-8">No orders found</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Clients Management Component
function ClientsManagement({ clients }: { clients: any[] | undefined }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Client Management</CardTitle>
        <CardDescription>View client profiles and order history</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {clients && clients.length > 0 ? (
            clients.map((client: any) => (
              <div key={client.id} className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold">{client.name}</h4>
                    <p className="text-sm text-muted-foreground">{client.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Phone</p>
                    <p className="font-medium">{client.phone}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Location</p>
                    <p className="font-medium">{client.city}, {client.country}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total Orders</p>
                    <p className="font-medium">{client.totalOrders || 0}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Member Since</p>
                    <p className="font-medium">{new Date(client.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-center py-8">No clients found</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Media Management Component
function MediaManagement() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Media Management</CardTitle>
        <CardDescription>Upload and manage background videos and images</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer">
            <Image className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <p className="font-medium mb-1">Upload Media</p>
            <p className="text-sm text-muted-foreground">Drag and drop or click to upload videos and images</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold">Current Background Media</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm font-medium">video-1.mp4</p>
                <p className="text-xs text-muted-foreground">522 KB • Video</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm font-medium">IMG_7267.jpg</p>
                <p className="text-xs text-muted-foreground">2.4 MB • Image</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Collections Management Component
function CollectionsManagement() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Collections Management</CardTitle>
        <CardDescription>Create and manage product collections</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button>+ Add New Collection</Button>
          <div className="space-y-2">
            <div className="p-4 border border-border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">Ramadan Eid Collection 2024</h4>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">Edit</Button>
                  <Button size="sm" variant="destructive">Delete</Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">4 products • Active</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}



