import { OrderValidationError, validateAmount, validateCustomer, validateId, validateIsPaid, validateReview, validateStatus } from "./validator.js";


/**
 * Функция нормализует и очищает исходный объект (не мутирует исходный объект)
 * @param {Object} data - исходный объект для нормализации 
 * @returns {Object} нормализированный объект
 * @throws {OrderValidationError} если исходные данные некорректны для какого-либо валидатора
 * @example
 *      createOrder({id: "3", customer: "Алекс", amount: "3000", isPaid: "true", status: "new", review: "random text"}); // {id: 3, customer: "Алекс", amount: 3000, isPaid: true, status: "new", review: "random text"}
 */


export function createOrder(data = {}) {
    let result = {};

    for (let key in data) {
        if (key === "id") {
            result[key] = validateId(data[key]);
        } else if (key === "customer") {
            result[key] = validateCustomer(data[key]);
        } else if (key === "amount") {
            result[key] = validateAmount(data[key]);
        } else if (key === "isPaid") {
            result[key] = validateIsPaid(data[key]);
        } else if (key === "status") {
            result[key] = validateStatus(data[key]);
        } else if (key === "review") {
            result[key] = validateReview(data[key]);
        }
    }

    return result;
}