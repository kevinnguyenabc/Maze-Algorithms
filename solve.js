let mazeSolution = [];

function solveMaze() {
    speed = $("#speed").val();
    let solveAlgo = $("#solveAlgo").val();
    $("#solveButton").prop("disabled", true);
    $("#createButton").prop("disabled", true);
    i = 1;
    mazeSolution = [];
    clearMazeSolution();
    let t0 = performance.now();
    if (solveAlgo == "depth") {
        solveDepth(0,0);
    } else if (solveAlgo == "breadth"){
        solveBreadth();
    }
    let t1 = performance.now();
    console.log("Solving took " + (t1 - t0) + " miliseconds");
    setTimeout( function () { $("#createButton").prop("disabled", false); $("#solveButton").prop("disabled", false); }, ++i*speed);
}

function solveDepth(x, y) {
    mazeSolution.push(x.toString() + "-" + y.toString());
    setTimeout( function() { $("#" + x.toString() + "-" + y.toString()).css("background-color", "lightgreen"); }, ++i*speed);
    if (mazeCompleted()){
        return;
    }
    for (let i=3; i >= 0; i--){
        if (!wallExists(x, y, i) && legalMove(x, y, i)){
            switch(i){
                case 0:
                    solveDepth(x-1, y);
                    break;
                case 1: 
                    solveDepth(x+1, y); 
                    break;
                case 2:
                    solveDepth(x, y-1);
                    break;
                case 3:
                    solveDepth(x, y+1);
                    break;
            }
        }
        if (mazeCompleted()){
            return;
        }
    }
    backtrack();
}

function legalMove(x,y,direction) {
    let lastMove = mazeSolution[mazeSolution.length - 2];
    switch (direction){
        case 0:
            if ( lastMove == ((x-1).toString() + "-" + y.toString()) ) { return false }
            break;
        case 1:
            if ( lastMove == ((x+1).toString() + "-" + y.toString()) ) { return false }
            break;
        case 2:
            if ( lastMove == (x.toString() + "-" + (y-1).toString()) ) { return false }
            break;
        case 3:
            if ( lastMove == (x.toString() + "-" + (y+1).toString()) ) { return false }
            break;
    }
    return true;
}

function wallExists(x,y,direction) {
    return mazeState[x][y][direction];
}

function backtrack() {
    let id = mazeSolution.pop()
    setTimeout( function() { $("#" + id).css("background-color", "transparent"); }, ++i*speed);
}

function mazeCompleted() {
    let corner = gridSize-1;
    return (mazeSolution.includes("0-0") && mazeSolution.includes(corner.toString() + "-" + corner.toString()));
}

function clearMazeSolution() {
    for (let y = 0; y < gridSize; y++){
        for (let x = 0; x < gridSize; x++){
            $("#" + (x).toString() + "-" + (y).toString()).css("background-color", "transparent");
        }
    }
}

function solveBreadth() {
    let queue = [];
    let parents = [];
    let curr = 0;
    let directions = ["up", "down", "left", "right"];
    for (let y = 0; y < gridSize; y++){
        parents.push([]);
        for (let x = 0; x < gridSize; x++){
            parents[y].push(-1);
        }
    }
    queue.push([0,0]);
    while (queue.length > curr) {  
        if (isArrayInArray(queue, [gridSize-1, gridSize-1])) {
            break;
        }
        let pair = queue[curr++];
        let x = pair[0];
        let y = pair[1];
        setTimeout( function() { $("#" + x.toString() + "-" + y.toString()).css("background-color", "lightgreen"); }, ++i*speed);
        for (const direction of directions){
            switch (direction) {
                case "up":
                    if (!wallExists(x, y, 0) && !isArrayInArray(queue, [x-1, y])){
                        queue.push([x-1, y]);
                        parents[x-1][y] = [x, y];
                    }
                    break;
                case "down":
                    if (!wallExists(x, y, 1) && !isArrayInArray(queue, [x+1, y])){
                        queue.push([x+1, y]);
                        parents[x+1][y] = [x, y];
                    }
                    break;
                case "left":
                    if (!wallExists(x, y, 2) && !isArrayInArray(queue, [x, y-1])){
                        queue.push([x, y-1]);
                        parents[x][y-1] = [x, y];
                    }
                    break;
                case "right":
                    if (!wallExists(x, y, 3) && !isArrayInArray(queue, [x, y+1])){
                        queue.push([x, y+1]);
                        parents[x][y+1] = [x, y];
                    }
                    break;
            }
        }
    }
    setTimeout( function() { clearMazeSolution(); }, ++i*speed);
    setTimeout( function() { $("#" + (gridSize-1).toString() + "-" + (gridSize-1).toString()).css("background-color", "lightgreen"); }, ++i*speed);
    let sol = parents[gridSize-1][gridSize-1];
    while (sol !== -1){
        let x = sol[0];
        let y = sol[1];
        setTimeout( function() { $("#" + x.toString() + "-" + y.toString()).css("background-color", "lightgreen"); }, ++i*speed);
        sol = parents[x][y];
    }
}

function isArrayInArray(arr, item){
    let item_as_string = JSON.stringify(item);
  
    let contains = arr.some(function(ele){
      return JSON.stringify(ele) === item_as_string;
    });
    return contains;
}

