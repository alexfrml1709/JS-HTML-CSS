import { test, expect, mock, spyOn } from 'bun:test';

// 1. Проверяем автономный mock()
test('mock() запоминает вызовы и возвращает настроенные данные', () => {
  const doubler = mock((x) => x * 2);

  const res1 = doubler(4);
  const res2 = doubler(10);

  expect(res1).toBe(8);
  expect(res2).toBe(20);
  expect(doubler).toHaveBeenCalledTimes(2);
  expect(doubler).toHaveBeenCalledWith(4);
  expect(doubler).toHaveBeenLastCalledWith(10);
});

// 2. Проверяем spyOn() и mockRestore()
test('spyOn() следит за объектом и корректно восстанавливается', () => {
  const service = {
    greet(name) {
      return `Привет, ${name}!`;
    },
  };

  const spy = spyOn(service, 'greet');

  const greeting = service.greet('Нурболат');

  expect(greeting).toBe('Привет, Нурболат!');
  expect(spy).toHaveBeenCalledTimes(1);
  expect(spy).toHaveBeenCalledWith('Нурболат');

  spy.mockRestore();
});

// 3. Проверяем mock.module()
test('mock.module() перехватывает обращение к модулю в памяти', async () => {
  let inMemoryData = [{ id: 1, text: 'тест' }];

  mock.module('./file-storage.js', () => ({
    loadFromFile: mock(() => inMemoryData),
    saveToFile: mock((path, data) => {
      inMemoryData = data;
    }),
  }));

  // выражение await import(...) позволяет выполнять импорт не в момент парсинга файла,
  // а по ходу потока выполнения.
  const { loadFromFile, saveToFile } = await import('./file-storage.js');

  expect(loadFromFile('любой-путь.csv')).toEqual([{ id: 1, text: 'тест' }]);

  saveToFile('любой-путь.csv', [{ id: 2, text: 'обновлено' }]);
  expect(inMemoryData).toEqual([{ id: 2, text: 'обновлено' }]);
});