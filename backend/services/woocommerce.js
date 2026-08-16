const axios = require('axios');

class WooCommerceService {
  constructor() {
    // Note: We'll initialize the base config here, but it relies on process.env 
    // variables being loaded.
    this.getBaseUrl = () => `${process.env.WOOCOMMERCE_URL}/wp-json/wc/v3`;
  }

  get api() {
    if (!this._api) {
      this._api = axios.create({
        baseURL: this.getBaseUrl(),
        auth: {
          username: process.env.WOOCOMMERCE_CONSUMER_KEY,
          password: process.env.WOOCOMMERCE_CONSUMER_SECRET
        }
      });
    }
    return this._api;
  }

  async getProducts(params = {}) {
    try {
      const response = await this.api.get('/products', { params });
      return response.data;
    } catch (error) {
      console.error('WooCommerce API Error (getProducts):', error.message);
      if (error.response) {
        console.error(error.response.data);
      }
      throw error;
    }
  }
}

module.exports = new WooCommerceService();
