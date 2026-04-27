/**
 * Main entry point — run on a time-based trigger.
 *
 * 1. Reads employee IDs and emails from the sheet in one batch.
 * 2. Fetches all 1:1 calendar events once (not per employee).
 * 3. Ensures each employee has a Drive folder.
 * 4. Writes previous / upcoming / next meeting dates back in one batch.
 * 5. Sorts rows by upcoming meeting date.
 */
function updateCheckinsAndFolders() {
  const sheet        = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const calendar     = CalendarApp.getDefaultCalendar();
  const parentFolder = DriveApp.getFolderById(CONFIG.PARENT_FOLDER_ID);
  const cols         = CONFIG.COLS;
  const startRow     = CONFIG.DATA_START_ROW;
  const lastRow      = sheet.getLastRow();

  if (lastRow < startRow) return;

  const numRows = lastRow - startRow + 1;

  // Read ID (col B) and Email (col D) in one call.
  // getRange(row, col, numRows, numCols) — we need cols B through D (3 cols).
  const rawData = sheet.getRange(startRow, cols.ID, numRows, cols.EMAIL - cols.ID + 1).getValues();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const folderMap = buildFolderMap(parentFolder);
  const allEvents = fetchAllMeetingEvents(calendar, today);

  const previousOut = [];
  const upcomingOut = [];
  const nextOut     = [];

  for (let i = 0; i < numRows; i++) {
    const id      = rawData[i][0];                        // col B
    const email   = rawData[i][cols.EMAIL - cols.ID];     // col D

    const upperId = id ? id.toString().toUpperCase() : null;

    if (upperId) {
      ensureEmployeeFolder(parentFolder, folderMap, upperId);
    }

    if (email) {
      const { previous, upcoming, next } = getMeetingsForEmail(allEvents, email, today);
      previousOut.push([previous || ""]);
      upcomingOut.push([upcoming || CONFIG.NO_MEETING_TEXT]);
      nextOut.push([next        || ""]);
    } else {
      previousOut.push([""]);
      upcomingOut.push([""]);
      nextOut.push([""]);
    }
  }

  // Write all three columns in three batch calls instead of one per row.
  sheet.getRange(startRow, cols.PREVIOUS, numRows, 1).setValues(previousOut);
  sheet.getRange(startRow, cols.UPCOMING, numRows, 1).setValues(upcomingOut);
  sheet.getRange(startRow, cols.NEXT,     numRows, 1).setValues(nextOut);

  // Sort rows by upcoming meeting date (col K), ascending.
  sheet.getRange(startRow, 1, numRows, sheet.getLastColumn())
       .sort({ column: cols.UPCOMING, ascending: true });
}
