import seedrandom from 'seedrandom';
import { v4 as uuidv4 } from 'uuid';
export default (() => {

    function generateRandomSeed() {
        let randomSeed = uuidv4();
        console.log(randomSeed);

        return randomSeed;
    }

    function getRandomItemsWithSeed(items, seed, count) {
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

    function updateBingoCard(id, card) {
        let row = id[0];
        let column = id[1];
        let selectedItem = card[row][column];
        selectedItem.complete = !selectedItem.complete;
    }

    function checkBingo(card) {
        const size = card.length;

        // Check rows
        for (let row = 0; row < size; row++) {
            if (card[row].every(item => item.complete)) {
                card[row].map(item => item.bingo = true);
                console.log('row match');
                return true;
            }
        }

        // Check columns
        for (let col = 0; col < size; col++) {
            let allComplete = true;
            for (let row = 0; row < size; row++) {
                if (!card[row][col].complete) {
                    allComplete = false;
                    break;
                }
            }
            if (allComplete) {
                console.log('column match');
                return true;
            }
        }

        // Check first diagonal (top-left to bottom-right)
        let allCompleteDiagonal1 = true;
        for (let i = 0; i < size; i++) {
            if (!card[i][i].complete) {
                allCompleteDiagonal1 = false;
                break;
            }
        }

        // Check second diagonal (top-right to bottom-left)
        let allCompleteDiagonal2 = true;
        for (let i = 0; i < size; i++) {
            if (!card[i][size - i - 1].complete) {
                allCompleteDiagonal2 = false;
                break;
            }
        }

        // Return true if either diagonal is complete
        if (allCompleteDiagonal1 || allCompleteDiagonal2) {
            console.log('diagonal match');

            return true;
        }

        for (let col = 0; col < size; col++) {
            for (let row = 0; row < size; row++) {
                card[col][row].bingo = false;
            }
        }
        // No bingo found
        return false;
    }

    return {
        getRandomItemsWithSeed, generateRandomSeed, checkBingo
    }
})
