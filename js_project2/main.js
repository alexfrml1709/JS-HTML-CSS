    const employees = ['Иванов', 'Петрова', 'Сидоров', 'Козлова'];

const salaries = {
  Иванов: 500000,
  Петрова: 450000,
  Сидоров: 480000,
  Козлова: 520000,
};

const workDays = {
  Иванов: 20,
  Петрова: 18,
  Сидоров: 22,
  Козлова: 20,
};

const WORK_DAYS_IN_MONTH = 22;
const OPV_RATE = 0.10;
const IPN_RATE = 0.10;

let totalPayroll = 0;
let totalOPV = 0;
let totalIPN = 0;
let totalNet = 0;
let fullMonthCount = 0;

console.log(`---------------------------------------------------------
Сотрудник | Начислено |  ОПВ  |  ИПН  | На руки`);

for (const surName of employees) {
    const grossSalary = Math.round((salaries[surName] / WORK_DAYS_IN_MONTH) * workDays[surName]);
    const opv = Math.round(grossSalary * OPV_RATE);
    const inp = Math.round((grossSalary - opv) * IPN_RATE);
    const netSalary = grossSalary - opv - inp;
    totalPayroll += grossSalary;
    totalOPV += opv;
    totalIPN += inp;
    totalNet += netSalary;
    if (workDays[surName] >= WORK_DAYS_IN_MONTH) {
        fullMonthCount += 1;
    }
    if (surName.length === 6) {
        console.log(`${surName}    |  ${grossSalary}   | ${opv} | ${inp} | ${netSalary}`);
    }
    else {
        console.log(`${surName}   |  ${grossSalary}   | ${opv} | ${inp} | ${netSalary}`);
    }
}

console.log(`---------------------------------------------------------
Общий фонд оплаты: ${totalPayroll} тг.
Всего удержано ОПВ: ${totalOPV} тг.
Всего удержано ИПН: ${totalIPN} тг.
Всего к выплате: ${totalNet} тг.
Количество отрудников, отработавших полный месяц: ${fullMonthCount}
---------------------------------------------------------`);