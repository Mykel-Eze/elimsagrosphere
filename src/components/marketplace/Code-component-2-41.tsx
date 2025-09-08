import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { MapPin, Calendar, Eye, MessageSquare } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  unit: string;
  quantity: number;
  farmer_name: string;
  location?: string;
  harvest_date?: string;
  organic: boolean;
  images: string[];
  views: number;
  inquiries: number;
  created_at: string;
}

interface ProductCardProps {
  product: Product;
  onInquire?: (productId: string) => void;
  showFarmerInfo?: boolean;
}

export function ProductCard({ product, onInquire, showFarmerInfo = true }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className="hover:shadow-md transition-shadow border-green-100">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          {product.images && product.images.length > 0 ? (
            <ImageWithFallback
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover rounded-t-lg"
            />
          ) : (
            <div className="w-full h-full bg-green-50 flex items-center justify-center rounded-t-lg">
              <span className="text-green-600 text-4xl">🌱</span>
            </div>
          )}
          {product.organic && (
            <Badge className="absolute top-2 left-2 bg-green-600 text-white">
              Organic
            </Badge>
          )}
          <Badge variant="secondary" className="absolute top-2 right-2">
            {product.category}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <CardTitle className="text-lg">{product.name}</CardTitle>
          <div className="text-right">
            <div className="text-xl font-bold text-green-600">
              {formatPrice(product.price)}
            </div>
            <div className="text-sm text-gray-500">per {product.unit}</div>
          </div>
        </div>

        {product.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {product.description}
          </p>
        )}

        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <span className="font-medium">Available: {product.quantity} {product.unit}</span>
          {product.harvest_date && (
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(product.harvest_date)}</span>
            </div>
          )}
        </div>

        {showFarmerInfo && (
          <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-100">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 text-sm font-semibold">
                {product.farmer_name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <div className="font-medium text-sm">{product.farmer_name}</div>
              {product.location && (
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <MapPin className="w-3 h-3" />
                  <span>{product.location}</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span>{product.views}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="w-3 h-3" />
              <span>{product.inquiries}</span>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            {formatDate(product.created_at)}
          </div>
        </div>

        <Button 
          className="w-full bg-green-600 hover:bg-green-700"
          onClick={() => onInquire?.(product.id)}
        >
          Make Inquiry
        </Button>
      </CardContent>
    </Card>
  );
}