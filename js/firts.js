// console.log("moe imya Alex");
// console.log("lybimiy cvet fioletoviy");
// console.log("Mne 28");


// console.log('Привет мир! Я Александр! И я начинаю свой путь');


// const smth = "qwe"
// const smth_2 = "rty"
// console.log(smth, smth_2)


// console.log(message);
// var message = 'Привет';


// const a = 10;
// const b = 5;
// alert(a + b);
// alert(a - b)
// alert(a * b)
// alert(a / b)
// alert(a % b)
// alert(a ** b)


// const name = "alex"
// const age = 28
// const pravda = true
// alert(`Menya zovut ${name}, tip: ${typeof  name};
// Mne ${age} let, tip: ${typeof age};
// Ya student: ${pravda}, tip:  ${typeof pravda};`)


// const word = 'JavaScript'
// alert(word.toUpperCase())
// const num = 123
// alert(num.toUpperCase()) //АпперКейс применим ко строкам, но не числам


// let age = prompt("ukaji vozrast");
// age = Number(age);
// alert(`sovershennoletniy: ${age >= 18}`);
// alert(`podrostok: ${age >= 12 && age < 18}`);
// alert(`pensioner: ${age >= 65}`);


// let temper = prompt("ukaji temperaturu");
// temper = Number(temper);
// let isRain = prompt("idet li dojd'?");
// let isRain_2 = isRain === "true";
// let isClaudy = prompt("segodnya oblachno?");
// let isClaudy_2 = isClaudy === "true";
// let mojno = (temper > 0 && temper < 35) && !isRain_2;
// alert(`Mojno li gulyat'? ${mojno}`);


// let temper = prompt("ukaji temperaturu");
// temper = Number(temper);
// let isRain = prompt("idet li dojd'?");
// let isRain_2 = isRain === "true";
// let isClaudy = prompt("segodnya oblachno?");
// let isClaudy_2 = isClaudy === "true";
// if (temper > 0 && temper < 35 && !isRain_2 && isClaudy_2){
//     alert("guliyat' mojno, no vozmojen dojd'...");
// } else if (temper > 0 && temper < 35 && !isRain_2) {
//     alert("guliyat' mojno");
// } else {
//     alert("idet dojd'")
// }


// let numb = Number(prompt("ukaji ocenku ot 0 do 100"));
// if (numb < 0 || numb > 100) console.log("nevernoe chislo");
// else if (numb >= 90) console.log("A");
// else if (numb >= 75) console.log("B");
// else if (numb >= 50) console.log("C");
// else console.log("D");


// let age = 20;
// let category = age >= 18 ? "vzrosl" : "reben"
// console.log(category);


// let score = 75;
// let grade = score >= 90 ? "A" : score >= 75 ? "B" : "C";
// console.log(grade);


// let a = Number(prompt("vvedite chislo"));
// let result = a % 2 === 0 ? "Chetnoe" : "Nechetnoe";
// console.log(result);


// const DEFAULT_SALARY = 300000;
// const WORK_DAYS_IN_MONTH = 22;

// const name = 'Иванов';

// const salaryRaw = null;
// const daysRaw = undefined;

// const salary = salaryRaw ?? DEFAULT_SALARY;
// const days = daysRaw ?? WORK_DAYS_IN_MONTH;

// const salaryPerDay = salary / WORK_DAYS_IN_MONTH;
// const daySalary = Math.round(salaryPerDay * days);

// console.log('Сотрудник: ' + name + ', начислено: ' + daySalary + ' тенге');


// function changeValues(num, obj) {
//     num = num + 10;
//     obj.value = obj.value + 10;
// }

// let a = 5;
// let b = { value: 5 };

// changeValues(a, b);

// console.log('a:', a);
// console.log('b.value:', b.value);


// function cb() {
//   console.log("Здесь выполняется работа колбека!");
// }

// function doSomething(callback) {
// console.log('Предварительная работа до вызова колбэка');
//   callback();
//   console.log('Можно что то делать и после вызова колбэка');
// }

// doSomething(cb);


// function repeat(text, count) {
//     if (typeof text !== "string") {
//         throw new TypeError("text должен быть строкой")
//     }
    
//     if (typeof count !== "number") {
//         throw new TypeError("count должен быть числом")
//     }

//     if (count <= 0) {
//         throw new RangeError("count должен быть больше 0");
        
//     }

//     console.log(text.repeat(count))
// };


// try {
//     repeat('JS', 3);
//     repeat(123, 3);
//     repeat('JS', 'abc');
//     repeat('JS', 0);
// } catch (error) {
//     if (error instanceof TypeError) {
//         console.log("TypeError:", error.message);
//     } else {
//         console.log("RangeError:", error.message)
//     }
// }


console.log('A'.charCodeAt(0));
console.log(String.fromCodePoint(65));