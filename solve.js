let mazeSolution = [];

function solveMaze() {
    $("#solveButton").prop("disabled", true);
    i = 1;
    console.log(mazeState)
    mazeSolution = [];
    solve(0,0);
    console.log(mazeSolution);
}

function solve(x, y) {
    mazeSolution.push(x.toString() + "-" + y.toString());
    setTimeout( function() { $("#" + x.toString() + "-" + y.toString()).css("background-color", "lightgreen"); }, ++i*speed);
    if (mazeCompleted()){
        return;
    }
    for (let i=0; i < 4; i++){
        if (!wallExists(x, y, i) && legalMove(x, y, i)){
            switch(i){
                case 0:
                    solve(x-1, y);
                    break;
                case 1:
                    solve(x+1, y); 
                    break;
                case 2:
                    solve(x, y-1);
                    break;
                case 3:
                    solve(x, y+1);
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
/*

SOLVING MAZE:
First, I need to create some sort of data structure that can hold the information
about the state of the maze. For now, I think a 2D array, where each element is an array
of booleans [up, right, down, left] for whether or not a wall exists (so a 3D array).
Second, I need to keep track of the solution. This can possibly simply be an array
of solution ids or indices, not sure yet. I want to highlight these in a different color,
or find another way to create a marking.
Third, I need to create helper functions. I would need a backtrack function, when the
algorithm reaches a dead end. I may also need a function to tell me whether or not a
wall exists or not, in order to keep the algorithm code cleaner.

 */