let colors = [
    { color: 'red', available: true, selected: false },
    { color: 'orange', available: true, selected: false },
    { color: 'yellow', available: true, selected: false },
    { color: 'green', available: true, selected: true },
    { color: 'teal', available: true, selected: false },
    { color: 'blue', available: false, selected: false },
    { color: 'purple', available: true, selected: false },
    { color: 'pink', available: true, selected: false }
]

colors = colors.map((c) => { return { ...c, selected: false } });

let output = colors;
console.log(output);
