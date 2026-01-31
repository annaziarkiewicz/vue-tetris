<template>
    <div class="az-next">
        <div class="az-next__title">Next:</div>

        <div class="az-next__blocks">
            <div
                v-for="(block, i) in nextBlocks"
                :key="i"
                class="az-next__block"
            >
                <div
                    v-for="(row, y) in block.shape"
                    :key="y"
                    class="az-next__row"
                >
                    <div
                        v-for="(cell, x) in row"
                        :key="x"
                        class="az-next__tile"
                        :style="{
                            backgroundColor: cell ? block.color : '#BFBFBA',
                            width: tileSize,
                            height: tileSize
                        }"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { Block } from '@/composables/useTetrisGame'

const props = defineProps<{
    nextBlocks: Block[]
    tile: number
}>()

const tileSize = `${props.tile / 4}px`
</script>

<style lang="scss" scoped>
.az-next {
    width: 120px;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    gap: 4px;

    &__blocks {
        display: flex;
        flex-direction: row;
        align-items: flex-end;
        gap: 4px;
    }

    &__row {
        display: flex;
    }

    &__tile {
        border: 0.5px solid $color-grey-200;
    }
}
</style>