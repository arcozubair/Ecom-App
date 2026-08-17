const woocommerceService = require('../services/woocommerce');

// Simple in-memory cache
const cache = {};
// We'll consider data "stale" after 5 minutes, but we still serve it!
const CACHE_TTL = 5 * 60 * 1000; 

exports.getProducts = async (req, res) => {
  try {
    const start = Date.now();
    // Support: page, per_page, search, category, min_price, max_price, order, orderby, featured
    const allowed = ['page', 'per_page', 'search', 'category', 'min_price', 'max_price', 'order', 'orderby', 'featured'];
    const params = {};
    allowed.forEach(key => { if (req.query[key] !== undefined) params[key] = req.query[key]; });

    // Generate a unique cache key based on the parameters
    const cacheKey = JSON.stringify(params);

    // If we have ANY data in cache (even if it's old), return it immediately to the user!
    if (cache[cacheKey]) {
      // If the data is older than 5 minutes, fetch fresh data in the background silently
      if (Date.now() - cache[cacheKey].timestamp > CACHE_TTL) {
        console.log(`[Cache] Data is stale. Refreshing WooCommerce products in the background...`);
        
        woocommerceService.getProducts(params)
          .then(freshProducts => {
            cache[cacheKey] = { timestamp: Date.now(), data: freshProducts };
            console.log(`[Cache] Background refresh complete!`);
          })
          .catch(err => console.error('[Cache] Background refresh failed:', err.message));
      }

      const duration = Date.now() - start;
      console.log(`[Timer] Fetched products (CACHE) in ${duration}ms`);
      return res.json(cache[cacheKey].data);
    }

    // Only the VERY FIRST user after you restart the backend server will wait 3 seconds.
    console.log(`[Cache] Initial fetch from WooCommerce...`);
    const products = await woocommerceService.getProducts(params);
    
    // Store the fresh data in cache
    cache[cacheKey] = {
      timestamp: Date.now(),
      data: products
    };
    
    const duration = Date.now() - start;
    console.log(`[Timer] Fetched products (API) in ${duration}ms`);
    
    res.json(products);
  } catch (error) {
    console.error('Products fetch error:', error.message);
    res.status(500).json({ error: 'Failed to fetch products from WooCommerce' });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const cacheKey = `product_${productId}`;

    // Stale-while-revalidate for single products
    if (cache[cacheKey]) {
      if (Date.now() - cache[cacheKey].timestamp > CACHE_TTL) {
        woocommerceService.api.get(`/products/${productId}`)
          .then(response => {
            cache[cacheKey] = { timestamp: Date.now(), data: response.data };
          })
          .catch(err => console.error('[Cache] Background product refresh failed:', err.message));
      }
      return res.json(cache[cacheKey].data);
    }

    const response = await woocommerceService.api.get(`/products/${productId}`);
    
    cache[cacheKey] = {
      timestamp: Date.now(),
      data: response.data
    };

    res.json(response.data);
  } catch (error) {
    console.error('Product fetch error:', error.message);
    res.status(404).json({ error: 'Product not found' });
  }
};
