const canvas = document.getElementById('virusGame');
const context = canvas.getContext('2d');
context.scale(20,20);
console.log(context);

// const matrix = [
//     [1,1],
//     [0,0],
// ];

// Find 4 or more in a row of same color
function arenaMatches() {
    for(let y=0; y<arena.length; y++) {
        let count = 0;
        for(let x=0; x<arena[y].length; x++) {
            let num = arena[y][x];
            if(num !== 0) {
                if(num === arena[y][x+1]) {
                    count++
                } else {
                    count = 0;
                }
                if(count > 2) {
                    console.log("matches");
                    arenaRedraw(x, y, count);
                    count = 0;

                }
            }
        }
    }
}

// Redraw arena when matches are found
function arenaRedraw(x, y, offset) {

}

// player is touching the ground or another piece
function collide(arena, player) {
    const [m, o] = [player.matrix, player.pos];
    for(let y=0; y<m.length; ++y) {
        for(let x=0; x<m[y].length; ++x) {
            if(m[y][x] !== 0 && (arena[y+o.y] && arena[y+o.y][x+o.x]) !== 0) {
                // console.log("Collision");
                return true;
            }
        }
    }
    return false;
}

// Create empty matrix(grid)
function createMatrix(width, height) {
    const matrix = [];
    while(height--) {
        matrix.push(new Array(width).fill(0));
    }
    return matrix;
}

// The different pieces
function createPiece(type) {
    let matrix;
    if(type === 'A') {
        matrix = [
            [1,1],
            [0,0],
        ]
    } else if(type === 'B') {
        matrix = [
            [1,2],
            [0,0],
        ]
    } else if(type === 'C') {
        matrix = [
            [1,3],
            [0,0],
        ]
    } else if(type === 'D') {
        matrix = [
            [2,1],
            [0,0],
        ]
    } else if(type === 'E') {
        matrix = [
            [2,2],
            [0,0],
        ]
    } else if(type === 'F') {
        matrix = [
            [2,3],
            [0,0],
        ]
    } else if(type === 'G') {
        matrix = [
            [3,1],
            [0,0],
        ]
    } else if(type === 'H') {
        matrix = [
            [3,2],
            [0,0],
        ]
    } else if(type === 'I') {
        matrix = [
            [3,3],
            [0,0],
        ]
    }
    return matrix;
}

// Draw
function draw() {
    // redraw canvas every time draw() is called
    context.fillStyle = '#232323';
    context.fillRect(0, 0, canvas.width, canvas.height);

    drawMatrix(arena, {x: 0, y: 0});

    drawMatrix(player.matrix, player.pos);
}

// draw the individual blocks
function drawBlock(context, x, y, offset, fillColor) {
    context.strokeStyle = 'white';
    context.lineWidth = 0.1;
    context.strokeRect(x+offset.x, y+offset.y, 1, 1);
    context.fillStyle = fillColor;
    context.fillRect(x+offset.x, y+offset.y, 1, 1);
    return context
}

// Draws matrix on canvas with given offset
function drawMatrix(matrix, offset) {
    let fillColor;
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if(value !== 0) {
                switch(value) {
                    case 1:
                        fillColor = 'red';
                        drawBlock(context, x, y, offset, fillColor);
                        break;
                    case 2:
                        fillColor = 'blue';
                        drawBlock(context, x, y, offset, fillColor);
                        break;
                    case 3:
                        fillColor = 'yellow';
                        drawBlock(context, x, y, offset, fillColor);
                        break;
                    default:
                            break;
                } 
            }
        });
    });
}

// Merge player's piece into arena
function merge(arena, player) {
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if(value !== 0) {
                arena[y+player.pos.y][x+player.pos.x] = value;
            }
        });
    });
}

// move player down one unit and reset dropCounter
function playerDrop() {
    player.pos.y++;
    if(collide(arena, player)) {
        player.pos.y--;
        merge(arena, player);
        playerReset();
        arenaMatches();
    }
    dropCounter = 0;
}

// move player left and right
function playerMove(dir) {
    player.pos.x += dir;
        if(collide(arena, player)) {
        player.pos.x -= dir;
    }
}

function playerReset() {
    const pieces = 'ABCDEFGHI'; 
    player.matrix = createPiece(pieces[Math.floor(pieces.length * Math.random())]);
    player.pos.y = 0;
    player.pos. x = Math.floor(arena[0].length /2) - Math.floor(player.matrix[0].length / 2);
    if(collide(arena, player)) {
        arena.forEach(row => row.fill(0));
    }
}


// rotate piece
function playerRotate() {
    const pos = player.pos.x;
    let offset = 1;
    rotate(player.matrix);
    while(collide(arena, player)) {
        player.pos.x += offset;
        offset = -(offset + (offset > 0 ? 1 : -1)); // increment offset while negating every other
        if(offset > player.matrix[0].length) {
            rotate(matrix);
            player.pos.x = pos;
            return;
        }
    }
}

// transpose and reverse matrix to rotate
function rotate(matrix) {
    for(let y=0; y<matrix.length; ++y) {
        for(let x=0; x<y; ++x) {
            // tuple switch
            [
                matrix[x][y],
                matrix[y][x],
            ] = [
                matrix[y][x],
                matrix[x][y],
            ]
        }
    }
    matrix.reverse();
}

let dropCounter = 0;
const dropInterval = 1000;

let lastTime = 0;
// Update
function update(time = 0) {
    const deltaTime = time - lastTime;
    lastTime = time;

    dropCounter += deltaTime;
    if(dropCounter > dropInterval) {
       playerDrop();
    }
    
    draw();
    requestAnimationFrame(update);
}

// Arena
const arena = createMatrix(12, 20);

// Player
const player = {
    pos: {x: 5, y: 5},
    matrix: createPiece('A'),
}

// player input
document.addEventListener('keydown', e => {
    if(e.keyCode === 65) {
        playerMove(-1);
    } else if(e.keyCode === 68) {
        playerMove(1);
    } else if(e.keyCode === 83) {
       playerDrop();
    } else if(e.keyCode === 32) {
        playerRotate();
    }
});

update();