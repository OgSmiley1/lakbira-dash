import React, { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, ArrowLeft, Check } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import { getDocumentLocale } from "@/lib/locale";

export default function OrderForm() {
  const [, params] = useRoute("/order/:productId");
  const [, setLocation] = useLocation();
  const productId = params?.productId || "";

  const { data: product, isLoading } = trpc.products.getById.useQuery({ id: productId });
  const createOrderMutation = trpc.orders.create.useMutation();
  const locale = getDocumentLocale();

  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    customerWhatsapp: "",
    shippingCity: "",
    shippingAddress: "",
    shippingCountry: "UAE",
    selectedColor: "",
    selectedSize: "",
    customerNotes: "",
    customMeasurements: {
      height: "",
      bust: "",
      waist: "",
      hips: "",
      shoulders: "",
      armLength: "",
    },
  });

  const [wantsCustomMeasurements, setWantsCustomMeasurements] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!product) return;

    try {
      const result = await createOrderMutation.mutateAsync({
        productId: product.id,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail || undefined,
        customerPhone: formData.customerPhone,
        customerWhatsapp: formData.customerWhatsapp || undefined,
        shippingCity: formData.shippingCity,
        shippingAddress: formData.shippingAddress || undefined,
        shippingCountry: formData.shippingCountry,
        selectedColor: formData.selectedColor || undefined,
        selectedSize: formData.selectedSize || undefined,
        customMeasurements: wantsCustomMeasurements ? formData.customMeasurements : undefined,
        customerNotes: formData.customerNotes || undefined,
        basePrice: product.basePrice,
        customizationFee: wantsCustomMeasurements ? 5000 : 0, // 50 AED customization fee
        totalPrice: product.basePrice + (wantsCustomMeasurements ? 5000 : 0),
        depositAmount: 0,
        locale,
      });

      toast.success("Order submitted successfully! We'll contact you soon.");
      setTimeout(() => {
        setLocation("/");
      }, 2000);
    } catch (error) {
      toast.error("Failed to submit order. Please try again.");
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Sparkles className="w-12 h-12 text-primary animate-pulse mx-auto" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-2xl text-muted-foreground">Product not found</p>
          <Link href="/products">
            <Button>Back to Collection</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link href={`/product/${productId}`}>
            <Button variant="ghost" className="gap-2 mb-4">
              <ArrowLeft className="w-4 h-4" />
              Back to Product
            </Button>
          </Link>
          
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-foreground">
              Join Waiting List
              <span className="block text-2xl text-muted-foreground mt-2" lang="ar">
                انضم إلى قائمة الانتظار
              </span>
            </h1>
            <p className="text-muted-foreground">
              Complete the form below to reserve your {product.nameEn}
            </p>
          </div>
        </div>

        {/* Product Summary */}
        <Card className="mb-8 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-6">
              <img
                src={Array.isArray(product.images) ? product.images[0] : ''}
                alt={product.nameEn}
                className="w-24 h-32 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="text-xl font-semibold">{product.nameEn}</h3>
                <p className="text-muted-foreground" lang="ar">{product.nameAr}</p>
                <p className="text-2xl font-bold text-primary mt-2">
                  {(product.basePrice / 100).toFixed(0)} AED
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Personal Information
                <span className="text-sm font-normal text-muted-foreground" lang="ar">
                  المعلومات الشخصية
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customerName">Full Name *</Label>
                  <Input
                    id="customerName"
                    required
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerEmail">Email</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    value={formData.customerEmail}
                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customerPhone">Phone Number *</Label>
                  <Input
                    id="customerPhone"
                    required
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                    placeholder="+971 50 123 4567"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerWhatsapp">WhatsApp Number</Label>
                  <Input
                    id="customerWhatsapp"
                    value={formData.customerWhatsapp}
                    onChange={(e) => setFormData({ ...formData, customerWhatsapp: e.target.value })}
                    placeholder="+971 50 123 4567"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Shipping Information
                <span className="text-sm font-normal text-muted-foreground" lang="ar">
                  معلومات الشحن
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="shippingCity">City *</Label>
                  <Input
                    id="shippingCity"
                    required
                    value={formData.shippingCity}
                    onChange={(e) => setFormData({ ...formData, shippingCity: e.target.value })}
                    placeholder="Dubai, Abu Dhabi, etc."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shippingCountry">Country *</Label>
                  <Input
                    id="shippingCountry"
                    required
                    value={formData.shippingCountry}
                    onChange={(e) => setFormData({ ...formData, shippingCountry: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="shippingAddress">Full Address</Label>
                <Textarea
                  id="shippingAddress"
                  value={formData.shippingAddress}
                  onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
                  placeholder="Street, building, apartment number..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Product Customization */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Product Customization
                <span className="text-sm font-normal text-muted-foreground" lang="ar">
                  تخصيص المنتج
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="selectedColor">Preferred Color</Label>
                  <Input
                    id="selectedColor"
                    value={formData.selectedColor}
                    onChange={(e) => setFormData({ ...formData, selectedColor: e.target.value })}
                    placeholder="Royal Blue, Emerald Green, etc."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="selectedSize">Size</Label>
                  <Input
                    id="selectedSize"
                    value={formData.selectedSize}
                    onChange={(e) => setFormData({ ...formData, selectedSize: e.target.value })}
                    placeholder="S, M, L, XL, Custom"
                  />
                </div>
              </div>

              {/* Custom Measurements Toggle */}
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                <input
                  type="checkbox"
                  id="wantsCustom"
                  checked={wantsCustomMeasurements}
                  onChange={(e) => setWantsCustomMeasurements(e.target.checked)}
                  className="w-5 h-5"
                />
                <Label htmlFor="wantsCustom" className="cursor-pointer">
                  I want custom measurements (+50 AED)
                  <span className="block text-sm text-muted-foreground">
                    أريد مقاسات مخصصة
                  </span>
                </Label>
              </div>

              {wantsCustomMeasurements && (
                <div className="grid md:grid-cols-3 gap-4 p-4 bg-primary/5 rounded-lg">
                  <div className="space-y-2">
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input
                      id="height"
                      value={formData.customMeasurements.height}
                      onChange={(e) => setFormData({
                        ...formData,
                        customMeasurements: { ...formData.customMeasurements, height: e.target.value }
                      })}
                      placeholder="165"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bust">Bust (cm)</Label>
                    <Input
                      id="bust"
                      value={formData.customMeasurements.bust}
                      onChange={(e) => setFormData({
                        ...formData,
                        customMeasurements: { ...formData.customMeasurements, bust: e.target.value }
                      })}
                      placeholder="90"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="waist">Waist (cm)</Label>
                    <Input
                      id="waist"
                      value={formData.customMeasurements.waist}
                      onChange={(e) => setFormData({
                        ...formData,
                        customMeasurements: { ...formData.customMeasurements, waist: e.target.value }
                      })}
                      placeholder="70"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hips">Hips (cm)</Label>
                    <Input
                      id="hips"
                      value={formData.customMeasurements.hips}
                      onChange={(e) => setFormData({
                        ...formData,
                        customMeasurements: { ...formData.customMeasurements, hips: e.target.value }
                      })}
                      placeholder="95"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shoulders">Shoulders (cm)</Label>
                    <Input
                      id="shoulders"
                      value={formData.customMeasurements.shoulders}
                      onChange={(e) => setFormData({
                        ...formData,
                        customMeasurements: { ...formData.customMeasurements, shoulders: e.target.value }
                      })}
                      placeholder="40"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="armLength">Arm Length (cm)</Label>
                    <Input
                      id="armLength"
                      value={formData.customMeasurements.armLength}
                      onChange={(e) => setFormData({
                        ...formData,
                        customMeasurements: { ...formData.customMeasurements, armLength: e.target.value }
                      })}
                      placeholder="60"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="customerNotes">Special Requests / Notes</Label>
                <Textarea
                  id="customerNotes"
                  value={formData.customerNotes}
                  onChange={(e) => setFormData({ ...formData, customerNotes: e.target.value })}
                  placeholder="Any special requests or notes..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="text-3xl font-bold text-primary">
                    {((product.basePrice + (wantsCustomMeasurements ? 5000 : 0)) / 100).toFixed(0)} AED
                  </p>
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="btn-luxury px-8"
                  disabled={createOrderMutation.isPending}
                >
                  {createOrderMutation.isPending ? (
                    "Submitting..."
                  ) : (
                    <>
                      <Check className="w-5 h-5 mr-2" />
                      Submit Order
                      <span className="mx-2">•</span>
                      إرسال الطلب
                    </>
                  )}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Your order will be reviewed and we'll contact you within 24 hours
              </p>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}

