// tournamentSetup.gs - Sheet setup and configuration

function setupTournamentSheet(sheet) {
    // Setup headers for tournament tracking
    const headers = [
      [
        "Date",
        "Player",
        "Grade",
        "Opponent",
        "Result",
        "Material Diff",
        "Points",
        "Notes",
      ],
    ];
  
    sheet.getRange("A1:H1").setValues(headers);
  
    // Format the sheet
    formatTournamentSheet(sheet);
  
    // Add data validation for points column
    const pointsRule = SpreadsheetApp.newDataValidation()
      .requireNumberBetween(0, 1)
      .setAllowInvalid(false)
      .build();
  
    const lastRow = sheet.getMaxRows();
    sheet.getRange(2, 7, lastRow - 1, 1).setDataValidation(pointsRule);
  }
  
  function setupMatchEntrySheet(sheet) {
    // Setup headers for match entry
    const headers = [
      [
        "Date",
        "Player 1",
        "Grade",
        "Player 2",
        "Grade",
        "Result",
        "Material Diff",
        "Notes",
      ],
    ];
  
    sheet.getRange("A1:H1").setValues(headers);
  
    // Format the sheet
    formatMatchEntrySheet(sheet);
  
    // Add data validation
    addMatchEntryValidation(sheet);
  }
  
  function createSummarySheet(spreadsheet) {
    const summarySheet = createOrClearSheet(spreadsheet, "Tournament Summary");
    Logger.log("Starting createSummarySheet");
    
    // Setup headers
    const summaryHeaders = [
      ["Player", "Grade", "Total Points", "Games Played", "Unique Opponents", "Win Rate", "Achievements"]
    ];
    summarySheet.getRange("A1:G1").setValues(summaryHeaders);
  
    const tournamentSheet = spreadsheet.getSheetByName("2024 Tournament");
    if (!tournamentSheet) {
      Logger.log("ERROR: Could not find 2024 Tournament sheet");
      return;
    }
  
    const data = tournamentSheet.getDataRange().getValues();
    Logger.log(`Found ${data.length} rows of tournament data`);
    
    const results = {};
    const processedMatches = new Set();
    const matchCounts = new Map(); // Track actual game counts
  
    const PLAYER = 1;    // Column B
    const GRADE = 2;     // Column C
    const OPPONENT = 3;  // Column D
    const RESULT = 4;    // Column E
  
    // First pass: Count actual games and track unique matchups
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const player = row[PLAYER];
      const opponent = row[OPPONENT];
      
      if (!player || !opponent) continue;
      
      // Update match counts
      const playerKey = player + "-games";
      const currentCount = matchCounts.get(playerKey) || 0;
      matchCounts.set(playerKey, currentCount + 1);
    }
  
    // Second pass: Process points and stats
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const player = row[PLAYER];
      const grade = row[GRADE];
      const opponent = row[OPPONENT];
      const result = row[RESULT];
  
      // Skip incomplete rows
      if (!player || !opponent || !result) {
        Logger.log(`Skipping incomplete row ${i+1}`);
        continue;
      }
  
      // Create matchup key
      const matchupKey = [player, opponent].sort().join("-");
      Logger.log(`Processing row ${i+1}: ${player} vs ${opponent}, Result=${result}, Key=${matchupKey}`);
  
      // Initialize player stats if not present
      if (!results[player]) {
        results[player] = {
          grade: grade,
          points: 0,
          gamesPlayed: matchCounts.get(player + "-games") || 0,
          opponents: new Set(),
          wins: 0
        };
        Logger.log(`Initialized stats for ${player}`);
      }
      if (!results[opponent]) {
        results[opponent] = {
          grade: row[GRADE],
          points: 0,
          gamesPlayed: matchCounts.get(opponent + "-games") || 0,
          opponents: new Set(),
          wins: 0
        };
        Logger.log(`Initialized stats for ${opponent}`);
      }
  
      // Update unique opponents
      results[player].opponents.add(opponent);
      results[opponent].opponents.add(player);
  
      // Track wins (only count once per unique matchup)
      if (!processedMatches.has(matchupKey)) {
        if (result === "Win") {
          results[player].wins += 1;
        } else if (result === "Loss") {
          results[opponent].wins += 1;
        }
      }
  
      // Process points for first games only
      if (!processedMatches.has(matchupKey)) {
        processedMatches.add(matchupKey);
        Logger.log(`First game between ${player} and ${opponent}`);
        
        if (result === "Win") {
          results[player].points += 1;
          Logger.log(`${player} gets 1 point for win`);
        } else if (result === "Loss") {
          results[opponent].points += 1;
          Logger.log(`${opponent} gets 1 point for win`);
        } else if (result === "Draw") {
          results[player].points += 0.5;
          results[opponent].points += 0.5;
          Logger.log(`Both players get 0.5 points for draw`);
        }
      }
    }
  
    // Prepare summary data
    const summaryData = Object.keys(results).map(player => {
      const stats = results[player];
      // Fix win rate calculation to ensure it's always a string with %
      const winRate = stats.gamesPlayed > 0 
        ? Math.round((stats.wins / stats.gamesPlayed) * 100).toString() + "%"
        : "0%";
        
      return [
        player,
        stats.grade,
        stats.points,
        stats.gamesPlayed,
        stats.opponents.size,
        winRate,
        ""
      ];
    });
  
    // Sort by points then name
    summaryData.sort((a, b) => {
      if (b[2] !== a[2]) return b[2] - a[2];
      return a[0].localeCompare(b[0]);
    });
  
    // Output results
    if (summaryData.length > 0) {
      Logger.log(`Writing ${summaryData.length} rows to summary sheet`);
      summarySheet.getRange(2, 1, summaryData.length, summaryHeaders[0].length)
        .setValues(summaryData);
    } else {
      Logger.log("WARNING: No summary data to write");
    }
  
    formatSummarySheet(summarySheet);
    Logger.log("Finished createSummarySheet");
  }
  