const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const cellSizeInp = document.getElementById('cell-size')
const cellSizeErr = document.getElementById('size-error')

const startText = 'Left click (or tap if touchscreen) to spawn hills'
const defaultCellSize = 10
let cellSize = 150

canvas.addEventListener('click', e => {
    const bounds = canvas.getBoundingClientRect()
    const mouseCoords = { x: e.clientX - bounds.left, y: e.clientY - bounds.top }
    points.push(mouseCoords)
    draw()
})

cellSizeInp.addEventListener('input', () => {
    if (cellSizeInp.value === '') {
        cellSizeErr.classList.add('hidden')
        cellSize = defaultCellSize
        return
    }
    const newCellSize = Number(cellSizeInp.value)
    if (isNaN(newCellSize) || newCellSize % 1 !== 0 || newCellSize < 1 || newCellSize > 150) {
        cellSizeErr.classList.remove('hidden')
        cellSize = defaultCellSize
    } else {
        cellSizeErr.classList.add('hidden')
        cellSize = newCellSize
    }
})

canvas.width = document.body.clientWidth
canvas.height = document.documentElement.clientHeight - 60

const points = []
const maxDim = Math.max(canvas.width, canvas.height)
const lineSpacing = maxDim / 10

ctx.fillStyle = 'black'
ctx.strokeStyle = 'white'
ctx.lineWidth = 3

const directions = [{ y: 0, x: 0 }, { y: 0, x: 1 }, { y: 1, x: 1 }, { y: 1, x: 0 }]
const lineOffsets = [{ y: 0, x: 0.5 }, { y: 0.5, x: 1 }, { y: 1, x: 0.5 }, { y: 0.5, x: 0 }]

// Lookup gotten from here: https://upload.wikimedia.org/wikipedia/en/5/59/Marching-squares-isoline.png
const linesLookup = {
    '0000': [],
    '1111': [],
    '0101': [[lineOffsets[0], lineOffsets[3]], [lineOffsets[1], lineOffsets[2]]],
    '1010': [[lineOffsets[0], lineOffsets[1]], [lineOffsets[2], lineOffsets[3]]],

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
    const grid = Array(Math.ceil(canvas.height / cellSize))
        .fill()
        .map(() => Array(Math.ceil(canvas.width / cellSize)).fill())

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

function draw() {
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    if (!points.length) {
        ctx.font = '1px Arial'
        const fontSize = ~~(canvas.width / ctx.measureText(startText).width)
        ctx.font = fontSize + 'px Arial'
        const textWidth = ctx.measureText(startText).width

        ctx.fillStyle = 'white'
        ctx.fillText(startText, canvas.width / 2 - textWidth / 2, canvas.height / 2)
        ctx.fillStyle = 'black'
        return
    }
    const grid = initGrid()

    drawMarchingSquares(grid)
}

draw()
