//server side player model

const Player = function(startX, startY) {
    let x = startX
    let y = startY
    let id

    const getX = function() {
        return x
    }

    const getY = function() {
        return y
    }

    const setX = function(newX) {
        x = newX
    }

    const setY = function(newY) {
        y = newY
    }

    return {
        getX: getX,
        getY: getY,
        setX: setX,
        setY: setY,
        id: id
    }
}

exports.Player = Player
