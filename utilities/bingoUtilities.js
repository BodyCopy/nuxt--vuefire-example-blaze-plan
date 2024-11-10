import seedrandom from 'seedrandom';
import { v4 as uuidv4 } from 'uuid';

// Analytics can only be retrieved on the client
export function generateRandomSeed() {
    let randomSeed = uuidv4();
    console.log(randomSeed);
    return randomSeed;
}
export function getRandomItemsWithSeed(items, seed, count) {
    // Initialize the seeded random generator
    const rng = seedrandom(seed);

    // Create a copy of the items array
    const itemsCopy = [...items];

    // Shuffle the array using the seeded random generator
    for (let i = itemsCopy.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [itemsCopy[i], itemsCopy[j]] = [itemsCopy[j], itemsCopy[i]];
    }

    // Return the first 'count' items from the shuffled array
    return itemsCopy.slice(0, count);
}

export function checkBingo(bingos, bingoItems, playerColor, index) {
    const bingoLines = (() => { return getBingoLines() })();
    const items = bingoItems;
    let scoreBingos = JSON.parse(JSON.stringify(bingos));

    let bingoVal = '';

    if (bingoItems[`item-${index}`].complete === '') {
        bingoVal = playerColor;
    }
    // Update the local state of the item
    items[`item-${index}`].complete = bingoVal;  // Update the completion state locally

    // Iterate over all possible bingo lines (rows, columns, diagonals)
    for (const [bingoIndex, line] of bingoLines.entries()) {
        const firstItemColor = items[`item-${line[0]}`].complete;

        // Check if all items in the line have the same non-empty color
        const isComplete = firstItemColor !== '' && line.every(i => items[`item-${i}`].complete === firstItemColor);
        // console.log('COMPLETE', isComplete, scoreBingos[bingoIndex]);

        // If the line is complete and not yet marked, mark it
        if (isComplete && !(scoreBingos[bingoIndex]?.[playerColor])) {
            scoreBingos[bingoIndex] = { ...(scoreBingos[bingoIndex] || {}), [playerColor]: true };
        }
        // If the line was marked but is now incomplete, unmark it
        else if (!isComplete && scoreBingos[bingoIndex]?.[playerColor]) {
            console.log('UNMARK');
            scoreBingos[bingoIndex] = { ...(scoreBingos[bingoIndex] || {}), [playerColor]: false };
        }
    }
    return { scoreBingos, bingoVal };

}
export function sortBingoItems(bingoItems) {
    const orderedItems = Object.keys(bingoItems)
        .sort((a, b) => {
            const numA = parseInt(a.replace('item-', ''), 10);
            const numB = parseInt(b.replace('item-', ''), 10);
            return numA - numB;
        })
        .map(key => bingoItems[key]);
    return orderedItems;
}

function getBingoLines() {
    const lines = [];

    // Rows (indices 0-4)
    for (let row = 0; row < 5; row++) {
        const rowIndices = Array.from({ length: 5 }, (_, i) => row * 5 + i);
        lines.push(rowIndices);
    }

    // Columns (indices 5-9)
    for (let col = 0; col < 5; col++) {
        const colIndices = Array.from({ length: 5 }, (_, i) => i * 5 + col);
        lines.push(colIndices);
    }

    // Diagonal 1 (index 10)
    const diagonal1 = [0, 6, 12, 18, 24];
    lines.push(diagonal1);

    // Diagonal 2 (index 11)
    const diagonal2 = [4, 8, 12, 16, 20];
    lines.push(diagonal2);

    return lines;
}
