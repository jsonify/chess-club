// sheetCore.gs
function createOrClearSheet(spreadsheet, sheetName) {
  var sheet = spreadsheet.getSheetByName(sheetName);
  if (sheet) {
    sheet.clear();
  } else {
    sheet = spreadsheet.insertSheet(sheetName);
  }
  return sheet;
}

function getStudentData(spreadsheet) {
  var signupSheet = spreadsheet.getSheetByName("2024 Sign Ups");
  if (!signupSheet) {
    Logger.log("ERROR: 2024 Sign Ups sheet not found");
    return [];
  }

  var data = signupSheet
    .getRange("A2:D" + signupSheet.getLastRow())
    .getValues();

  return data
    .filter((row) => row[0] && row[1]) // Filter out empty rows
    .sort((a, b) => a[0].localeCompare(b[0])); // Sort by first name
}

function globalWriteHeadersAndData(
  sheet,
  headers,
  firstHalf,
  secondHalf,
  formattedDate
) {
  // Write headers
  sheet.getRange(2, 1, 1, 6).setValues(headers);
  sheet.getRange(2, 8, 1, 6).setValues(headers);

  // Write title
  sheet
    .getRange("A1")
    .setValue("Sherwood Chess Club Attendance - " + formattedDate);

  // Write data for first half
  if (firstHalf.length > 0) {
    sheet
      .getRange(3, 1, firstHalf.length, 4)
      .setValues(firstHalf.map((row) => [row[0], row[1], row[2], row[3]]));
  }

  // Write data for second half
  if (secondHalf.length > 0) {
    sheet
      .getRange(3, 8, secondHalf.length, 4)
      .setValues(secondHalf.map((row) => [row[0], row[1], row[2], row[3]]));
  }
}

function globalApplyFontFormatting(sheet) {
  sheet.getRange("A1:M1").setFontSize(14).setFontWeight("bold");
  sheet.getRange("A2:F2").setFontWeight("bold");
  sheet.getRange("H2:M2").setFontWeight("bold");
}

function globalSetColumnWidths(sheet) {
  const columnWidths = [
    [1, 150], // First Name
    [2, 150], // Last Name
    [3, 60], // Grade
    [4, 150], // Teacher
    [5, 50], // In
    [6, 50], // Out
    [7, 40], // Spacer
    [8, 150], // First Name (Second Half)
    [9, 150], // Last Name (Second Half)
    [10, 60], // Grade (Second Half)
    [11, 150], // Teacher (Second Half)
    [12, 50], // In (Second Half)
    [13, 50], // Out (Second Half)
  ];

  columnWidths.forEach(([col, width]) => {
    sheet.setColumnWidth(col, width);
  });
}

function globalAddCheckboxes(sheet, firstHalfLength, secondHalfLength) {
  // Add checkboxes for first half
  if (firstHalfLength > 0) {
    var checkboxRange1 = sheet.getRange(3, 5, firstHalfLength, 1);
    var checkboxRange2 = sheet.getRange(3, 6, firstHalfLength, 1);
    checkboxRange1.insertCheckboxes();
    checkboxRange2.insertCheckboxes();
  }

  // Add checkboxes for second half
  if (secondHalfLength > 0) {
    var checkboxRange3 = sheet.getRange(3, 12, secondHalfLength, 1);
    var checkboxRange4 = sheet.getRange(3, 13, secondHalfLength, 1);
    checkboxRange3.insertCheckboxes();
    checkboxRange4.insertCheckboxes();
  }
}

function globalApplyAlignment(sheet, lastRow) {
  // Center align grades and checkboxes
  sheet.getRange(2, 3, lastRow, 1).setHorizontalAlignment("center");
  sheet.getRange(2, 5, lastRow, 2).setHorizontalAlignment("center");
  sheet.getRange(2, 10, lastRow, 1).setHorizontalAlignment("center");
  sheet.getRange(2, 12, lastRow, 2).setHorizontalAlignment("center");

  // Center the title
  sheet.getRange("A1:M1").merge().setHorizontalAlignment("center");
}

function globalAddBorders(sheet, lastRow) {
  // Add borders to first half
  sheet
    .getRange(2, 1, lastRow, 6)
    .setBorder(true, true, true, true, true, true);

  // Add borders to second half
  sheet
    .getRange(2, 8, lastRow, 6)
    .setBorder(true, true, true, true, true, true);
}

function formatSheet(sheet, firstHalf, secondHalf, formattedDate) {
  const headers = [
    ["First Name", "Last Name", "Grade", "Teacher", "In", "Out"],
  ];
  const lastRow = Math.max(firstHalf.length, secondHalf.length) + 2;

  // Write headers and data
  globalWriteHeadersAndData(
    sheet,
    headers,
    firstHalf,
    secondHalf,
    formattedDate
  );

  // Apply all formatting
  globalApplyFontFormatting(sheet);
  globalSetColumnWidths(sheet);
  globalAddCheckboxes(sheet, firstHalf.length, secondHalf.length);
  globalApplyAlignment(sheet, lastRow);
  globalAddBorders(sheet, lastRow);

  return lastRow;
}
