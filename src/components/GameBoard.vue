<template>
    <div
        ref="gameBoardRef"
        class="az-board"
        tabindex="0"
        :style="{ width: cols * tile + 'px', height: rows * tile + 'px' }"
        @keydown="onKeyDown"
        @keyup="onKeyUp"
    >
        <div
            v-for="(row, y) in board"
            :key="y"
            class="az-board__row"
        >
            <div
                v-for="x in row.length"
                :key="x - 1"
                class="az-board__tile"
                :class="{
                    'az-board__tile--filled': isFilled(x - 1, y),
                    'az-board__tile--fading': fadingRows.includes(y)
                }"
                :style="getStyle(x - 1, y)"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch, nextTick } from 'vue'
import type { Ref, CSSProperties } from 'vue'
import type { TetrisBlock } from '@/composables/useTetrisBlock'

const props = defineProps<{
    board: string[][]
    currentBlock: Ref<TetrisBlock | null>
    fadingRows: number[]
    tile: number
    onKeyDown: (e: KeyboardEvent) => void
    onKeyUp: (e: KeyboardEvent) => void
}>()

const gameBoardRef = ref<HTMLDivElement | null>(null)

const focus = async () => {
    await nextTick()
    gameBoardRef.value?.focus()
}

watch(
    () => props.currentBlock.value,
    (block, prev) => {
        if (block && !prev) {
            focus()
        }
    }
)

const rows = computed(() => props.board.length)
const cols = computed(() => (props.board[0]?.length ?? 0))

const isBlockCell = (x: number, y: number): boolean => {
    const block = props.currentBlock.value
    if (!block) return false

    for (let dy = 0; dy < block.shape.length; dy++) {
        for (let dx = 0; dx < block.shape[dy].length; dx++) {
            if (
                block.shape[dy][dx] &&
                x === block.x + dx &&
                y === block.y + dy
            ) {
                return true
            }
        }
    }
    return false
}

const isFilled = (x: number, y: number): boolean => {
    return Boolean(isBlockCell(x, y) || props.board[y]?.[x])
}

const getStyle = (x: number, y: number): CSSProperties => {
    const block = props.currentBlock.value
    const isCurrent = isBlockCell(x, y)
    const color = isCurrent ? block!.color : props.board[y]?.[x]

    return {
        width: props.tile + 'px',
        height: props.tile + 'px',
        backgroundColor: color || 'transparent'
    }
}
</script>

<style lang="scss" scoped>
.az-board {
    display: flex;
    flex-direction: column;
    background-color: #EBEBE7;
    background-image:
        repeating-linear-gradient(
            45deg,
            #E7E7E2 25%,
            transparent 25%,
            transparent 75%,
            #E7E7E2 75%,
            #E7E7E2
        ),
        repeating-linear-gradient(
            45deg,
            #E7E7E2 25%,
            #EBEBE7 25%,
            #EBEBE7 75%,
            #E7E7E2 75%,
            #E7E7E2
        );
    background-position: 0 0, 25px 25px;
    background-size: 50px 50px;

    &__row {
        display: flex;
    }

    &__tile {
        box-sizing: border-box;

        &--filled {
            border: 4px solid;
            border-left-color: rgba(255, 255, 255, 0.4);
            border-top-color: rgba(255, 255, 255, 0.4);
            border-right-color: rgba(0, 0, 0, 0.25);
            border-bottom-color: rgba(0, 0, 0, 0.25);
        }

        &--fading {
            animation: fadeOut 0.3s forwards;
        }
    }
}

@keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
}
</style>