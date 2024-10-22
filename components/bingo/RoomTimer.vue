<template>
    <div class="room-timer">
        <h5>Timer</h5>
        <!-- <IconClock /> -->
        <time>
            <SegmentDisplay :string="timerTime" />
        </time>
        <div class="control-modal">
            <Transition>
                <BaseButton v-if="!isPaused" btn-style="outline" btn-modifier="micro">
                    <template #icon>
                        <IconPause />
                    </template>
                </BaseButton>
                <BaseButton v-else btn-style="outline" btn-modifier="micro">
                    <template #icon>
                        <IconPlay />
                    </template>
                </BaseButton>
            </Transition>
            <BaseButton btn-style="outline" btn-modifier="micro">Reset</BaseButton>
        </div>
    </div>
</template>
<script setup>
const props = defineProps({ startTime: Object, isPaused: Boolean });

const timerTime = ref('00:00:00');
let timerInterval = null;

// Function to calculate the time difference and format it
function getTimeDifferenceInSeconds(firestoreTimestamp) {
    const firestoreTimeMs = firestoreTimestamp.toMillis();
    const localTimeMs = Date.now();
    const timeDifferenceInSeconds = Math.floor((localTimeMs - firestoreTimeMs) / 1000);
    return timeDifferenceInSeconds;
}

// Function to display the time in 'HHMMSS' format
function displayTime(seconds) {
    const hours = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${hours}:${minutes}:${secs}`;
}

// Function to start the timer
function startTimer() {
    timerInterval = setInterval(() => {
        const elapsed = getTimeDifferenceInSeconds(props.startTime);
        timerTime.value = displayTime(elapsed);
    }, 1000);  // Update every second
}

// Clear the timer on unmount
onUnmounted(() => {
    if (timerInterval) {
        clearInterval(timerInterval);
    }
});

// Watch for changes to the isPaused prop to start/stop the timer
watch(() => props.isPaused, (newVal) => {
    if (!newVal) {
        startTimer();  // Start timer if not paused
    } else {
        clearInterval(timerInterval);  // Stop timer if paused
    }
});

// Start the timer if not paused when component is mounted
onMounted(() => {
    if (!props.isPaused) {
        startTimer();
    }
});
</script>
<style lang="scss">
.room-timer {
    padding: 0.5rem;
    gap: 0.25rem;
    --segment-display-height: 1.25rem;
    display: grid;
    grid-template-columns: max-content 1fr max-content;
    position: relative;

    &>time {
        margin-block: auto;
    }

    &>.control-modal {
        gap: 0.5rem;
        display: flex;
        // background-color: var(--background-color);
    }
}
</style>