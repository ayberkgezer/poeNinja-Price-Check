// Description: Fetches currency data from the POE.ninja API

const fetch = require("cross-fetch");

const league = "Crucible";

const apiUrl =
  "https://poe.ninja/api/data/currencyoverview?league=" + league + "&type=";

async function fetchCurrencyData(name) {
  try {
    const response = await fetch(apiUrl + name);
    const data = await response.json();
    return data.lines;
  } catch (error) {
    console.error("An error occurred:", error);
    return [];
  }
}
module.exports = fetchCurrencyData;
