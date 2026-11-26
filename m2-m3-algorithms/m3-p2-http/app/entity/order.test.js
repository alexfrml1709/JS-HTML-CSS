import { describe, test, expect } from "bun:test";
import { createOrder } from "./order";
import { OrderValidationError } from "./validator";


describe("Тесты функции createOrder", () => {
    test("Должна обрабатывать валидные данные", () => {
        const data = {id: "3", customer: "Алекс", amount: "3000", isPaid: "true", status: "new", review: "random text"};
        const result = createOrder(data);

        expect(result).toEqual({id: 3, customer: "Алекс", amount: 3000, isPaid: true, status: "new", review: "random text"});
    });

    test("Должна отбрасывать лишние ключи", () => {
        const data = {id: "3", bla: "blabla"};
        const result = createOrder(data);

        expect(result).toEqual({id: 3});
    });

    test("Должна работать с пустым объектом по умолчанию, если data не передана", () => {
        const result = createOrder();

        expect(result).toEqual({});
    });

    test("Не должна мутировать исходный объект", () => {
        const data = { id: "5", amount: "1000" };
        const dataSnapshot = { ...data };

        createOrder(data);
        expect(data).toEqual(dataSnapshot);
    });

    test("Должна выбрасывать ошибку при передаче невалидных данных", () => {
        const data = {id: "wrongId"};

        expect(() => createOrder(data)).toThrow(OrderValidationError);
    });

    test("Должна выбрасывать ошибку при передаче невалидного статуса в status", () => {
        const data = {status: "wrongStatus"};

        expect(() => createOrder(data)).toThrow(OrderValidationError);
    });
});