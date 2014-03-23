$(function () {
    var KEY_LEFT = 37, KEY_UP = 38, KEY_RIGHT = 39, KEY_DOWN = 40,
        board, drawBoard, isBetween, isCellEmpty, addTile, tileInCell, allowedToMove, mergeTiles;

    //Init new game
    board = {
        tiles : [
        ]
    };

    drawBoard = function () {
        var cell, tileHtml;
        _.each(board.tiles, function (tile) {

            // if tile is rendered
            if ($('[tile-id='+tile.id+']').length) {
                tileHtml = $('[tile-id='+tile.id+']');
                tileHtml.removeClass();
                tileHtml.addClass('brick animated bounceIn');
            } else {
                tileHtml = $('<div tile-id="'+ tile.id +'" class="brick animated bounceIn">'+ tile.value +'</div>');
                $('#pork .tile-overlay').append(tileHtml);
            }
            tileHtml.addClass('x'+tile.x+' y'+tile.y);
            tileHtml.addClass('value'+tile.value);
            tileHtml.html(tile.value);

        });
    };

    isBetween = function (value, min, max) {
        return value >= min && value <= max;
    };

    isCellEmpty = function (cell, tiles) {
        return !_.some(tiles, function (tile) {
            return tile.x === cell.x && tile.y === cell.y;
        });
    };

    addTile = function () {
        var emptyCells = [], tile, index;
        _.each([0,1,2,3], function (x) {
            _.each([0,1,2,3], function (y) {
                if (isCellEmpty({x:x, y:y}, board.tiles)) {
                    emptyCells.push({x:x, y:y});
                }
            });
        });
        index = _.random(0, emptyCells.length - 1);
        tile = {
            id: _.uniqueId(),
            value: 2,
            x: emptyCells[index].x,
            y: emptyCells[index].y
        };

        board.tiles.push(tile);

    };

    tileInCell = function (cell) {
        return _.findWhere(board.tiles, {x:cell.x, y:cell.y});
    };

    allowedToMove = function (tile, cell, tiles) {
        return isCellEmpty(cell, tiles) ||
            (tileInCell(cell).value === tile.value &&
                _.where(board.tiles, {x:cell.x, y:cell.y}).size() < 2);
    };

    mergeTiles = function (tiles) {
        var mergedTiles,
            tilesToAdd,
            tilesGroupedByCell = _.groupBy(tiles, function (tile) {
                return 'x' + tile.x + 'y' + tile.y;
            });

            mergedTiles = _.map(tilesGroupedByCell, function (tilesInCell) {
                if (tilesInCell.length > 1) {
                    tilesInCell[0].value = tilesInCell[0].value * 2;
                    $('[tile-id='+tilesInCell[1].id+']').remove();
                }
                return tilesInCell[0];
            });

        return mergedTiles;
    };

    $(window).on('keydown', function (event) {
        var columns, sortedTiles, sortFunction, groupFunction, nextCell, updateTile, newTiles;
        if (event.which === KEY_LEFT) {
            sortFunction = function(tile) {
                return tile.x;
            };
            groupFunction = function(tile) {
                return tile.y;
            };
            nextCell = function(tile) {
                return {
                    x: tile.x-1,
                    y: tile.y
                };
            };
        } else if (event.which === KEY_UP) {
            sortFunction = function(tile) {
                return tile.y;
            };
            groupFunction = function(tile) {
                return tile.x;
            };
            nextCell = function(tile) {
                return {
                    x: tile.x,
                    y: tile.y-1
                };
            };
        } else if (event.which === KEY_RIGHT) {
            sortFunction = function(tile) {
                return -tile.x;
            };
            groupFunction = function(tile) {
                return tile.y;
            };
            nextCell = function(tile) {
                return {
                    x: tile.x+1,
                    y: tile.y
                };
            };
        } else if (event.which === KEY_DOWN) {
            sortFunction = function(tile) {
                return -tile.y;
            };
            groupFunction = function(tile) {
                return tile.x;
            };
            nextCell = function(tile) {
                return {
                    x: tile.x,
                    y: tile.y+1
                };
            };
        } else {
            return;
        }

        updateTile = function (tile, key, tiles) {

            var next = nextCell(tile);

            if (isBetween(next.x, 0, 3) && isBetween(next.y, 0, 3) && allowedToMove(next, tiles)) {
                tile.x = next.x;
                tile.y = next.y;
                updateTile(tile, key, tiles);
            }
        };

        sortedTiles = _.sortBy(board.tiles, sortFunction);
        columns = _.groupBy(sortedTiles, groupFunction);

        _.each(columns, function (column) {
            _.each(column, updateTile);
        });

        newTiles = mergeTiles(_.flatten(columns));

        board.tiles = newTiles;
        drawBoard();
        addTile();
        drawBoard();
    });


    // Run stuff
    addTile();
    drawBoard();
});