import { defineStore } from 'pinia'
import { doc } from 'firebase/firestore';
// You can name the return value of `defineStore()` anything you want,
// but it's best to use the name of the store and surround it with `use`
// and `Store` (e.g. `useUserStore`, `useCartStore`, `useProductStore`)
// the first argument is a unique id of the store across your application
const route = useRoute();
export const useScoreStore = defineStore('score', () => {
    const db = useFirestore();

    //State
    const scoresRef = computed(() => doc(db, `rooms/${route.params.id}/scores/scoreBoard`));
    const scoreData = useDocument(scoresRef);

    const sortedScoreData = computed(() => {
        if (!scoreData.value) return [];
        const scores = extractAndSortTeamScores(scoreData.value.teams);

        return scores;
    });

    const bingos = computed(() => {
        if (!scoreData.value) return [];
        return scoreData.value.bingos;
    })

    function extractAndSortTeamScores(teams) {
        // Create an array to hold the team scores
        const teamScores = Object.entries(teams)
            .map(([teamColor, teamData]) => {
                // Ensure the score exists, default to 0 if it's undefined
                return [teamColor, teamData.score || 0];
            });

        // Sort the array by the score in descending order
        const sortedTeamScores = teamScores.sort(([colorA, scoreA], [colorB, scoreB]) => {
            if (scoreB !== scoreA) {
                return scoreB - scoreA; // Sort by score
            }
            return colorA.localeCompare(colorB); // Tie-breaker by color
        });

        // Convert the sorted array back to an object
        return Object.fromEntries(sortedTeamScores);
    }
    return { scoreData, sortedScoreData, bingos };
})