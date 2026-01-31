<template>
    <div class="az-dashboard">
        <div class="az-dashboard__score">
            Score: {{ score }}
        </div>

        <div
            v-if="paused"
            class="az-dashboard__paused"
        >
            Paused
        </div>

        <GameNextBlocks
            :nextBlocks="nextBlocks"
            :tile="tile"
        />
    </div>
</template>

<script lang="ts" setup>
import GameNextBlocks from '@/components/GameNextBlocks.vue'
import type { Block } from '@/composables/useTetrisGame'

defineProps<{
    score: number
    nextBlocks: Block[]
    tile: number
    paused: boolean
}>()
</script>

<style lang="scss" scoped>
.az-dashboard {
    width: 100%;
    height: 24px;
    padding: 0 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: $color-grey-200;
    font-size: 13px;
    font-weight: 400;
    color: $color-grey-400;

    &__score {
        width: 120px;
        text-align: left;
    }

    &__paused {
        font-weight: 700;
        text-align: center;
        text-transform: uppercase;
    }
}
</style>