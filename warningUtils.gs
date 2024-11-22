// warningUtils.gs
function addWarningsToSheet(sheet, firstHalf, secondHalf, incompleteCheckouts) {
  Logger.log(
    `Adding warnings for ${incompleteCheckouts.size} incomplete checkouts`
  );

  // Style constants
  const WARNING_BACKGROUND = "#fff3e0"; // Light orange
  const WARNING_TEXT = "⚠️ Missed checkout last week";

  // Process first half
  firstHalf.forEach((student, index) => {
    const key = `${student[0]},${student[1]}`;
    if (incompleteCheckouts.has(key)) {
      Logger.log(`Adding warning for ${key} in first half at row ${index + 3}`);

      // Highlight entire row (First Name through Check-in)
      const rowRange = sheet.getRange(index + 3, 1, 1, 5);
      rowRange.setBackground(WARNING_BACKGROUND);

      // Add warning note to check-in cell
      const checkInCell = sheet.getRange(index + 3, 5);
      checkInCell.setNote(WARNING_TEXT);

      // Add warning icon to teacher column
      const teacherCell = sheet.getRange(index + 3, 4);
      const currentValue = teacherCell.getValue();
      teacherCell.setValue(`${currentValue} ⚠️`);
    }
  });

  // Process second half
  secondHalf.forEach((student, index) => {
    const key = `${student[0]},${student[1]}`;
    if (incompleteCheckouts.has(key)) {
      Logger.log(
        `Adding warning for ${key} in second half at row ${index + 3}`
      );

      // Highlight entire row (First Name through Check-in)
      const rowRange = sheet.getRange(index + 3, 8, 1, 5);
      rowRange.setBackground(WARNING_BACKGROUND);

      // Add warning note to check-in cell
      const checkInCell = sheet.getRange(index + 3, 12);
      checkInCell.setNote(WARNING_TEXT);

      // Add warning icon to teacher column
      const teacherCell = sheet.getRange(index + 3, 11);
      const currentValue = teacherCell.getValue();
      teacherCell.setValue(`${currentValue} ⚠️`);
    }
  });

  Logger.log("Finished adding warnings to sheet");
}
