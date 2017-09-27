function createMinefield() {
    var minefield = {};
    minefield.rows = [];

    for(var i = 0; i < 8; i++) {
        var row = {};
        row.spots = [];

        for(var j = 0; j < 8; j++) {
            var spot = {};
            spot.isCovered = true;
            spot.flag = 0;
            spot.wrong = false;
            spot.isCheck = false;
            spot.content = "empty";
            row.spots.push(spot);
        }
        minefield.rows.push(row);
    }
    placeManyRandomMines(minefield);
    calculateAllNumbers(minefield);

    return minefield;
}

function getSpot(minefield, row, column) {
    return minefield.rows[row].spots[column];
}

function placeRandomMine(minefield) {
    var row = Math.round(Math.random() * 7);
    var column = Math.round(Math.random() * 7);
    var spot = getSpot(minefield, row, column);
    spot.content = "mine";
}

function placeManyRandomMines(minefield) {
    for(var i = 0; i < 15; i++) {
        placeRandomMine(minefield);
    }
}

function calculateNumber(minefield, row, column) {
    var thisSpot = getSpot(minefield, row, column);

    if(thisSpot.content == "mine") {
        return;
    }

    var mineCount = 0;

    if(row > 0) {
        if(column > 0) {
            var spot = getSpot(minefield, row - 1, column - 1);
            if(spot.content == "mine") {
                mineCount++;
            }
        }

        var spot = getSpot(minefield, row - 1, column);
        if(spot.content == "mine") {
            mineCount++;
        }

        if(column < 7) {
            var spot = getSpot(minefield, row - 1, column + 1);
            if(spot.content == "mine") {
                mineCount++;
            }
        }
    }

    if(column > 0) {
        var spot = getSpot(minefield, row, column - 1);
        if(spot.content == "mine") {
            mineCount++;
        }
    }

    if(column < 7) {
        var spot = getSpot(minefield, row, column + 1);
        if(spot.content == "mine") {
            mineCount++;
        }
    }

    if(row < 7) {
        if(column > 0) {
            var spot = getSpot(minefield, row + 1, column - 1);
            if(spot.content == "mine") {
                mineCount++;
            }
        }

        var spot = getSpot(minefield, row + 1, column);
        if(spot.content == "mine") {
            mineCount++;
        }

        if(column < 7) {
            var spot = getSpot(minefield, row + 1, column + 1);
            if(spot.content == "mine") {
                mineCount++;
            }
        }
    }

    if(mineCount > 0) {
        thisSpot.content = mineCount;
    }
}

function calculateAllNumbers(minefield) {
    for(var y = 0; y < 8; y++) {
        for(var x = 0; x < 8; x++) {
            calculateNumber(minefield, y, x);
        }
    }
}

function setFlag(spot) {
    spot.flag = spot.flag++;
    if(spot.flag > 2) {
        spot.flag = 0;
    }
}

function uncoverNeighborEmpty(minefield, x, y, setSpot) {
    thisSpot = getSpot(minefield, x, y);
    if(thisSpot.isCovered) {
        thisSpot.isCovered = false;
        if (thisSpot.content != "mine") {
            if (thisSpot.content == "empty") {
                let a = [-1, 0, 1];
                for (b of a) {
                    if (x + b < 0) {
                        continue;
                    } else if (x + b > 7) {
                        break;
                    } else {
                        for (c of a) {
                            if (y + c < 0) {
                                continue;
                            } else if (y + c > 7) {
                                break;
                            } else {
                                if (x + b > 7 || y + c > 7) {
                                    return;
                                }
                                uncoverNeighborEmpty(minefield, x + b, y + c);
                            }
                        }
                    }
                }
            }
        }
    }
}

function hasWon(minefield) {
    for(var y = 0; y < 8; y++) {
        for(var x = 0; x < 8; x++) {
            var spot = getSpot(minefield, y, x);
            if(spot.isCovered && spot.content != "mine") {
                return false;
            }
        }
    }

    return true;
}

function getFlag(flag) {
    if (flag != 1) {
        flag = 1;
    } else {
        flag = 0;
    }
    return flag;
}

function getSuspect(flag) {
    if (flag != 2) {
        flag = 2;
    } else {
        flag = 0;
    }
    return flag;
}

function uncoverAll(minefield) {
    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
            spot = getSpot(minefield, i, j);
            spot.isCovered = false; 
        }
    }
    return minefield;
}

angular.module('minesweeper', []).controller('MinesweeperController', function($scope) {
    $scope.localFlag = 0;
    $scope.minefield = createMinefield();
    $scope.flag = function(localFlag) {
        $scope.localFlag = getFlag(localFlag);
    }
    $scope.suspect = function(localFlag) {
        $scope.localFlag = getSuspect($scope.localFlag);
    }
    $scope.uncoverSpot = function(spot) {
        if ($scope.localFlag != 0) {
            if (spot.flag == $scope.localFlag) {
                spot.flag = 0;
            } else {
                spot.flag = $scope.localFlag;
            }
            $scope.localFlag = 0;
            return;
        }
        for (var i = 0; i < 8; i++) {
            for (var j = 0; j < 8; j++) {
                if (spot == getSpot($scope.minefield, i, j)) {
                    uncoverNeighborEmpty($scope.minefield, i, j);
                }
            }
        }
        if(spot.content == "mine") {
            $scope.hasLostMessageVisible = true;
            spot.wrong = true;
            $scope.minefield = uncoverAll($scope.minefield);
        } else {
            if(hasWon($scope.minefield)) {
                $scope.isWinMessageVisible = true;
            }
        }
    };
});
