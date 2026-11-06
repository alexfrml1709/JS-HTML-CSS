import { describe, test, expect } from "bun:test";
import { toCSV } from "./toCSV";


describe("Базовые тесты функции toCSV", () => {
    test("Должна вернуть пустую строку для пустого массива", () => {
        const result = toCSV([]);

        expect(result).toEqual("");
    });

    test("Должна преобразовать один объект", () => {
        const result = toCSV([{a: 1}]);

        expect(result).toEqual('a\n1\n');
    });

    test("Должна преобразовать несколько объектов", () => {
        const result = toCSV([{a: 1}, {a: 2}, {a: 3}]);

        expect(result).toEqual('a\n1\n2\n3\n');
    });

    test("Должна не нарушать порядок ключей", () => {
        const result = toCSV([{b: 2, a: 1}]);

        expect(result).toEqual('b,a\n2,1\n');
    });

    test("Должна выставить пустую ячейку, если один из ключей в последующих объектах после первого отсутствует", () => {
        const result = toCSV([{a: 1, b: 2}, {a: 3}]);

        expect(result).toEqual('a,b\n1,2\n3,\n');
    });

    test("Должна игнорировать лишний ключ в последующих объектак после первого", () => {
        const result = toCSV([{a: 1}, {a: 2, b: 3}]);

        expect(result).toEqual('a\n1\n2\n');
    });
});


describe("Тесты типов данных функции toCSV", () => {
    test("Должна не менять тип данных строки", () => {
        const result = toCSV([{name: 'Анна', age: 25}]);

        expect(result).toEqual('name,age\n"Анна",25\n');
    });

    test("Должна не менять тип данных строки, даже если в строке число", () => {
        const result = toCSV([{a: "5"}]);

        expect(result).toEqual('a\n"5"\n');
    });

    test("Число 0 не должно исчезнуть", () => {
        const result = toCSV([{a: 0}]);

        expect(result).toEqual('a\n0\n');
    });

    test("Булевы значения не должны исчезнуть", () => {
        const result = toCSV([{a: true}, {a: false}]);

        expect(result).toEqual('a\ntrue\nfalse\n');
    });

    test("Должна работать со строкой true", () => {
        const result = toCSV([{a: "true"}]);

        expect(result).toEqual('a\n"true"\n');
    });

    test("Должна работать с отрицательным дробным числом", () => {
        const result = toCSV([{a: -3.14}]);

        expect(result).toEqual('a\n-3.14\n');
    });

    test("Должна работать с null", () => {
        const result = toCSV([{a: null}]);

        expect(result).toEqual('a\nnull\n');
    });

    test("Должна работать со строкой 'null'", () => {
        const result = toCSV([{a: "null"}]);

        expect(result).toEqual('a\n"null"\n');
    });
    
    test("Должна выставлять пустую ячейку, при undefined", () => {
        const result = toCSV([{a: undefined}]);

        expect(result).toEqual('a\n\n');
    });

    test("Должна работать с пустой строкой", () => {
        const result = toCSV([{a: ""}]);

        expect(result).toEqual('a\n""\n');
    });

    test("Должна выставлять null при NaN, Infinity или -Infinity", () => {
        const result1 = toCSV([{a: NaN}]);
        const result2 = toCSV([{a: Infinity}]);
        const result3 = toCSV([{a: -Infinity}]);

        expect(result1).toEqual('a\nnull\n');
        expect(result2).toEqual('a\nnull\n');
        expect(result3).toEqual('a\nnull\n');
    });
});


describe("Тесты экранирования функции toCSV", () => {
    test("Должна экранировать значение с запятой", () => {
        const result = toCSV([{name: 'Анна, Борис', age: 25}]);

        expect(result).toEqual('name,age\n"Анна, Борис",25\n');
    });

    test("Должна экранировать значение c кавычками", () => {
        const result = toCSV([{a: 'say "hi"'}]);

        expect(result).toEqual('a\n"say \\"hi\\""\n');
    });

    test("Должна экранировать значение c обратным слэшем", () => {
        const result = toCSV([{x: 'a\\b'}]);

        expect(result).toEqual('x\n"a\\\\b"\n');
    });

    test("Должна экранировать значение с переносом строки", () => {
        const result = toCSV([{x: 'a\nb'}]);

        expect(result).toEqual('x\n"a\\nb"\n');
    });

    test("Должна экранировать табуляцию", () => {
        const result = toCSV([{x: 'a\tb'}]);

        expect(result).toEqual('x\n"a\\tb"\n');
    });

    test("Должна экранировать возврат каретки", () => {
        const result = toCSV([{x: 'a\rb'}]);

        expect(result).toEqual('x\n"a\\rb"\n');
    });

    test("Должна экранировать всё сразу", () => {
        const result = toCSV([{x: 'a, "b"\nc\\d'}]);

        expect(result).toEqual('x\n"a, \\"b\\"\\nc\\\\d"\n');
    });
});


describe("Тесты разделителей и переносов функции toCSV", () => {
    test("Действительный \n в конце каждой строки", () => {
        const result = toCSV([{a: 1}]);

        expect(result).toEqual('a\n1\n');
        expect(result.length).toEqual(4);
        expect(result.charCodeAt(1)).toEqual(10);
    });

    test("Последняя строка завершается переносом строки", () => {
        const result = toCSV([{a: 1}]);
        
        expect(result.endsWith("\n")).toEqual(true);
    });

    test("Отсутствует литерал \ + n среди разделителей", () => {
        const result = toCSV([{a: 1}]);
        
        expect(result.includes("\\n")).toEqual(false);
    });

    test("Перенос внутри значения не разрывает строку", () => {
        const result = toCSV([{x: 'a\nb'}]);
        
        expect(result).toEqual('x\n"a\\nb"\n');
        expect(result.split("\n").length).toEqual(3);
    });
});


describe("Тесты допустимости ключей функции toCSV", () => {
    test("Ключ с пробелом допустим", () => {
        const result = toCSV([{'first name': 'Anna'}]);

        expect(result).toEqual('first name\n"Anna"\n');
    });

    test("Пустой ключ недопустим", () => {
        expect(() => toCSV([{'': 1}])).toThrow(TypeError)
    });

    test("Ключ с запятой недопустим", () => {
        expect(() => toCSV([{'a,b': 1}])).toThrow(TypeError)
    });

    test("Ключ с кавычками недопустим", () => {
        expect(() => toCSV([{'a"b': 1}])).toThrow(TypeError)
    });

    test("Ключ с обратным слэшем недопустим", () => {
        expect(() => toCSV([{'a\\b': 1}])).toThrow(TypeError)
    });

    test("Ключ с переносом строки недопустим", () => {
        expect(() => toCSV([{'a\nb': 1}])).toThrow(TypeError)
    });

    test("Ключ с возвратом каретки недопустим", () => {
        expect(() => toCSV([{'a\rb': 1}])).toThrow(TypeError)
    });
});


describe("Тесты на выброс ошибок функции toCSV", () => {
    test("Должна выбросить ошибку, если аргумент строка", () => {
        expect(() => toCSV("x")).toThrow(TypeError)
    });

    test("Должна выбросить ошибку, если аргумент число", () => {
        expect(() => toCSV(123)).toThrow(TypeError)
    });

    test("Должна выбросить ошибку, если аргумент null", () => {
        expect(() => toCSV(null)).toThrow(TypeError)
    });

    test("Должна выбросить ошибку, если аргумент undefined", () => {
        expect(() => toCSV(undefined)).toThrow(TypeError)
    });

    test("Должна выбросить ошибку, если аргумент объект", () => {
        expect(() => toCSV({})).toThrow(TypeError)
    });

    test("Должна выбросить ошибку, если значение объект", () => {
        expect(() => toCSV([{a: {}}])).toThrow(TypeError)
    });

    test("Должна выбросить ошибку, если значение массив", () => {
        expect(() => toCSV([{a: []}])).toThrow(TypeError)
    });
});