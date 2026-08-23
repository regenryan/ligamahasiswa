// ============================================================
// Google Apps Script — Liga Mahasiswa Malaysia
// Paste this ENTIRE file into: https://script.google.com
// Replace all existing code, then Deploy > New deployment > Web app
//   - Execute as: Me
//   - Who has access: Anyone
//   - Copy the new web app URL and update NEXT_PUBLIC_APPS_SCRIPT_URL
// ============================================================

var SPREADSHEET_ID = "1-Oerh1wfm29t4JZsBFYigjBJTc8nDTgXCm6mUXRs-No";

function doGet(e) {
  var params = e.parameter;
  var sheetName = params.sheet;
  var action = params.action || "read";

  if (!sheetName) {
    return textResponse({ error: "Missing sheet parameter" });
  }

  try {
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);

    if (action === "write") {
      var row = JSON.parse(params.row_data || "{}");
      var sheet = getOrCreateSheet(ss, sheetName);
      return doAppendRow(sheet, row);
    }

    if (action === "update") {
      var sheet = ss.getSheetByName(sheetName);
      if (!sheet) return textResponse({ error: "Sheet not found: " + sheetName });
      var updates = JSON.parse(params.updates_data || "{}");
      return doUpdateRow(sheet, params.matchField, params.matchValue, updates);
    }

    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      return textResponse({ rows: [] });
    }

    if (action === "find") {
      return doFindRow(sheet, params);
    }

    return doReadRows(sheet, params);

  } catch (err) {
    return textResponse({ error: err.message });
  }
}

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheetName = body._sheet;

    if (!sheetName) return textResponse({ error: "Missing _sheet" });

    if (body._action === "update") {
      var sheet = ss.getSheetByName(sheetName);
      if (!sheet) return textResponse({ error: "Sheet not found: " + sheetName });
      return doUpdateRow(sheet, body._matchField, body._matchValue, body._updates);
    }

    var row = body._row || {};
    var sheet = getOrCreateSheet(ss, sheetName);
    return doAppendRow(sheet, row);

  } catch (err) {
    return textResponse({ error: err.message });
  }
}

function getOrCreateSheet(ss, sheetName) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }
  return sheet;
}

function doReadRows(sheet, params) {
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return textResponse({ rows: [] });

  var lastCol = sheet.getLastColumn();
  if (lastCol < 1) return textResponse({ rows: [] });

  var data = sheet.getRange(1, 1, lastRow, lastCol).getValues();

  var headers = [];
  for (var h = 0; h < data[0].length; h++) {
    headers.push(String(data[0][h]).trim());
  }

  var rows = [];
  for (var i = 1; i < data.length; i++) {
    var row = {};
    var match = true;

    for (var j = 0; j < headers.length; j++) {
      row[headers[j]] = String(data[i][j] != null ? data[i][j] : "");
    }

    for (var key in params) {
      if (key.indexOf("filter_") === 0 && key !== "sheet" && key !== "action") {
        var field = key.substring(7);
        if (row[field] !== params[key]) {
          match = false;
          break;
        }
      }
    }

    if (match) rows.push(row);
  }

  return textResponse({ rows: rows });
}

function doFindRow(sheet, params) {
  var field = params.field;
  var value = params.value;
  if (!field || !value) return textResponse({ row: null });

  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return textResponse({ row: null });

  var lastCol = sheet.getLastColumn();
  if (lastCol < 1) return textResponse({ row: null });

  var data = sheet.getRange(1, 1, lastRow, lastCol).getValues();

  var headers = [];
  for (var h = 0; h < data[0].length; h++) {
    headers.push(String(data[0][h]).trim());
  }

  var fieldIndex = -1;
  for (var f = 0; f < headers.length; f++) {
    if (headers[f] === field) { fieldIndex = f; break; }
  }
  if (fieldIndex === -1) return textResponse({ row: null });

  for (var i = 1; i < data.length; i++) {
    if (String(data[i][fieldIndex]) === value) {
      var row = {};
      for (var j = 0; j < headers.length; j++) {
        row[headers[j]] = String(data[i][j] != null ? data[i][j] : "");
      }
      return textResponse({ row: row });
    }
  }

  return textResponse({ row: null });
}

function doAppendRow(sheet, row) {
  if (!row || typeof row !== "object") {
    return textResponse({ error: "Missing row data" });
  }

  var lastRow = sheet.getLastRow();
  var lastCol = sheet.getLastColumn();
  var headers = [];

  if (lastCol > 0 && lastRow > 0) {
    var headerRange = sheet.getRange(1, 1, 1, lastCol);
    var headerValues = headerRange.getValues()[0];
    for (var h = 0; h < headerValues.length; h++) {
      headers.push(String(headerValues[h]).trim());
    }
  }

  if (headers.length === 0) {
    headers = Object.keys(row);
    var headerRow = sheet.getRange(1, 1, 1, headers.length);
    headerRow.setValues([headers]);
    SpreadsheetApp.flush();
  } else {
    var rowKeys = Object.keys(row);
    var newHeaders = [];
    for (var n = 0; n < rowKeys.length; n++) {
      var found = false;
      for (var m = 0; m < headers.length; m++) {
        if (headers[m] === rowKeys[n]) { found = true; break; }
      }
      if (!found) {
        newHeaders.push(rowKeys[n]);
        headers.push(rowKeys[n]);
      }
    }
    if (newHeaders.length > 0) {
      var startCol = headers.length - newHeaders.length + 1;
      var hRange = sheet.getRange(1, headers.length - newHeaders.length + 1, 1, newHeaders.length);
      hRange.setValues([newHeaders]);
      SpreadsheetApp.flush();
    }
  }

  var values = [];
  for (var k = 0; k < headers.length; k++) {
    var val = row[headers[k]];
    values.push(val !== undefined && val !== null ? String(val) : "");
  }

  var newRowNum = sheet.getLastRow() + 1;
  var writeRange = sheet.getRange(newRowNum, 1, 1, values.length);
  writeRange.setValues([values]);
  SpreadsheetApp.flush();

  return textResponse({ ok: true, _row: newRowNum });
}

function doUpdateRow(sheet, matchField, matchValue, updates) {
  if (!matchField || !matchValue || !updates) {
    return textResponse({ error: "Missing matchField, matchValue, or updates" });
  }

  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return textResponse({ error: "No data in sheet" });

  var lastCol = sheet.getLastColumn();
  if (lastCol < 1) return textResponse({ error: "No columns in sheet" });

  var data = sheet.getRange(1, 1, lastRow, lastCol).getValues();

  var headers = [];
  for (var h = 0; h < data[0].length; h++) {
    headers.push(String(data[0][h]).trim());
  }

  var fieldIndex = -1;
  for (var f = 0; f < headers.length; f++) {
    if (headers[f] === matchField) { fieldIndex = f; break; }
  }

  if (fieldIndex === -1) {
    return textResponse({ error: "Field not found: " + matchField });
  }

  for (var i = 1; i < data.length; i++) {
    if (String(data[i][fieldIndex]) === matchValue) {
      var rowNum = i + 1;
      for (var key in updates) {
        var colIndex = -1;
        for (var c = 0; c < headers.length; c++) {
          if (headers[c] === key) { colIndex = c; break; }
        }
        if (colIndex === -1) {
          var newCol = headers.length + 1;
          sheet.getRange(1, newCol).setValue(key);
          headers.push(key);
          colIndex = newCol - 1;
        }
        sheet.getRange(rowNum, colIndex + 1).setValue(String(updates[key]));
      }
      SpreadsheetApp.flush();
      return textResponse({ ok: true });
    }
  }

  return textResponse({ error: "Row not found" });
}

function textResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
