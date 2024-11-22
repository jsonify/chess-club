// achievementSystem.gs - Achievement tracking and updates

function updatePlayerAchievements() {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const summarySheet = spreadsheet.getSheetByName("Tournament Summary");
    const lastRow = summarySheet.getLastRow();
  
    if (lastRow <= 1) return; // Only header row exists
  
    const dataRange = summarySheet.getRange("A2:F" + lastRow).getValues();
  
    dataRange.forEach((row, index) => {
      if (row[0]) { // If player name exists
        const achievements = [];
        const points = row[2];
        const gamesPlayed = row[3];
        const uniqueOpponents = row[4];
        // Fix win rate parsing by removing % before converting
        const winRate = parseFloat(row[5].toString().replace('%', ''));
  
        // Check for achievements
        if (points >= 5) achievements.push("⭐ 5 Point Club");
        if (points >= 10) achievements.push("🏆 10 Point Master");
        if (uniqueOpponents >= 5) achievements.push("🤝 Social Player");
        if (uniqueOpponents >= 10) achievements.push("🌟 Chess Ambassador");
        if (gamesPlayed >= 10) achievements.push("🎮 Active Player");
        if (winRate >= 70 && gamesPlayed >= 5) achievements.push("👑 Chess Champion");
  
        // Update achievements cell
        summarySheet.getRange(index + 2, 7).setValue(achievements.join("\n"));
      }
    });
  }
    