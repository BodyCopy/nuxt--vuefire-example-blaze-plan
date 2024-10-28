import { defineStore } from 'pinia'
import { doc, getDoc, serverTimestamp, setDoc, updateDoc, query, collection, where, getDocs } from 'firebase/firestore';
import { signInAnonymously, updateProfile } from 'firebase/auth';
import { useFirebaseAuth, useFirestore, getCurrentUser, useIsCurrentUserLoaded, useCurrentUser } from 'vuefire';
import { useStorage as vueUseStorage } from '@vueuse/core';
import { useRouter, useRoute } from 'nuxt/app';
// You can name the return value of `defineStore()` anything you want,
// but it's best to use the name of the store and surround it with `use`
// and `Store` (e.g. `useUserStore`, `useCartStore`, `useProductStore`)
// the first argument is a unique id of the store across your application
const route = useRoute();
export const useUserStore = defineStore('user', () => {
    const router = useRouter();
    const auth = useFirebaseAuth();
    const db = useFirestore();

    //STATE
    const user = vueUseStorage('user.uid', null);
    const vueFireUser = useCurrentUser(); // Firestore Auth user
    const userIsLoaded = useIsCurrentUserLoaded();

    watch(vueFireUser, async (currentUser, previousUser) => {

        if (!currentUser && !previousUser) {
            anonSignIn(); // Trigger anon sign-in if no user is authenticated
        } else if (user?.value !== currentUser.uid) {
            user.value = currentUser.uid;

            // Fetch user data from Firestore
            const userDoc = await getDoc(doc(db, `users/${currentUser.uid}`));
            if (userDoc.exists()) {
                userNickname.value = userDoc.data().nickname || 'Anonymous';
            }
        }
        // redirect to login if they logout and the current route is only for authenticated users
        if (!currentUser && previousUser &&
            (Array.isArray(route.meta.middleware)
                ? route.meta.middleware.includes('authenticated')
                : route.meta.middleware === 'authenticated')
        ) {
            return router.push({ name: 'login' })
        }
        // redirect the user if they are logged in but were rejected because the user wasn't ready yet
        if (currentUser && typeof route.query.redirect === 'string') {
            return router.push(route.query.redirect)
        }

        // update user info
        if (currentUser) {
            console.log('Updating user info...')
            const userDoc = doc(db, 'users', currentUser.uid)
            const userData = {
                displayName: currentUser.displayName || 'Anonymous',
                photoURL: currentUser.photoURL,
                lastLogin: serverTimestamp(),
            }

            // fallback photo for dev with emulators or anonymous users
            if (currentUser.isAnonymous || process.dev) {
                userData.displayName ??= 'Anonymous'
                userData.photoURL ??= `https://i.pravatar.cc/150?u=${currentUser.uid}`

                updateProfile(currentUser, {
                    displayName: userData.displayName,
                    photoURL: userData.photoURL,
                })
            }

            // only create entries for real users
            if (!currentUser.isAnonymous) {
                const existingUser = await getDoc(userDoc)

                if (existingUser.exists()) {
                    await updateDoc(userDoc, userData)
                } else {
                    await setDoc(userDoc, {
                        ...userData,
                        joinedAt: serverTimestamp(),
                    })
                }
                console.log('User updated')
            }
        }
    })

    function anonSignIn() {
        signInAnonymously(auth);
    }

    return { user, anonSignIn };
})