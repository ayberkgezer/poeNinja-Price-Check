// Description: Fetches item data from the POE.ninja API

const leagueData = require("../../json/utils/utils.json");
const league = leagueData.poeLeague;
const fetch = require("cross-fetch");

const apiUrl =
  "https://poe.ninja/api/data/itemoverview?league=" + league + "&type=";

async function fetchItemData(name) {
  try {
    const response = await fetch(apiUrl + name);
    const data = await response.json();
    return data.lines;
  } catch (error) {
    console.error("An error occurred:", error);
    return [];
  }
}
module.exports = fetchItemData;
