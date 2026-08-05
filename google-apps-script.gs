function doPost(e) {
  try {
    // Exact sheet tab name (bottom of Google Sheet)
    var SHEET_NAME = "intrudersKidsAndMenz";

    var HEADERS = [
      "Timestamp",
      "Form Type",
      "Player Name",
      "Phone Number",
      "Kids Age",
      "Name on Tshirt",
      "Tshirt Size",
      "Number on back",
      "Sleeve Length"
    ];

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME);

    // Create tab if missing
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
    }

    var p = (e && e.parameter) ? e.parameter : {};

    // Auto-create headers if first row is empty
    var firstRow = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
    var hasHeader = firstRow.some(function (cell) {
      return String(cell).trim() !== "";
    });

    if (!hasHeader) {
      sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
    }

    var row = [
      new Date(),
      p.formType || "",
      p.playerName || "",
      p.phoneNumber || "",
      p.kidsAge || "",
      p.nameOnTshirt || "",
      p.tshirtSize || "",
      p.numberOnBack || "",
      p.sleeveLength || ""
    ];

    var nextRow = sheet.getLastRow() + 1;

    // Keep phone / kids age / back number as text (so 007 stays 007)
    sheet.getRange(nextRow, 4).setNumberFormat("@"); // Phone Number
    sheet.getRange(nextRow, 5).setNumberFormat("@"); // Kids Age
    sheet.getRange(nextRow, 8).setNumberFormat("@"); // Number on back

    sheet.getRange(nextRow, 1, 1, row.length).setValues([row]);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true, message: "Saved successfully" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({
      ok: true,
      message: "Web App is live. Use POST to submit form data."
    }))
    .setMimeType(ContentService.MimeType.JSON);
}
