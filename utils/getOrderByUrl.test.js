import { describe, test, expect } from "bun:test";
import { getOrderByUrl } from "./getOrderByUrl";


describe("Тесты функции getOrderByUrl", () => {
    test("Должна вернуть искомый заказ", () => {
        const result = getOrderByUrl('https://store.example.com/api/order?id=103', `id,customer,amount,isPaid,status,review
101,"Иван",3500,true,"completed","Отличный сервис!\\nКурьеру спасибо."
102,"Ольга",0,false,"pending","Жду подтверждения"
103,"Анна",7200,true,"completed","Всё в срок"
104,"Денис",1500,false,"canceled","Передумал.\\nПрошу вернуть средства."`);

        expect(result).toEqual('{"id":103,"customer":"Анна","amount":7200,"isPaid":true,"status":"completed","review":"Всё в срок"}');
    });

    test("Должна вернуть null, если в ссылке нет поля с ключом-значением", () => {
        const result = getOrderByUrl('https://store.example.com/api/order', `id,customer,amount,isPaid,status,review
101,"Иван",3500,true,"completed","Отличный сервис!\\nКурьеру спасибо."`);

        expect(result).toEqual(null);
    });

    test("Должна вернуть null, если в базе заказов нет искомого заказа", () => {
        const result = getOrderByUrl('https://store.example.com/api/order?id=103', `id,customer,amount,isPaid,status,review
101,"Иван",3500,true,"completed","Отличный сервис!\\nКурьеру спасибо."
102,"Ольга",0,false,"pending","Жду подтверждения"`);

        expect(result).toEqual(null);
    });
});