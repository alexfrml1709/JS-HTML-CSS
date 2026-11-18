import { writeFileSync, readFileSync } from 'node:fs';
import { toCSV } from '../../../js-algorithms/utils/toCSV.js';
import { fromCSV } from '../../../js-algorithms/utils/fromCSV.js';


export function saveToFile(path, data) {
  const text = toCSV(data);
  writeFileSync(path, text, 'utf8');
}


export function loadFromFile(path) {
  const text = readFileSync(path, 'utf8');
  return fromCSV(text);
}