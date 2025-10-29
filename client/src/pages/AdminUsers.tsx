import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Users, Mail, Phone, MapPin, Calendar, Search, Download, Eye } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function AdminUsers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  // Fetch registered users
  const { data: users, isLoading } = trpc.admin.getClients.useQuery();

  const filteredUsers = users?.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone?.includes(searchTerm)
  ) || [];

  const handleExportCSV = () => {
    if (!users) return;
    
    const headers = ["Name", "Email", "Phone", "Location", "Member Since", "Total Orders"];
    const rows = users.map(user => [
      user.name || "",
      user.email || "",
      user.phone || "",
      `${user.city || ""}, ${user.country || ""}`,
      new Date(user.createdAt || "").toLocaleDateString(),
      user.orders?.length || 0
    ]);

    const csv = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "registered-users.csv";
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-serif font-bold">Registered Users</h2>
          <p className="text-muted-foreground mt-1">
            Manage and view all registered customers
          </p>
        </div>
        <Button 
          onClick={handleExportCSV}
          variant="outline"
          className="gap-2"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
        <Input
          placeholder="Search by name, email, or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-3xl font-bold">{users?.length || 0}</p>
              </div>
              <Users className="w-12 h-12 text-amber-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active This Month</p>
                <p className="text-3xl font-bold">
                  {users?.filter(u => {
                    const lastMonth = new Date();
                    lastMonth.setMonth(lastMonth.getMonth() - 1);
                    return new Date(u.lastSignedIn || "") > lastMonth;
                  }).length || 0}
                </p>
              </div>
              <Users className="w-12 h-12 text-green-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-3xl font-bold">
                  {users?.reduce((sum, u) => sum + (u.orders?.length || 0), 0) || 0}
                </p>
              </div>
              <Users className="w-12 h-12 text-blue-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Orders/User</p>
                <p className="text-3xl font-bold">
                  {users && users.length > 0 
                    ? (users.reduce((sum, u) => sum + (u.orders?.length || 0), 0) / users.length).toFixed(1)
                    : 0
                  }
                </p>
              </div>
              <Users className="w-12 h-12 text-purple-600 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>User Directory</CardTitle>
          <CardDescription>
            Showing {filteredUsers.length} of {users?.length || 0} users
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading users...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No users found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Phone</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Location</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Member Since</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Orders</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4">
                        <p className="font-medium text-gray-900">{user.name}</p>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail className="w-4 h-4" />
                          <span className="text-sm">{user.email}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone className="w-4 h-4" />
                          <span className="text-sm">{user.phone || "N/A"}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">
                            {user.city && user.country 
                              ? `${user.city}, ${user.country}`
                              : user.country || "N/A"
                            }
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">
                            {user.createdAt 
                              ? new Date(user.createdAt).toLocaleDateString()
                              : "N/A"
                            }
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                          {user.orders?.length || 0} orders
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => setSelectedUser(user.id)}
                          className="gap-1"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Details Modal */}
      {selectedUser && (
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle>User Details</CardTitle>
            <Button 
              size="sm" 
              variant="ghost"
              onClick={() => setSelectedUser(null)}
              className="absolute top-4 right-4"
            >
              ✕
            </Button>
          </CardHeader>
          <CardContent>
            {users?.find(u => u.id === selectedUser) && (
              <div className="space-y-4">
                {/* User info will be displayed here */}
                <p className="text-sm text-gray-600">User details panel</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

