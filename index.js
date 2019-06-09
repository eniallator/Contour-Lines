const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const points = [{ x: canvas.width / 4, y: canvas.height / 2 }, { x: (canvas.width * 3) / 4, y: canvas.height / 2 }]
const radiusModifier = 80

ctx.fillStyle = 'black'
ctx.strokeStyle = 'white'
ctx.lineWidth = 3

function run() {
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    for (const point of points) {
        const maxDist = Math.max(point.x, point.y, canvas.width - point.x, canvas.height - point.y)
        let radius = 0

        while ((radius += radiusModifier) <= maxDist) {
            ctx.beginPath()
            ctx.arc(point.x, point.y, radius, 0, Math.PI * 2)
            ctx.stroke()
        }
    }

    requestAnimationFrame(run)
}

run()
