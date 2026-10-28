const department = {
  name: 'Маркетинг',
  employees: ['Иванов', 'Петрова', 'Сидоров', 'Козлова'],
};

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

const calendar = {
  month: 'Июнь 2026',
  workDaysInMonth: 22,
};

const taxConfig = {
  OPV_RATE: 0.10,
  IPN_RATE: 0.10,
};


function calcAccrued(salary, workDays, totalWorkDays) {
  return Math.round(salary * workDays / totalWorkDays)
};


function calcOpv(accrued) {
  return Math.round(accrued * taxConfig.OPV_RATE)
};


function calcIpn(accrued, opv) {
  return Math.round((accrued - opv) * taxConfig.IPN_RATE)
};


function calcEmployee(name, salary, workedDays, totalWorkDays) {
  const accrued = calcAccrued(salary, workedDays, totalWorkDays)
  const opv = calcOpv(accrued)
  const ipn = calcIpn(accrued, opv)
  const net = accrued - opv - ipn
  return {name, salary, workedDays, accrued, opv, ipn, net};
};


function calcDepartment(department, salaries, workDays, calendar) {
  const employees = [];
  const totals = {
    totalAccrued: 0,
    totalOpv: 0,
    totalIpn: 0,
    totalNet: 0,
    fullMonthCount: 0
  };

  for (const employee of department.employees) {
    const employeeData = calcEmployee(employee, salaries[employee], workDays[employee], calendar.workDaysInMonth);
    employees.push(calcEmployee(employee, salaries[employee], workDays[employee], calendar.workDaysInMonth));
    totals.totalAccrued += employeeData.accrued
    totals.totalOpv += employeeData.opv
    totals.totalIpn += employeeData.ipn
    totals.totalNet += employeeData.net
    if (workDays[employee] >= 22) {
      totals.fullMonthCount += 1}
  }

  return {
    name: department.name,
    month: calendar.month,
    employees,
    totals,
  }
};


function formatMoney(num) {
  const stringNum = String(num);
  let formatResult = '';
  let count = 0;

  for (let i = stringNum.length - 1; i >= 0; i--) {
    formatResult = stringNum[i] + formatResult;
    count++;

    if (count % 3 === 0 && i !== 0) {
      formatResult = ' ' + formatResult;
    }
  }

  return formatResult + " " + "тг.";
}


const COLUMNS = [
  ['name',    'Сотрудник'],
  ['salary',  'Оклад'],
  ['days',    'Дней'],
  ['accrued', 'Начислено'],
  ['held',    'Удержано'],
  ['net',     'На руки'],
];


function padRight(text, width) {
  let result = String(text)
  while (result.length < width) {
    result += ".";
  }

  return result;
}


function padLeft(text, width) {
  let result = String(text)
  while (result.length < width) {
    result = "." + result;
  }

  return result;
}


function calcColumnWidths(employees) {
  const widths = {};

  for (const [key, label] of COLUMNS) {
    widths[key] = label.length;
  }

  for (const employee of employees) {
    for (const [key] of COLUMNS) {
      let value = employee[key];
      if (key === "salary" || key === "accrued" || key === "held" || key === "net") {
        value = formatMoney(value);
      } else {
        value = String(value);
      }

      if (value.length > widths[key]) {
        widths[key] = value.length;
      }
    }
  }

  return widths;
}


function renderToText(departmentResult) {
  const employees = departmentResult.employees;
  const widths = calcColumnWidths(employees);

  let header = COLUMNS
    .map(([key, label]) => padRight(label, widths[key]))
    .join(" | ");

  let separator = COLUMNS
    .map(([key]) => "-".repeat(widths[key]))
    .join("-|-");

  let rows = employees.map(emp => {
    return COLUMNS.map(([key]) => {
      let value = emp[key];

      if (key === "salary" || key === "accrued" || key === "held" || key === "net") {
        return padLeft(formatMoney(value), widths[key]);
      }

      if (key === "days") {
        return padLeft(String(value), widths[key]);
      }

      if (key === "name") {
        return padRight(value, widths[key]);
      }
    }).join(" | ");
  }).join("\n");

  const total = departmentResult.totals;

  let footer =
    "\n" +
    `Фонд: ${formatMoney(total.totalAccrued)}\n` +
    `ОПВ: ${formatMoney(total.totalOpv)}\n` +
    `ИПН: ${formatMoney(total.totalIpn)}\n` +
    `К выплате: ${formatMoney(total.totalNet)}\n` +
    `Полный месяц: ${total.fullMonthCount}`;

  return header + "\n" + separator + "\n" + rows + footer;
}


function main() {
    const departmentResult = calcDepartment(department, salaries, workDays, calendar);
    const resultStr = renderToText(departmentResult);
    console.log(resultStr);
}

main();