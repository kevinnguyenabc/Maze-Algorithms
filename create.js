console.log("Creating Maze")


let gridSize = 10;
let cellHeight = 50;
let mazeGrid = jQuery("#maze-grid");
let mazeState = [];
let i = 1;
let speed = $("#speed").val();

function createGrid() {
    gridSize = $("#size").val();
    if (gridSize == 20 || gridSize == 30){
        cellHeight = 25;
        
    } else {
        cellHeight = 50;
    }
    for (var x = 0; x < gridSize; x++)
    {
        let rowHTML = "<tr>";

        for(var y = 0; y < gridSize; y++)
        {

            rowHTML += '<td height="' + cellHeight + '" style="border: 2px solid black;" id=' + x + "-" + y + '>  </td>';
        }
        rowHTML += "</tr>";
        mazeGrid.append(rowHTML);
    }
}

createGrid();


function generateMaze() {
    speed = $("#speed").val();
    algo = $("#algo").val();
    $("#solveButton").prop("disabled", true);
    $("#createButton").prop("disabled", true);
    mazeGrid.empty();
    createGrid();
    i = 1;
    let visitGrid = [];
    mazeState = [];
    for (let y = 0; y < gridSize; y++){
        visitGrid.push([]);
        mazeState.push([]);
        for (let x = 0; x < gridSize; x++){
            visitGrid[y].push(0);
            // Boolean values correspond to [up, down, left, right]
            mazeState[y].push([true, true, true, true]);
        }
    }
    document.getElementById("0-0").style.borderTop = "solid 1px #FFF";
    if (algo == "depth"){
        createMazeDepth(Math.floor(Math.random() * gridSize), Math.floor(Math.random() * gridSize), visitGrid);
    } else {
        createMazeBreadth(Math.floor(Math.random() * gridSize), Math.floor(Math.random() * gridSize), visitGrid);
    }
    $("#" + (gridSize-1).toString() + "-" + (gridSize-1).toString()).css("border-bottom", "solid 1px #FFF");
    setTimeout( function () { $("#createButton").prop("disabled", false); $("#solveButton").prop("disabled", false); }, ++i*speed);
    console.log(visitGrid)
}

function createMazeDepth(x, y, visitGrid) {
    let directions = ["up", "down", "left", "right"];
    directions.sort((a,b) => 0.5 - Math.random());
    visitGrid[x][y] = 1;
    for (const direction of directions){
        switch (direction){
            case "up":
                var newX = x-1;
                if (newX >= 0 && visitGrid[newX][y] === 0){
                    breakWall(x, y, "up");
                    createMazeDepth(newX, y, visitGrid);
                }
                break;
            case "down":
                var newX = x+1;
                if (newX < gridSize && visitGrid[newX][y] === 0){
                    breakWall(x, y, "down");
                    createMazeDepth(newX, y, visitGrid);
                }
                break;
            case "left":
                var newY = y-1;
                if (newY >= 0 && visitGrid[x][newY] === 0){
                    breakWall(x, y, "left");
                    createMazeDepth(x, newY, visitGrid);
                }
                break;
            case "right":
                var newY = y+1;
                if (newY < gridSize && visitGrid[x][newY] === 0){
                    breakWall(x, y, "right");
                    createMazeDepth(x, newY, visitGrid);
                }
                break;
        }
    }
}


function createMazeBreadth (firstX, firstY, visitGrid) {
    let queue = [];
    queue.push([firstX,firstY]);
    while (queue.length > 0) {
        queue.sort((a,b) => 0.5 - Math.random());
        let pair = queue.shift();
        let x = pair[0];
        let y = pair[1];
        console.log(x, y);
        visitGrid[x][y] = 1;
        let directions = ["up", "down", "left", "right"];
        for (const direction of directions){
            console.log(x, y);
            switch (direction){
                case "up":
                    var newX = x-1;
                    if (newX >= 0 && visitGrid[newX][y] === 0){
                        visitGrid[newX][y] = 1;
                        breakWall(x, y, "up");
                        queue.push([newX, y]);
                    }
                case "down":
                    var newX = x+1;
                    if (newX < gridSize && visitGrid[newX][y] === 0){
                        visitGrid[newX][y] = 1;
                        breakWall(x, y, "down");
                        queue.push([newX, y]);
                    }
                case "left":
                    var newY = y-1;
                    if (newY >= 0 && visitGrid[x][newY] === 0){
                        visitGrid[x][newY] = 1;
                        breakWall(x, y, "left");
                        queue.push([x, newY]);        
                    }
                case "right":
                    var newY = y+1;
                    if (newY < gridSize && visitGrid[x][newY] === 0){
                        visitGrid[x][newY] = 1;
                        breakWall(x, y, "right");
                        queue.push([x, newY]);
                    }
            }
        }
    }
}

function breakWall(x, y, direction) {
    switch (direction) { 
        case "up":
            var newX = x-1;
            mazeState[x][y][0] = false;
            mazeState[newX][y][1] = false;
            var id = "#" + newX.toString() + "-" + y.toString();
            var idn = "#" + x.toString() + "-" + y.toString();
            setTimeout( function () {
                $(id).css("border-bottom", "solid 1px #FFF");
                $(idn).css("border-top", "solid 1px #FFF"); }, ++i*speed);
            break;
        case "down":
            var newX = x+1;
            mazeState[x][y][1] = false;
            mazeState[newX][y][0] = false;
            var id = "#" + x.toString() + "-" + y.toString();
            var idn = "#" + newX.toString() + "-" + y.toString();
            setTimeout( function () {
                $(id).css("border-bottom", "solid 1px #FFF");
                $(idn).css("border-top", "solid 1px #FFF"); }, ++i*speed);
            break;
        case "left":
            var newY = y-1;
            mazeState[x][y][2] = false;
            mazeState[x][newY][3] = false;
            var id = "#" + x.toString() + "-" + newY.toString();
            var idn = "#" + x.toString() + "-" + y.toString();
            setTimeout( function () {
                $(id).css("border-right", "solid 1px #FFF");
                $(idn).css("border-left", "solid 1px #FFF"); }, ++i*speed);
            break;
        case "right":
            var newY = y+1;
            mazeState[x][y][3] = false;
            console.log(x, newY);
            mazeState[x][newY][2] = false;
            var id = "#" + x.toString() + "-" + y.toString();
            var idn = "#" + x.toString() + "-" + newY.toString();
            setTimeout( function () {
                $(id).css("border-right", "solid 1px #FFF");
                $(idn).css("border-left", "solid 1px #FFF"); }, ++i*speed);
            break;
    }
}