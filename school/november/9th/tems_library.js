export function rand_int (offset, multiplier) {
    return Math.floor(Math.random() * multiplier + offset) 
}

export function rand_float (offset, multiplier) {
    return Math.random() * multiplier + offset
}

// export { rand_float, rand_int }