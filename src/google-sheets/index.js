const GoogleSpreadsheet = require('google-spreadsheet');
const credentials = require('./credentials.js');

const ERROR_MESSAGE_BAD_REQUEST = 'Please provide a valid spreadsheet ID and ensure the spreadsheet is shared with the Google Service account.';

/**
 * API for interacting with Google Spreadsheets.
 */
module.exports = {

    /**
     * Gets general information about the document.
     *
     * @param res - response to send data to
     * @param sheetId - id of our spreadsheet
     */
    getInfo: (res, sheetId) => {
        const doc = new GoogleSpreadsheet(sheetId);

        doc.useServiceAccountAuth(credentials, () => {
            doc.getInfo((err, info) => {
                if(err) {
                    res.status(400).send({ status: 400, message: ERROR_MESSAGE_BAD_REQUEST, type: 'Bad Request' });
                } else {
                    res.status(200).json(info);
                }
            });
        });
    },

    /**
     * Gets general information about a single worksheet.
     *
     * @param res - response to send data to
     * @param sheetId - id of our spreadsheet
     * @param sheetIndex - optional sheet index
     */
    getWorksheetInfo: (res, sheetId, sheetIndex = 1) => {
        const doc = new GoogleSpreadsheet(sheetId);

        doc.useServiceAccountAuth(credentials, () => {
            doc.getInfo((err, info) => {
                if(err) {
                    res.status(400).send({ status: 400, message: ERROR_MESSAGE_BAD_REQUEST, type: 'Bad Request' });
                } else {
                    res.status(200).json(info["worksheets"][sheetIndex]);
                }
            });
        });
    },

    /**
     * Reads all rows (reads just row spreadsheet data).
     *
     * @param res - response to send data to
     * @param sheetId - id of our spreadsheet
     * @param sheetIndex - optional sheet index
     */
    getRows: (res, sheetId, sheetIndex = 1) => {
        const doc = new GoogleSpreadsheet(sheetId);

        doc.useServiceAccountAuth(credentials, () => {
            doc.getRows(sheetIndex, (err, row_data) => {
                if(err) {
                    res.status(400).send({ status: 400, message: ERROR_MESSAGE_BAD_REQUEST, type: 'Bad Request' });
                } else {
                    res.status(200).json(module.exports.stripRowsData(row_data));
                }
            });
        });
    },

    /**
     * Reads a single row (reads just row spreadsheet data).
     *
     * @param res - response to send data to
     * @param sheetId - id of our spreadsheet
     * @param rowIndex - row data to write to our spreadsheet
     * @param sheetIndex - optional sheet index
     */
    getRow: (res, sheetId, rowIndex, sheetIndex = 1) => {
        const doc = new GoogleSpreadsheet(sheetId);

        doc.useServiceAccountAuth(credentials, () => {
            doc.getRows(sheetIndex, (err, row_data) => {
                if(err) {
                    res.status(400).send({ status: 400, message: ERROR_MESSAGE_BAD_REQUEST, type: 'Bad Request' });
                } else {
                    res.status(200).json(module.exports.stripRowData(row_data[rowIndex]));
                }
            });
        });
    },

    /**
     * Writes a single row to our spreadsheet.
     *
     * @param res - response to send data to
     * @param sheetId - id of our spreadsheet
     * @param rowData - row data to write to our spreadsheet
     * @param sheetIndex - optional sheet index
     */
    postRow: (res, sheetId, rowData, sheetIndex = 1) => {
        const doc = new GoogleSpreadsheet(sheetId);

        doc.useServiceAccountAuth(credentials, () => {
            doc.addRow(sheetIndex, rowData, (err) => {
                if(err) {
                    res.status(400).send({ status: 400, message: ERROR_MESSAGE_BAD_REQUEST, type: 'Bad Request' });
                } else {
                    res.status(200).json(rowData);
                }
            });
        });
    },

    /**
     * Loops through all given rows and strips out everything
     * other than the actual spreadsheet row data.
     *
     * @param rows - rows to strip data out of
     * @returns {Array} of stripped rows
     */
    stripRowsData: (rows) => rows.map((row) => module.exports.stripRowData(row)),

    /**
     * Strips everything other than the actual row data
     * out of our spreadsheet row object.
     *
     * @param row - row to strip data out of
     * @returns a stripped row
     */
    stripRowData: (row) => {
        if(row) {
            delete row['id'];
            delete row['_xml'];
            delete row['app:edited'];
            delete row['_links'];
        }
        return row;
    }
};