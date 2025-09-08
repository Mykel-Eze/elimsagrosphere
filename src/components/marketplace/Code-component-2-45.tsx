import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Switch } from "../ui/switch";
import { toast } from "sonner@2.0.3";
import { projectId } from "../../utils/supabase/info";

interface CreateProductFormProps {
  accessToken: string;
  onSuccess?: () => void;
}

const PRODUCT_CATEGORIES = [
  "Vegetables", "Fruits", "Grains", "Legumes", "Tubers", 
  "Herbs & Spices", "Nuts & Seeds", "Livestock", "Dairy", "Other"
];

const UNITS = ["kg", "tonnes", "bags", "pieces", "bunches", "liters"];

export function CreateProductForm({ accessToken, onSuccess }: CreateProductFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    unit: "kg",
    quantity: "",
    harvest_date: "",
    location: "",
    organic: false,
    images: [] as string[]
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-b712d4ef/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          quantity: parseInt(formData.quantity)
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Product listing created successfully!");
        setFormData({
          name: "",
          description: "",
          category: "",
          price: "",
          unit: "kg",
          quantity: "",
          harvest_date: "",
          location: "",
          organic: false,
          images: []
        });
        onSuccess?.();
      } else {
        toast.error(data.error || "Failed to create product listing");
      }
    } catch (error) {
      console.error('Create product error:', error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Create Product Listing</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
                placeholder="e.g., Fresh Tomatoes"
              />
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Select onValueChange={(value) => handleChange('category', value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCT_CATEGORIES.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Describe your product quality, variety, farming methods..."
              rows={3}
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="price">Price per Unit</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => handleChange('price', e.target.value)}
                required
                placeholder="0.00"
              />
            </div>

            <div>
              <Label htmlFor="unit">Unit</Label>
              <Select value={formData.unit} onValueChange={(value) => handleChange('unit', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {UNITS.map(unit => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="quantity">Available Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => handleChange('quantity', e.target.value)}
                required
                placeholder="100"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="harvest_date">Harvest Date (Optional)</Label>
              <Input
                id="harvest_date"
                type="date"
                value={formData.harvest_date}
                onChange={(e) => handleChange('harvest_date', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                type="text"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder="City, State"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="organic"
              checked={formData.organic}
              onCheckedChange={(checked) => handleChange('organic', checked)}
            />
            <Label htmlFor="organic">This is an organic product</Label>
          </div>

          <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={loading}>
            {loading ? "Creating Listing..." : "Create Product Listing"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}