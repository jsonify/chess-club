// sheetFormatting.gs

// Make all functions global by adding them to the global scope
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

  // Apply formatting
  globalApplyFontFormatting(sheet);
  globalSetColumnWidths(sheet);
  globalAddCheckboxes(sheet, firstHalf.length, secondHalf.length);
  globalApplyAlignment(sheet, lastRow);
  globalAddBorders(sheet, lastRow);

  return lastRow;
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

  // Write data
  if (firstHalf.length > 0) {
    sheet
      .getRange(3, 1, firstHalf.length, 4)
      .setValues(firstHalf.map((row) => [row[0], row[1], row[2], row[3]]));
  }

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
    [1, 150],
    [2, 150],
    [3, 60],
    [4, 150],
    [5, 50],
    [6, 50],
    [7, 40],
    [8, 150],
    [9, 150],
    [10, 60],
    [11, 150],
    [12, 50],
    [13, 50],
  ];

  columnWidths.forEach(([col, width]) => {
    sheet.setColumnWidth(col, width);
  });
}

function globalAddCheckboxes(sheet, firstHalfLength, secondHalfLength) {
  // First column checkboxes
  if (firstHalfLength > 0) {
    var checkboxRange1 = sheet.getRange(3, 5, firstHalfLength, 1);
    var checkboxRange2 = sheet.getRange(3, 6, firstHalfLength, 1);
    checkboxRange1.insertCheckboxes();
    checkboxRange2.insertCheckboxes();
  }

  // Second column checkboxes
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
  sheet
    .getRange(2, 1, lastRow, 6)
    .setBorder(true, true, true, true, true, true);
  sheet
    .getRange(2, 8, lastRow, 6)
    .setBorder(true, true, true, true, true, true);
}
