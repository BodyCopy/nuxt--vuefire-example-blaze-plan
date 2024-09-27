export default defineNuxtRouteMiddleware((to, from) => {
    if (import.meta.client) {  // Ensure this only runs on the client side
        const roomId = to.params.id as string;  // Extract the room UUID from the route params
        const storedRoomPasswords = JSON.parse(localStorage.getItem('roomPasswords') || '{}') as Record<string, string>;

        // Check if the password for the current room exists in localStorage
        if (!storedRoomPasswords[roomId]) {
            // Redirect to the join page if no password is found for this room
            return navigateTo(`/rooms/join/${roomId}`);
        }
    }
});
