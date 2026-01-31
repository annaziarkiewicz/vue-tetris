<template>
    <section class="az-game">
        <GameDashboard
            :score="tetris.score.value"
            :nextBlocks="tetris.nextBlocks.value"
            :tile="tileSize"
            :paused="tetris.isPaused.value"
        />

        <GameBoard
            :board="tetris.board"
            :currentBlock="tetris.currentBlock"
            :fadingRows="tetris.fadingRows.value"
            :tile="tileSize"
        />

        <GameScreen
            v-if="overlayVisible || tetris.isGameOver.value"
            :isGameOver="tetris.isGameOver.value"
            :score="tetris.score.value"
            @start="startGame"
            @restart="restartGame"
        />
    </section>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useTetrisGame } from '@/composables/useTetrisGame'
import GameBoard from '@/components/GameBoard.vue'
import GameDashboard from '@/components/GameDashboard.vue'
import GameScreen from '@/components/GameScreen.vue'

const tileSize = 25
const rows = 25
const cols = 16

const colors = [
    '#9AE0DE',
    '#E08DA6',
    '#587993'
]

const tetris = useTetrisGame(rows, cols, colors)
const overlayVisible = ref(true)

const startGame = (): void => {
    overlayVisible.value = false
    tetris.start()
}

const restartGame = (): void => {
    overlayVisible.value = false
    tetris.restart()
}

watch(
    () => tetris.isGameOver.value,
    (over) => {
        overlayVisible.value = over
    }
)
</script>

<style lang="scss" scoped>
.az-game {
    position: relative;
}
</style>