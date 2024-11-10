let colors = {
    red: { available: true, selected: false },
    orange: { available: true, selected: false },
    yellow: { available: true, selected: false },
    green: { available: true, selected: true },
    teal: { available: true, selected: false },
    blue: { available: false, selected: false },
    purple: { available: true, selected: false },
    pink: { available: true, selected: false }
}

for (let color in colors) {
    colors[color].selected = true;
}

const entriesColors = Object.fromEntries(Object.entries(colors).map(([key, val]) => [key, { ...val, selected: true, newProp: 'hello' }]));

console.log(entriesColors);
