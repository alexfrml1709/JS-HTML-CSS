import { test, expect, mock, beforeEach } from 'bun:test';
import { describe } from 'node:test';
import { setOrdersPath } from './order-repo.js';

let orders = [];
let err = null;
let savedCalls = [];

const loadFromFile = mock(() => {
    if (err) {
        throw err;
    }

    return orders;
});

const saveToFile = mock((path, nextOrders) => {
    if (err) {
        throw err;
    }

    savedCalls.push({path, nextOrders});
    orders = nextOrders;
});

mock.module('../../infra/file-storage', () => ({loadFromFile, saveToFile}));

const { getOrder, listOrders, addOrder, updateOrder, deleteOrder} = await import('./order-repo');

beforeEach(() => {
    orders = [];
    err = null;
    savedCalls = [];
    loadFromFile.mockClear();
    saveToFile.mockClear();
    setOrdersPath('data/orders.csv');
});

describe('Тесты функции getOrder', () => {
    test('Должна возвращать заказ по id и не трогать файл записи', () => {
        orders = [{id: 1, total: 100}]

        expect(getOrder(1)).toEqual({ id: 1, total: 100 });
        expect(saveToFile).not.toHaveBeenCalled();
    });
    
    test('Должна возвращать null, если id нет или файл не найден', () => {
        expect(getOrder(99)).toBeNull();
    
        const enoent = new Error('not found');
        enoent.code = 'ENOENT';
        err = enoent;
        expect(getOrder(1)).toBeNull();
    });
});


describe('Тесты функции listOrders', () => {
    test('Должна возвращать список заказов из базы заказов', () => {
        orders = [{id: 1, total: 100}, {id: 2, total: 200}];
        const result = listOrders();

        expect(result).toEqual([{id: 1, total: 100}, {id: 2, total: 200}]);
        expect(loadFromFile).toHaveBeenCalledTimes(1);
        expect(saveToFile).not.toHaveBeenCalled();
    });

    test('Должна возвращать пустой массив при ошибке ENOENT', () => {
        const enoent = new Error('Not found');
        enoent.code = 'ENOENT';
        err = enoent;

        expect(listOrders()).toEqual([]);
        expect(saveToFile).not.toHaveBeenCalled();
    });
});


describe('Тесты функции addOrder', () => {
    test('Должна назначить id = 1 для пустого списка и сохранять заказ', () => {
        const created = addOrder({item: 'book', price: 500});

        expect(created).toEqual({id: 1, item: 'book', price: 500});
        expect(saveToFile).toHaveBeenCalledTimes(1);
        expect(savedCalls[0].nextOrders).toEqual([{id: 1, item: 'book', price: 500}]);
    });

    test('Должна вычислить maxId + 1, не мутировать исходный массив и не дать перезаписать id', () => {
        const initial = [{id: 2, item: 'pen'}, {id: 7, item: 'desk'}];
        orders = initial;
        const created = addOrder({ id: 999, item: 'chair' });

        expect(created).toEqual({id: 8, item: 'chair'});
        expect(initial).toEqual([{id: 2, item: 'pen'}, {id: 7, item: 'desk'}]);
        expect(savedCalls[0].nextOrders).toEqual([{id: 2, item: 'pen'}, {id: 7, item: 'desk'}, {id: 8, item: 'chair'}]);
    });
});


describe('Тесты функции updateOrder', () => {
    test('Должна обновлять заказ без мутации исходных данных и сохранять список', () => {
        const initial = [{id: 1, status: 'new', total: 100}, {id: 2, status: 'paid', total: 300}];
        orders = initial;
        const updated = updateOrder(1, {id: 77, status: 'shipped'});

        expect(updated).toEqual({id: 1, status: 'shipped', total: 100});
        expect(initial[0]).toEqual({id: 1, status: 'new', total: 100});
        expect(saveToFile).toHaveBeenCalledTimes(1);
        expect(savedCalls[0].nextOrders[0]).toEqual({id: 1, status: 'shipped', total: 100});
    });

    test('Должна возвращать null и не вызывать saveToFile, если заказ не найден', () => {
        orders = [{id: 1, status: 'new'}];
        const result = updateOrder(404, {status: 'done'});

        expect(result).toBeNull();
        expect(saveToFile).not.toHaveBeenCalled();
    });
});


describe('Тесты функции deleteOrder', () => {
    test('Должна удалять заказ без мутации исходного массива и возвращать true', () => {
        const initial = [{id: 1, total: 100}, {id: 2, total: 200}];
        orders = initial;
        const deleted = deleteOrder(1);

        expect(deleted).toBe(true);
        expect(initial).toEqual([{id: 1, total: 100}, {id: 2, total: 200}]);
        expect(saveToFile).toHaveBeenCalledTimes(1);
        expect(savedCalls[0].nextOrders).toEqual([{id: 2, total: 200}]);
    });

    test('Должна возвращать false и не вызывать saveToFile, если заказ не найден', () => {
        orders = [{id: 1, total: 100}];
        const deleted = deleteOrder(999);

        expect(deleted).toBe(false);
        expect(saveToFile).not.toHaveBeenCalled();
    });
});