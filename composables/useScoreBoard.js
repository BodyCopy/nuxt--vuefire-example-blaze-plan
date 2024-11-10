import { updateDoc } from "firebase/firestore";

export function useScoreBoard() {
    //resetScore
    async function resetScore(scoreBoardRef, team) {
        // const scoreBoardRef = doc(db, `rooms/${roomId}/scores/scoreBoard`);
        const updatedDoc = await updateDoc(scoreBoardRef,
            {
                [`teams.${team}.score`]: 0
            }
        )
    }
    /*teams
        teams:{
        [color]:
            players:[],
            score: ##
        }
    */
    async function resetAllScores(scoreBoardRef, teams) {
        //teams should be the data from the scoreBoard document
        const resetScores = Object.fromEntries(Object.entries(teams).map(([key, value]) => [key, { ...value, score: 0 }]));
        const updatedDoc = await setDoc(scoreBoardRef,
            {
                resetScores
            },
            { merge: true }
        )
    }
    return { resetScore, resetAllScores };
}