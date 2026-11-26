import { saveToFile, loadFromFile } from "../../infra/file-storage";


let ordersPath = 'data/orders.csv';

export function getOrdersPath() {
  return ordersPath;
}

export function setOrdersPath(customPath) {
  ordersPath = customPath;
}


export function getOrder(id) {
    let orders = [];

    try {
        orders = loadFromFile(getOrdersPath());
    } catch (error) {
        if (error?.code !== "ENOENT") {
            throw error;
        }
    }

    for (let i = 0; i < orders.length; i++) {
        if (orders[i].id === id) {
            return orders[i];
        } 
    }

    return null;
}


export function listOrders() {
    let orders = [];

    try {
        orders = loadFromFile(getOrdersPath());
    } catch (error) {
        if (error?.code !== "ENOENT") {
            throw error;
        }
    }

    return orders;
}


export function addOrder(data) {
    let orders = [];

    try {
        orders = loadFromFile(getOrdersPath());
    } catch (error) {
        if (error?.code !== "ENOENT") {
            throw error;
        }
    }

    let newOrder = {};

    if (orders.length === 0) {
        newOrder.id = 1;
    } else {
        let maxIdValue = 0;

        for (let i = 0; i < orders.length; i++) {
            if (orders[i].id > maxIdValue) {
                maxIdValue = orders[i].id;
            }
        }

        newOrder.id = maxIdValue + 1;
    }

    for (let key in data) {
        if (key !== "id") {
            newOrder[key] = data[key];
        }
    }

    let ordersToSave = [];

    for (let i = 0; i < orders.length; i++) {
        ordersToSave.push(orders[i]);
    }

    ordersToSave.push(newOrder);
    saveToFile(getOrdersPath(), ordersToSave);

    return newOrder;
}


export function updateOrder(id, updates) {
    let orders = [];

    try {
        orders = loadFromFile(getOrdersPath());
    } catch (error) {
        if (error?.code !== "ENOENT") {
            throw error;
        }
    }

    let updatedOrder = {};

    for (let i = 0; i < orders.length; i++) {
        if (orders[i].id === id) {
            for (let key in orders[i]) {
                updatedOrder[key] = orders[i][key];
            }

            for (let key in updates) {
                if (key !== "id") {
                    updatedOrder[key] = updates[key];
                }
            }

            let newOrdersList = [];

            for (let j = 0; j < orders.length; j++) {
                if (i !== j) {
                newOrdersList.push(orders[j]);
                } else {
                    newOrdersList.push(updatedOrder);
                }
            }

            saveToFile(getOrdersPath(), newOrdersList);
            return updatedOrder;
        }
    }

    return null;
}


export function deleteOrder(id) {
    let orders = [];

    try {
        orders = loadFromFile(getOrdersPath());
    } catch (error) {
        if (error?.code !== "ENOENT") {
            throw error;
        }
    }

    for (let i = 0; i < orders.length; i++) {
        if (orders[i].id === id) {
            let newOrdersList = [];
           
            for (let j = 0; j < orders.length; j++) {
                if (orders[j].id !== id) {
                    newOrdersList.push(orders[j]);
                }
            }
            
            saveToFile(getOrdersPath(), newOrdersList);
            return true;
        }
    }

    return false;
}











export function serOrdersPath(customPath) {
    return 0;
}