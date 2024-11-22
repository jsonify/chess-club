// tournamentValidation.gs - Data validation rules

function addMatchEntryValidation(sheet) {
  // Create validation rule for results
  const resultRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(
      ["Player 1 Win", "Draw", "Player 2 Win", "Incomplete"],
      true
    )
    .setAllowInvalid(false)
    .build();

  // Apply validation to the entire Result column (minus header)
  const lastRow = sheet.getMaxRows();
  sheet.getRange(2, 6, lastRow - 1, 1).setDataValidation(resultRule);
}
