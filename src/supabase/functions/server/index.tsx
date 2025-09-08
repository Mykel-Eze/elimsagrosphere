/* eslint-disable @typescript-eslint/no-unused-vars */
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { serve } from '@hono/node-server'
import { createClient } from '@supabase/supabase-js'
import { randomUUID } from 'crypto'
import dotenv from 'dotenv'
import * as kv from './kv_store'

// Load environment variables
dotenv.config()

const app = new Hono()

app.use('*', logger(console.log))
app.use('*', cors({
  origin: '*',
  allowHeaders: ['*'],
  allowMethods: ['*'],
}))

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing Supabase environment variables');
}
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
)


// User Registration
app.post('/make-server-b712d4ef/signup', async (c) => {
  try {
    const { email, password, name, role, phone, location } = await c.req.json()
    
    if (!email || !password || !name || !role) {
      return c.json({ error: 'Missing required fields' }, 400)
    }

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, role, phone, location },
      email_confirm: true
    })

    if (authError) {
      console.log('Auth error during signup:', authError)
      return c.json({ error: 'Failed to create user account' }, 400)
    }

    // Store additional user profile data
    const userProfile = {
      user_id: authData.user.id,
      email,
      name,
      role, // farmer, consumer, business, ngo
      phone: phone || null,
      location: location || null,
      created_at: new Date().toISOString(),
      verified: false,
      rating: 0,
      total_transactions: 0
    }

    await kv.set(`user_profile:${authData.user.id}`, userProfile)

    // Initialize role-specific data
    if (role === 'farmer') {
      await kv.set(`farmer_profile:${authData.user.id}`, {
        farm_size: null,
        crops: [],
        certifications: [],
        total_sales: 0,
        active_listings: 0
      })
    } else if (role === 'business') {
      await kv.set(`business_profile:${authData.user.id}`, {
        company_name: name,
        business_type: null,
        purchase_volume: 0,
        preferred_products: []
      })
    }

    return c.json({ 
      message: 'User registered successfully',
      user_id: authData.user.id
    })
  } catch (error) {
    console.log('Error during signup:', error)
    return c.json({ error: 'Internal server error during signup' }, 500)
  }
})

// Get User Profile
app.get('/make-server-b712d4ef/profile', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (!user?.id) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const userProfile = await kv.get(`user_profile:${user.id}`)
    if (!userProfile) {
      return c.json({ error: 'Profile not found' }, 404)
    }

    let roleProfile = null
    if (userProfile.role === 'farmer') {
      roleProfile = await kv.get(`farmer_profile:${user.id}`)
    } else if (userProfile.role === 'business') {
      roleProfile = await kv.get(`business_profile:${user.id}`)
    }

    return c.json({
      profile: userProfile,
      role_profile: roleProfile
    })
  } catch (error) {
    console.log('Error fetching profile:', error)
    return c.json({ error: 'Failed to fetch profile' }, 500)
  }
})

// Create Product Listing
app.post('/make-server-b712d4ef/products', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (!user?.id) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const userProfile = await kv.get(`user_profile:${user.id}`)
    if (userProfile?.role !== 'farmer') {
      return c.json({ error: 'Only farmers can create product listings' }, 403)
    }

    const { 
      name, 
      description, 
      category, 
      price, 
      unit, 
      quantity, 
      harvest_date,
      location,
      organic,
      images 
    } = await c.req.json()

    if (!name || !price || !quantity || !category) {
      return c.json({ error: 'Missing required product fields' }, 400)
    }

    const productId = randomUUID()
    const product = {
      id: productId,
      farmer_id: user.id,
      farmer_name: userProfile.name,
      name,
      description: description || '',
      category,
      price: parseFloat(price),
      unit: unit || 'kg',
      quantity: parseInt(quantity),
      harvest_date: harvest_date || null,
      location: location || userProfile.location,
      organic: organic || false,
      images: images || [],
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      views: 0,
      inquiries: 0
    }

    await kv.set(`product:${productId}`, product)
    await kv.set(`farmer_product:${user.id}:${productId}`, productId)

    // Update farmer's active listings count
    const farmerProfile = await kv.get(`farmer_profile:${user.id}`)
    if (farmerProfile) {
      farmerProfile.active_listings += 1
      await kv.set(`farmer_profile:${user.id}`, farmerProfile)
    }

    return c.json({
      message: 'Product listing created successfully',
      product_id: productId
    })
  } catch (error) {
    console.log('Error creating product:', error)
    return c.json({ error: 'Failed to create product listing' }, 500)
  }
})

// Get Products (with filtering)
app.get('/make-server-b712d4ef/products', async (c) => {
  try {
    const category = c.req.query('category')
    const location = c.req.query('location')
    const organic = c.req.query('organic')
    const limit = parseInt(c.req.query('limit') || '20')

    // Get all active products
    const allProducts = await kv.getByPrefix('product:')
    let products = allProducts.filter(p => p.status === 'active')

    // Apply filters
    if (category) {
      products = products.filter(p => p.category.toLowerCase() === category.toLowerCase())
    }
    if (location) {
      products = products.filter(p => p.location?.toLowerCase().includes(location.toLowerCase()))
    }
    if (organic === 'true') {
      products = products.filter(p => p.organic === true)
    }

    // Sort by creation date (newest first) and limit
    products = products
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit)

    return c.json({
      products,
      total: products.length
    })
  } catch (error) {
    console.log('Error fetching products:', error)
    return c.json({ error: 'Failed to fetch products' }, 500)
  }
})

// Create Order/Inquiry
app.post('/make-server-b712d4ef/orders', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (!user?.id) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const { product_id, quantity, message, delivery_address } = await c.req.json()

    if (!product_id || !quantity) {
      return c.json({ error: 'Missing required order fields' }, 400)
    }

    // Get product details
    const product = await kv.get(`product:${product_id}`)
    if (!product) {
      return c.json({ error: 'Product not found' }, 404)
    }

    if (product.quantity < quantity) {
      return c.json({ error: 'Insufficient quantity available' }, 400)
    }

    const orderId = randomUUID()
    const order = {
      id: orderId,
      product_id,
      farmer_id: product.farmer_id,
      buyer_id: user.id,
      product_name: product.name,
      quantity: parseInt(quantity),
      unit_price: product.price,
      total_price: product.price * parseInt(quantity),
      message: message || '',
      delivery_address: delivery_address || '',
      status: 'pending', // pending, confirmed, shipped, delivered, cancelled
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    await kv.set(`order:${orderId}`, order)
    await kv.set(`farmer_order:${product.farmer_id}:${orderId}`, orderId)
    await kv.set(`buyer_order:${user.id}:${orderId}`, orderId)

    // Update product inquiries count
    product.inquiries += 1
    await kv.set(`product:${product_id}`, product)

    return c.json({
      message: 'Order created successfully',
      order_id: orderId,
      total_price: order.total_price
    })
  } catch (error) {
    console.log('Error creating order:', error)
    return c.json({ error: 'Failed to create order' }, 500)
  }
})

// Get User Orders
app.get('/make-server-b712d4ef/orders', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (!user?.id) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const userProfile = await kv.get(`user_profile:${user.id}`)
    let orders = []

    if (userProfile?.role === 'farmer') {
      const farmerOrderIds = await kv.getByPrefix(`farmer_order:${user.id}:`)
      const orderPromises = farmerOrderIds.map(id => kv.get(`order:${id}`))
      orders = await Promise.all(orderPromises)
    } else {
      const buyerOrderIds = await kv.getByPrefix(`buyer_order:${user.id}:`)
      const orderPromises = buyerOrderIds.map(id => kv.get(`order:${id}`))
      orders = await Promise.all(orderPromises)
    }

    orders = orders
      .filter(order => order !== null)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    return c.json({
      orders,
      total: orders.length
    })
  } catch (error) {
    console.log('Error fetching orders:', error)
    return c.json({ error: 'Failed to fetch orders' }, 500)
  }
})

// Update Order Status (farmers only)
app.put('/make-server-b712d4ef/orders/:id/status', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (!user?.id) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const orderId = c.req.param('id')
    const { status } = await c.req.json()

    if (!['confirmed', 'shipped', 'delivered', 'cancelled'].includes(status)) {
      return c.json({ error: 'Invalid status' }, 400)
    }

    const order = await kv.get(`order:${orderId}`)
    if (!order) {
      return c.json({ error: 'Order not found' }, 404)
    }

    if (order.farmer_id !== user.id) {
      return c.json({ error: 'You can only update your own orders' }, 403)
    }

    order.status = status
    order.updated_at = new Date().toISOString()

    await kv.set(`order:${orderId}`, order)

    return c.json({
      message: 'Order status updated successfully',
      order
    })
  } catch (error) {
    console.log('Error updating order status:', error)
    return c.json({ error: 'Failed to update order status' }, 500)
  }
})

// Create Community Post
app.post('/make-server-b712d4ef/community/posts', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (!user?.id) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const userProfile = await kv.get(`user_profile:${user.id}`)
    const { title, content, category, tags } = await c.req.json()

    if (!title || !content) {
      return c.json({ error: 'Title and content are required' }, 400)
    }

    const postId = randomUUID()
    const post = {
      id: postId,
      author_id: user.id,
      author_name: userProfile.name,
      author_role: userProfile.role,
      title,
      content,
      category: category || 'general',
      tags: tags || [],
      likes: 0,
      replies: 0,
      views: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    await kv.set(`community_post:${postId}`, post)
    await kv.set(`user_post:${user.id}:${postId}`, postId)

    return c.json({
      message: 'Community post created successfully',
      post_id: postId
    })
  } catch (error) {
    console.log('Error creating community post:', error)
    return c.json({ error: 'Failed to create community post' }, 500)
  }
})

// Get Community Posts
app.get('/make-server-b712d4ef/community/posts', async (c) => {
  try {
    const category = c.req.query('category')
    const limit = parseInt(c.req.query('limit') || '20')

    let posts = await kv.getByPrefix('community_post:')

    if (category) {
      posts = posts.filter(p => p.category.toLowerCase() === category.toLowerCase())
    }

    posts = posts
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit)

    return c.json({
      posts,
      total: posts.length
    })
  } catch (error) {
    console.log('Error fetching community posts:', error)
    return c.json({ error: 'Failed to fetch community posts' }, 500)
  }
})

// Get Platform Analytics (admin/overview)
app.get('/make-server-b712d4ef/analytics', async (c) => {
  try {
    const users = await kv.getByPrefix('user_profile:')
    const products = await kv.getByPrefix('product:')
    const orders = await kv.getByPrefix('order:')
    const posts = await kv.getByPrefix('community_post:')

    const farmers = users.filter(u => u.role === 'farmer')
    const consumers = users.filter(u => u.role === 'consumer')
    const businesses = users.filter(u => u.role === 'business')

    const activeProducts = products.filter(p => p.status === 'active')
    const totalValue = orders.reduce((sum, order) => sum + (order.total_price || 0), 0)

    return c.json({
      users: {
        total: users.length,
        farmers: farmers.length,
        consumers: consumers.length,
        businesses: businesses.length
      },
      marketplace: {
        active_products: activeProducts.length,
        total_orders: orders.length,
        total_value: totalValue
      },
      community: {
        total_posts: posts.length
      }
    })
  } catch (error) {
    console.log('Error fetching analytics:', error)
    return c.json({ error: 'Failed to fetch analytics' }, 500)
  }
})

// Search functionality
app.get('/make-server-b712d4ef/search', async (c) => {
  try {
    const query = c.req.query('q')
    const type = c.req.query('type') || 'products' // products, posts, users

    if (!query) {
      return c.json({ error: 'Search query is required' }, 400)
    }

    const searchTerm = query.toLowerCase()
    let results = []

    if (type === 'products') {
      const products = await kv.getByPrefix('product:')
      results = products.filter(p => 
        p.status === 'active' && (
          p.name.toLowerCase().includes(searchTerm) ||
          p.description.toLowerCase().includes(searchTerm) ||
          p.category.toLowerCase().includes(searchTerm)
        )
      )
    } else if (type === 'posts') {
      const posts = await kv.getByPrefix('community_post:')
      results = posts.filter(p =>
        p.title.toLowerCase().includes(searchTerm) ||
        p.content.toLowerCase().includes(searchTerm)
      )
    }

    return c.json({
      results: results.slice(0, 20),
      total: results.length
    })
  } catch (error) {
    console.log('Error performing search:', error)
    return c.json({ error: 'Search failed' }, 500)
  }
})

// Start the server
const port = Number(process.env.PORT) || 3000
serve({
  fetch: app.fetch,
  port,
})

console.log(`Server is running on port ${port}`)