/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ProductCard } from "../marketplace/ProductCard";
import { CreateProductForm } from "../marketplace/CreateProductForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Plus, Package, ShoppingCart, TrendingUp, Users, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { projectId } from "../../utils/supabase/info";

interface UserProfile {
  user_id: string;
  email: string;
  name: string;
  role: string;
  phone?: string;
  location?: string;
  verified: boolean;
  rating: number;
  total_transactions: number;
}

interface DashboardProps {
  accessToken: string;
  onSignOut: () => void;
}

export function Dashboard({ accessToken, onSignOut }: DashboardProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateProduct, setShowCreateProduct] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, [accessToken]);

  const loadDashboardData = async () => {
    try {
      // Load profile
      const profileResponse = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-b712d4ef/profile`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      
      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        setProfile(profileData.profile);
      }

      // Load products (for farmers) or marketplace products (for others)
      const productsResponse = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-b712d4ef/products?limit=12`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      
      if (productsResponse.ok) {
        const productsData = await productsResponse.json();
        setProducts(productsData.products || []);
      }

      // Load orders
      const ordersResponse = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-b712d4ef/orders`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      
      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json();
        setOrders(ordersData.orders || []);
      }

      // Load analytics
      const analyticsResponse = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-b712d4ef/analytics`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      
      if (analyticsResponse.ok) {
        const analyticsData = await analyticsResponse.json();
        setAnalytics(analyticsData);
      }

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleProductInquiry = (productId: string) => {
    toast.info("Contact feature coming soon! Please use the farmer's contact information.");
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Failed to load profile</p>
          <Button onClick={onSignOut} variant="outline">Sign Out</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome back, {profile.name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant={profile.verified ? "default" : "secondary"} className="bg-green-600">
                {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
              </Badge>
              <Button onClick={onSignOut} variant="outline">
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        {analytics && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.users.total}</div>
                <p className="text-xs text-muted-foreground">
                  {analytics.users.farmers} farmers, {analytics.users.consumers} consumers
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Products</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.marketplace.active_products}</div>
                <p className="text-xs text-muted-foreground">
                  Available in marketplace
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.marketplace.total_orders}</div>
                <p className="text-xs text-muted-foreground">
                  Orders processed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Platform Value</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatPrice(analytics.marketplace.total_value)}</div>
                <p className="text-xs text-muted-foreground">
                  Total transaction value
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs defaultValue="marketplace" className="space-y-6">
          <TabsList className="grid w-full lg:w-[600px] grid-cols-4">
            <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
            {profile.role === 'farmer' && <TabsTrigger value="products">My Products</TabsTrigger>}
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
          </TabsList>

          <TabsContent value="marketplace" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Fresh Products</h2>
                <p className="text-gray-600">Discover fresh produce from local farmers</p>
              </div>
              {profile.role === 'farmer' && (
                <Dialog open={showCreateProduct} onOpenChange={setShowCreateProduct}>
                  <DialogTrigger asChild>
                    <Button className="bg-green-600 hover:bg-green-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Product
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Create New Product Listing</DialogTitle>
                    </DialogHeader>
                    <CreateProductForm 
                      accessToken={accessToken}
                      onSuccess={() => {
                        setShowCreateProduct(false);
                        loadDashboardData();
                      }}
                    />
                  </DialogContent>
                </Dialog>
              )}
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product: any) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onInquire={handleProductInquiry}
                />
              ))}
            </div>

            {products.length === 0 && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Package className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No products available</h3>
                  <p className="text-gray-600 text-center">
                    {profile.role === 'farmer' 
                      ? "Start by creating your first product listing"
                      : "Check back later for fresh products from our farmers"
                    }
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {profile.role === 'farmer' && (
            <TabsContent value="products" className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">My Products</h2>
                  <p className="text-gray-600">Manage your product listings</p>
                </div>
                <Dialog open={showCreateProduct} onOpenChange={setShowCreateProduct}>
                  <DialogTrigger asChild>
                    <Button className="bg-green-600 hover:bg-green-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Product
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Create New Product Listing</DialogTitle>
                    </DialogHeader>
                    <CreateProductForm 
                      accessToken={accessToken}
                      onSuccess={() => {
                        setShowCreateProduct(false);
                        loadDashboardData();
                      }}
                    />
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.filter((p: any) => p.farmer_id === profile.user_id).map((product: any) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    showFarmerInfo={false}
                  />
                ))}
              </div>
            </TabsContent>
          )}

          <TabsContent value="orders" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Orders</h2>
              <p className="text-gray-600">
                {profile.role === 'farmer' ? 'Orders for your products' : 'Your purchase orders'}
              </p>
            </div>

            <div className="space-y-4">
              {orders.map((order: any) => (
                <Card key={order.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{order.product_name}</h3>
                        <p className="text-gray-600">Quantity: {order.quantity} units</p>
                        {order.message && (
                          <p className="text-sm text-gray-500 mt-1">Message: {order.message}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">
                          {formatPrice(order.total_price)}
                        </div>
                        <Badge 
                          variant={order.status === 'delivered' ? 'default' : 'secondary'}
                          className={order.status === 'delivered' ? 'bg-green-600' : ''}
                        >
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      Order placed: {new Date(order.created_at).toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {orders.length === 0 && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <ShoppingCart className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                  <p className="text-gray-600 text-center">
                    {profile.role === 'farmer' 
                      ? "Orders for your products will appear here"
                      : "Your purchase history will appear here"
                    }
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="community" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Community</h2>
              <p className="text-gray-600">Connect, learn, and share with the agricultural community</p>
            </div>

            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <MessageSquare className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Community Features Coming Soon</h3>
                <p className="text-gray-600 text-center">
                  Forums, educational resources, and farmer networks are in development
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}