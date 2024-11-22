// pdfExport.gs
// Handles PDF creation and export
function exportToPDF(spreadsheet, sheet, formattedDate) {
  const url = spreadsheet.getUrl();

  const exportUrl =
    url.replace(/edit$/, "") +
    "export?format=pdf&" +
    "size=letter&" +
    "portrait=false&" +
    "fitw=true&" +
    "top_margin=0.25&" +
    "bottom_margin=0.25&" +
    "left_margin=0.25&" +
    "right_margin=0.25&" +
    "gid=" +
    sheet.getSheetId();

  const response = UrlFetchApp.fetch(exportUrl, {
    headers: {
      Authorization: "Bearer " + ScriptApp.getOAuthToken(),
    },
  });

  const pdfFile = DriveApp.createFile(
    response
      .getBlob()
      .setName("Chess Club Attendance - " + formattedDate + ".pdf")
  );

  return pdfFile.getId();
}
