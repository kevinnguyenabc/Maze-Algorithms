console.log("Creating Maze")


let gridSize = 10;
let cellHeight = 50;
let mazeGrid = jQuery("#maze-grid");
let i = 1;
let speed = 100;

function createGrid() {
    let size = $("#size").val();
    switch (size){
        case "10x10":
            gridSize = 10;
            cellHeight = 50;
            break;
        case "20x20":
            gridSize = 20;
            cellHeight = 25;
            break;
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
    let inputSpeed = $("#speed").val();
    switch (inputSpeed){
        case "0.25x":
            speed = 160;
            break;
        case "0.5x":
            speed = 80;
            break;
        case "1x":
            speed = 40;
            break;
        case "2x":
            speed = 20;
            break;
        case "4x":
            speed = 10;
            break;
        default:
            speed = 80;
            break;
    }
    $("#solveButton").prop("disabled", true);
    $("#createButton").prop("disabled", true);
    mazeGrid.empty();
    createGrid();
    i = 1;
    let visitGrid = [];
    for (let y = 0; y < gridSize; y++){
        visitGrid.push([]);
        for (let x = 0; x < gridSize; x++){
            visitGrid[y].push(0);
        }
    }
    document.getElementById("0-0").style.borderTop = "solid 1px #FFF";
    createMaze(0, 0, visitGrid);
    $("#" + (gridSize-1).toString() + "-" + (gridSize-1).toString()).css("border-bottom", "solid 1px #FFF");
    setTimeout( function () { $("#createButton").prop("disabled", false); $("#solveButton").prop("disabled", false); }, speed * gridSize * gridSize);

}

function createMaze(x, y, visitGrid) {
    let directions = ["up", "down", "left", "right"];
    directions.sort((a,b) => 0.5 - Math.random());
    visitGrid[x][y] = 1;
    for (const direction of directions){
        switch (direction){
            case "up":
                var newX = x-1;
                if (newX >= 0 && visitGrid[newX][y] === 0){
                    let id = "#" + newX.toString() + "-" + y.toString();
                    let idn = "#" + x.toString() + "-" + y.toString();
                    //$(id).css("border-bottom", "solid 1px #FFF");
                    setTimeout( function () {
                        $(id).css("border-bottom", "solid 1px #FFF");
                        $(idn).css("border-top", "solid 1px #FFF"); }, ++i*speed);
                        // document.getElementById(id).style.borderBottom = "solid 1px #FFF";
                        // document.getElementById(x.toString() + y.toString()).style.borderTop = "solid 1px #FFF"; }, ++i*100);
                    createMaze(newX, y, visitGrid);
                }
                break;
            case "down":
                var newX = x+1;
                if (newX < gridSize && visitGrid[newX][y] === 0){
                    let id = "#" + x.toString() + "-" + y.toString();
                    let idn = "#" + newX.toString() + "-" + y.toString();
                    setTimeout( function () {
                        $(id).css("border-bottom", "solid 1px #FFF");
                        $(idn).css("border-top", "solid 1px #FFF"); }, ++i*speed);
                    createMaze(newX, y, visitGrid);
                }
                break;
            case "left":
                var newY = y-1;
                if (newY >= 0 && visitGrid[x][newY] === 0){
                    let id = "#" + x.toString() + "-" + newY.toString();
                    let idn = "#" + x.toString() + "-" + y.toString();
                    setTimeout( function () {
                        $(id).css("border-right", "solid 1px #FFF");
                        $(idn).css("border-left", "solid 1px #FFF"); }, ++i*speed);
                    createMaze(x, newY, visitGrid);
                }
                break;
            case "right":
                var newY = y+1;
                if (newY < gridSize && visitGrid[x][newY] === 0){
                    let id = "#" + x.toString() + "-" + y.toString();
                    let idn = "#" + x.toString() + "-" + newY.toString();
                    setTimeout( function () {
                        $(id).css("border-right", "solid 1px #FFF");
                        $(idn).css("border-left", "solid 1px #FFF"); }, ++i*speed);
                    createMaze(x, newY, visitGrid);
                }
                break;
        }
    }
}
