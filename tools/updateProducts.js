// updateProducts.js

const shopify = require('./shopifyConnector');
const readCSV = require('./csvReader');

const location_id = process.env.SHOPIFY_LOCATION_ID;
let totalVariantsUpdate = 0;
let totalProductsUpdate = 0;
let undefinedProducts = 0;
let allProducts = new Array();
let data = [];

async function obtainProducts(data, updateVariants) {
	let params = { limit: 250 };

	do {
		const products = await shopify.product.list(params);
		totalProductsUpdate += products.length;
		allProducts = allProducts.concat(products);
		params = products.nextPageParameters;
	} while (params !== undefined);

	updateVariants(allProducts, data);
}

async function updateVariants(allProducts, data) {
	for (const product of allProducts) {
		for (const variant of product.variants) {
			await updateVariant(variant, data);
		}
	}

	displaySummary();
}

async function updateVariant(variant, data) {
	const {
		price: variant_price,
		compare_at_price: variant_compare_at_price,
		inventory_quantity: variant_inventory_quantity,
		sku: variant_sku,
		id: variant_id,
		inventory_item_id: variant_inventory_item_id
	} = variant;

	const dataRow = data.find(row => row.order_size === variant_sku);

	if (dataRow && typeof dataRow === "object") {
		await updateWithCSVData(variant, dataRow);
	} else if (typeof dataRow === "undefined" || dataRow === null) {
		await updateUndefinedVariant(variant);
	}
}

async function updateWithCSVData(variant, dataRow) {
	const {
		standard_price,
		sale_price,
		quantity: inventory
	} = dataRow;

	const salePrice = sale_price > 0 ? sale_price : standard_price;

	if (
		variant.price !== salePrice ||
		variant.compare_at_price !== standard_price ||
		variant.inventory_quantity !== inventory
	) {
		totalVariantsUpdate++;

		if (variant.price !== salePrice || variant.compare_at_price !== standard_price) {
			const params_price = {
				price: salePrice,
				compare_at_price: standard_price,
			};
			await shopify.productVariant.update(variant.id, params_price);
			console.log("Price updated for variant: " + variant.sku);
		}

		if (variant.inventory_quantity !== inventory) {
			const params_inventory = {
				location_id,
				inventory_item_id: variant.inventory_item_id,
				available: inventory,
			};
			await shopify.inventoryLevel.set(params_inventory);
			console.log("Stock updated for variant: " + variant.sku);
		}
	}
}

async function updateUndefinedVariant(variant) {
	if (variant.inventory_quantity !== 0 || variant.compare_at_price !== variant.price) {
		undefinedProducts++;

		const params_inventory = {
			location_id,
			inventory_item_id: variant.inventory_item_id,
			available: 0,
		};
		await shopify.inventoryLevel.set(params_inventory);
		console.log("Stock updated to 0 for variant: " + variant.sku);

		const params_price = {
			compare_at_price: variant.price,
		};
		await shopify.productVariant.update(variant.id, params_price);
		console.log("Variant updated: " + variant.sku);
	}
}

function displaySummary() {
	console.log("-------------------------------------");
	console.log("Total products/variants from CSV: " + data.length);
	console.log("Total products: " + totalProductsUpdate);
	console.log("Total updated variants: " + totalVariantsUpdate);
	console.log("Total undefined variants: " + undefinedProducts);
	console.log("-------------------------------------");
}

module.exports = { obtainProducts, updateVariants };
