
export const checks = {
    minLengthTwo: function (value) {
        return value.length >= 2 
    },

    minLengthEight: function (value) {
        return value.length >= 8
    },

    includesAt: function (value) {
       return value.includes("@")
    },

    firstLetterPlus: function (value) {
        return value[0] === '+'
    },

    firstLetterCapital :function (value) {
        return value[0] === value[0].toUpperCase()
    }
}


