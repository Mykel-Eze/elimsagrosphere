import { useState, useEffect } from "react";
import { CheckCircle, Users, Truck, BarChart3, Shield, Zap, Leaf, TrendingUp, MessageSquare, Cloud } from "lucide-react";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
// import { Badge } from "./components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./components/ui/dialog";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { SignUpForm } from "./components/auth/SignUpForm";
import { SignInForm } from "./components/auth/SignInForm";
import { Dashboard } from "./components/dashboard/Dashboard";
import { Toaster } from "sonner";
import { getSupabaseClient } from "./utils/supabase/client";
import elimsLogo from "./assets/elims-agro-sphere.png";

const supabase = getSupabaseClient();

export default function App() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      setAccessToken(session.access_token);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setAccessToken(null);
  };

  const handleAuthSuccess = (token?: string) => {
    if (token) {
      setAccessToken(token);
    }
    setShowAuth(false);
  };

  if (accessToken) {
    return (
      <>
        <Dashboard accessToken={accessToken} onSignOut={handleSignOut} />
        <Toaster />
      </>
    );
  }
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-green-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <img src={elimsLogo} alt="Elims AgroSphere" className="h-16 w-16" />
              <span className="font-bold text-xl text-green-800 hidden md:block biz-name">ElimsAgroSphere</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#about" className="text-gray-700 hover:text-green-600 transition-colors">About</a>
              <a href="#features" className="text-gray-700 hover:text-green-600 transition-colors">Features</a>
              <a href="#mission" className="text-gray-700 hover:text-green-600 transition-colors">Mission</a>
              <a href="#contact" className="text-gray-700 hover:text-green-600 transition-colors">Contact</a>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                className="border-green-600 text-green-600 hover:bg-green-50 cursor-pointer"
                onClick={() => {
                  setAuthMode('signin');
                  setShowAuth(true);
                }}
              >
                Sign In
              </Button>
              
              <Button 
                className="bg-green-600 hover:bg-green-700 cursor-pointer"
                onClick={() => {
                  setAuthMode('signup');
                  setShowAuth(true);
                }}
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-50 via-white to-emerald-50 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Revolutionizing Agriculture.{" "}
              <span className="text-green-600">Empowering Farmers.</span>{" "}
              Feeding Communities.
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              ElimsAgroSphere is a digital platform that connects farmers directly with consumers, FMCGs, and businesses—eliminating costly middlemen, maximizing farmer profits, and delivering fresh, affordable, and traceable food to every table.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-green-600 hover:bg-green-700 text-lg px-8 py-3 cursor-pointer"
                onClick={() => {
                  setAuthMode('signup');
                  setShowAuth(true);
                }}
              >
                Join as a Farmer
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="border-green-600 text-green-600 hover:bg-green-50 text-lg px-8 py-3 cursor-pointer"
                onClick={() => {
                  setAuthMode('signup');
                  setShowAuth(true);
                }}
              >
                Shop Fresh Produce
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                About ElimsAgroSphere
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                At ElimsAgroSphere, we believe agriculture is the backbone of Africa's economy—and farmers deserve fairer access to markets.
              </p>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Our platform bridges the gap between producers and buyers, ensuring farmers earn more while consumers, businesses, and manufacturers access fresh, affordable, and high-quality agricultural products.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                By removing inefficiencies, streamlining logistics, and introducing smart technology, we're not just building a marketplace—we're shaping a sustainable future for food security, fair trade, and economic growth across Africa.
              </p>
            </div>
            <div className="bg-green-50 rounded-2xl p-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">50,000+</div>
                  <div className="text-gray-600">Farmers Connected</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">1M+</div>
                  <div className="text-gray-600">Tons Traded</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">95%</div>
                  <div className="text-gray-600">Farmer Satisfaction</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">30%</div>
                  <div className="text-gray-600">Cost Reduction</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section id="mission" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              To empower farmers and agribusinesses with a trusted, tech-enabled marketplace
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center border-green-100 hover:border-green-300 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle className="text-lg">Market Access</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Simplifies trading and improves access to markets.</p>
              </CardContent>
            </Card>
            <Card className="text-center border-green-100 hover:border-green-300 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Leaf className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle className="text-lg">Sustainable Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Drives sustainable growth and reduces food wastage.</p>
              </CardContent>
            </Card>
            <Card className="text-center border-green-100 hover:border-green-300 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle className="text-lg">Transparency</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Promotes transparency, fair pricing, and traceability.</p>
              </CardContent>
            </Card>
            <Card className="text-center border-green-100 hover:border-green-300 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle className="text-lg">Community Building</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Builds resilient agricultural communities across Africa.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Why Choose ElimsAgroSphere?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              ElimsAgroSphere is more than a marketplace—it's a revolution in agri-trade.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex items-start space-x-4">
              <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Direct Farmer-to-Market Access</h3>
                <p className="text-gray-600">No more middlemen. Farmers get better value, and buyers enjoy affordable prices.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Fresh & Traceable Produce</h3>
                <p className="text-gray-600">Know where your food comes from and trust its quality.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">AI-Driven Insights</h3>
                <p className="text-gray-600">Farmers receive crop yield forecasts, pest alerts, and irrigation recommendations.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Seamless Logistics</h3>
                <p className="text-gray-600">Real-time delivery tracking, optimized routes, and integrated supply chain support.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Community & Education</h3>
                <p className="text-gray-600">Farmers connect, learn, and grow through forums, webinars, and expert Q&As.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Disaster Preparedness</h3>
                <p className="text-gray-600">Weather alerts, crop season advice, and recovery support for farmers.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Key Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive tools and features designed to transform African agriculture
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-green-100 hover:border-green-300 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>Digital Marketplace</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Buy and sell fresh produce, inputs, and agro products with secure payment options and order tracking.</p>
              </CardContent>
            </Card>
            <Card className="border-green-100 hover:border-green-300 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Truck className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>Smart Logistics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Streamlined supply chain with real-time tracking, inventory management, and third-party logistics integration.</p>
              </CardContent>
            </Card>
            <Card className="border-green-100 hover:border-green-300 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>AI-Powered Tools</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Crop yield forecasting, pest detection, irrigation optimization, and market trend predictions.</p>
              </CardContent>
            </Card>
            <Card className="border-green-100 hover:border-green-300 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>Data Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Custom dashboards and reports help farmers, buyers, and co-ops make data-driven decisions.</p>
              </CardContent>
            </Card>
            <Card className="border-green-100 hover:border-green-300 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <MessageSquare className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>Community Engagement</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Forums, educational resources, webinars, and personalized learning paths for farmers and agri-professionals.</p>
              </CardContent>
            </Card>
            <Card className="border-green-100 hover:border-green-300 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Cloud className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>Weather Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Real-time weather alerts, disaster warnings, and recovery resources to keep farmers prepared.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Who We Serve Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Who We Serve</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Empowering every stakeholder in the agricultural value chain
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center border-green-100 hover:border-green-300 transition-colors">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle>Farmers</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Gain fair prices, market access, and tools to grow sustainably.</p>
              </CardContent>
            </Card>
            <Card className="text-center border-green-100 hover:border-green-300 transition-colors">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle>Consumers</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Access fresh, traceable, and affordable food directly from producers.</p>
              </CardContent>
            </Card>
            <Card className="text-center border-green-100 hover:border-green-300 transition-colors">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle>Businesses</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Reliable supply chain and direct farmer partnerships for FMCGs.</p>
              </CardContent>
            </Card>
            <Card className="text-center border-green-100 hover:border-green-300 transition-colors">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle>Communities</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Efficient food distribution and crisis response systems for NGOs.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Get Started Section */}
      <section className="py-20 bg-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Get Started Today</h2>
            <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto">
              Be part of Africa's agricultural transformation. Join ElimsAgroSphere and help create a transparent, efficient, and sustainable agricultural ecosystem.
            </p>
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Farmers</h3>
                <p className="text-green-100">Earn more, waste less, and grow smarter.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Businesses</h3>
                <p className="text-green-100">Access fresh, affordable, and traceable supply.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Communities</h3>
                <p className="text-green-100">Build resilient food systems for the future.</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant="secondary" 
                className="bg-white text-green-600 hover:bg-gray-100 text-lg px-8 py-3 cursor-pointer"
                onClick={() => {
                  setAuthMode('signup');
                  setShowAuth(true);
                }}
              >
                Join the Movement
              </Button>
              
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600 text-lg px-8 py-3 cursor-pointer bg-[rgba(0,166,62,1)]">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-3">
                <img src={elimsLogo} alt="Elims AgroSphere" className="h-20 w-20" />
                {/* <span className="font-bold text-lg block sm:hidden">ElimsAgroSphere</span> */}
              </div>
              <p className="text-gray-400 mb-4">
                Revolutionizing agriculture across Africa through technology and direct market access.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <div className="space-y-2">
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Marketplace</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">AI Tools</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Logistics</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Analytics</a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <div className="space-y-2">
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Help Center</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Community</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Training</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Contact</a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <div className="space-y-2">
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">About</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Careers</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Press</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Partners</a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 ElimsAgroSphere. All rights reserved. Together, we're building Africa's future of food.</p>
          </div>
        </div>
      </footer>
      
      {/* Auth Dialogs */}
      <Dialog open={showAuth && authMode === 'signin'} onOpenChange={(open) => setShowAuth(open)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign In to ElimsAgroSphere</DialogTitle>
            <DialogDescription>
              Enter your credentials to access your ElimsAgroSphere account.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center">
            <SignInForm onSuccess={handleAuthSuccess} />
            <p className="text-sm text-gray-600 mt-4">
              Don't have an account?{" "}
              <button
                onClick={() => setAuthMode('signup')}
                className="text-green-600 hover:text-green-700 font-medium cursor-pointer"
              >
                Sign up here
              </button>
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showAuth && authMode === 'signup'} onOpenChange={(open) => setShowAuth(open)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Join ElimsAgroSphere</DialogTitle>
            <DialogDescription>
              Create your account to start connecting with the agricultural marketplace.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center">
            <SignUpForm onSuccess={handleAuthSuccess} />
            <p className="text-sm text-gray-600 mt-4">
              Already have an account?{" "}
              <button
                onClick={() => setAuthMode('signin')}
                className="text-green-600 hover:text-green-700 font-medium cursor-pointer"
              >
                Sign in here
              </button>
            </p>
          </div>
        </DialogContent>
      </Dialog>
      
      <Toaster />
    </div>
  );
}