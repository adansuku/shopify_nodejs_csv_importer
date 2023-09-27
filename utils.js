// utils.js
const fs = require('fs');
const csv = require('csv-parser');

async function obtenerProductos(data) {
	try {
		let params = { limit: 250 };
		do {
			const products = await Shopify.product.list(params);
			totalProductsUpdate += products.length;
			allProducts = allProducts.concat(products);
			params = products.nextPageParameters;
		} while (params !== undefined);

		updateVariants(allProducts, data);
	} catch (error) {
		console.error(error);
	}
}

async function updateVariants(allProducts, data) {
	const location_id = 61302997131;

	allProducts.forEach(product => {
		product.variants.forEach(variant => {
			// ... Código de actualización de variantes ...
		});
	});

	mostrarResumen();
}

function mostrarResumen() {
	console.log("-------------------------------------");
	console.log("Productos/variantes totales provenientes del CSV: " + data.length);
	console.log("Productos totales: " + totalProductsUpdate);
	console.log("Total de variantes actualizadas: " + totalVariantsUpdate);
	console.log("Total de variantes no definidas: " + undefinedProducts);
	console.log("-------------------------------------");

	// Guardar registros (si es necesario)
	// ...
}

module.exports = { obtenerProductos, mostrarResumen };
