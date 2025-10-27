import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Clock, User, FileText, AlertCircle, CheckCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function AuditLogs() {
  const [filters, setFilters] = useState({
    action: "",
    entityType: "",
    userId: "",
    startDate: "",
    endDate: "",
  });

  const { data: logs, isLoading } = trpc.admin.getAuditLogs.useQuery({
    action: filters.action || undefined,
    entityType: filters.entityType || undefined,
    userId: filters.userId || undefined,
    startDate: filters.startDate ? new Date(filters.startDate) : undefined,
    endDate: filters.endDate ? new Date(filters.endDate) : undefined,
    limit: 100,
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setFilters({
      action: "",
      entityType: "",
      userId: "",
      startDate: "",
      endDate: "",
    });
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case "approve":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "reject":
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <FileText className="w-4 h-4 text-blue-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    return status === "success" 
      ? <Badge variant="default" className="bg-green-100 text-green-800">Success</Badge>
      : <Badge variant="destructive">Error</Badge>;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Audit Logs</CardTitle>
          <CardDescription>Track all admin actions and system events</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <Input
              placeholder="User ID"
              value={filters.userId}
              onChange={(e) => handleFilterChange("userId", e.target.value)}
              className="text-sm"
            />
            <Select value={filters.action} onValueChange={(value) => handleFilterChange("action", value)}>
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="Action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Actions</SelectItem>
                <SelectItem value="approve">Approve</SelectItem>
                <SelectItem value="reject">Reject</SelectItem>
                <SelectItem value="update">Update</SelectItem>
                <SelectItem value="create">Create</SelectItem>
                <SelectItem value="delete">Delete</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.entityType} onValueChange={(value) => handleFilterChange("entityType", value)}>
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="Entity Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                <SelectItem value="order">Order</SelectItem>
                <SelectItem value="client">Client</SelectItem>
                <SelectItem value="product">Product</SelectItem>
                <SelectItem value="collection">Collection</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange("startDate", e.target.value)}
              className="text-sm"
            />
            <Input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange("endDate", e.target.value)}
              className="text-sm"
            />
          </div>

          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={handleReset}>
              Reset Filters
            </Button>
          </div>

          {/* Logs Table */}
          <div className="border border-border rounded-lg overflow-hidden">
            {isLoading ? (
              <div className="p-8 text-center text-muted-foreground">Loading audit logs...</div>
            ) : logs && logs.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted border-b border-border">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">Timestamp</th>
                      <th className="px-4 py-3 text-left font-semibold">User</th>
                      <th className="px-4 py-3 text-left font-semibold">Action</th>
                      <th className="px-4 py-3 text-left font-semibold">Entity</th>
                      <th className="px-4 py-3 text-left font-semibold">Status</th>
                      <th className="px-4 py-3 text-left font-semibold">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log: any) => (
                      <tr key={log.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                        <td className="px-4 py-3 text-xs text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Clock className="w-3 h-3" />
                            {new Date(log.createdAt).toLocaleString()}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <User className="w-3 h-3 text-muted-foreground" />
                            <span className="font-medium">{log.userName}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {getActionIcon(log.action)}
                            <span className="capitalize">{log.action}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium capitalize">{log.entityType}</p>
                            {log.entityId && <p className="text-xs text-muted-foreground">{log.entityId}</p>}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {getStatusBadge(log.status)}
                        </td>
                        <td className="px-4 py-3">
                          {log.errorMessage ? (
                            <span className="text-xs text-red-600">{log.errorMessage}</span>
                          ) : log.changes ? (
                            <span className="text-xs text-muted-foreground">
                              {Object.keys(log.changes).length} field(s) changed
                            </span>
                          ) : (
                            <span className="text-xs text-muted-foreground">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center text-muted-foreground">No audit logs found</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

