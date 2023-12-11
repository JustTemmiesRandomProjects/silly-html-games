export function circleOverlapping(a, b) {
    const distance = Math.sqrt(Math.pow(b.position.x - a.position.x, 2) + Math.pow(b.position.y - a.position.y, 2));

    return distance < a.radius + b.radius;
}

export function pointDistanceFromPoint(point1, point2) {
    return Math.sqrt(Math.pow(point1[0] - point2[0], 2) + Math.pow(point1[1] - point2[1], 2));
}

// function to check if a line and circle intersect
export function checkLaserCircleCollision(laser, circle) {
    // calculate the direction vector of the laser
    const dx = laser.targetX - laser.x;
    const dy = laser.targetY - laser.y;

    // vector from the laser start point to the center of the circle
    const fx = circle.position["x"] - laser.x;
    const fy = circle.position["y"] - laser.y;

    // calculate the length of the direction vector
    const length = Math.sqrt(dx * dx + dy * dy);

    // normalize the direction vector
    const unitX = dx / length;
    const unitY = dy / length;

    // calculate the dot product of the normalized direction vector and the vector to the circle center
    const dotProduct = fx * unitX + fy * unitY;

    // find the closest point on the line to the circle center
    let closestX, closestY;

    if (dotProduct < 0) {
        closestX = laser.x;
        closestY = laser.y;
    } else if (dotProduct > length) {
        closestX = laser.targetX;
        closestY = laser.targetY;
    } else {
        closestX = laser.x + unitX * dotProduct;
        closestY = laser.y + unitY * dotProduct;
    }

    // calculate the distance between the closest point on the laser, and the circle center
    const distance = Math.sqrt((closestX - circle.position["x"]) ** 2 + (closestY - circle.position["y"]) ** 2);

    // check if the distance is less than or equal to the circle's radius
    return distance <= circle.radius;
}
