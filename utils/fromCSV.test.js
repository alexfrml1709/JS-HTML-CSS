import { describe, test, expect } from "bun:test";
import { fromCSV } from "./fromCSV";
import { toCSV } from "./toCSV";


describe("Базовые тесты функции fromCSV", () => {
    test("Должна вернуть пустой массив для пустой строки", () => {
        const result = fromCSV("");

        expect(result).toEqual([]);
    });

    test("Должна вернуть пустой массив для строки состоящей только из заголовков", () => {
        const result = fromCSV("a,b\n");

        expect(result).toEqual([]);
    });

    test("Должна разобрать текст с несколькими колонками", () => {
        const result = fromCSV("a,b\n1,2");

        expect(result).toEqual([{a: 1, b: 2}]);
    });

    test("Должна разобрать текст с несколькими строками", () => {
        const result = fromCSV("a\n1\n2");

        expect(result).toEqual([{a: 1}, {a: 2}]);
    });
});


describe("Тесты на сохранность типов данных функции fromCSV", () => {
    test("Должна обработать число", () => {
        const result = fromCSV("a\n5");

        expect(result).toEqual([{a: 5}]);
    });

    test("Должна обработать строку с числом внутри", () => {
        const result = fromCSV('a\n"5"');

        expect(result).toEqual([{a: "5"}]);
    });

    test("Должна обработать ноль", () => {
        const result = fromCSV('a\n0');

        expect(result).toEqual([{a: 0}]);
    });

    test("Должна обработать отрицательное дробное", () => {
        const result = fromCSV('a\n-3.14');

        expect(result).toEqual([{a: -3.14}]);
    });

    test("Должна обработать boolean", () => {
        const result = fromCSV('a\ntrue');

        expect(result).toEqual([{a: true}]);
    });

    test("Должна обработать null", () => {
        const result = fromCSV('a\nnull');

        expect(result).toEqual([{a: null}]);
    });

    test("Должна обработать строку null", () => {
        const result = fromCSV('a\n"null"');

        expect(result).toEqual([{a: "null"}]);
    });

    test("Должна обработать undefined при пустой ячейке", () => {
        const result = fromCSV('a\n\n');

        expect(result).toEqual([{a: undefined}]);
        expect(Object.hasOwn(result[0], 'a')).toBe(true);
    });

    test("Должна работать с пустой строкой после заголовков", () => {
        const result = fromCSV('a\n""');

        expect(result).toEqual([{a: ""}]);
    });
});


describe("Тесты экранирования функции fromCSV", () => {
    test("Должна обработать запятую внутри строки", () => {
        const result = fromCSV('name\n"Анна, Борис"');

        expect(result).toEqual([{name: 'Анна, Борис'}]);
    });

    test("Должна обработать кавычки", () => {
        const result = fromCSV('s\n"say \\"hi\\""');

        expect(result).toEqual([{s: 'say "hi"'}]);
    });

    test("Должна обработать обратный слэш", () => {
        const result = fromCSV('s\n"a\\\\b"');

        expect(result).toEqual([{s: "a\\b"}]);
    });

    test("Должна обработать перенос строки", () => {
        const result = fromCSV('s\n"a\\nb"');

        expect(result).toEqual([{s: 'a\nb'}]);
    });

    test("Должна обработать табуляцию", () => {
        const result = fromCSV('s\n"a\\tb"');

        expect(result).toEqual([{s: 'a\tb'}]);
    });

    test("Должна обработать возврат каретки", () => {
        const result = fromCSV('s\n"a\\rb"');

        expect(result).toEqual([{s: 'a\rb'}]);
    });
});


describe("Тесты пропусков и лишних ячеек функции fromCSV", () => {
    test("Должна показать undefined, если строка короче заголовка", () => {
        const result = fromCSV('a,b\n1');

        expect(result).toEqual([{a: 1, b: undefined}]);
    });

    test("Должна игнорировать лишнюю ячейку", () => {
        const result = fromCSV('a\n1,2');

        expect(result).toEqual([{a: 1}]);
    });

    test("Должна обработать ключ с пробелом", () => {
        const result = fromCSV('first name\n"Anna"');

        expect(result).toEqual([{'first name': 'Anna'}]);
    });
});


describe("Тесты разделителей строк и CRLF функции fromCSV", () => {
    test("Должна обработать реальный LF-разделитель", () => {
        const result = fromCSV('a\n1\n');

        expect(result).toEqual([{a: 1}]);
    });

    test("Должна обработать Windows файл с CRLF", () => {
        const result = fromCSV('a\r\n1\r\n');

        expect(result).toEqual([{a: 1}]);
    });

    test("Должна обработать Windows файл с несколькими колоноками", () => {
        const result = fromCSV('a,b\r\n1,2\r\n');

        expect(result).toEqual([{a: 1, b: 2}]);
    });

    test("Должна обработать возврат каретки внутри значения", () => {
        const result = fromCSV('s\n"a\\rb"');

        expect(result).toEqual([{s: "a\rb"}]);
    });
});


describe("Round-trip тесты функции fromCSV", () => {
    test("Должна выполнить round-trip с сохранением типов данных", () => {
        const data = [{n: 5, s: '5', b: true, x: null}];
        const result = fromCSV(toCSV(data));

        expect(result).toEqual([{n: 5, s: '5', b: true, x: null}]);
    });

    test("Должна выполнить round-trip с сохранением falsy-значений", () => {
        const data = [{a: 0, b: false, c: ''}];
        const result = fromCSV(toCSV(data));

        expect(result).toEqual([{a: 0, b: false, c: ''}]);
    });

    test("Должна выполнить round-trip с сохранением спецсимволов", () => {
        const data = [{s: 'a, "b"\nc\\d'}];
        const result = fromCSV(toCSV(data));

        expect(result).toEqual([{s: 'a, "b"\nc\\d'}]);
    });

    test("Должна выполнить round-trip с сохранением undefined", () => {
        const data = [{a: undefined, b: 5}];
        const result = fromCSV(toCSV(data));

        expect(result).toEqual([{a: undefined, b: 5}]);
    });
});


describe("Тесты выброса ошибки функции fromCSV", () => {
    test("Должна выбросить TypeError, если text не строка", () => {
        expect(() => fromCSV(123).toThrow(TypeError));
        expect(() => fromCSV(null).toThrow(TypeError));
        expect(() => fromCSV([]).toThrow(TypeError));
    });
});