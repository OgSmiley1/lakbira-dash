import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, Package, Truck, MapPin, Phone, Mail, User, Ruler } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function AdminOrders() {
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: orders, refetch } = trpc.orders.list.useQuery();
  const approveMutation = trpc.orders.approve.useMutation({
    onSuccess: () => refetch()
  });
  const rejectMutation = trpc.orders.reject.useMutation({
    onSuccess: () => refetch()
  });

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      deposit_paid: "bg-blue-100 text-blue-800",
      in_production: "bg-purple-100 text-purple-800",
      ready: "bg-indigo-100 text-indigo-800",
      shipped: "bg-cyan-100 text-cyan-800",
      delivered: "bg-emerald-100 text-emerald-800",
      rejected: "bg-red-100 text-red-800",
      cancelled: "bg-gray-100 text-gray-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "approved":
        return <CheckCircle className="w-4 h-4" />;
      case "in_production":
        return <Package className="w-4 h-4" />;
      case "shipped":
        return <Truck className="w-4 h-4" />;
      case "delivered":
        return <CheckCircle className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const filteredOrders = orders?.filter(order => 
    statusFilter === "all" || order.status === statusFilter
  );

  const selectedOrderData = orders?.find(o => o.id === selectedOrder);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Orders Management</h2>
          <p className="text-muted-foreground">View and manage customer orders</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-input rounded-md bg-background"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="in_production">In Production</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders List */}
        <div className="lg:col-span-2 space-y-4">
          {filteredOrders?.map((order) => (
            <Card
              key={order.id}
              className={`cursor-pointer transition-all ${
                selectedOrder === order.id ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => setSelectedOrder(order.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">Order #{order.orderNumber}</CardTitle>
                    <CardDescription className="mt-1">{order.customerName}</CardDescription>
                  </div>
                  <Badge className={getStatusColor(order.status)}>
                    <span className="flex items-center gap-1">
                      {getStatusIcon(order.status)}
                      {order.status.replace("_", " ")}
                    </span>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    {order.customerPhone}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    {order.shippingCity}
                  </div>
                  <div className="col-span-2 flex items-center justify-between pt-2 border-t">
                    <span className="text-muted-foreground">Total:</span>
                    <span className="font-semibold">{order.totalPrice} AED</span>
                  </div>
                </div>

                {order.status === "pending" && (
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        approveMutation.mutate({ orderId: order.id });
                      }}
                      className="flex-1"
                    >
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        const reason = prompt("Reason for rejection:");
                        if (reason) {
                          rejectMutation.mutate({ orderId: order.id, reason });
                        }
                      }}
                      className="flex-1"
                    >
                      <XCircle className="w-3 h-3 mr-1" />
                      Reject
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {filteredOrders?.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No orders found</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Order Details Panel */}
        <div className="lg:col-span-1">
          {selectedOrderData ? (
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Details</CardTitle>
                <CardDescription>#{selectedOrderData.orderNumber}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Customer Information */}
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Customer Information
                  </h3>
                  <div className="text-sm space-y-1 pl-6">
                    <p><span className="text-muted-foreground">Name:</span> {selectedOrderData.customerName}</p>
                    <p><span className="text-muted-foreground">Phone:</span> {selectedOrderData.customerPhone}</p>
                    {selectedOrderData.customerEmail && (
                      <p><span className="text-muted-foreground">Email:</span> {selectedOrderData.customerEmail}</p>
                    )}
                    {selectedOrderData.customerWhatsapp && (
                      <p><span className="text-muted-foreground">WhatsApp:</span> {selectedOrderData.customerWhatsapp}</p>
                    )}
                  </div>
                </div>

                {/* Shipping Information */}
                <div className="space-y-2 pt-4 border-t">
                  <h3 className="font-semibold flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Shipping Address
                  </h3>
                  <div className="text-sm space-y-1 pl-6">
                    <p>{selectedOrderData.shippingCity}, {selectedOrderData.shippingCountry}</p>
                    {selectedOrderData.shippingAddress && (
                      <p className="text-muted-foreground">{selectedOrderData.shippingAddress}</p>
                    )}
                  </div>
                </div>

                {/* Product Details */}
                <div className="space-y-2 pt-4 border-t">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Product Details
                  </h3>
                  <div className="text-sm space-y-1 pl-6">
                    {selectedOrderData.selectedColor && (
                      <p><span className="text-muted-foreground">Color:</span> {selectedOrderData.selectedColor}</p>
                    )}
                    {selectedOrderData.selectedSize && (
                      <p><span className="text-muted-foreground">Size:</span> {selectedOrderData.selectedSize}</p>
                    )}
                  </div>
                </div>

                {/* Custom Measurements */}
                {selectedOrderData.customMeasurements && (
                  <div className="space-y-2 pt-4 border-t">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Ruler className="w-4 h-4" />
                      Custom Measurements
                    </h3>
                    <div className="text-sm pl-6">
                      <pre className="whitespace-pre-wrap text-muted-foreground">
                        {selectedOrderData.customMeasurements}
                      </pre>
                    </div>
                  </div>
                )}

                {/* Customer Notes */}
                {selectedOrderData.customerNotes && (
                  <div className="space-y-2 pt-4 border-t">
                    <h3 className="font-semibold">Customer Notes</h3>
                    <p className="text-sm text-muted-foreground pl-6">
                      {selectedOrderData.customerNotes}
                    </p>
                  </div>
                )}

                {/* Pricing */}
                <div className="space-y-2 pt-4 border-t">
                  <h3 className="font-semibold">Pricing</h3>
                  <div className="text-sm space-y-1 pl-6">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Base Price:</span>
                      <span>{selectedOrderData.basePrice} AED</span>
                    </div>
                    {(selectedOrderData.customizationFee ?? 0) > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Customization:</span>
                        <span>{selectedOrderData.customizationFee} AED</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between pt-2 border-t font-semibold">
                      <span>Total:</span>
                      <span>{selectedOrderData.totalPrice} AED</span>
                    </div>
                  </div>
                </div>

                {/* Production Time */}
                <div className="space-y-2 pt-4 border-t">
                  <h3 className="font-semibold">Production Time</h3>
                  <p className="text-sm text-muted-foreground pl-6">
                    ⏱️ Estimated: <span className="font-semibold text-foreground">10 days</span>
                  </p>
                  <p className="text-xs text-muted-foreground pl-6">
                    مدة التفصيل: 10 أيام
                  </p>
                </div>

                {/* Order Timeline */}
                <div className="space-y-2 pt-4 border-t">
                  <h3 className="font-semibold">Order Timeline</h3>
                  <div className="text-xs text-muted-foreground pl-6">
                    <p>Created: {selectedOrderData.createdAt ? new Date(selectedOrderData.createdAt).toLocaleString() : 'N/A'}</p>
                    {selectedOrderData.updatedAt && (
                      <p>Updated: {new Date(selectedOrderData.updatedAt).toLocaleString()}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">Select an order to view details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

