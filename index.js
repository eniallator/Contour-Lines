const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

canvas.width = document.body.clientWidth
canvas.height = document.documentElement.clientHeight

const points = [{ x: canvas.width / 4, y: canvas.height / 2 }, { x: (canvas.width * 3) / 4, y: canvas.height / 2 }]
const lineSpacing = Math.max(canvas.width, canvas.height) / 10
const cellSize = 10

ctx.fillStyle = 'black'
ctx.strokeStyle = 'white'
ctx.lineWidth = 3

const directions = [{ y: 0, x: 0 }, { y: 0, x: 1 }, { y: 1, x: 1 }, { y: 1, x: 0 }]
const lineOffsets = [{ y: 0, x: 0.5 }, { y: 0.5, x: 1 }, { y: 1, x: 0.5 }, { y: 0.5, x: 0 }]

// Lookup gotten from here: https://upload.wikimedia.org/wikipedia/en/5/59/Marching-squares-isoline.png
const linesLookup = {
    '0000': [],
    '1111': [],
    '0101': [],
    '1010': [],

    '1110': [[lineOffsets[2], lineOffsets[3]]],
    '1101': [[lineOffsets[1], lineOffsets[2]]],
    '1011': [[lineOffsets[0], lineOffsets[1]]],
    '0111': [[lineOffsets[0], lineOffsets[3]]],

    '0001': [[lineOffsets[2], lineOffsets[3]]],
    '0010': [[lineOffsets[1], lineOffsets[2]]],
    '0100': [[lineOffsets[0], lineOffsets[1]]],
    '1000': [[lineOffsets[0], lineOffsets[3]]],

    '1100': [[lineOffsets[1], lineOffsets[3]]],
    '1001': [[lineOffsets[0], lineOffsets[2]]],
    '0011': [[lineOffsets[1], lineOffsets[3]]],
    '0110': [[lineOffsets[0], lineOffsets[2]]]
}

function initGrid() {
    const grid = Array(~~((canvas.height + 1) / cellSize))
        .fill()
        .map(() => Array(~~((canvas.width + 1) / cellSize)).fill())

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

function drawMarchingSquares(grid) {
    for (let y = 0; y < grid.length - 1; y++) {
        const row = grid[y]
        for (let x = 0; x < row.length - 1; x++) {
            const gridPoints = directions.map(dir => grid[y + dir.y][x + dir.x])
            const max = Math.max(...gridPoints)
            const normalised = gridPoints.map(n => +(n === max))
            const str = normalised.reduce((acc, val) => acc + val, '')
            for (const line of linesLookup[str]) {
                ctx.beginPath()
                ctx.moveTo((line[0].x + x) * cellSize, (line[0].y + y) * cellSize)
                ctx.lineTo((line[1].x + x) * cellSize, (line[1].y + y) * cellSize)
                ctx.stroke()
            }
        }
    }
}

function start() {
    const grid = initGrid()

    ctx.fillRect(0, 0, canvas.width, canvas.height)
    drawMarchingSquares(grid)
}

start()
