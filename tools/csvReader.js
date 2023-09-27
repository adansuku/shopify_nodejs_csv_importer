// csvReader.js
const fs = require('fs');
const csv = require('csv-parser');

async function readCSV(filePath, onDataCallback, onEndCallback) {
	fs.createReadStream(filePath)
		.pipe(csv())
		.on('data', onDataCallback)
		.on('end', onEndCallback);
}

module.exports = readCSV;
