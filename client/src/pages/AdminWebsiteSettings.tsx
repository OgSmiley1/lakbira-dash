import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, Upload, Video, Image as ImageIcon, Globe, Mail, Phone, Instagram } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function AdminWebsiteSettings() {
  const [isSaving, setIsSaving] = useState(false);
  
  // Fetch current settings
  const { data: settings, refetch } = trpc.website.getSettings.useQuery();
  
  const updateSettingsMutation = trpc.website.updateSettings.useMutation({
    onSuccess: () => {
      toast.success("Settings saved successfully!");
      refetch();
      setIsSaving(false);
    },
    onError: (error: any) => {
      toast.error(`Failed to save: ${error.message}`);
      setIsSaving(false);
    }
  });
  
  const [formData, setFormData] = useState({
    // Hero Section
    heroTitleEn: settings?.heroTitleEn || "",
    heroTitleAr: settings?.heroTitleAr || "",
    heroSubtitleEn: settings?.heroSubtitleEn || "",
    heroSubtitleAr: settings?.heroSubtitleAr || "",
    heroDescriptionEn: settings?.heroDescriptionEn || "",
    heroDescriptionAr: settings?.heroDescriptionAr || "",
    
    // About Section
    aboutTitleEn: settings?.aboutTitleEn || "",
    aboutTitleAr: settings?.aboutTitleAr || "",
    aboutDescriptionEn: settings?.aboutDescriptionEn || "",
    aboutDescriptionAr: settings?.aboutDescriptionAr || "",
    
    // Background Media Settings
    slideshowSpeed: (settings as any)?.slideshowSpeed || 5000,
    
    // Contact
    contactEmail: settings?.contactEmail || "",
    contactPhone: settings?.contactPhone || "",
    contactWhatsapp: settings?.contactWhatsapp || "",
    
    // Social Media
    instagramUrl: settings?.instagramUrl || "",
    facebookUrl: settings?.facebookUrl || "",
    tiktokUrl: settings?.tiktokUrl || "",
  });
  
  const handleSave = () => {
    setIsSaving(true);
    updateSettingsMutation.mutate(formData);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-serif font-bold">Website Settings</h2>
          <p className="text-muted-foreground mt-1">
            Manage your website content and appearance
          </p>
        </div>
        <Button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-gradient-to-r from-amber-600 to-amber-700"
        >
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <Tabs defaultValue="hero" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="hero">Hero Section</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="media">Background Media</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
        </TabsList>

        {/* Hero Section */}
        <TabsContent value="hero" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Hero Section Content
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Title (English)</Label>
                  <Input
                    value={formData.heroTitleEn}
                    onChange={(e) => setFormData({...formData, heroTitleEn: e.target.value})}
                    placeholder="Ramadan Eid Collection 2024"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Title (Arabic)</Label>
                  <Input
                    value={formData.heroTitleAr}
                    onChange={(e) => setFormData({...formData, heroTitleAr: e.target.value})}
                    placeholder="مجموعة رمضان"
                    dir="rtl"
                    className="arabic-text"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Subtitle (English)</Label>
                  <Input
                    value={formData.heroSubtitleEn}
                    onChange={(e) => setFormData({...formData, heroSubtitleEn: e.target.value})}
                    placeholder="Luxury Moroccan Kaftans"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Subtitle (Arabic)</Label>
                  <Input
                    value={formData.heroSubtitleAr}
                    onChange={(e) => setFormData({...formData, heroSubtitleAr: e.target.value})}
                    placeholder="قفاطين مغربية فاخرة"
                    dir="rtl"
                    className="arabic-text"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Description (English)</Label>
                  <Textarea
                    value={formData.heroDescriptionEn}
                    onChange={(e) => setFormData({...formData, heroDescriptionEn: e.target.value})}
                    placeholder="Handcrafted luxury kaftans and abayas..."
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description (Arabic)</Label>
                  <Textarea
                    value={formData.heroDescriptionAr}
                    onChange={(e) => setFormData({...formData, heroDescriptionAr: e.target.value})}
                    placeholder="قفاطين وعباءات فاخرة مصنوعة يدوياً..."
                    dir="rtl"
                    className="arabic-text"
                    rows={4}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* About Section */}
        <TabsContent value="about" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>About La Kbira</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Title (English)</Label>
                  <Input
                    value={formData.aboutTitleEn}
                    onChange={(e) => setFormData({...formData, aboutTitleEn: e.target.value})}
                    placeholder="Why La Kbira?"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Title (Arabic)</Label>
                  <Input
                    value={formData.aboutTitleAr}
                    onChange={(e) => setFormData({...formData, aboutTitleAr: e.target.value})}
                    placeholder="لماذا لا كبيرة؟"
                    dir="rtl"
                    className="arabic-text"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Description (English)</Label>
                  <Textarea
                    value={formData.aboutDescriptionEn}
                    onChange={(e) => setFormData({...formData, aboutDescriptionEn: e.target.value})}
                    placeholder="Experience luxury fashion that honors tradition..."
                    rows={6}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description (Arabic)</Label>
                  <Textarea
                    value={formData.aboutDescriptionAr}
                    onChange={(e) => setFormData({...formData, aboutDescriptionAr: e.target.value})}
                    placeholder="اختبر الموضة الفاخرة التي تحترم التقاليد..."
                    dir="rtl"
                    className="arabic-text"
                    rows={6}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Background Media */}
        <TabsContent value="media" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="w-5 h-5" />
                Background Videos & Images
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label>Upload Background Video</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-amber-400 transition-colors cursor-pointer">
                  <Upload className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                  <p className="text-sm text-gray-600 mb-2">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-400">
                    MP4, MOV or WEBM (MAX. 50MB)
                  </p>
                  <input type="file" accept="video/*" className="hidden" />
                </div>
              </div>

              <div className="space-y-4">
                <Label>Upload Background Images</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-amber-400 transition-colors cursor-pointer">
                  <ImageIcon className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                  <p className="text-sm text-gray-600 mb-2">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-400">
                    PNG, JPG or WEBP (MAX. 10MB)
                  </p>
                  <input type="file" accept="image/*" multiple className="hidden" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Slideshow Speed (seconds)</Label>
                <Input
                  type="number"
                  value={formData.slideshowSpeed / 1000}
                  onChange={(e) => setFormData({...formData, slideshowSpeed: parseInt(e.target.value) * 1000})}
                  min={3}
                  max={30}
                  placeholder="5"
                />
                <p className="text-xs text-muted-foreground">Time between background image/video transitions</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Information */}
        <TabsContent value="contact" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                  placeholder="info@lakbira.com"
                />
              </div>

              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  type="tel"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({...formData, contactPhone: e.target.value})}
                  placeholder="+971 XX XXX XXXX"
                />
              </div>

              <div className="space-y-2">
                <Label>WhatsApp</Label>
                <Input
                  type="tel"
                  value={formData.contactWhatsapp}
                  onChange={(e) => setFormData({...formData, contactWhatsapp: e.target.value})}
                  placeholder="+971 XX XXX XXXX"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Media */}
        <TabsContent value="social" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Instagram className="w-5 h-5" />
                Social Media Links
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Instagram URL</Label>
                <Input
                  value={formData.instagramUrl}
                  onChange={(e) => setFormData({...formData, instagramUrl: e.target.value})}
                  placeholder="https://instagram.com/la_kbiraf"
                />
              </div>

              <div className="space-y-2">
                <Label>Facebook URL</Label>
                <Input
                  value={formData.facebookUrl}
                  onChange={(e) => setFormData({...formData, facebookUrl: e.target.value})}
                  placeholder="https://facebook.com/lakbira"
                />
              </div>

              <div className="space-y-2">
                <Label>TikTok URL</Label>
                <Input
                  value={formData.tiktokUrl}
                  onChange={(e) => setFormData({...formData, tiktokUrl: e.target.value})}
                  placeholder="https://tiktok.com/@lakbira"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

