import { bezierCurvePoint } from "./math.js";

export function drawSquircle(ctx, x, y, width, height, cornerRadius, colour) {
    ctx.beginPath();
    ctx.moveTo(x + cornerRadius, y);
    ctx.arcTo(x + width, y, x + width, y + height, cornerRadius);
    ctx.arcTo(x + width, y + height, x, y + height, cornerRadius);
    ctx.arcTo(x, y + height, x, y, cornerRadius);
    ctx.arcTo(x, y, x + width, y, cornerRadius);
    ctx.closePath();
    ctx.fillStyle = colour;
    ctx.fill();
}

export function drawBezierArrow(ctx, p0, p3) {
    const p1X = p0.x + (p3.x - p0.x) * -0.25
    const p1Y = p0.y + (p3.y - p0.y) * 0.8
    
    const p2X = p0.x + (p3.x - p0.x) * 0.1
    const p2Y = p0.y + (p3.y - p0.y) * 1.25

    const points = []
    const nodes = 20
    for (let i = 0; i < nodes; i ++) {
        // t -> 0 <= t <= 1
        const t = Math.log2(i / (nodes - 1) + 1)
        points.push(bezierCurvePoint(t,
            [p0, {x: p1X, y: p1Y}, {x: p2X, y: p2Y}, p3]
        ))
    }

    points.forEach((point) => {
        ctx.fillStyle = "#ff8888"
        ctx.fillRect(point.x - 5, point.y - 5, 10, 10)
    })
}

// draw an image to cover the screen, crop the image if needed to fill the screen
// the transformations took me too fucking long lmao
export function drawBackgroundImage(context, image) {
    console.log("drawing background...")
    const scale = Math.max(
        context.canvas.width / image.width,
        context.canvas.height / image.height
    )

    //https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/transform
    context.setTransform(
      /*     scale x */ scale,
      /*      skew x */ 0,
      /*      skew y */ 0,
      /*     scale y */ scale,
      /* translate x */(context.canvas.width - scale * image.width) / 2,
      /* translate y */(context.canvas.height - scale * image.height) / 2,
    )

    context.drawImage(image, 0, 0)
    // reset the transformation back to the default
    context.setTransform(1, 0, 0, 1, 0, 0)
}

// function to deal with drawing things on the edges of the screen, at making them "wrap around" to the other side
export function drawWithScreenWrap(position_x, position_y, radius, drawAtPos, offset_value, object) {
    var drawn_this_frame = 0


    // handle the edges on the x plane
    if (position_x < radius + offset_value) {
        drawAtPos(position_x + ctx.canvas.width, position_y, object)
        drawn_this_frame ++
    } else if (position_x > ctx.canvas.width - radius - offset_value) {
        drawAtPos(position_x - ctx.canvas.width, position_y, object)
        drawn_this_frame ++
    }

    // handle the edges on the y plane
    if (position_y < radius + offset_value) {
        drawAtPos(position_x, position_y + ctx.canvas.height, object)
        drawn_this_frame ++
    } else if (position_y > ctx.canvas.height - radius - offset_value) {
        drawAtPos(position_x, position_y - ctx.canvas.height, object)
        drawn_this_frame ++
    }

    // draw the player at the actual position
    drawAtPos(position_x, position_y, object)
    drawn_this_frame ++

    // if there's already been 3 objects drawn, we need to draw a 4th one as the real object is in one of the corners
    // and the code above simply doesn't have the ability to handle corners properly :)
    if ( drawn_this_frame >= 3 ){
        // if object is on the rgiht
        if ( position_x > ctx.canvas.width / 2 ) {
            // if object is at the top
            if ( position_y < ctx.canvas.height / 2 ) {
                // the real object is at the top right
                drawAtPos(position_x - ctx.canvas.width, position_y + ctx.canvas.height, object)
            } else {
                // the real object is at the bottom right
                drawAtPos(position_x - ctx.canvas.width, position_y - ctx.canvas.height, object)
            }
        } else {
            if ( position_y < ctx.canvas.height / 2 ) {
                // the real object is at the top left
                drawAtPos(position_x + ctx.canvas.width, position_y + ctx.canvas.height, object)
            } else {
                // the real object is at the bottom left
                drawAtPos(position_x + ctx.canvas.width, position_y - ctx.canvas.height, object)
            }
        }
    }
}