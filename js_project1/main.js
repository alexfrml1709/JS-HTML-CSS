const OPV_RATE = 0.10;
const IPN_RATE = 0.10;
const BONUS_RATE = 0.15;
const BONUS_DAYS = 20;

const userName = prompt("Укажите имя сотрудника:");
const salary = Number(prompt("Укажите изначальную зарплату:"));
const days = Number(prompt("Укажите кол-во отработанных дней:"));

const bonus = days > BONUS_DAYS ? salary * BONUS_RATE : 0;
const grossSalary = bonus + salary;
const opvAmount = grossSalary * OPV_RATE;
const ipnAmount = grossSalary * IPN_RATE;
const netSalary = grossSalary - opvAmount - ipnAmount;

console.log(`Имя сотрудника: ${userName}
Начислено: ${salary} тг.
Отработано дней: ${days}
Премия (15%): ${bonus} тг.
База для удержания: ${grossSalary} тг.
----------------------------------
ОПВ (10%): ${opvAmount} тг.
ИПН (10%): ${ipnAmount} тг.
----------------------------------
На руки: ${netSalary} тг.`)