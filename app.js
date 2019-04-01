let mapX;
let map = [];

let numberOfSteps=3;
let sideLength=6;

//Create empty map
map = Array(sideLength).fill('TBF');
for (var i = 0; i<sideLength; i++){
    map[i] = Array(sideLength).fill('TBF');
}


//--Placing Kayleigh--//
kayleighX = Math.floor(Math.random()*sideLength);
kayleighY = Math.floor(Math.random()*sideLength);
console.log('Kayleigh will go:', `(X = ${kayleighX}, Y = ${kayleighY})`);
console.log('ALERT', map[kayleighY][kayleighX]);
map[kayleighY][kayleighX] = 'K';
console.log('Kayleigh has been placed.')
console.log(map);

//--Placing Home--//
let homeX;
let homeY;

do{
    homeX = Math.floor(Math.random()*sideLength);
    homeY = Math.floor(Math.random()*sideLength);
} while(homeX == kayleighX && homeY == kayleighY) //chooses again if there's a clash

map[homeY][homeX] = 'H';
console.log('Home has been placed.');
console.log(map);

//--Generating the rest of the spaces--//
probOfTree=0.1;
probOfDrink=0.1;
probOfClearPath=0.8;

map = map.map(item => {
    return item.map(item => {
        if(item == 'K' || item =='H') {
            return item //Shortcircuit when Kayleigh/Home tile is selected by map()
        }
        randomNumber = Math.random();
        if(randomNumber <= probOfTree){
            return 'T';
        }else if(probOfTree<randomNumber && randomNumber <= (probOfTree+probOfDrink)){
            return 'D';
        }else if(probOfTree+probOfDrink<randomNumber){
            return '.';
        }
    })
})
console.log('The map has been generated: ', map);

//--Possible moves--//
function getPossibleMoves(){
    possibleMoves=['U','R', 'D', 'L']
    //Eliminating off the map moves
    if (kayleighX-1<0){
        possibleMoves.splice(possibleMoves.indexOf('L'), 1);
    }
    if (kayleighX+1>sideLength){
        possibleMoves.splice(possibleMoves.indexOf('R'), 1);
    }
    if (kayleighY-1<0){
        possibleMoves.splice(possibleMoves.indexOf('U'), 1);
    }
    if (kayleighY+1>sideLength){
        possibleMoves.splice(possibleMoves.indexOf('D'), 1);
    }
    console.log('All possible moves calculated:', possibleMoves);
    return possibleMoves;
}

//--Move functions--//
function getNextMoveCoords(){
    let possibleMoves = getPossibleMoves();
    numberOfPossbileMoves=possibleMoves.length;
    probabilityOfEachMove=1.0/numberOfPossbileMoves;
    randomNumber = Math.random();
    let chosenMove;
    let lowerBound=0;
    possibleMoves.forEach((value, index)=>{
        if(lowerBound<randomNumber && randomNumber<lowerBound+probabilityOfEachMove){
            chosenMove=possibleMoves[index];
        }
        lowerBound+=probabilityOfEachMove;
    });

    //Move has now been selected.
    if(!chosenMove){
        throw 'Something\'s gone wrong with choosing the move';
    }

    let newX;
    let newY;

    switch(chosenMove){
        case 'L':
            newX = kayleighX-1;
            newY = kayleighY;
            break;
        case 'U':
            newX = kayleighX;
            newY = kayleighY-1;
            break;
        case 'R':
            newX = kayleighX+1;
            newY = kayleighY;
            break;
        case 'D':
            newX = kayleighX;
            newY = kayleighY+1;
            break;
    }
    console.log(`Kayleigh will be at [${newY}, ${newX}]`);
    return {
                newX : newX,
                newY : newY
            };
}

function move(){
    map[kayleighY][kayleighX] = null
    const nextCoords = getNextMoveCoords();
    switch(map[nextCoords.newY][nextCoords.newX]){
        case 'H':
            return '1';
        case 'T':
            return '-1';
        case 'D':
            return '0';
        case '.':
            map[nextCoords.newY, nextCoords.newX]='K';
            return 'OK';
    }
    
}

//-- PLAY THE GAME!!! --//
let status = 'OK';
while(numberOfSteps > 0){
    status = move();
    console.log(status);

    if(status != 'OK'){
        break;
        console.log('Game over!');
    }
}