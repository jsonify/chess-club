// sheetSetup.gs
function setupAttendanceSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const attendanceSheet = spreadsheet.getSheetByName("2024 Attendance");
  
  if (!attendanceSheet) {
    Logger.log("2024 Attendance sheet not found");
    return;
  }

  // Freeze the header row and first three columns
  attendanceSheet.setFrozenRows(1);
  attendanceSheet.setFrozenColumns(3);

  // Set up the header row
  const headerRange = attendanceSheet.getRange("1:1");
  headerRange.setFontWeight("bold");
  headerRange.setBackground("#E8EAF6");  // Light blue background
  
  // Format date columns
  const dateColumns = attendanceSheet.getRange("D1:AK1");
  dateColumns.setHorizontalAlignment("center");
  
  // Add data validation for attendance marks
  const lastRow = attendanceSheet.getLastRow();
  const attendanceRange = attendanceSheet.getRange(2, 4, lastRow - 1, dateColumns.getNumColumns());
  
  const rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['x', '-', ''], true)
    .setAllowInvalid(false)
    .build();
  
  attendanceRange.setDataValidation(rule);

  // Set up the headers
  setupAttendanceHeaders(attendanceSheet);
  
  Logger.log("Attendance sheet setup completed");
}

function setupAttendanceHeaders(sheet) {
  if (!sheet) {
    Logger.log("No sheet provided for header setup");
    return;
  }
  
  // Get the current headers
  const headers = sheet.getRange("1:1").getValues()[0];
  const newHeaders = [...headers]; // Create a copy of the headers array
  
  // Process each date column (starting from column D, index 3)
  for (let i = 3; i < headers.length; i += 2) {
    const date = headers[i];
    if (date && !date.includes("(In)")) { // Only modify if it's a date and hasn't been modified
      // Format for the next two columns
      newHeaders[i] = `${date} (In)`;
      if (i + 1 < headers.length) {
        newHeaders[i + 1] = `${date} (Out)`;
      }
    }
  }
  
  // Update all headers at once
  sheet.getRange(1, 1, 1, newHeaders.length).setValues([newHeaders]);
  
  Logger.log("Headers setup completed");
}

// Add to your existing onOpen function
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu("Chess Club")
    .addItem("Generate Attendance PDF", "formatAndExportPDF")
    .addSeparator()
    .addItem("Setup Attendance Sheet", "setupAttendanceSheet")
    .addToUi();
}