/**
 * Liga Mahasiswa Malaysia — Google Apps Script
 *
 * Deploy this as a Web App (Execute as: Me, Who has access: Anyone)
 * Webhook URL: https://script.google.com/macros/s/.../exec
 *
 * Handles:
 *   GET  → read rows, find a row
 *   POST → write a row, update a row
 */

const SS_ID = SpreadsheetApp.getActiveSpreadsheet().getId();

function doGet(e) {
  const params = e.parameter || {};
  const action = params.action || "read";
  const sheetName = params.sheet;

  if (!sheetName) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: "Missing 'sheet' param" }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  try {
    const ss = SpreadsheetApp.openById(SS_ID);
    const sheet = ss.getSheetByName(sheetName);

    if (!sheet) {
      return ContentService
        .createTextOutput(JSON.stringify({ ok: false, error: "Sheet not found: " + sheetName }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    if (action === "find") {
      return handleFind(sheet, params);
    }

    // Default: read
    return handleRead(sheet, params);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function handleRead(sheet, params) {
  const data = sheet.getDataRange().getValues();
  if (data.length < 2) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: true, rows: [] }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  const headers = data[0].map(String);
  const rows = [];

  for (let i = 1; i < data.length; i++) {
    const row = {};
    let match = true;

    for (let j = 0; j < headers.length; j++) {
      row[headers[j]] = String(data[i][j] ?? "");
    }

    // Apply filters (params starting with "filter_")
    for (const [key, value] of Object.entries(params)) {
      if (key.startsWith("filter_") && key !== "action" && key !== "sheet") {
        const field = key.replace("filter_", "");
        if (row[field] !== value) {
          match = false;
          break;
        }
      }
    }

    if (match) {
      rows.push(row);
    }
  }

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, rows }))
    .setMimeType(ContentService.MimeType.JSON);
}

function handleFind(sheet, params) {
  const field = params.field;
  const value = params.value;

  if (!field || !value) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: "Missing 'field' or 'value'" }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  const data = sheet.getDataRange().getValues();
  if (data.length < 2) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: true, row: null }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  const headers = data[0].map(String);

  for (let i = 1; i < data.length; i++) {
    const row = {};
    for (let j = 0; j < headers.length; j++) {
      row[headers[j]] = String(data[i][j] ?? "");
    }

    if (row[field] === value) {
      return ContentService
        .createTextOutput(JSON.stringify({ ok: true, row }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, row: null }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const sheetName = body._sheet;

    if (!sheetName) {
      return ContentService
        .createTextOutput(JSON.stringify({ ok: false, error: "Missing _sheet" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const ss = SpreadsheetApp.openById(SS_ID);
    const sheet = ss.getSheetByName(sheetName);

    if (!sheet) {
      return ContentService
        .createTextOutput(JSON.stringify({ ok: false, error: "Sheet not found: " + sheetName }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Update action
    if (body._action === "update") {
      return handleUpdate(sheet, body);
    }

    // Default: append row
    const row = body._row;
    if (!row) {
      return ContentService
        .createTextOutput(JSON.stringify({ ok: false, error: "Missing _row" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const headers = sheet.getDataRange().getValues()[0] || [];
    const values = headers.map((h) => row[h] ?? "");
    sheet.appendRow(values);

    const rowNum = sheet.getLastRow();

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true, _sheet: sheetName, _row: rowNum }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function handleUpdate(sheet, body) {
  const { _matchField, _matchValue, _updates } = body;

  if (!_matchField || !_matchValue || !_updates) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: "Missing _matchField, _matchValue, or _updates" }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  const data = sheet.getDataRange().getValues();
  if (data.length < 2) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: "No data" }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  const headers = data[0].map(String);
  const matchCol = headers.indexOf(_matchField);

  if (matchCol === -1) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: "Field not found: " + _matchField }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][matchCol]) === _matchValue) {
      const rowNum = i + 1;
      for (const [key, value] of Object.entries(_updates)) {
        const col = headers.indexOf(key);
        if (col !== -1) {
          sheet.getRange(rowNum, col + 1).setValue(value);
        }
      }
      return ContentService
        .createTextOutput(JSON.stringify({ ok: true, _sheet: sheet.getSheetName(), _row: rowNum }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }

  return ContentService
    .createTextOutput(JSON.stringify({ ok: false, error: "Row not found" }))
    .setMimeType(ContentService.MimeType.JSON);
}
