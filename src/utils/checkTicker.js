const axios = require('axios');

async function checkTicker(ticker) {
	const url = `https://www.nasdaq.com/market-activity/stocks/${ticker.toLowerCase()}`;
	const response = await axios.get(url);
	const val = await response.data.includes('Summary');
	if (!val) { return false; }
	return true;
}

module.exports = {
	checkTicker,
};
