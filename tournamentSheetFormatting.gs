// tournamentSheetFormatting.gs - All sheet formatting related functions
function formatTournamentSheet(sheet) {
  // Freeze header row
  sheet.setFrozenRows(1);

  // Set column widths
  const columnWidths = [
    [1, 100], // Date
    [2, 150], // Player
    [3, 80], // Grade
    [4, 150], // Opponent
    [5, 100], // Result
    [6, 100], // Material Diff
    [7, 80], // Points
    [8, 200], // Notes
  ];

  columnWidths.forEach(([col, width]) => {
    sheet.setColumnWidth(col, width);
  });

  // Format header row
  const headerRange = sheet.getRange("A1:H1");
  headerRange
    .setBackground("#f3f3f3")
    .setFontWeight("bold")
    .setBorder(true, true, true, true, true, true);

  // Center align specific columns
  sheet.getRange("A:A").setHorizontalAlignment("center"); // Date
  sheet.getRange("C:C").setHorizontalAlignment("center"); // Grade
  sheet.getRange("E:G").setHorizontalAlignment("center"); // Result, Material Diff, Points
}

function formatMatchEntrySheet(sheet) {
  // Freeze header row
  sheet.setFrozenRows(1);

  // Set column widths
  const columnWidths = [
    [1, 100], // Date
    [2, 150], // Player 1
    [3, 80], // Grade
    [4, 150], // Player 2
    [5, 80], // Grade
    [6, 100], // Result
    [7, 100], // Material Diff
    [8, 200], // Notes
  ];

  columnWidths.forEach(([col, width]) => {
    sheet.setColumnWidth(col, width);
  });

  // Format header row
  const headerRange = sheet.getRange("A1:H1");
  headerRange
    .setBackground("#f3f3f3")
    .setFontWeight("bold")
    .setBorder(true, true, true, true, true, true);

  // Center align specific columns
  sheet.getRange("A:A").setHorizontalAlignment("center"); // Date
  sheet.getRange("C:C").setHorizontalAlignment("center"); // Grade 1
  sheet.getRange("E:E").setHorizontalAlignment("center"); // Grade 2
  sheet.getRange("F:G").setHorizontalAlignment("center"); // Result, Material Diff
}

function formatSummarySheet(sheet) {
  // Freeze header row
  sheet.setFrozenRows(1);

  // Set column widths
  const columnWidths = [
    [1, 150], // Player
    [2, 80], // Grade
    [3, 100], // Total Points
    [4, 100], // Games Played
    [5, 120], // Unique Opponents
    [6, 100], // Win Rate
    [7, 200], // Achievements
  ];

  columnWidths.forEach(([col, width]) => {
    sheet.setColumnWidth(col, width);
  });

  // Format header row
  const headerRange = sheet.getRange("A1:G1");
  headerRange
    .setBackground("#f3f3f3")
    .setFontWeight("bold")
    .setBorder(true, true, true, true, true, true);

  // Center align columns
  sheet.getRange("B:F").setHorizontalAlignment("center");

  // Add conditional formatting to highlight top performers
  const numRows = Math.max(sheet.getLastRow(), 100); // Ensure we cover future rows

  // Highlight top points (green background)
  const pointsRange = sheet.getRange(2, 3, numRows - 1, 1);
  const pointsRule = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberGreaterThanOrEqualTo(5)
    .setBackground("#b7e1cd")
    .setRanges([pointsRange])
    .build();

  // Highlight high win rates (blue background)
  const winRateRange = sheet.getRange(2, 6, numRows - 1, 1);
  const winRateRule = SpreadsheetApp.newConditionalFormatRule()
    .whenTextContains("70")
    .setBackground("#c9daf8")
    .setRanges([winRateRange])
    .build();

  sheet.setConditionalFormatRules([pointsRule, winRateRule]);
}
