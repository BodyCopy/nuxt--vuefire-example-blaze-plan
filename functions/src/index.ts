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
    .onUpdate(async (change, context) => {
        const { roomId } = context.params;
        const newValue = change.after.data();
        const previousValue = change.before.data();
        console.log(`room ${roomId} written: ${newValue}`)
        if (!newValue || !previousValue) {
            return null;
        }

        // Compare and check if the room expiry needs to be updated
        const expiryTime = newValue.createdOn;
        if (expiryTime === previousValue.expiry) {
            return null; // No changes, so exit early
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
