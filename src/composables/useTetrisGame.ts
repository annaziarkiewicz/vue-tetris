import { ref, reactive } from 'vue'
import { useTetrisBlock, type TetrisBlock } from '@/composables/useTetrisBlock'

export const useTetrisGame = (
    rows: number,
    cols: number,
    colors: string[]
) => {
    const board = reactive<string[][]>(
        Array.from({ length: rows }, () => Array(cols).fill(''))
    )

    const nextBlocks = ref<TetrisBlock[]>([])
    const fadingRows = ref<number[]>([])
    const score = ref(0)

    const isPaused = ref(false)
    const isGameOver = ref(false)
    const isClearing = ref(false)

    const normalSpeed = 500
    const fastSpeed = 60
    const speed = ref(normalSpeed)

    let gameInterval: number | undefined
    let colorBag: string[] = []

    const shapes: number[][][] = [
        [[1, 1, 1, 1]],
        [[1, 1], [1, 1]],
        [[0, 1, 0], [1, 1, 1]],
        [[1, 1, 0], [0, 1, 1]],
        [[0, 1, 1], [1, 1, 0]],
        [[1, 0, 0], [1, 1, 1]],
        [[0, 0, 1], [1, 1, 1]]
    ]

    const lineScoreMap: Record<number, number> = {
        1: 10,
        2: 30,
        3: 50,
        4: 80
    }

    const {
        currentBlock,
        spawn,
        tryMove,
        tryRotate,
        lock
    } = useTetrisBlock(board, rows, cols)

    const restartInterval = (): void => {
        clearInterval(gameInterval)
        gameInterval = window.setInterval(tick, speed.value)
    }

    const shuffleColors = (): void => {
        colorBag = [...colors]
        for (let i = colorBag.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            ;[colorBag[i], colorBag[j]] = [colorBag[j], colorBag[i]]
        }
    }

    const createBlock = (): TetrisBlock => {
        if (!colorBag.length) shuffleColors()
        const shape = shapes[Math.floor(Math.random() * shapes.length)]
            .map(row => [...row])

        return {
            shape,
            color: colorBag.pop() as string,
            x: 0,
            y: 0
        }
    }

    const initNextBlocks = (): void => {
        nextBlocks.value = Array.from({ length: 3 }, () => createBlock())
    }

    const spawnNext = (): void => {
        if (!nextBlocks.value.length) initNextBlocks()
        const next = nextBlocks.value[0]
        nextBlocks.value = [...nextBlocks.value.slice(1), createBlock()]
        spawn(next)
    }

    const clearLines = (): void => {
        const full = board
            .map((row, r) => (row.every(c => c) ? r : -1))
            .filter(r => r !== -1)

        if (!full.length) {
            spawnNext()
            return
        }

        isClearing.value = true
        fadingRows.value = full

        setTimeout(() => {
            const newBoard = board.filter((_, r) => !full.includes(r))
            const empty = Array.from(
                { length: full.length },
                () => Array(cols).fill('')
            )
            empty.forEach(r => newBoard.unshift(r))
            newBoard.forEach((r, i) => (board[i] = r))

            score.value += lineScoreMap[full.length] ?? 0
            fadingRows.value = []
            isClearing.value = false
            spawnNext()
        }, 300)
    }

    const tick = (): void => {
        if (isPaused.value || isClearing.value || isGameOver.value) return
        if (!currentBlock.value) return

        const moved = tryMove(0, 1)
        if (!moved) {
            if (currentBlock.value.y < 0) {
                isGameOver.value = true
                clearInterval(gameInterval)
                currentBlock.value = null
                return
            }
            lock()
            clearLines()
        }
    }

    const moveLeft = (): void => {
        if (!isPaused.value && !isClearing.value && !isGameOver.value) {
            tryMove(-1, 0)
        }
    }

    const moveRight = (): void => {
        if (!isPaused.value && !isClearing.value && !isGameOver.value) {
            tryMove(1, 0)
        }
    }

    const rotate = (): void => {
        if (!isPaused.value && !isClearing.value && !isGameOver.value) {
            tryRotate()
        }
    }

    const pause = (): void => {
        isPaused.value = true
        clearInterval(gameInterval)
    }

    const resume = (): void => {
        if (isGameOver.value || isClearing.value) return
        isPaused.value = false
        restartInterval()
    }

    const togglePause = (): void => {
        if (isPaused.value) resume()
        else pause()
    }

    const handleKeyDown = (e: KeyboardEvent): void => {
        if (
            e.key === 'ArrowUp' ||
            e.key === 'ArrowDown' ||
            e.key === 'ArrowLeft' ||
            e.key === 'ArrowRight' ||
            e.key === ' '
        ) {
            e.preventDefault()
        }

        if (e.key === ' ') {
            togglePause()
            return
        }

        if (e.key === 'ArrowDown') {
            if (speed.value !== fastSpeed) {
                speed.value = fastSpeed
                restartInterval()
            }
            return
        }

        if (e.key === 'ArrowLeft') moveLeft()
        if (e.key === 'ArrowRight') moveRight()
        if (e.key === 'ArrowUp') rotate()
    }

    const handleKeyUp = (e: KeyboardEvent): void => {
        if (e.key === 'ArrowDown') {
            speed.value = normalSpeed
            restartInterval()
        }
    }

    const start = (): void => {
        if (!nextBlocks.value.length) initNextBlocks()
        spawnNext()
        speed.value = normalSpeed
        restartInterval()
    }

    const restart = (): void => {
        clearInterval(gameInterval)
        board.forEach((_, r) => (board[r] = Array(cols).fill('')))
        nextBlocks.value = []
        fadingRows.value = []
        score.value = 0
        isPaused.value = false
        isClearing.value = false
        isGameOver.value = false
        colorBag = []
        start()
    }

    return {
        board,
        currentBlock,
        nextBlocks,
        fadingRows,
        score,
        isPaused,
        isGameOver,
        start,
        restart,
        moveLeft,
        moveRight,
        rotate,
        togglePause,
        handleKeyDown,
        handleKeyUp
    }
}