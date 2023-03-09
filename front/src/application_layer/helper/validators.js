

export const minLengthTwo = (value) => {
    return value.length >= 2 
}

export const minLengthEight = (value) => {
    return value.length >= 8
}

export const includesAt = (value) => {
    return value.includes("@")
}

export const firstLetterPlus = (value) => {
    return value[0] === '+'
}

export const firstLetterCapital = (value) => {
    return value[0] === value[0].toUpperCase()
}

