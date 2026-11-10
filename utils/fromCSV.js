import { len as strLen } from "../len";
import { len as arrLen } from "../arrays/len";
import { push } from "../arrays/push";


/**
 * Функция парсит CSV-строки обратно в массив объектов (функция иммутабельна)
 * @param {string} text - исходная строка для парсинга
 * @returns {object[]} массив объектов после парсинга строки
 * @throws {TypeError} - если csvString не строка
 * @example
 *     fromCSV("a,b\n1,2"); // [{a: 1, b: 2}]
 */


export function fromCSV(text) {
    if (typeof text !== "string") {
        throw new TypeError("csvString должен быть строкой");
    }

    let result = [];
    let currentRow = [];
    let rows = [];
    let currentField = '';
    let inQuotes = false;
    let isFieldWasQuoted = false;

    for (let i = 0; i < strLen(text); i++) {
        if (inQuotes) {
            if (text[i] === '\\' && text[i + 1] === '\\' && text[i + 2] === '"') {
                currentField += '\\';
                i += 2;
            } else if (text[i] === '\\' && text[i + 1] === '"') {
                currentField += '"';
                i++;
            } else if (text[i] === "\\" && text[i + 1] === "n") {
                currentField += "\n";
                i++;
            } else if (text[i] === "\\" && text[i + 1] === "t") {
                currentField += "\t";
                i++;
            } else if (text[i] === "\\" && text[i + 1] === "r") {
                currentField += "\r";
                i++;
            } else if (text[i] === '\\' && text[i + 1] === '\\') {
                currentField += '\\';
                i++;
            } else if (text[i] === '"') {
                inQuotes = false;
            } else {
                currentField += text[i];
            }
        } else {
            if (text[i] === '"') {
                inQuotes = true;
                isFieldWasQuoted = true;
            } else if (text[i] === ',') {
                push(currentRow, {value: currentField, quoted: isFieldWasQuoted});
                currentField = "";
                isFieldWasQuoted = false;
            } else if (text[i] === '\r') {
                if (text[i + 1] === "\n") {
                    push(currentRow, {value: currentField, quoted: isFieldWasQuoted});
                    push(rows, currentRow);
                    currentField = "";
                    currentRow = [];
                    isFieldWasQuoted = false;
                    i++;   
                }
            } else if (text[i] === "\n") {
                push(currentRow, {value: currentField, quoted: isFieldWasQuoted});
                push(rows, currentRow);
                currentField = "";
                currentRow = [];
                isFieldWasQuoted = false;
            } else {
                currentField += text[i];
            }
        }
    }

    if (arrLen(currentRow) > 0 || strLen(currentField) > 0 || isFieldWasQuoted) {
        push(currentRow, {value: currentField, quoted: isFieldWasQuoted});
        push(rows, currentRow);
    }

    const rowsLen = arrLen(rows);

    for (let i = 1; i < rowsLen; i++) {
        const rowObj = {};
        const iRowsLen = arrLen(rows[i]);

        for (let j = 0; j < iRowsLen; j++) {
            const keyRow = rows[0][j];

            if(!keyRow) {
                continue;
            }

            const key = keyRow.value;
            const cell = rows[i][j];

            if (cell.quoted) {
                rowObj[key] = cell.value;
            } else {
                if (cell.value === 'true') {
                    rowObj[key] = true;
                } else if (cell.value === 'false') {
                    rowObj[key] = false;
                } else if (cell.value === 'null') {
                    rowObj[key] = null;
                } else if (strLen(cell.value) === 0) {
                    rowObj[key] = undefined; 
                } else {
                const num = +cell.value;

                rowObj[key] = (num === num) ? num : cell.value;
                }
            }
        }

        push(result, rowObj);
    }

    return result;
}