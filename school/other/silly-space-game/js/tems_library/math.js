export function circleOverlapping(a, b) {
    const distance = Math.sqrt(
        Math.pow(b.position.x - a.position.x, 2) +
        Math.pow(b.position.y - a.position.y, 2)
    )
    
    return distance < a.radius + b.radius
}