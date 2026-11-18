import { test, expect, afterEach } from 'bun:test';
import { existsSync, unlinkSync } from 'node:fs';
import { saveToFile, loadFromFile } from './file-storage.js';

const TEST_PATH = 'temp-roundtrip.csv';

afterEach(() => {
  if (existsSync(TEST_PATH)) {
    unlinkSync(TEST_PATH);
  }
});

test('round-trip: массив объектов сохраняется в файл и считывается обратно', () => {
  const sampleData = [
    { id: 1, customer: 'Анна', amount: 5000, isPaid: true },
    { id: 2, customer: 'Борис', amount: 3200, isPaid: false },
  ];

  saveToFile(TEST_PATH, sampleData);
  const loaded = loadFromFile(TEST_PATH);

  expect(loaded).toEqual(sampleData);
});