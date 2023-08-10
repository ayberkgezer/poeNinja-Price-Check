const fetchCurrencyData = require("./api");

async function findDivineOrb(data) {
  const desiredCurrency = data.find((item) => item.detailsId === "divine-orb");

  if (desiredCurrency) {
    const currencyTypeName = desiredCurrency.currencyTypeName;
    const chaosEquivalent = desiredCurrency.chaosEquivalent;

    console.log("Currency Type Name:", currencyTypeName);
    console.log("Chaos Equivalent:", chaosEquivalent);
  } else {
    console.log("Desired currency not found.");
  }
}

async function main() {
  const currencyData = await fetchCurrencyData();
  findDivineOrb(currencyData);
}

main();
