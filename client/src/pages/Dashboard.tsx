import React, { useMemo, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { getDocumentLocale, isArabicLocale } from "@/lib/locale";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { getLoginUrl } from "@/const";
import { Package, Clock, Check, X, Sparkles, TrendingUp, UserPlus } from "lucide-react";
import { toast } from "sonner";
import DashboardContentStudio from "@/components/dashboard/ContentStudio";

type DashboardTab = "orders" | "registrations" | "content";

const orderStatusLabels = {
  en: {
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",
    deposit_paid: "Deposit Paid",
    in_production: "In Production",
    ready: "Ready",
    shipped: "Shipped",
    delivered: "Delivered",
    cancelled: "Cancelled",
  },
  ar: {
    pending: "قيد المراجعة",
    approved: "مقبول",
    rejected: "مرفوض",
    deposit_paid: "تم دفع العربون",
    in_production: "قيد التنفيذ",
    ready: "جاهز",
    shipped: "تم الشحن",
    delivered: "تم التسليم",
    cancelled: "ملغي",
  },
} as const;

const registrationStatusLabels = {
  en: {
    new: "New",
    confirmed: "Confirmed",
    waitlisted: "Waitlisted",
    cancelled: "Cancelled",
  },
  ar: {
    new: "جديد",
    confirmed: "مؤكد",
    waitlisted: "قائمة الانتظار",
    cancelled: "ملغي",
  },
} as const;

const registrationStatusStyles: Record<string, string> = {
  new: "bg-blue-600/10 text-blue-700",
  confirmed: "bg-green-600/10 text-green-700",
  waitlisted: "bg-yellow-500/10 text-yellow-700",
  cancelled: "bg-red-600/10 text-red-700",
};

export default function Dashboard(): React.JSX.Element {
  const locale = getDocumentLocale();
  const isArabic = isArabicLocale(locale);
  const copy = useMemo(() => {
    if (isArabic) {
      return {
        pageTitle: "لوحة التحكم",
        pageSubtitle: "تابع الطلبات والتسجيلات في الوقت الفعلي",
        waitingListTab: "قائمة الانتظار",
        registrationsTab: "التسجيلات",
        contentTab: "استوديو المحتوى",
        searchPlaceholder: "ابحث بالاسم أو البريد أو المدينة",
        stats: {
          totalOrders: "إجمالي الطلبات",
          pending: "قيد المراجعة",
          approved: "طلبات مقبولة",
          rejected: "طلبات مرفوضة",
          totalRegistrations: "إجمالي التسجيلات",
          confirmedRegistrations: "تسجيلات مؤكدة",
        },
        ordersSectionTitle: "قائمة الانتظار",
        registrationsSectionTitle: "سجل التسجيلات",
        contentSectionTitle: "إدارة الوسائط والمجموعات",
        contentSectionDescription:
          "حدّث فيديوهات العرض، أضف المجموعات، وعدّل الأسعار الفاخرة من مكان واحد.",
        orderLocationLabel: "المدينة",
        orderProductLabel: "تفاصيل القطعة",
        orderPriceLabel: "الإجمالي",
        orderNotesLabel: "ملاحظات العميل",
        registrationLocationLabel: "الموقع",
        registrationContactLabel: "بيانات التواصل",
        registrationSourceLabel: "مصدر التسجيل",
        approve: "اعتماد",
        reject: "رفض",
        cancel: "إلغاء",
        confirmApproval: "تأكيد الاعتماد",
        confirmRejection: "تأكيد الرفض",
        adminNotesLabel: "ملاحظات المسؤول",
        rejectionReasonLabel: "سبب الرفض",
        dialogTitleApprove: "اعتماد الطلب",
        dialogTitleReject: "رفض الطلب",
        noOrders: "لا توجد طلبات حالياً",
        noRegistrations: "لا توجد تسجيلات",
        processing: "جارٍ المعالجة...",
        loginRequiredTitle: "يتطلب صلاحيات المسؤول",
        loginRequiredDescription: "الرجاء تسجيل الدخول للوصول إلى لوحة التحكم",
        loginButton: "تسجيل الدخول",
        accessDeniedTitle: "تم رفض الوصول",
        accessDeniedDescription: "ليست لديك الصلاحية لدخول هذه الصفحة",
        toastApproved: "تم اعتماد الطلب بنجاح",
        toastRejected: "تم رفض الطلب بنجاح",
        toastError: "تعذر تحديث حالة الطلب",
      };
    }

    return {
      pageTitle: "Operations Dashboard",
      pageSubtitle: "Monitor waiting list orders and lead registrations in real time",
      waitingListTab: "Waiting List",
      registrationsTab: "Registrations",
      contentTab: "Content Studio",
      searchPlaceholder: "Search by name, email, or city",
      stats: {
        totalOrders: "Total Orders",
        pending: "Pending",
        approved: "Approved",
        rejected: "Rejected",
        totalRegistrations: "Total Registrations",
        confirmedRegistrations: "Confirmed Leads",
      },
      ordersSectionTitle: "Waiting List",
      registrationsSectionTitle: "Registration Ledger",
      contentSectionTitle: "Media & Catalog Management",
      contentSectionDescription:
        "Launch new collections, refresh hero videos, and adjust couture pricing in one place.",
      orderLocationLabel: "Location",
      orderProductLabel: "Piece details",
      orderPriceLabel: "Total",
      orderNotesLabel: "Customer notes",
      registrationLocationLabel: "Location",
      registrationContactLabel: "Contact",
      registrationSourceLabel: "Source",
      approve: "Approve",
      reject: "Reject",
      cancel: "Cancel",
      confirmApproval: "Confirm approval",
      confirmRejection: "Confirm rejection",
      adminNotesLabel: "Admin notes",
      rejectionReasonLabel: "Rejection reason",
      dialogTitleApprove: "Approve order",
      dialogTitleReject: "Reject order",
      noOrders: "No orders yet",
      noRegistrations: "No registrations yet",
      processing: "Processing...",
      loginRequiredTitle: "Admin access required",
      loginRequiredDescription: "Please log in to access the dashboard",
      loginButton: "Login",
      accessDeniedTitle: "Access denied",
      accessDeniedDescription: "You do not have permission to view this page",
      toastApproved: "Order approved successfully",
      toastRejected: "Order rejected successfully",
      toastError: "Failed to update order status",
      };
  }, [isArabic]);

  const { user, loading, isAuthenticated } = useAuth();
  const ordersQuery = trpc.orders.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const registrationsQuery = trpc.registrations.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const updateStatusMutation = trpc.orders.updateStatus.useMutation();

  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [activeTab, setActiveTab] = useState<DashboardTab>("orders");
  const [searchTerm, setSearchTerm] = useState("");

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
            <h2 className="text-2xl font-bold">{copy.loginRequiredTitle}</h2>
            <p className="text-muted-foreground">{copy.loginRequiredDescription}</p>
            <Button onClick={() => (window.location.href = getLoginUrl())}>
              {copy.loginButton}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center space-y-4">
            <X className="w-12 h-12 text-destructive mx-auto" />
            <h2 className="text-2xl font-bold">{copy.accessDeniedTitle}</h2>
            <p className="text-muted-foreground">{copy.accessDeniedDescription}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const orders = ordersQuery.data ?? [];
  const registrations = registrationsQuery.data ?? [];

  const stats = useMemo(() => {
    const pendingOrders = orders.filter(order => order.status === "pending").length;
    const approvedOrders = orders.filter(order => order.status === "approved").length;
    const rejectedOrders = orders.filter(order => order.status === "rejected").length;
    const confirmedRegistrations = registrations.filter(reg => reg.status === "confirmed").length;

    return {
      totalOrders: orders.length,
      pendingOrders,
      approvedOrders,
      rejectedOrders,
      totalRegistrations: registrations.length,
      confirmedRegistrations,
    };
  }, [orders, registrations]);

  const filterMatch = (value: string | null | undefined) =>
    value?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false;

  const filteredOrders = useMemo(() => {
    if (!searchTerm) return orders;
    return orders.filter(order =>
      filterMatch(order.customerName) ||
      filterMatch(order.customerEmail) ||
      filterMatch(order.customerPhone) ||
      filterMatch(order.shippingCity)
    );
  }, [orders, searchTerm]);

  const filteredRegistrations = useMemo(() => {
    if (!searchTerm) return registrations;
    return registrations.filter(registration =>
      filterMatch(registration.fullName) ||
      filterMatch(registration.email) ||
      filterMatch(registration.phone) ||
      filterMatch(registration.city)
    );
  }, [registrations, searchTerm]);

  const handleAction = (order: any, type: "approve" | "reject") => {
    setSelectedOrder(order);
    setActionType(type);
    setShowDialog(true);
  };

  const handleSubmitAction = async () => {
    if (!selectedOrder || !actionType) return;

    try {
      await updateStatusMutation.mutateAsync({
        orderId: selectedOrder.id,
        status: actionType === "approve" ? "approved" : "rejected",
        adminNotes: adminNotes || undefined,
        rejectionReason: actionType === "reject" ? rejectionReason : undefined,
      });

      toast.success(actionType === "approve" ? copy.toastApproved : copy.toastRejected);
      setShowDialog(false);
      setAdminNotes("");
      setRejectionReason("");
      await ordersQuery.refetch();
    } catch (error) {
      toast.error(copy.toastError);
      console.error(error);
    }
  };

  const orderStatusText = orderStatusLabels[locale] ?? orderStatusLabels.en;
  const registrationStatusText = registrationStatusLabels[locale] ?? registrationStatusLabels.en;
  /**
   * Formats ISO timestamps while guarding against null database values.
   */
  const formatDate = (value: string | Date | null | undefined) =>
    value ?
      new Date(value).toLocaleDateString(locale, {
        year: "numeric",
        month: "short",
        day: "numeric",
      }) : "—";

  return (
    <div className="min-h-screen bg-background py-8" dir={isArabic ? "rtl" : "ltr"}>
      <div className="container mx-auto px-6 space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">{copy.pageTitle}</h1>
          <p className="text-muted-foreground">{copy.pageSubtitle}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{copy.stats.totalOrders}</p>
                  <p className="text-3xl font-bold text-foreground">{stats.totalOrders}</p>
                </div>
                <Package className="w-10 h-10 text-primary/30" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{copy.stats.pending}</p>
                  <p className="text-3xl font-bold text-yellow-600">{stats.pendingOrders}</p>
                </div>
                <Clock className="w-10 h-10 text-yellow-600/30" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{copy.stats.approved}</p>
                  <p className="text-3xl font-bold text-green-600">{stats.approvedOrders}</p>
                </div>
                <Check className="w-10 h-10 text-green-600/30" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{copy.stats.rejected}</p>
                  <p className="text-3xl font-bold text-red-600">{stats.rejectedOrders}</p>
                </div>
                <X className="w-10 h-10 text-red-600/30" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{copy.stats.totalRegistrations}</p>
                  <p className="text-3xl font-bold text-primary">{stats.totalRegistrations}</p>
                </div>
                <TrendingUp className="w-10 h-10 text-primary/30" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{copy.stats.confirmedRegistrations}</p>
                  <p className="text-3xl font-bold text-emerald-600">{stats.confirmedRegistrations}</p>
                </div>
                <UserPlus className="w-10 h-10 text-emerald-600/30" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={value => setActiveTab(value as DashboardTab)}>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <TabsList>
              <TabsTrigger value="orders">{copy.waitingListTab}</TabsTrigger>
              <TabsTrigger value="registrations">{copy.registrationsTab}</TabsTrigger>
              <TabsTrigger value="content">{copy.contentTab}</TabsTrigger>
            </TabsList>
            <Input
              className="w-full md:w-80"
              placeholder={copy.searchPlaceholder}
              value={searchTerm}
              onChange={event => setSearchTerm(event.target.value)}
            />
          </div>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>{copy.ordersSectionTitle}</CardTitle>
              </CardHeader>
              <CardContent>
                {ordersQuery.isLoading ? (
                  <div className="text-center py-8">
                    <Sparkles className="w-8 h-8 text-primary animate-pulse mx-auto" />
                  </div>
                ) : filteredOrders.length > 0 ? (
                  <div className="space-y-4">
                    {filteredOrders.map(order => (
                      <Card
                        key={order.id}
                        className="border-l-4"
                        style={{
                          borderLeftColor:
                            order.status === "pending"
                              ? "#ca8a04"
                              : order.status === "approved"
                              ? "#16a34a"
                              : order.status === "rejected"
                              ? "#dc2626"
                              : "#6b7280",
                        }}
                      >
                        <CardContent className="p-6 space-y-4">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="outline" className="font-mono">
                              {order.orderNumber}
                            </Badge>
                            <Badge>
                              {orderStatusText[order.status as keyof typeof orderStatusText] ?? order.status}
                            </Badge>
                          </div>
                          <div className="grid gap-4 md:grid-cols-5">
                            <div className="md:col-span-2 space-y-1">
                              <p className="font-semibold text-lg">{order.customerName}</p>
                              <p className="text-sm text-muted-foreground">{order.customerPhone}</p>
                              {order.customerEmail && (
                                <p className="text-sm text-muted-foreground">{order.customerEmail}</p>
                              )}
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">{copy.orderLocationLabel}</p>
                              <p className="font-medium">{order.shippingCity}</p>
                              <p className="text-sm">{order.shippingCountry}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">{copy.orderProductLabel}</p>
                              <p className="text-sm">{order.selectedColor || "-"}</p>
                              <p className="text-sm">{order.selectedSize || "-"}</p>
                              <p className="font-bold text-primary mt-1">
                                {(order.totalPrice / 100).toFixed(0)} AED
                              </p>
                            </div>
                            <div className="flex flex-col gap-2">
                              {order.status === "pending" ? (
                                <>
                                  <Button
                                    size="sm"
                                    onClick={() => handleAction(order, "approve")}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    <Check className="w-4 h-4 mr-1" />
                                    {copy.approve}
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleAction(order, "reject")}
                                  >
                                    <X className="w-4 h-4 mr-1" />
                                    {copy.reject}
                                  </Button>
                                </>
                              ) : (
                                <div className="text-sm text-muted-foreground space-y-1">
                                  <p>{formatDate(order.updatedAt)}</p>
                                  {order.adminNotes && <p className="italic">{`"${order.adminNotes}"`}</p>}
                                </div>
                              )}
                            </div>
                          </div>
                          {order.customerNotes && (
                            <div className="p-3 bg-muted/50 rounded-lg">
                              <p className="text-sm text-muted-foreground mb-1">{copy.orderNotesLabel}</p>
                              <p className="text-sm italic">{`"${order.customerNotes}"`}</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">{copy.noOrders}</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

        <TabsContent value="registrations">
          <Card>
            <CardHeader>
              <CardTitle>{copy.registrationsSectionTitle}</CardTitle>
            </CardHeader>
            <CardContent>
              {registrationsQuery.isLoading ? (
                  <div className="text-center py-8">
                    <Sparkles className="w-8 h-8 text-primary animate-pulse mx-auto" />
                  </div>
                ) : filteredRegistrations.length > 0 ? (
                  <div className="space-y-4">
                    {filteredRegistrations.map(registration => (
                      <Card key={registration.id} data-testid="registration-card">
                        <CardContent className="p-6 space-y-4">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="outline" className="font-mono">
                              {registration.registrationNumber}
                            </Badge>
                            <Badge className={registrationStatusStyles[registration.status] ?? ""}>
                              {registrationStatusText[registration.status as keyof typeof registrationStatusText] ?? registration.status}
                            </Badge>
                          </div>
                          <div className="grid gap-4 md:grid-cols-4">
                            <div className="space-y-1">
                              <p className="font-semibold text-lg">{registration.fullName}</p>
                              <p className="text-sm text-muted-foreground">{registration.phone}</p>
                              {registration.email && (
                                <p className="text-sm text-muted-foreground">{registration.email}</p>
                              )}
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">{copy.registrationLocationLabel}</p>
                              <p className="font-medium">{registration.city || "-"}</p>
                              <p className="text-sm">{registration.country}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">{copy.registrationSourceLabel}</p>
                              <p className="font-medium">{registration.source || "—"}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">{copy.registrationContactLabel}</p>
                              <p className="text-sm">{registration.preferredLanguage.toUpperCase()}</p>
                              <p className="text-sm">{formatDate(registration.createdAt)}</p>
                            </div>
                          </div>
                          {registration.notes && (
                            <div className="p-3 bg-muted/50 rounded-lg">
                              <p className="text-sm text-muted-foreground mb-1">{copy.orderNotesLabel}</p>
                              <p className="text-sm italic">{registration.notes}</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">{copy.noRegistrations}</div>
                )}
              </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="content">
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-foreground">
                {copy.contentSectionTitle}
              </h2>
              <p className="text-muted-foreground text-sm">{copy.contentSectionDescription}</p>
            </div>
            <DashboardContentStudio />
          </div>
        </TabsContent>
      </Tabs>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "approve" ? copy.dialogTitleApprove : copy.dialogTitleReject}
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
              <label className="text-sm font-medium">{copy.adminNotesLabel}</label>
              <Textarea
                value={adminNotes}
                onChange={event => setAdminNotes(event.target.value)}
                rows={3}
              />
            </div>

            {actionType === "reject" && (
              <div className="space-y-2">
                <label className="text-sm font-medium">{copy.rejectionReasonLabel}</label>
                <Textarea
                  value={rejectionReason}
                  onChange={event => setRejectionReason(event.target.value)}
                  rows={3}
                  required
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              {copy.cancel}
            </Button>
            <Button
              onClick={handleSubmitAction}
              disabled={
                updateStatusMutation.isPending ||
                (actionType === "reject" && !rejectionReason)
              }
              className={actionType === "approve" ? "bg-green-600 hover:bg-green-700" : ""}
              variant={actionType === "reject" ? "destructive" : "default"}
            >
              {updateStatusMutation.isPending
                ? copy.processing
                : actionType === "approve"
                ? copy.confirmApproval
                : copy.confirmRejection}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
