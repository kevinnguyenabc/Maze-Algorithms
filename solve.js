
function solveMaze() {
    console.log(gridSize)
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