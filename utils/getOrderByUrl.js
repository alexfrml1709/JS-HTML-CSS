import { getQueryParams } from "./getQueryParams";
import { fromCSV } from "./fromCSV";
import { groupBy } from "./groupBy";


/**
 * Возвращает искомый, по URL-ссылке, заказ из CSV-базы
 * @param {string} url - ссылка с искомым id заказа
 * @param {string} ordersDatabase - общая база заказов в виде CSV-таблицы
 * @returns {string} искомый заказ в виде JSON-строки или null, если не найден
 * @example
 *     getOrderByUrl("https://store.example.com/api/order?id=103", `id,customer,amount,isPaid,status,review
101,"Иван",3500,true,"completed","Отличный сервис!\\nКурьеру спасибо."
102,"Ольга",0,false,"pending","Жду подтверждения"
103,"Анна",7200,true,"completed","Всё в срок"
104,"Денис",1500,false,"canceled","Передумал.\\nПрошу вернуть средства."`
); // '{"id":103,"customer":"Анна","amount":7200,"isPaid":true,"status":"completed","review":"Всё в срок"}'
 */


export function getOrderByUrl(url, ordersDatabase) {
    const getQueryParamsResult = getQueryParams(url);
    const targetedId = getQueryParamsResult["id"];

    if (targetedId === undefined) {
        return null;
    }

    const orders = ordersDatabase;
    const parsedOrders = fromCSV(orders);
    const groupedById = groupBy(parsedOrders, "id");

    if (!(targetedId in groupedById)) {
        return null;
    }

    const result = groupedById[targetedId][0];

    return JSON.stringify(result);
}