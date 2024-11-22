// tournamentCore.gs - Core setup and initialization functions
function createTournamentSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const tournamentSheet = createOrClearSheet(spreadsheet, "2024 Tournament");
  const matchEntrySheet = createOrClearSheet(spreadsheet, "Enter Matches");

  // Setup tournament tracking sheet
  setupTournamentSheet(tournamentSheet);

  // Setup match entry sheet
  setupMatchEntrySheet(matchEntrySheet);

  // Create summary sheet
  createSummarySheet(spreadsheet);

  return "Tournament sheets created successfully!";
}
