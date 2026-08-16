const axios = require('axios');

class ShiprocketService {
  constructor() {
    this.api = axios.create({
      baseURL: 'https://apiv2.shiprocket.in/v1/external',
    });
    this.token = null;
  }

  async authenticate() {
    try {
      const response = await this.api.post('/auth/login', {
        email: process.env.SHIPROCKET_EMAIL,
        password: process.env.SHIPROCKET_PASSWORD,
      });
      this.token = response.data.token;
      this.api.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
      return this.token;
    } catch (error) {
      console.error('Shiprocket Auth Error:', error.message);
      throw error;
    }
  }

  async trackOrder(orderId) {
    if (!this.token) await this.authenticate();
    try {
      const response = await this.api.get(`/courier/track/shipment/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Shiprocket Track Error:', error.message);
      throw error;
    }
  }
}

module.exports = new ShiprocketService();
