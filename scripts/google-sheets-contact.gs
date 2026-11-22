/**
 * IYRA Creations — contact form → Google Sheet.
 *
 * Paste this into the Sheet's Apps Script editor (Extensions → Apps Script),
 * set SECRET, then Deploy → New deployment → Web app:
 *   Execute as: Me    Who has access: Anyone
 * Copy the /exec URL into Vercel as GOOGLE_SHEETS_WEBHOOK_URL and the same
 * secret as GOOGLE_SHEETS_SECRET.
 */

const SECRET = 'snslfsrfurwfiiIJUHubuib8U9uubbJKNIHEUFEFJO7F'
const SHEET_ID = '177jvsD1YBRtbXj7xlaGQU5SReRAwr1x_X08JD_MeeiM'
const SHEET_NAME = 'Enquiries'
const HEADERS = ['Submitted at', 'Name', 'Email', 'Phone', 'Company', 'Service', 'Budget', 'Message', 'Page', 'User agent']

function doPost(e) {
  try {
    const data = JSON.parse((e && e.postData && e.postData.contents) || '{}')
    if (data.secret !== SECRET) return json({ ok: false, error: 'Unauthorized' })

    const lock = LockService.getScriptLock()
    lock.waitLock(10000)
    try {
      const sheet = getSheet()
      sheet.appendRow([
        new Date(),
        safe(data.name),
        safe(data.email),
        safe(data.phone),
        safe(data.company),
        safe(data.service),
        safe(data.budget),
        safe(data.message),
        safe(data.page),
        safe(data.userAgent),
      ])
    } finally {
      lock.releaseLock()
    }
    return json({ ok: true })
  } catch (err) {
    return json({ ok: false, error: String(err) })
  }
}

function getSheet() {
  const ss = SpreadsheetApp.openById(SHEET_ID)
  let sheet = ss.getSheetByName(SHEET_NAME)
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME)
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS)
    sheet.setFrozenRows(1)
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold')
  }
  return sheet
}

// Stop values like "=HYPERLINK(...)" being run as formulas in the sheet.
function safe(value) {
  const s = String(value == null ? '' : value)
  return /^[=+\-@]/.test(s) ? "'" + s : s
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON)
}
