// Description: Fetches currency data from the POE.ninja API

const leagueData = require("../../json/utils/utils.json");
const league = leagueData.poeLeague;

const fetch = require("cross-fetch");

const apiUrl =
  "https://poe.ninja/api/data/currencyoverview?league=" + league + "&type=";

async function fetchCurrencyDetails(name) {
  try {
    const response = await fetch(apiUrl + name);
    const data = await response.json();
    return data.currencyDetails;
  } catch (error) {
    console.error("An error occurred:", error);
    return [];
  }
}
module.exports = fetchCurrencyDetails;
