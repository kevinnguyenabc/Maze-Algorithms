console.log("Creating Maze")


let gridSize = 10;
let cellHeight = 50;
let mazeGrid = jQuery("#maze-grid");
let mazeState = [];
let i = 1;
let speed = $("#speed").val();
let visitGrid = [];

function createGrid() {
    gridSize = $("#size").val();
    if (gridSize == 20 || gridSize == 30){
        cellHeight = 25;
        
    } else {
        cellHeight = 50;
    }
    for (let x = 0; x < gridSize; x++)
    {
        let rowHTML = "<tr>";

        for(let y = 0; y < gridSize; y++)
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
    let algo = $("#algo").val();
    $("#solveButton").prop("disabled", true);
    $("#createButton").prop("disabled", true);
    mazeGrid.empty();
    createGrid();
    i = 1;
    visitGrid = [];
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
        createMazeDepth(Math.floor(Math.random() * gridSize), Math.floor(Math.random() * gridSize));
    } else if (algo === "breadth"){
        createMazeBreadth(Math.floor(Math.random() * gridSize), Math.floor(Math.random() * gridSize));
    } else if (algo === "unionfind"){
        createMazeUnion();
    }
    $("#" + (gridSize-1).toString() + "-" + (gridSize-1).toString()).css("border-bottom", "solid 1px #FFF");
    setTimeout( function () { $("#createButton").prop("disabled", false); $("#solveButton").prop("disabled", false); }, ++i*speed);
}

function createMazeDepth(x, y) {
    let directions = ["up", "down", "left", "right"];
    directions.sort((a,b) => 0.5 - Math.random());
    visitGrid[x][y] = 1;
    for (const direction of directions){
        switch (direction){
            case "up":
                var newX = x-1;
                if (newX >= 0 && visitGrid[newX][y] === 0){
                    breakWall(x, y, "up");
                    createMazeDepth(newX, y);
                }
                break;
            case "down":
                var newX = x+1;
                if (newX < gridSize && visitGrid[newX][y] === 0){
                    breakWall(x, y, "down");
                    createMazeDepth(newX, y);
                }
                break;
            case "left":
                var newY = y-1;
                if (newY >= 0 && visitGrid[x][newY] === 0){
                    breakWall(x, y, "left");
                    createMazeDepth(x, newY);
                }
                break;
            case "right":
                var newY = y+1;
                if (newY < gridSize && visitGrid[x][newY] === 0){
                    breakWall(x, y, "right");
                    createMazeDepth(x, newY);
                }
                break;
        }
    }
}


function createMazeBreadth (firstX, firstY) {
    let queue = [];
    queue.push([firstX,firstY]);
    while (queue.length > 0) {
        queue.sort((a,b) => 0.5 - Math.random());
        let pair = queue.shift();
        let x = pair[0];
        let y = pair[1];
        visitGrid[x][y] = 1;
        let directions = ["up", "down", "left", "right"];
        for (const direction of directions){
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


function createMazeUnion() {
    console.log(gridSize);
    let set = [[gridSize-1, gridSize-2, gridSize-1, gridSize-1]];
    for (let y = 0; y < (gridSize-1); y++){
        for (let x = 0; x < (gridSize-1); x++){
            set.push([x, y, x, y+1]);
            set.push([x, y, x+1, y]);
        }
    }
    set.sort((a,b) => 0.5 - Math.random());
    console.log(set);
    while (set.length > 0) {
        let cells = set.shift();
        // Union Algorithm
        root1 = find(cells[0], cells[1]);
        root2 = find(cells[2], cells[3]);

        if (!(root1[0] == root2[0] && root1[1] == root2[1])){
            if (cells[0] != cells[2]){
                breakWall(cells[0], cells[1], "down");
            } else {
                breakWall(cells[0], cells[1], "right");
            }
            visitGrid[root1[0]][root1[1]] = root2;
        }
    }
}


function find(x, y) {
    if (visitGrid[x][y] === 0){
        return [x,y]
    } else {
        root = find(visitGrid[x][y][0], visitGrid[x][y][1]);
        visitGrid[x][y] = root;
        return root;
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
            mazeState[x][newY][2] = false;
            var id = "#" + x.toString() + "-" + y.toString();
            var idn = "#" + x.toString() + "-" + newY.toString();
            setTimeout( function () {
                $(id).css("border-right", "solid 1px #FFF");
                $(idn).css("border-left", "solid 1px #FFF"); }, ++i*speed);
            break;
    }
}