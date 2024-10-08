<script lang="ts" setup>
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore'
import {
  signInAnonymously,
} from 'firebase/auth'
import { updateProfile } from 'firebase/auth'
const auth = useFirebaseAuth()! // only exists on client side
function anonSignIn() {
  signInAnonymously(auth);
}
const mobile = ref(true);
const db = useFirestore()
const user = useCurrentUser()
provide('user', user);
provide('mobile', mobile);
const {
  public: { vuefireVersion, nuxtVuefireVersion },
} = useRuntimeConfig()

const router = useRouter()
const route = useRoute()
watch(user, async (currentUser, previousUser) => {
  // redirect to login if they logout and the current route is only for authenticated users
  if (
    !currentUser &&
    previousUser &&
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
    if (currentUser.isAnonymous) {
      anonSignIn();
    }
  }
})

function isMobile() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  return /android|iPad|iPhone|iPod/i.test(userAgent.toLowerCase());
}

onBeforeMount(() => {
  mobile.value = isMobile();
})
</script>

<template>
  <!-- <div>
    <a href="https://nuxt.com" target="_blank">
      <img src="@/assets/nuxt.svg" class="logo" alt="Nuxt logo" />
    </a>
    <a href="https://vuefire.vuejs.org" target="_blank">
      <img src="/vuefire.svg" class="logo vuefire" alt="VueFire logo" />
    </a>
  </div> -->
  <div id="app">
    <main>
      <!-- <NavigationLinks /> -->
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
      <SnackBarController></SnackBarController>
    </main>
  </div>
  <!-- <footer>
    <a href="https://github.com/posva/nuxt--vuefire-example-blaze-plan">
      <img src="@/assets/github-mark.svg" alt="GitHub logo" class="logo github" />
      Source Code
    </a>
  </footer> -->
</template>

<style scoped>
html{
}
#app {
  --top-nav-height: 2rem;
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;

  transition: filter ease-out 0.3s;
}

.logo.vuefire {
  height: 7.5em;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #00dc82aa);
}

.logo.vuefire:hover {
  filter: drop-shadow(0 0 2em #f78200aa);
}

@media screen and (max-width: 425px) {
  .logo {
    height: 4em;
    padding: 0.5em;
  }

  .logo.vuefire {
    height: 5em;
  }
}

.logo.github {
  height: 1em;
  padding: 0 0.15em;
}
</style>
