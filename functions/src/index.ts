/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// import { onRequest } from "firebase-functions/v2/https";
// import * as logger from "firebase-functions/logger";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

//the below was running infinitly
export const watchRoomUpdates = functions.firestore
    .document('rooms/{roomId}')
    .onCreate(async (snapshot, context) => {
        const { roomId } = context.params;
        const docData = snapshot.data();
        console.log(`room ${roomId} written: ${docData}`)
        if (!docData) {
            return null;
        }

        // Add X days to the current time in the server
        const newExpiry = admin.firestore.Timestamp.now().toDate();
        newExpiry.setDate(newExpiry.getDate() + 30); // Add 30 days as an example

        // Update the room with the new expiry time
        await db.collection('rooms').doc(roomId).update({
            expiry: admin.firestore.Timestamp.fromDate(newExpiry),
        });

        return null;
    });
