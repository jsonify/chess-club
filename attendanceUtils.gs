// attendanceUtils.gs - New file for attendance-related functions

function getHistoricalAttendanceData(spreadsheet, date) {
  const attendanceSheet = spreadsheet.getSheetByName("2024 Attendance");
  if (!attendanceSheet) {
    throw new Error("2024 Attendance sheet not found");
  }

  // Get the formatted date string to match the header
  const formattedDate = formatDate(date, "MM/dd/yyyy");

  // Get headers to find the correct columns for this date
  const headers = attendanceSheet.getRange("1:1").getValues()[0];

  // Find column indices for this date's check-in/check-out
  let checkInCol = -1;
  for (let i = 5; i < headers.length; i += 2) {
    // Start from column F (index 5)
    if (headers[i] === formattedDate) {
      checkInCol = i + 1; // Adding 1 because getValues() is 0-based but Sheets is 1-based
      break;
    }
  }

  if (checkInCol === -1) {
    throw new Error(`No attendance data found for ${formattedDate}`);
  }

  // Get all attendance data
  const lastRow = attendanceSheet.getLastRow();
  const checkInRange = attendanceSheet.getRange(2, checkInCol, lastRow - 1, 1);
  const checkOutRange = attendanceSheet.getRange(
    2,
    checkInCol + 1,
    lastRow - 1,
    1
  );

  // Get student names for reference
  const namesRange = attendanceSheet.getRange(2, 1, lastRow - 1, 2);

  return {
    date: formattedDate,
    students: namesRange.getValues(),
    checkIn: checkInRange.getValues(),
    checkOut: checkOutRange.getValues(),
  };
}

// Example usage function
function getLastWednesdayAttendance() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const lastWednesday = getMostRecentWednesday();

  try {
    const attendanceData = getHistoricalAttendanceData(
      spreadsheet,
      lastWednesday
    );

    // Process the attendance data
    const summary = attendanceData.students.map((student, index) => ({
      firstName: student[0],
      lastName: student[1],
      checkedIn: attendanceData.checkIn[index][0],
      checkedOut: attendanceData.checkOut[index][0],
    }));

    return summary;
  } catch (error) {
    Logger.log(`Error retrieving attendance: ${error.message}`);
    return null;
  }
}

function getIncompleteCheckouts(spreadsheet, date) {
  const attendanceSheet = spreadsheet.getSheetByName("2024 Attendance");
  if (!attendanceSheet) {
    Logger.log("2024 Attendance sheet not found");
    return new Map();
  }

  const formattedDate = formatDate(date, "MM/dd/yyyy");
  Logger.log(`Looking for attendance data for: ${formattedDate}`);

  // Get headers and find matching columns for the specific date
  const headers = attendanceSheet.getRange("1:1").getValues()[0];
  Logger.log(`Searching headers for date: ${formattedDate}`);

  // Find the check-in column for the specified date
  let checkInCol = -1;
  let checkOutCol = -1;

  for (let i = 0; i < headers.length; i++) {
    const header = headers[i];
    if (header && header.includes(formattedDate)) {
      if (header.includes("(In)")) {
        checkInCol = i + 1;
        Logger.log(
          `Found check-in column at ${checkInCol} (${columnToLetter(
            checkInCol
          )})`
        );
      } else if (header.includes("(Out)")) {
        checkOutCol = i + 1;
        Logger.log(
          `Found check-out column at ${checkOutCol} (${columnToLetter(
            checkOutCol
          )})`
        );
      }
    }
  }

  if (checkInCol === -1 || checkOutCol === -1) {
    Logger.log(
      `Could not find both check-in and check-out columns for ${formattedDate}`
    );
    return new Map();
  }

  // Get all data at once
  const lastRow = attendanceSheet.getLastRow();
  const numRows = lastRow - 1; // Subtract header row

  // Get student names and attendance data
  const studentData = attendanceSheet.getRange(2, 1, numRows, 2).getValues(); // First, Last columns
  const checkInData = attendanceSheet
    .getRange(2, checkInCol, numRows, 1)
    .getValues();
  const checkOutData = attendanceSheet
    .getRange(2, checkOutCol, numRows, 1)
    .getValues();

  Logger.log(`Processing ${numRows} students for missed checkouts`);

  // Track students who missed checkout
  const incompleteCheckouts = new Map();

  studentData.forEach((student, index) => {
    const firstName = student[0];
    const lastName = student[1];
    const checkIn = checkInData[index][0];
    const checkOut = checkOutData[index][0];

    Logger.log(
      `Checking ${firstName} ${lastName}: In='${checkIn}', Out='${checkOut}'`
    );

    // Check for incomplete checkout (checked in but not out)
    if (checkIn === "x" && checkOut === "-") {
      const key = `${firstName},${lastName}`;
      incompleteCheckouts.set(key, true);
      Logger.log(`Added to incomplete checkouts: ${key}`);
    }
  });

  Logger.log(`Found ${incompleteCheckouts.size} incomplete checkouts`);
  return incompleteCheckouts;
}

// Helper function to convert column number to letter (moved from validation.gs)
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

// Add this function to verify the note addition
function addHistoricalNotes(sheet, firstHalf, secondHalf, incompleteCheckouts) {
  Logger.log(
    `Starting to add historical notes. Incomplete checkouts map size: ${incompleteCheckouts.size}`
  );

  // Add notes to first half
  firstHalf.forEach((student, index) => {
    const key = `${student[0]},${student[1]}`;
    Logger.log(`Checking first half student: ${key}`);
    if (incompleteCheckouts.has(key)) {
      Logger.log(`Adding note for student: ${key} at row ${index + 3}`);
      const cell = sheet.getRange(index + 3, 5); // Check-in column
      cell.setNote("⚠️ Missed checkout last week");
      cell.setBackground("#ffeb3b"); // More visible yellow background

      // Add a visual marker in the adjacent cell
      const noteCell = sheet.getRange(index + 3, 4); // Teacher column
      noteCell.setValue(noteCell.getValue() + " ⚠️");
    }
  });

  // Add notes to second half
  secondHalf.forEach((student, index) => {
    const key = `${student[0]},${student[1]}`;
    Logger.log(`Checking second half student: ${key}`);
    if (incompleteCheckouts.has(key)) {
      Logger.log(`Adding note for student: ${key} at row ${index + 3}`);
      const cell = sheet.getRange(index + 3, 12); // Check-in column for second half
      cell.setNote("⚠️ Missed checkout last week");
      cell.setBackground("#ffeb3b"); // More visible yellow background

      // Add a visual marker in the adjacent cell
      const noteCell = sheet.getRange(index + 3, 11); // Teacher column
      noteCell.setValue(noteCell.getValue() + " ⚠️");
    }
  });
}
