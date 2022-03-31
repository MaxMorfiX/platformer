var buttons = {};
var gamespeed = 10;
var blockSize = 30;
var ysp = 0.00;
var xsp = 5;
var blocks = {};
var yp;
var blocksCountNotField = 27;
var blocksCount = blocksCountNotField + 1;
var colId;
const BTN_SPACE = 32;
const BTN_LEFT = 37;
const BTN_RIGHT = 39;

var player = document.getElementById('player');

document.addEventListener ('keydown', KeyDown);
document.addEventListener ('keyup', KeyUp);
addHitbox (blocksCountNotField);
setTimeout (cycle, 1000);

function getBottom(id) {
//    console.log("getbottom from " + id)
    return document.getElementById('field').offsetHeight - document.getElementById(id).offsetTop - blockSize;
}
function addHitbox(count) {
    for (var i=1; i <= count; i++) {
//        console.log (i);
        var currBlock = {};
        var x = document.getElementById("block" + i).offsetLeft;
        var y = getBottom('block' + i);
//        console.log (x + y);u
        currBlock['left'] = x - 1;
        currBlock['right'] = x + blockSize + 1;
        currBlock['top'] = y + blockSize; 
        currBlock['bottom'] = y;
        blocks[i] = currBlock;
    }
    var fieldBottom = {};
    fieldBottom['left'] = 0;
    fieldBottom['right'] = document.getElementById('field').offsetWidth;
    fieldBottom['top'] = 0;
    fieldBottom['bottom'] = -100;
    blocks[blocksCount] = fieldBottom;
    console.log (blocks)
}

function KeyDown(e){
    buttons[e.which] = true;
//   console.log (buttons);
}
function KeyUp(e) {
    buttons[e.which] = false;
//    console.log (buttons);
}

function cycle() {
    var isAtBottom = handleY();

    if (isAtBottom && buttons[BTN_SPACE]) {
        ysp = 5.5;
    }
    
    if (buttons[BTN_LEFT]) {
        moveLeft();
    }
    if (buttons[BTN_RIGHT]) {
        moveRight();
    }
    
    yp = getBottom('player');
//    console.log (yp + " " + ysp);
    player.style.bottom = (yp + ysp + 'px');
    setTimeout (cycle, gamespeed);
}



function moveRight() {
    if (hitboxCheck('right')) {
        return;
    }

    var posLeft = player.offsetLeft;
    player.style.left = (posLeft + xsp) + "px";
}
function moveLeft() {
    if (hitboxCheck('left')) {
        return;
    }

    var posLeft = player.offsetLeft;
    player.style.left = (posLeft - xsp) + "px";
}

function handleY() {


    if (hitboxCheck('top')) {
        console.log (getBottom('player') + ' ' + blocks[colId]['bottom'] + ' ' + (blocks[colId]['bottom'] - blockSize - 1) + ' ' + colId);
        player.style.bottom = blocks[colId]['bottom'] - blockSize - 1 + 'px';
        console.log (getBottom('player') + 'now');
        ysp = 0;
        //console.log(getBottom() + 'rtt' + blocks[colId]['bottom']);
    }

    if (ysp > -7) {
//            console.log("-1");
        ysp = ysp - 0.5;
    }

    var isAtBottom = hitboxCheck('bottom');

    if (isAtBottom) {
        player.style.bottom = blocks[colId]['top'] + 'px';
        ysp = 0;
        return true;
    }

    return false;
}
function hitboxCheck (orientation) {
    var left = player.offsetLeft;
    var bottom = getBottom('player');
    var right = left + blockSize;
    var top = bottom + blockSize;
    
    
    if (orientation === 'left') {
        for(i = 1; i <= blocksCount; i++) {
            if (left >= blocks[i]['left'] + 25) {
                if (left <= blocks[i]['right']) {
                    if (bottom < blocks[i]['top']) {
//            console.log ('ghgi')
                        if (top > blocks [i]['bottom']) {
                            colId = i;
                            return true;
                        }
                    }
                }
            }
        }
    }
    if (orientation === 'right') {
        for (i = 1; i <= blocksCount; i++) {
            if (right >= blocks[i]['left']) {
                if (right <= blocks[i]['right'] - 25) {
                    if (bottom < blocks[i]['top'] - 1) {
                        if (top > blocks[i]['bottom'] + 1) {
                            colId = i;
                            return true;
                        }
                    }
                }
            }
        }
    }
    if (orientation === 'top') {
        for (i = 1; i <= blocksCount; i++) {
            if (right > blocks[i]['left'] + 1) {
                if (left < blocks[i]['right'] - 1) {
                    if (top >= blocks[i]['bottom']) {
                        if (top <= blocks[i]['top']) {
                            colId = i;
                            return true;
                        }
                    }
                }
            }
        }
    }
    if (orientation === 'bottom') {
        for (i = 1; i <= blocksCount; i++) {
            if (right > blocks[i]['left'] + 1) {
                if (left < blocks[i]['right'] - 1) {
                    if (bottom >= blocks[i]['bottom']) {
                        if (bottom <= blocks[i]['top']) {
                            colId = i;
                            return true;
                        }
                    }
                }
            }
        }
    }
}
