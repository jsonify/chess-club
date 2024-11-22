// main.gs
function formatAndExportPDF() {
  Logger.log("Starting PDF generation process");
  
  // Get active spreadsheet
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  
  // Get and format dates
  const dateForSheet = getNextWednesdayDate();
  const formattedDate = formatDate(dateForSheet, "MM/dd/yyyy");
  const shortDate = formatDate(dateForSheet, "MM-dd");
  const sheetName = "Chess Club " + shortDate;
  
  Logger.log(`Creating sheet for date: ${formattedDate}`);

  // Get last Wednesday's date for attendance check
  const lastWednesday = getMostRecentWednesday();
  Logger.log(`Checking attendance for: ${formatDate(lastWednesday, "MM/dd/yyyy")}`);

  // Get incomplete checkouts
  const incompleteCheckouts = getIncompleteCheckouts(spreadsheet, lastWednesday);
  Logger.log(`Found ${incompleteCheckouts.size} incomplete checkouts`);
  
  // Create or clear sheet
  const sheet = createOrClearSheet(spreadsheet, sheetName);
  Logger.log(`Created/cleared sheet: ${sheetName}`);

  // Get and process student data
  const data = getStudentData(spreadsheet);
  Logger.log(`Retrieved ${data.length} total students`);
  
  const halfLength = Math.ceil(data.length / 2);
  const firstHalf = data.slice(0, halfLength);
  const secondHalf = data.slice(halfLength);
  
  // Format sheet
  formatSheet(sheet, firstHalf, secondHalf, formattedDate);
  
  // Add warnings for incomplete checkouts
  addWarningsToSheet(sheet, firstHalf, secondHalf, incompleteCheckouts);

  // Export to PDF
  Logger.log("Exporting to PDF");
  return exportToPDF(spreadsheet, sheet, formattedDate);
}