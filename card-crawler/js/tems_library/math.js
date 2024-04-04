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

// function to check if a line and circle intersect
export function checkLaserCircleCollision(laser, circle) {
    // calculate the direction vector of the laser
    const dx = laser.targetX - laser.x
    const dy = laser.targetY - laser.y

    // vector from the laser start point to the center of the circle
    const fx = circle.position.x - laser.x
    const fy = circle.position.y - laser.y

    // calculate the length of the direction vector
    const length = Math.sqrt(dx * dx + dy * dy)

    // normalize the direction vector
    const unitX = dx / length
    const unitY = dy / length

    // calculate the dot product of the normalized direction vector and the vector to the circle center
    const dotProduct = fx * unitX + fy * unitY

    // find the closest point on the line to the circle center
    let closestX, closestY

    if (dotProduct < 0) {
        closestX = laser.x
        closestY = laser.y
    } else if (dotProduct > length) {
        closestX = laser.targetX
        closestY = laser.targetY
    } else {
        closestX = laser.x + unitX * dotProduct
        closestY = laser.y + unitY * dotProduct
    }

    // calculate the distance between the closest point on the laser, and the circle center
    const distance = Math.sqrt((closestX - circle.position.x) ** 2 + (closestY - circle.position.y) ** 2)

    // check if the distance is less than or equal to the circle's radius
    return distance <= circle.radius
}

export function cubicBezierX(x, p) {
    const EPSILON = 1e-6; // small value for convergence
    let t = x; // initial guess for t

    // newton's method for root-finding
    for (let i = 0; i < 1000; i++) {
        const f = bezierCurvePoint(t, p).x - x;
        if (Math.abs(f) < EPSILON) {
            break; // we achieved convergence
        }
        const df = (bezierCurvePoint(t + EPSILON, p).x - bezierCurvePoint(t - EPSILON, p).x) / (2 * EPSILON);
        t -= f / df; // update t using newton's method
    }

    return t;
}

export function cubicBezierY(y, p) {
    const EPSILON = 1e-6; // small value for convergence
    let t = y; // initial guess for t

    // newton's method for root-finding
    for (let i = 0; i < 1000; i++) {
        const f = bezierCurvePoint(t, p).y - y;
        if (Math.abs(f) < EPSILON) {
            break; // we achieved convergence
        }
        const df = (bezierCurvePoint(t + EPSILON, p).y - bezierCurvePoint(t - EPSILON, p).y) / (2 * EPSILON);
        t -= f / df; // update t using newton's method
    }

    return t;
}

export function bezierCurvePointAxis(t, p) {
    return Math.pow(1 - t, 3) * p[0]
            + 3 * Math.pow(1 - t, 2) * t * p[1]
            + 3 * (1 - t) * Math.pow(t, 2) * p[2]
            + Math.pow(t, 3) * p[3];
}

export function bezierCurvePoint(t, p) {
    const a = {
        x: bezierCurvePointAxis(t, [p[0].x, p[1].x, p[2].x, p[3].x]),
        y: bezierCurvePointAxis(t, [p[0].y, p[1].y, p[2].y, p[3].y])
    };

    return a
}