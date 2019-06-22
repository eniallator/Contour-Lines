const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const points = [{ x: canvas.width / 4, y: canvas.height / 2 }, { x: (canvas.width * 3) / 4, y: canvas.height / 2 }]
const lineSpacing = 80
const cellSize = 20
// Lowest common factors of current canvas dimensions are: 1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60

ctx.fillStyle = 'black'
ctx.strokeStyle = 'white'
ctx.lineWidth = 3

function initGrid() {
    const grid = Array(~~(canvas.height / cellSize))
        .fill()
        .map(() => Array(~~(canvas.width / cellSize)).fill())

    for (const y in grid) {
        const row = grid[y]
        for (const x in row) {
            const cell = { x: x * cellSize + cellSize / 2, y: y * cellSize + cellSize / 2 }
            const distances = points.map(point => ~~(Math.sqrt((cell.x - point.x) ** 2 + (cell.y - point.y) ** 2) / lineSpacing))
            row[x] = Math.min(...distances)
        }
    }
    return grid
}

function start() {
    const grid = initGrid()

    console.log(grid)
}

start()
