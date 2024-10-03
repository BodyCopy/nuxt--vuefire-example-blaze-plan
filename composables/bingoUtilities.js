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
