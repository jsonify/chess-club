// ui.gs
// Handles UI elements
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu("Chess Club")
    .addItem("Generate Attendance PDF", "formatAndExportPDF")
    .addItem("Create Tournament Tracker", "createTournamentSheet")
    .addItem("Process New Matches", "processNewMatches")
    .addItem("Update Achievements", "updatePlayerAchievements")
    .addToUi();
}
