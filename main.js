// main.js
const readCSV = require('./tools/csvReader');
const { obtainProducts, updateVariants } = require('./tools/updateProducts');

const data = [];

readCSV('example_csv.csv', (row) => {
	data.push(row);
}, () => {
	obtainProducts(data, updateVariants);
});
