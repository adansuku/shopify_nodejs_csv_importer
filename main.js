// main.js
require('dotenv').config();
const { Shopify } = require('./config'); // Asegúrate de que el nombre del objeto sea correcto
const { obtenerProductos, mostrarResumen } = require('./utils');

// Data Store
let totalVariantsUpdate = 0;
let totalProductsUpdate = 0;
let undefinedProducts = 0;
let allProducts = [];
let data = [];

// Leemos el CSV y comenzamos el proceso
fs.createReadStream('/read_from_here.csv')
	.pipe(csv())
	.on('data', (row) => {
		data.push(row);
	})
	.on('end', () => {
		obtenerProductos(data);
	});
