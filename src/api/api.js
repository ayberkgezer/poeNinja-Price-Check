const fetch = require("cross-fetch");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Enter gem name keyword(s): ", (name) => {
  rl.question("Corrupted? (true/undefined): ", (corrupted) => {
    rl.question("Enter minimum gem level: ", (gemLevel) => {
      rl.question("Enter details keyword: ", (detailsKeyword) => {
        rl.close();

        fetchData(name, corrupted, gemLevel, detailsKeyword);
      });
    });
  });
});

async function fetchData(name, corrupted, gemLevel, detailsKeyword) {
  const league = "Crucible"; // Belirlediğiniz lig adı
  const url = `https://poe.ninja/api/data/itemoverview?league=${league}&type=SkillGem`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const skillGems = data.lines;

    const filteredGems = skillGems.filter((gem) => {
      const gemName = gem.name;
      const includesName =
        detailsKeyword.toLowerCase() === "normal"
          ? gemName.toLowerCase() === name.toLowerCase()
          : gemName.toLowerCase() ===
            detailsKeyword.toLowerCase() + " " + name.toLowerCase();

      const isCorrupted =
        corrupted === "true" ? gem.corrupted : gem.corrupted === undefined;

      const isGemLevelValid = Number(gemLevel) <= gem.gemLevel;

      return includesName && isCorrupted && isGemLevelValid;
    });

    filteredGems.forEach((gem) => {
      console.log(`
        Name: ${gem.name}
        Corrupted: ${gem.corrupted}
        Gem Level: ${gem.gemLevel}
        Gem Quality: ${gem.gemQuality}
        Chaos Value: ${gem.chaosValue}
        Exalted Value: ${gem.exaltedValue}
        Divine Value: ${gem.divineValue}
        --------------------------
      `);
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
