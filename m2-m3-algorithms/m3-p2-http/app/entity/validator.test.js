import { test, describe, expect } from "bun:test";
import { validateId, validateCustomer, validateAmount, validateIsPaid, validateStatus, validateReview } from "./validator";
import { OrderValidationError } from "./validator";


describe("Тесты валидаторов", () => {
    describe("Тесты validateId", () => {
        test("Должна обрабатывать валидные ID", () => {
            expect(() => validateId(1)).not.toThrow();
            expect(() => validateId("123")).not.toThrow();
            expect(() => validateId(9999)).not.toThrow();
        });

        test("Должна выбрасывать ошибку для невалидных ID", () => {
            const invalidValues = [0, -1, 3.5, "3.5", "abc", null, undefined, NaN, Infinity];
            
            invalidValues.forEach(raw => {
                expect(() => validateId(raw)).toThrow(OrderValidationError);
            });
        });
    });


    describe("Тесты validateCustomer", () => {
        test("Должна обрабатывать непустые строки и обрезать пробелы", () => {
            expect(() => validateCustomer("Alex S")).not.toThrow();
            expect(() => validateCustomer("  Alex S  ")).not.toThrow();
        });

        test("Должна выбрасывать ошибку для пустых значений и нестроковых типов данных", () => {
            const invalidValues = ["", "   ", null, undefined, 123, true, {}];
            
            invalidValues.forEach(raw => {
                expect(() => validateCustomer(raw)).toThrow(OrderValidationError);
            });
        });
    });

    
    describe("Тесты validateAmount", () => {
        test("Должна обрабатывать положительные числа и дробные суммы", () => {
            expect(() => validateAmount(100)).not.toThrow();
            expect(() => validateAmount("99.90")).not.toThrow();
            expect(() => validateAmount(0.01)).not.toThrow();
        });

        test("Должна выбрасывать ошибку для нуля, отрицательных сумм и некорректных типов данных", () => {
            const invalidValues = [0, -50, "-10.5", "abc", null, undefined, NaN, Infinity];
            
            invalidValues.forEach(val => {
                expect(() => validateAmount(val)).toThrow(OrderValidationError);
            });
        });
    });


    describe("Тесты validateIsPaid", () => {
        test("Должна корректно нормализовать значения в булевый тип", () => {
            expect(validateIsPaid(true)).toBe(true);
            expect(validateIsPaid("true")).toBe(true);
            expect(validateIsPaid(false)).toBe(false);
            expect(validateIsPaid("false")).toBe(false);
        });

        test("Должна выбрасывать ошибку для некорректных и строк и типов данных", () => {
            const invalidValues = ["yes", "no", 1, 0, null, undefined, ""];
            
            invalidValues.forEach(val => {
                expect(() => validateIsPaid(val)).toThrow(OrderValidationError);
            });
        });
    });


    describe("Тесты validateStatus", () => {
        test("Должна обрабатывать разрешенные статусы", () => {
            expect(() => validateStatus("new")).not.toThrow();
            expect(() => validateStatus("completed")).not.toThrow();
            expect(() => validateStatus("canceled")).not.toThrow();
        });

        test("Должна выбрасывать ошибку для неизвестных статусов и пустых значений", () => {
            const invalidValues = ["archived", "pending", "", null, undefined, 123];
            
            invalidValues.forEach(val => {
                expect(() => validateStatus(val)).toThrow(OrderValidationError);
            });
        });
    });


    describe("Тесты validateReview", () => {
        test("Должна возвращать undefined для отсутствующих или пустых отзывов", () => {
            expect(validateReview(undefined)).toBeUndefined();
            expect(validateReview(null)).toBeUndefined();
            expect(validateReview("")).toBeUndefined();
        });

        test("Должна возвращать очищенную от пробелов строку для валидного отзыва", () => {
            expect(validateReview("  Hello!  ")).toBe("Hello!");
            expect(validateReview("Hello world")).toBe("Hello world");
        });

        test("Должна выбрасывать ошибку для нестроковых типов данных (кроме null/undefined)", () => {
            const invalidValues = [123, true, {}, []];
            
            invalidValues.forEach(val => {
                expect(() => validateReview(val)).toThrow(OrderValidationError);
            });
        });
    });
});