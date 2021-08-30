// WebApp code for tracking qr code scans

// Name of sheet to input to
const INPUT_SHEET = "Raw"

function doGet(e) {
  // Get query string properties
  const {id, userAgent} = e.parameter
  
  // If no ID was specified, stop execution
  if(!id) return

  // Get the input sheet
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const inputSheet = ss.getSheetByName(INPUT_SHEET)

  // Get a document lock, so 2 different scans don't try
  // to go in at the same time and overwrite each other
  const lock = LockService.getDocumentLock()
  // Try to get a lock, wait for up to 10 seconds. If
  // successful, insert a new row of data
  try {
    lock.waitLock(10000)
    inputSheet.appendRow([new Date(), id, userAgent])
  // If failure, log the error
  } catch(e) {
    Logger.log(e)
  // Make sure to update changes to the sheet and release the lock
  } finally {
    SpreadsheetApp.flush()
    lock.releaseLock()
    
    // Send a response back
    return ContentService.createTextOutput()
  }
}
