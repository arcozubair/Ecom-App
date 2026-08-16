const axios = require('axios');
const woocommerceService = require('../services/woocommerce');

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // 1. Verify password and get WP JWT token from miniOrange
    const wpAuthResponse = await axios.post(`${process.env.WOOCOMMERCE_URL}wp-json/api/v1/token`, {
      username,
      password
    });
    
    const token = wpAuthResponse.data.jwt_token;
    
    // 2. Fetch the rich WooCommerce customer data
    const customers = await woocommerceService.api.get('/customers', { params: { email: username } });
    
    if (customers.data && customers.data.length > 0) {
      res.json({ token, user: customers.data[0] });
    } else {
      res.status(401).json({ error: 'User found in WP but not in WooCommerce' });
    }
  } catch (error) {
    console.error('Login Error:', error.response?.data || error.message);
    res.status(401).json({ error: error.response?.data?.error_description || error.response?.data?.message || 'Invalid credentials' });
  }
};

exports.register = async (req, res) => {
  try {
    const { email, password, first_name, last_name } = req.body;
    
    // 1. Create WooCommerce customer
    const response = await woocommerceService.api.post('/customers', {
      email,
      username: email,
      password,
      first_name,
      last_name
    });
    
    // 2. Immediately login to get the JWT token
    const wpAuthResponse = await axios.post(`${process.env.WOOCOMMERCE_URL}wp-json/api/v1/token`, {
      username: email,
      password
    });
    
    res.json({ token: wpAuthResponse.data.jwt_token, user: response.data });
  } catch (error) {
    console.error('WooCommerce Registration Error:', error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data?.error_description || error.response?.data?.message || 'Registration failed' });
  }
};

exports.googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body;
    
    // 1. Verify Google Token
    const googleRes = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);
    const { email, given_name, family_name } = googleRes.data;
    
    if (!email) throw new Error('No email found in Google token');

    // 2. Check if customer exists in WooCommerce
    let customers = await woocommerceService.api.get('/customers', { params: { email } });
    let customer = customers.data[0];
    
    // 3. Create if they don't exist
    if (!customer) {
      // Create a random complex password for Google users
      const randomPassword = Math.random().toString(36).slice(-10) + 'Aa1!'; 
      const response = await woocommerceService.api.post('/customers', {
        email,
        username: email,
        password: randomPassword,
        first_name: given_name || '',
        last_name: family_name || ''
      });
      customer = response.data;
    }
    
    // 4. Return the user (Note: we don't return a WP JWT here because Google handles auth.
    // In a real headless setup, we'd sign our own JWT here for Google users.)
    // For now, we'll return a mock token for Google sessions since WP JWT plugin doesn't support Google directly.
    res.json({ token: 'google-session-token-' + customer.id, user: customer });
    
  } catch (error) {
    console.error('Google Login Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Google login failed' });
  }
};
