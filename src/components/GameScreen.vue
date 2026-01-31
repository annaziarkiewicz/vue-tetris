<template>
    <div class="az-game-screen">
        <div class="az-game-screen__box">
            <div class="az-game-screen__heading">
                {{ heading }}
            </div>

            <div class="az-game-screen__subtitle">
                {{ subtitle }}
            </div>

            <div class="az-game-screen__action">
                <button
                    class="az-game-screen__button"
                    :class="buttonModifier"
                    @click="handleClick"
                >
                    {{ buttonLabel }}
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps<{
    isGameOver: boolean
    score: number
}>()

const emit = defineEmits<{
    (e: 'start'): void
    (e: 'restart'): void
}>()

const heading = computed<string>(() =>
    props.isGameOver ? 'Your score' : 'Vue.js Tetris'
)

const subtitle = computed<string>(() =>
    props.isGameOver
        ? String(props.score)
        : 'This is a classic tetris style game where players rotate and place falling blocks to clear full lines and earn points.'
)

const buttonLabel = computed<string>(() =>
    props.isGameOver ? 'Restart' : 'Start'
)

const buttonModifier = computed<string>(() =>
    props.isGameOver
        ? 'az-game-screen__button--rose'
        : 'az-game-screen__button--mint'
)

const handleClick = (): void => {
    props.isGameOver ? emit('restart') : emit('start')
}
</script>

<style lang="scss" scoped>
.az-game-screen {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;

    &__box {
        position: relative;
        width: 100%;
        height: 100%;
        padding: 0 48px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 16px;
        background: $color-milk-200;

        &:before,
        &:after {
            content: '';
            position: absolute;
            pointer-events: none;
            background-repeat: no-repeat;
            background-size: contain;

            @media (max-width: 400px) {
                display: none;
            }
        }

        &:before {
            bottom: 130px;
            left: -220px;
            rotate: 20deg;
            width: 337px;
            height: 225px;
            background-image: url('@/assets/block-before.png');
        }

        &:after {
            bottom: 130px;
            right: -220px;
            rotate: -20deg;
            width: 337px;
            height: 225px;
            background-image: url('@/assets/block-after.png');
        }
    }

    &__heading {
        font-size: 32px;
        font-weight: 700;
        line-height: 1;
        color: $color-milk-500;
        text-align: center;
    }

    &__subtitle {
        padding: 0 12px;
        font-size: 13px;
        font-weight: 200;
        line-height: 1.25rem;
        color: $color-grey-400;
        text-align: center;
    }

    &__action {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 12px;
    }

    &__button {
        width: 100%;
        padding: 16px;
        border-radius: 12px;
        font-size: 18px;
        font-weight: 500;
        text-transform: uppercase;
        transition: 0.5s;

        &--rose {
            background: $color-rose-200;

            &:hover {
                background: $color-rose-300;
            }
        }

        &--mint {
            background: $color-mint-300;

            &:hover {
                background: $color-mint-400;
            }
        }
    }
}
</style>