function tryModulo() {
    return 10 % 5;
}

const testArray = [
    { name: 'cool' },
    { name: 'cooler' },
    { name: 'hotty' },
    { name: 'hotty' },
    { name: 'hotty' },
    { name: 'hotty' },
    { name: 'hotty' },
    { name: 'hotty' },
    { name: 'hotty' },
    { name: 'hotty' },
    { name: 'hotty' },
    { name: 'hotty' },
    { name: 'hotty' },
    { name: 'hotty' },
    { name: 'hotty' },
    { name: 'hotty' },
    { name: 'hotty' },
    { name: 'hotty' },
    { name: 'hotty' },
    { name: 'hotty' },
]
function TestOutput() {
    let output = [];
    let rowIndex = 0;
    for (let i = 0; i < testArray.length; i++) {
        if (i === 0) {
            output.push([testArray[i]])
        }
        else if (i % 5 === 0) {
            output.push([testArray[i]]);
            rowIndex++
        } else {
            output[rowIndex].push(testArray[i]);
        }
    }
    return output;
}

console.log(TestOutput());
