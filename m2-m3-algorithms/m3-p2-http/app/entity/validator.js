export class OrderValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'OrderValidationError';
    }
}


export const ORDER_STATUSES = ['new', 'completed', 'canceled'];


/**
 * Функция валидирует и приводит к числу исходный ID
 * @param {*} raw - исходный id для валидации
 * @returns {number} валидный целый положительный ID
 * @throws {OrderValidationError} - если raw не является целым числом больше нуля
 */


export function validateId(raw) {
    const numRaw = Number(raw);

    if (Number.isNaN(numRaw)) {
        throw new OrderValidationError("Некорректный ID заказа");
    }

    if (!Number.isFinite(numRaw)) {
        throw new OrderValidationError("Некорректный ID заказа");
    }

    if (!Number.isInteger(numRaw)) {
        throw new OrderValidationError("Некорректный ID заказа");
    }

    if (numRaw <= 0) {
        throw new OrderValidationError("Некорректный ID заказа");
    }

    return numRaw;
}


/**
 * Функция валидирует и очищает от лишних пробелов исходное имя пользователя
 * @param {*} raw - исходная строка для валидации
 * @returns {string} строка без лишних пробелов по краям
 * @throws {OrderValidationError} - если raw не строка или пустая строка
 */


export function validateCustomer(raw) {
    if (typeof raw !== "string") {
        throw new OrderValidationError("Укажите корректное имя клиента");
    }

    const trimmedRaw = raw.trim();

    if (trimmedRaw === "") {
        throw new OrderValidationError("Укажите корректное имя клиента");
    }

    return trimmedRaw;
}


/**
 * Функция валидирует и приводит к числу сумму заказа
 * @param {*} raw - исходные данные для валидации
 * @returns {number} положительное число суммы заказа
 * @throws {OrderValidationError} - если raw не является числом больше нуля
 */


export function validateAmount(raw) {
    const numRaw = Number(raw);

    if (Number.isNaN(numRaw)) {
        throw new OrderValidationError("Сумма заказа должна быть положительным числом");
    }

    if (!Number.isFinite(numRaw)) {
        throw new OrderValidationError("Сумма заказа должна быть положительным числом");
    }

    if (numRaw <= 0) {
        throw new OrderValidationError("Сумма заказа должна быть положительным числом");
    }

    return numRaw;
}


/**
 * Функция валидирует и приводит к булеву значению статус оплаты заказа
 * @param {*} raw - исходные данные для валидации
 * @returns {boolean} булево значение статуса оплаты заказа
 * @throws {OrderValidationError} - если raw не является "true", "false" или булевым значением
 */


export function validateIsPaid(raw) {
    if (raw === "true" || raw === true) {
        return true;
    }

    if (raw === "false" || raw === false) {
        return false;
    }

    if (typeof raw !== "boolean") {
        throw new OrderValidationError("Некорректное значение оплаты");
    }
}



/**
 * Функция проверяет статус заказа на разрешенные значения
 * @param {*} raw - исходные данные для проверки
 * @returns {string} валидный статус заказа
 * @throws {OrderValidationError} - если raw не найден в ORDER_STATUSES
 */


export function validateStatus(raw) {
    if (!ORDER_STATUSES.includes(raw)) {
        throw new OrderValidationError("Некорректный статус заказа");
    }

    return raw;
}


/**
 * Функция валидирует и очищает от лишних пробелов отзыв к заказу
 * @param {*} raw - исходные данные для валидации
 * @returns {string} очищенный от лишних пробелов отзыв
 * @throws {OrderValidationError} - если тип данных raw отличается от строкового
 */


export function validateReview(raw) {
    if (raw === undefined || raw === null || raw === "") {
        return undefined;
    } else if (typeof raw === "string") {
        return raw.trim();
    } else {
        throw new OrderValidationError("Отзыв должен быть строкой");
    }
}