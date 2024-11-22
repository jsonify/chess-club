// validation.gs
function validateAttendanceSetup() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName("2024 Attendance");

  if (!sheet) {
    Logger.log("ERROR: 2024 Attendance sheet not found");
    return false;
  }

  // Check headers
  const headers = sheet.getRange("1:1").getValues()[0];
  let issues = [];

  // Validate basic structure
  if (headers[0] !== "First") issues.push("Column A should be 'First'");
  if (headers[1] !== "Last") issues.push("Column B should be 'Last'");
  if (headers[2] !== "Grade") issues.push("Column C should be 'Grade'");

  // Check date columns
  for (let i = 3; i < headers.length; i += 2) {
    const header = headers[i];
    if (header) {
      if (!header.includes("(In)")) {
        issues.push(`Column ${columnToLetter(i + 1)} missing (In) suffix`);
      }
      if (
        i + 1 < headers.length &&
        headers[i + 1] &&
        !headers[i + 1].includes("(Out)")
      ) {
        issues.push(`Column ${columnToLetter(i + 2)} missing (Out) suffix`);
      }
    }
  }

  // Log results
  if (issues.length > 0) {
    Logger.log("Issues found in attendance sheet setup:");
    issues.forEach((issue) => Logger.log("- " + issue));
    return false;
  }

  Logger.log("Attendance sheet setup is valid");
  return true;
}

// Helper function to convert column number to letter
function columnToLetter(column) {
  let temp,
    letter = "";
  while (column > 0) {
    temp = (column - 1) % 26;
    letter = String.fromCharCode(temp + 65) + letter;
    column = (column - temp - 1) / 26;
  }
  return letter;
}
