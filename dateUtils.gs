// dateUtils.gs
// Handles all date-related operations
function getNextWednesdayDate() {
  const today = new Date();
  const currentDay = today.getDay();
  
  let daysUntilWednesday;
  if (currentDay === 3) {
    daysUntilWednesday = 0;
  } else {
    daysUntilWednesday = (3 + 7 - currentDay) % 7;
  }
  
  const nextWednesday = new Date();
  nextWednesday.setDate(today.getDate() + daysUntilWednesday);
  
  return nextWednesday;
}

function formatDate(date, format) {
  return Utilities.formatDate(date, Session.getScriptTimeZone(), format);
}

function getMostRecentWednesday() {
  const today = new Date();
  const currentDay = today.getDay(); // 0 = Sunday, 3 = Wednesday
  
  let daysToSubtract;
  if (currentDay > 3) {
    daysToSubtract = currentDay - 3;
  } else {
    daysToSubtract = currentDay + 4;
  }
  
  const lastWednesday = new Date();
  lastWednesday.setDate(today.getDate() - daysToSubtract);
  
  // Add logging to verify date calculation
  Logger.log(`Current date: ${today}`);
  Logger.log(`Last Wednesday: ${lastWednesday}`);
  return lastWednesday;
}