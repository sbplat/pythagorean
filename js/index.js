$(document).ready(function() {
    $("#side-info").submit(function(event) {
        event.preventDefault()

        const sideLength = parseInt($("#side-length").val())

        const sidesFromHypotenuse = findSidesFromHypotenuse(sideLength),
              sidesFromLeg = findSidesFromLeg(sideLength)

        const solutionsString =
        `Hypotenuse Triplets (${sidesFromHypotenuse.size}):<br>` +
        `${[...sidesFromHypotenuse].join("<br>") || "None"}<br><br>` +
        `Leg Triplets (${sidesFromLeg.size}):<br>` +
        `${[...sidesFromLeg].reverse().join("<br>") || "None"}`

        $("#triplets").html(solutionsString)
    })
})

function isPerfectSquare(number) {
    if (number <= 0) { // we don't want to count zero
        return [false, null]
    }

    const lastHexDigit = number & 0xF

    if (lastHexDigit != 0 && lastHexDigit != 1 && lastHexDigit != 4 && lastHexDigit != 9) {
        return [false, null]
    }

    let l = 1, r = number // left, right

    while (l <= r) { // binary search
        const m = Math.floor((l + r) / 2) // middle
        const mSquared = m * m

        if (mSquared == number) {
            return [true, m]

        } else if (mSquared < number) {
            l = m + 1

        } else {
            r = m - 1
        }
    }

    return [false, null]
}

/*
function splitSetToArray(set) {
    let array = []

    for (const string of set) {
        array.push(string.split(", ").map(Number))
    }

    return array
}
*/

function findSidesFromHypotenuse(hypotenuse) {
    let triplets = new Set()
    const hypotenuseSquared = hypotenuse * hypotenuse, upperBound = Math.floor(hypotenuse / Math.sqrt(2)) + 1

    for (let i = 1; i <= upperBound; ++i) {
        const iSquared = i * i, result = isPerfectSquare(hypotenuseSquared - iSquared)

        if (result[0]) {
            const leg1 = i, leg2 = result[1]

            triplets.add([leg1, leg2, hypotenuse].sort((first, second) => parseInt(first) - parseInt(second)).join(", "))
        }
    }

    return triplets
}

function getFactorPairs(number) {
    let factorPairs = []

    for (let i = 1; i * i <= number; ++i) {
        if (number % i == 0) {
            factorPairs.push([i, number / i])
        }
    }

    return factorPairs
}

function findSidesFromLeg(leg) {
    let triplets = new Set(), legSquared = leg * leg
    const factorPairs = getFactorPairs(legSquared)

    // a^2 = (c+b)(c-b)

    for (const pair of factorPairs) {
        const pairSum = pair[0] + pair[1]

        if (pairSum % 2 != 0) {
            continue
        }

        const pairDifference = Math.abs(pair[0] - pair[1])

        if (pairDifference == 0) {
            continue
        }

        const c = pairSum / 2, b = pairDifference / 2

        triplets.add([c, b, leg].sort((first, second) => parseInt(first) - parseInt(second)).join(", "))
    }

    return triplets
}
