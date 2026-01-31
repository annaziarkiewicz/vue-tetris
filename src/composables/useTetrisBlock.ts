import { ref } from 'vue'

export interface TetrisBlock {
    shape: number[][]
    x: number
    y: number
    color: string
}

export const useTetrisBlock = (
    board: string[][],
    rows: number,
    cols: number
) => {
    const currentBlock = ref<TetrisBlock | null>(null)

    const spawn = (block: TetrisBlock): void => {
        currentBlock.value = {
            shape: block.shape.map(row => [...row]),
            color: block.color,
            x: Math.floor(cols / 2 - block.shape[0].length / 2),
            y: -block.shape.length
        }
    }

    const collides = (): boolean => {
        if (!currentBlock.value) return false

        const { shape, x, y } = currentBlock.value

        return shape.some((row, dy) =>
            row.some((cell, dx) => {
                if (!cell) return false

                const nx = x + dx
                const ny = y + dy

                if (nx < 0 || nx >= cols) return true
                if (ny >= rows) return true
                if (ny < 0) return false

                return Boolean(board[ny][nx])
            })
        )
    }

    const tryMove = (dx: number, dy: number): boolean => {
        if (!currentBlock.value) return false

        currentBlock.value.x += dx
        currentBlock.value.y += dy

        if (collides()) {
            currentBlock.value.x -= dx
            currentBlock.value.y -= dy
            return false
        }

        return true
    }

    const tryRotate = (): void => {
        if (!currentBlock.value) return

        const shape = currentBlock.value.shape
        currentBlock.value.shape = shape[0].map((_, i) =>
            shape.map(row => row[i]).reverse()
        )

        if (collides()) {
            currentBlock.value.shape = shape
        }
    }

    const lock = (): void => {
        if (!currentBlock.value) return

        const { shape, x, y, color } = currentBlock.value

        shape.forEach((row, dy) =>
            row.forEach((cell, dx) => {
                const ny = y + dy
                if (cell && ny >= 0) {
                    board[ny][x + dx] = color
                }
            })
        )

        currentBlock.value = null
    }

    return {
        currentBlock,
        spawn,
        tryMove,
        tryRotate,
        lock
    }
}