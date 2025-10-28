import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2, Upload, Eye, EyeOff } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function AdminProducts() {
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);

  const { data: products, refetch } = trpc.products.list.useQuery();
  const { data: collections } = trpc.collections.list.useQuery();

  const [formData, setFormData] = useState({
    nameEn: "",
    nameAr: "",
    descriptionEn: "",
    descriptionAr: "",
    basePrice: 0,
    fabricEn: "",
    fabricAr: "",
    collectionId: "",
    availableColors: [""],
    availableSizes: ["Free Size"],
    images: [""]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement product creation/update
    console.log("Product data:", formData);
    setIsAddingProduct(false);
    refetch();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // TODO: Implement S3 upload
    console.log("Uploading image:", file.name);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Products Management</h2>
          <p className="text-muted-foreground">Manage your product catalog</p>
        </div>
        <Button onClick={() => setIsAddingProduct(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Add/Edit Product Form */}
      {(isAddingProduct || editingProduct) && (
        <Card>
          <CardHeader>
            <CardTitle>{editingProduct ? "Edit Product" : "Add New Product"}</CardTitle>
            <CardDescription>Fill in the product details below</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* English Name */}
                <div className="space-y-2">
                  <Label htmlFor="nameEn">Product Name (English)</Label>
                  <Input
                    id="nameEn"
                    value={formData.nameEn}
                    onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                    placeholder="Blue Sky Kaftan"
                    required
                  />
                </div>

                {/* Arabic Name */}
                <div className="space-y-2">
                  <Label htmlFor="nameAr">Product Name (Arabic)</Label>
                  <Input
                    id="nameAr"
                    value={formData.nameAr}
                    onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                    placeholder="قفطان السماء الزرقاء"
                    dir="rtl"
                    required
                  />
                </div>
              </div>

              {/* English Description */}
              <div className="space-y-2">
                <Label htmlFor="descriptionEn">Description (English)</Label>
                <Textarea
                  id="descriptionEn"
                  value={formData.descriptionEn}
                  onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                  placeholder="Elegant Moroccan design with beautiful embroidery..."
                  rows={3}
                />
              </div>

              {/* Arabic Description */}
              <div className="space-y-2">
                <Label htmlFor="descriptionAr">Description (Arabic)</Label>
                <Textarea
                  id="descriptionAr"
                  value={formData.descriptionAr}
                  onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
                  placeholder="تصميم مغربي أنيق مع تطريز جميل..."
                  dir="rtl"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Price */}
                <div className="space-y-2">
                  <Label htmlFor="basePrice">Base Price (AED)</Label>
                  <Input
                    id="basePrice"
                    type="number"
                    value={formData.basePrice}
                    onChange={(e) => setFormData({ ...formData, basePrice: parseInt(e.target.value) })}
                    placeholder="0"
                    min="0"
                  />
                  <p className="text-xs text-muted-foreground">Set to 0 for "DM for price"</p>
                </div>

                {/* Fabric English */}
                <div className="space-y-2">
                  <Label htmlFor="fabricEn">Fabric (English)</Label>
                  <Input
                    id="fabricEn"
                    value={formData.fabricEn}
                    onChange={(e) => setFormData({ ...formData, fabricEn: e.target.value })}
                    placeholder="Chiffon"
                  />
                </div>

                {/* Fabric Arabic */}
                <div className="space-y-2">
                  <Label htmlFor="fabricAr">Fabric (Arabic)</Label>
                  <Input
                    id="fabricAr"
                    value={formData.fabricAr}
                    onChange={(e) => setFormData({ ...formData, fabricAr: e.target.value })}
                    placeholder="شيفون"
                    dir="rtl"
                  />
                </div>
              </div>

              {/* Collection */}
              <div className="space-y-2">
                <Label htmlFor="collectionId">Collection</Label>
                <select
                  id="collectionId"
                  value={formData.collectionId}
                  onChange={(e) => setFormData({ ...formData, collectionId: e.target.value })}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  required
                >
                  <option value="">Select a collection</option>
                  {collections?.map((collection) => (
                    <option key={collection.id} value={collection.id}>
                      {collection.nameEn} / {collection.nameAr}
                    </option>
                  ))}
                </select>
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <Label htmlFor="images">Product Images</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="images"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    multiple
                  />
                  <Button type="button" variant="outline" size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload to S3
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Upload high-quality product images</p>
              </div>

              {/* Form Actions */}
              <div className="flex items-center gap-2 pt-4">
                <Button type="submit">
                  {editingProduct ? "Update Product" : "Add Product"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAddingProduct(false);
                    setEditingProduct(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Products List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products?.map((product) => (
          <Card key={product.id}>
            <CardHeader className="pb-3">
              {product.images && JSON.parse(product.images)[0] && (
                <img
                  src={JSON.parse(product.images)[0]}
                  alt={product.nameEn}
                  className="w-full h-48 object-cover rounded-md mb-3"
                />
              )}
              <CardTitle className="text-lg">{product.nameEn}</CardTitle>
              <CardDescription className="text-right" dir="rtl">{product.nameAr}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Price:</span>
                  <span className="font-semibold">
                    {product.basePrice === 0 ? "DM for price" : `${product.basePrice} AED`}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Fabric:</span>
                  <span>{product.fabricEn}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="flex items-center gap-1">
                    {product.isActive ? (
                      <>
                        <Eye className="w-3 h-3 text-green-600" />
                        <span className="text-green-600">Active</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3 h-3 text-gray-400" />
                        <span className="text-gray-400">Inactive</span>
                      </>
                    )}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingProduct(product.id)}
                  className="flex-1"
                >
                  <Edit className="w-3 h-3 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    if (confirm("Are you sure you want to delete this product?")) {
                      // TODO: Implement delete
                      console.log("Delete product:", product.id);
                    }
                  }}
                  className="flex-1"
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {products?.length === 0 && !isAddingProduct && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No products yet. Add your first product to get started!</p>
            <Button onClick={() => setIsAddingProduct(true)} className="mt-4">
              <Plus className="w-4 h-4 mr-2" />
              Add First Product
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

