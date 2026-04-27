/**
 * Fetches all calendar events in the configured search window that contain
 * the meeting keyword. Called once per script run — not per employee.
 *
 * @param {CalendarApp.Calendar} calendar
 * @param {Date} today - midnight-normalised today
 * @returns {CalendarApp.CalendarEvent[]}
 */
function fetchAllMeetingEvents(calendar, today) {
  const past    = new Date(today.getTime() - CONFIG.MEETING_PAST_DAYS   * 86400000);
  const future  = new Date(today.getTime() + CONFIG.MEETING_FUTURE_DAYS * 86400000);
  const keyword = CONFIG.MEETING_TITLE_KEYWORD.toLowerCase();

  return calendar.getEvents(past, future)
    .filter(e => e.getTitle().toLowerCase().includes(keyword));
}

/**
 * Filters a pre-fetched event list for a single employee email and returns
 * their previous, upcoming, and next 1:1 dates.
 *
 * @param {CalendarApp.CalendarEvent[]} allEvents - from fetchAllMeetingEvents()
 * @param {string} email
 * @param {Date} today - midnight-normalised today
 * @returns {{ previous: Date|null, upcoming: Date|null, next: Date|null }}
 */
function getMeetingsForEmail(allEvents, email, today) {
  const relevant = allEvents
    .filter(e => e.getGuestList().some(g => g.getEmail() === email))
    .sort((a, b) => a.getStartTime() - b.getStartTime());

  const past   = relevant.filter(e => e.getStartTime() <  today);
  const future = relevant.filter(e => e.getStartTime() >= today);

  return {
    previous: past.length   ? past[past.length - 1].getStartTime() : null,
    upcoming: future.length ? future[0].getStartTime()             : null,
    next:     future.length > 1 ? future[1].getStartTime()         : null,
  };
}
