import {pyram} from "./main";

describe("pyram", () => {
    test("Тест с обычными числами", () => {
        expect(pyram(2, 3)).toBe(`...$...\n..$$$..\n`);
    });

    test("Тест с 0", () => {
        expect(pyram(0)).toBe("")
    });

});


import {pine} from "./main";

describe("pine", () => {
    test("Тест с обычным числом", () => {
        expect(pine(3)).toBe(`...$...\n..$$$..\n...$...\n..$$$..\n.$$$$$.\n...$...\n..$$$..\n.$$$$$.\n$$$$$$$\n...|...`)
    });

    test("Тест с числом 0", () => {
        expect(pine(0)).toBe("")
    });

    test("Тест с числом 1", () => {
        expect(pine(1)).toBe(".$.\n$$$\n.|.")
    })

    test("Тест с числом 2", () => {
        expect(pine(2)).toBe("..$..\n.$$$.\n..$..\n.$$$.\n$$$$$\n..|..")
    })
});