const axios = require('axios');

class WooCommerceService {
  constructor() {
    // Note: We'll initialize the base config here, but it relies on process.env 
    // variables being loaded.
    this.getBaseUrl = () => `${process.env.WOOCOMMERCE_URL}/wp-json/wc/v3`;
  }

  // The traditional v3 API (used for admin tasks, orders, etc.)
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

  // The newer, faster Store API (used for storefront catalog)
  get storeApi() {
    if (!this._storeApi) {
      this._storeApi = axios.create({
        baseURL: `${process.env.WOOCOMMERCE_URL}/wp-json/wc/store/v1`
      });
    }
    return this._storeApi;
  }

  async getProducts(params = {}) {
    try {
      // Reverting to the v3 API because Store API changes the JSON structure (like prices)
      // which breaks the mobile app's frontend. Our Node cache will still keep it fast!
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
