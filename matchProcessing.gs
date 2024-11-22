// matchProcessing.gs - Match processing and updates
function processNewMatches() {
  Logger.log("Starting processNewMatches");
  
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  Logger.log("Got active spreadsheet");

  // Check for required sheets
  const matchSheet = spreadsheet.getSheetByName("Enter Matches");
  if (!matchSheet) {
    Logger.log("ERROR: Enter Matches sheet not found");
    SpreadsheetApp.getUi().alert(
      "Error: 'Enter Matches' sheet not found. Please run 'Create Tournament Tracker' first."
    );
    return;
  }

  const tournamentSheet = spreadsheet.getSheetByName("2024 Tournament");
  if (!tournamentSheet) {
    Logger.log("ERROR: 2024 Tournament sheet not found");
    SpreadsheetApp.getUi().alert(
      "Error: '2024 Tournament' sheet not found. Please run 'Create Tournament Tracker' first."
    );
    return;
  }

  // Get all matches that haven't been processed
  const matchData = matchSheet.getDataRange().getValues();
  Logger.log(`Found ${matchData.length} rows in Enter Matches sheet`);
  
  if (matchData.length <= 1) {
    Logger.log("No matches to process");
    SpreadsheetApp.getUi().alert(
      "No matches to process. Please enter matches in the 'Enter Matches' sheet."
    );
    return;
  }

  const headers = matchData.shift(); // Remove headers
  let newEntries = [];

  Logger.log(`Processing ${matchData.length} matches`);
  matchData.forEach((row, index) => {
    if (row[0]) { // If date exists (row has data)
      Logger.log(`Processing row ${index + 1}: ${JSON.stringify(row)}`);
      const [date, player1, grade1, player2, grade2, result, materialDiff, notes] = row;

      // Validate required fields
      if (!player1 || !player2 || !result) {
        Logger.log(`Skipping incomplete row ${index + 1}: Player1=${player1}, Player2=${player2}, Result=${result}`);
        return;
      }

      // Determine points based on result
      let player1Points = 0;
      let player2Points = 0;
      let player1Result = "";
      let player2Result = "";

      switch (result) {
        case "Player 1 Win":
          player1Points = 1;
          player2Points = 0;
          player1Result = "Win";
          player2Result = "Loss";
          break;
        case "Player 2 Win":
          player1Points = 0;
          player2Points = 1;
          player1Result = "Loss";
          player2Result = "Win";
          break;
        case "Draw":
          player1Points = 0.5;
          player2Points = 0.5;
          player1Result = "Draw";
          player2Result = "Draw";
          break;
        case "Incomplete":
          const diff = Number(materialDiff) || 0;
          player1Points = diff > 0 ? 1 : diff < 0 ? 0 : 0.5;
          player2Points = diff < 0 ? 1 : diff > 0 ? 0 : 0.5;
          player1Result = "Incomplete";
          player2Result = "Incomplete";
          break;
        default:
          Logger.log(`Invalid result for row ${index + 1}: ${result}`);
          return;
      }

      Logger.log(`Match result: ${player1} (${player1Result}) vs ${player2} (${player2Result})`);

      // Create two entries - one for each player
      newEntries.push([
        date,
        player1,
        grade1,
        player2,
        player1Result,
        materialDiff,
        player1Points,
        notes,
      ]);
      newEntries.push([
        date,
        player2,
        grade2,
        player1,
        player2Result,
        materialDiff ? -materialDiff : "",
        player2Points,
        notes,
      ]);
    }
  });

  Logger.log(`Created ${newEntries.length} new tournament entries`);

  // Add new entries to tournament sheet
  if (newEntries.length > 0) {
    try {
      const lastRow = getFirstEmptyRow(tournamentSheet);
      Logger.log(`Writing entries starting at row ${lastRow}`);
      
      tournamentSheet
        .getRange(lastRow, 1, newEntries.length, 8)
        .setValues(newEntries);
      Logger.log("Successfully wrote entries to tournament sheet");

      // Clear processed matches
      matchSheet.getRange(2, 1, matchSheet.getLastRow() - 1, 8).clearContent();
      Logger.log("Cleared processed matches from entry sheet");

      // Create summary first, then update achievements
      Logger.log("Creating summary sheet");
      createSummarySheet(spreadsheet);
      
      Logger.log("Updating achievements");
      updatePlayerAchievements();

      SpreadsheetApp.getUi().alert(
        `Successfully processed ${newEntries.length / 2} matches!`
      );
    } catch (error) {
      Logger.log(`ERROR processing matches: ${error.message}`);
      Logger.log(`Error stack: ${error.stack}`);
      SpreadsheetApp.getUi().alert(
        `Error processing matches: ${error.message}\nPlease make sure all required sheets exist and try again.`
      );
    }
  } else {
    Logger.log("No valid matches to process");
    SpreadsheetApp.getUi().alert(
      "No valid matches to process. Please check the data in the 'Enter Matches' sheet."
    );
  }
  
  Logger.log("Finished processNewMatches");
}

// Helper function to find first empty row
function getFirstEmptyRow(sheet) {
  const values = sheet.getRange("A:A").getValues();
  for (let i = 0; i < values.length; i++) {
    if (!values[i][0]) {
      return i + 1;
    }
  }
  return values.length + 1;
}
