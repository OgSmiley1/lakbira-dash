import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Sparkles, Check, X, Eye, Package, Clock, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";

export default function Dashboard() {
  const { user, loading, isAuthenticated } = useAuth();
  const { data: orders, isLoading, refetch } = trpc.orders.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const updateStatusMutation = trpc.orders.updateStatus.useMutation();

  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Sparkles className="w-12 h-12 text-primary animate-pulse" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center space-y-4">
            <Sparkles className="w-12 h-12 text-primary mx-auto" />
            <h2 className="text-2xl font-bold">Admin Access Required</h2>
            <p className="text-muted-foreground">Please log in to access the dashboard</p>
            <Button onClick={() => window.location.href = getLoginUrl()}>
              Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center space-y-4">
            <X className="w-12 h-12 text-destructive mx-auto" />
            <h2 className="text-2xl font-bold">Access Denied</h2>
            <p className="text-muted-foreground">You don't have permission to access this page</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleAction = (order: any, type: 'approve' | 'reject') => {
    setSelectedOrder(order);
    setActionType(type);
    setShowDialog(true);
  };

  const handleSubmitAction = async () => {
    if (!selectedOrder || !actionType) return;

    try {
      await updateStatusMutation.mutateAsync({
        orderId: selectedOrder.id,
        status: actionType === 'approve' ? 'approved' : 'rejected',
        adminNotes: adminNotes || undefined,
        rejectionReason: actionType === 'reject' ? rejectionReason : undefined,
      });

      toast.success(`Order ${actionType === 'approve' ? 'approved' : 'rejected'} successfully`);
      setShowDialog(false);
      setAdminNotes("");
      setRejectionReason("");
      refetch();
    } catch (error) {
      toast.error("Failed to update order status");
      console.error(error);
    }
  };

  const stats = {
    total: orders?.length || 0,
    pending: orders?.filter(o => o.status === 'pending').length || 0,
    approved: orders?.filter(o => o.status === 'approved').length || 0,
    rejected: orders?.filter(o => o.status === 'rejected').length || 0,
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Orders Dashboard
            <span className="text-2xl text-muted-foreground ml-4" lang="ar">
              لوحة التحكم
            </span>
          </h1>
          <p className="text-muted-foreground">
            Manage and review all customer orders
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <p className="text-3xl font-bold text-foreground">{stats.total}</p>
                </div>
                <Package className="w-10 h-10 text-primary/30" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <Clock className="w-10 h-10 text-yellow-600/30" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Approved</p>
                  <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
                </div>
                <Check className="w-10 h-10 text-green-600/30" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Rejected</p>
                  <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
                </div>
                <X className="w-10 h-10 text-red-600/30" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Orders List */}
        <Card>
          <CardHeader>
            <CardTitle>All Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <Sparkles className="w-8 h-8 text-primary animate-pulse mx-auto" />
              </div>
            ) : orders && orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map((order: any) => (
                  <Card key={order.id} className="border-l-4" style={{
                    borderLeftColor: 
                      order.status === 'pending' ? '#ca8a04' :
                      order.status === 'approved' ? '#16a34a' :
                      order.status === 'rejected' ? '#dc2626' : '#6b7280'
                  }}>
                    <CardContent className="p-6">
                      <div className="grid md:grid-cols-5 gap-4">
                        <div className="md:col-span-2">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="font-mono">
                              {order.orderNumber}
                            </Badge>
                            <Badge variant={
                              order.status === 'pending' ? 'secondary' :
                              order.status === 'approved' ? 'default' :
                              'destructive'
                            }>
                              {order.status}
                            </Badge>
                          </div>
                          <p className="font-semibold text-lg">{order.customerName}</p>
                          <p className="text-sm text-muted-foreground">{order.customerPhone}</p>
                          <p className="text-sm text-muted-foreground">{order.customerEmail}</p>
                        </div>

                        <div>
                          <p className="text-sm text-muted-foreground">Location</p>
                          <p className="font-medium">{order.shippingCity}</p>
                          <p className="text-sm">{order.shippingCountry}</p>
                        </div>

                        <div>
                          <p className="text-sm text-muted-foreground">Product Details</p>
                          <p className="text-sm">Color: {order.selectedColor || 'N/A'}</p>
                          <p className="text-sm">Size: {order.selectedSize || 'N/A'}</p>
                          <p className="font-bold text-primary mt-1">
                            {(order.totalPrice / 100).toFixed(0)} AED
                          </p>
                        </div>

                        <div className="flex flex-col gap-2">
                          {order.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleAction(order, 'approve')}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <Check className="w-4 h-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleAction(order, 'reject')}
                              >
                                <X className="w-4 h-4 mr-1" />
                                Reject
                              </Button>
                            </>
                          )}
                          {order.status !== 'pending' && (
                            <div className="text-sm text-muted-foreground">
                              <p>Updated: {new Date(order.updatedAt).toLocaleDateString()}</p>
                              {order.adminNotes && (
                                <p className="mt-1 italic">"{order.adminNotes}"</p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {order.customerNotes && (
                        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                          <p className="text-sm text-muted-foreground mb-1">Customer Notes:</p>
                          <p className="text-sm italic">"{order.customerNotes}"</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No orders yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Action Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'approve' ? 'Approve Order' : 'Reject Order'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {selectedOrder && (
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="font-semibold">{selectedOrder.customerName}</p>
                <p className="text-sm text-muted-foreground">{selectedOrder.orderNumber}</p>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Admin Notes</label>
              <Textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Add internal notes..."
                rows={3}
              />
            </div>

            {actionType === 'reject' && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Rejection Reason *</label>
                <Textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Explain why this order is being rejected..."
                  rows={3}
                  required
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmitAction}
              disabled={updateStatusMutation.isPending || (actionType === 'reject' && !rejectionReason)}
              className={actionType === 'approve' ? 'bg-green-600 hover:bg-green-700' : ''}
              variant={actionType === 'reject' ? 'destructive' : 'default'}
            >
              {updateStatusMutation.isPending ? 'Processing...' : `Confirm ${actionType === 'approve' ? 'Approval' : 'Rejection'}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

