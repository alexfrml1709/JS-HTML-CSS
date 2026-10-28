export function pyram(k, total) {
    let result = ""
    let width = 2 * total + 1;

    if (k === 0) {
        return ""
    }

    for (let i = 0; i < k; i++) {
        let sum = "";   
        let symbols = 2 * i + 1;
        let dots = (width - symbols) / 2;

        sum += ".".repeat(dots);
        sum += "$".repeat(symbols);
        sum += ".".repeat(dots) + "\n";
        result += sum   
    }
    return result;
}

// console.log(pyram(4, 50));

export function pine(height) {
    if (height < 1) {
        return ""
    }

    let sum = "";

    for (let i = 2; i <= height + 1; i++) {
        sum += pyram(i, height);
    }

    return sum + ".".repeat(height) + "|" + ".".repeat(height) 
}

console.log(pine(2));