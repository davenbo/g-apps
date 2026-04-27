// ─── USER CONFIGURATION ───────────────────────────────────────────────────────
// Edit this file when duplicating the sheet for a new user.
// No other file should need to change.

const CONFIG = {

  // Google Drive folder ID that holds one sub-folder per employee.
  // Find it in the URL: drive.google.com/drive/folders/<ID>
  PARENT_FOLDER_ID: "1RcMZlQU6V9r6UOBx27nJdiFLxsOtU-bj",

  // Suffix appended to each employee's notes Google Doc name.
  // e.g. "EMP001-notes (DAEN)"
  NOTES_DOC_SUFFIX: "-notes (DAEN)",

  // Calendar: substring that must appear in a 1:1 event title (case-insensitive).
  MEETING_TITLE_KEYWORD: "1:1",

  // How far back and forward to search for 1:1 events (in days).
  MEETING_PAST_DAYS:   45,
  MEETING_FUTURE_DAYS: 60,

  // Text written to the Upcoming cell when no future meeting is found.
  NO_MEETING_TEXT: "No meeting",

  // Sheet column numbers (1-based). Adjust if you add/remove columns.
  COLS: {
    ID:       2,   // B — employee ID
    EMAIL:    4,   // D — employee email
    UPCOMING: 11,  // K — next upcoming 1:1
    PREVIOUS: 12,  // L — most recent past 1:1
    NEXT:     13,  // M — meeting after upcoming
  },

  // Data starts on this row (row 1 is the header).
  DATA_START_ROW: 2,

};
// ──────────────────────────────────────────────────────────────────────────────
