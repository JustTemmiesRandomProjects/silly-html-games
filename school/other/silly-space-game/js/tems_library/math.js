export function circleOverlapping(a, b) {
    const distance = Math.sqrt(
        Math.pow(b.position.x - a.position.x, 2) +
        Math.pow(b.position.y - a.position.y, 2)
    )
    
    return distance < a.radius + b.radius
}

export function pointDistanceFromPoint(point1, point2) {
    return Math.sqrt(Math.pow((point1[0] - point2[0]), 2) + Math.pow((point1[1] - point2[1]), 2))
}