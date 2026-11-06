import { len as strLen} from "../len";
import { len as arrLen } from "../arrays/len";
import { keys } from "../objects/keys";
import { join } from "../arrays/join";
import { push } from "../arrays/push";


/**
 * Функция преобразовывает массив объектов в CSV-строку (не мутирует исходный массив)
 * @param {Array<*>} data - исходный массив объектов с одинаковой структурой 
 * @returns {string} CSV-строка
 * @throws {TypeError} - если data не массив
 * @example
 *     toCSV([{name: 'Анна', age: 25}]); // 'name,age\nАнна,25\n'
 */


export function toCSV(data) {
    if (!Array.isArray(data)) {
        throw new TypeError("data должна быть массивом");
    }

    const dataLen = arrLen(data);

    if (dataLen === 0) {
        return "";
    }

    let result = "";
    const keysResult = keys(data[0]);
    let isValidKeyResult = [];

    for (let i = 0; i < arrLen(keysResult); i++) {
        if (isValidKey(keysResult[i])) {
            push(isValidKeyResult, keysResult[i]);
        } else {
            throw new TypeError("Ключ не должен быть пуст или содержать запрещенные символы");
        }
    }

    result += join(isValidKeyResult, ",") + "\n";

    for (let i = 0; i < dataLen; i++) {
        let serializedValueArr = [];

        for (let j = 0; j < arrLen(keysResult); j++) {
            const currentKey = keysResult[j];
            const currentValue = data[i][currentKey];
            
            push(serializedValueArr, serializeValue(currentValue));
        }
        
        result += join(serializedValueArr, ",") + "\n";
    }

    return result;
}


function isValidKey(key) {
    if (key === "" || key === null || key === undefined) {
        return false;
    }

    for (let i = 0; i < strLen(key); i++) {
        if (key[i] === ',' || key[i] === '"' || key[i] === '\\' || key[i] === "\n" || key[i] === "\r") {
            return false;
        }
    }

    return true;
}


function serializeValue(value) {
    let serializeValueResult;

    if (typeof value === "number") {
        if (Number.isNaN(value) || !Number.isFinite(value)) {
            serializeValueResult = "null";
        } else {
            serializeValueResult = String(value);
        }
    } else if (typeof value === "string") {
        serializeValueResult = '"' + escapeString(value) + '"';
    } else if (typeof value === "boolean" || value === null) {
        serializeValueResult = String(value);
    } else if (typeof value === "undefined") {
        serializeValueResult = "";
    } else {
        throw new TypeError("value не должно быть объектом или массивом");
    }

    return serializeValueResult;
}


function escapeString(value) {
    let escapeStringResult = "";
    const valueLen = strLen(value);

    for (let i = 0; i < valueLen; i++) {
        if (value[i] === '"') {
            escapeStringResult = escapeStringResult + '\\' + value[i];
        } else if (value[i] === "\\") {
            escapeStringResult = escapeStringResult + '\\\\';
        } else if (value[i] === "\n") {
            escapeStringResult = escapeStringResult + '\\n';
        } else if (value[i] === "\t") {
            escapeStringResult = escapeStringResult + '\\t';
        } else if (value[i] === "\r") {
            escapeStringResult = escapeStringResult + '\\r';
        } else {
            escapeStringResult += value[i];
        }
    }

    return escapeStringResult;
}