// shopifyConnector.js
const Shopify = require('shopify-api-node');
require('dotenv').config();

const shopify = new Shopify({
	autoLimit: { calls: 2, interval: 1000, bucketSize: 30 },
	shopName: process.env.SHOPIFY_SHOP_NAME,
	apiKey: process.env.SHOPIFY_API_KEY,
	password: process.env.SHOPIFY_PASSWORD
});

module.exports = shopify;
