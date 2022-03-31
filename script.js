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

document.addEventListener ('keydown', KeyDown);
document.addEventListener ('keyup', KeyUp);
addHitbox (blocksCountNotField);

function getBottom(id) {
//    console.log("getbottom from " + id)
    return document.getElementById('field').offsetHeight - document.getElementById(id).offsetTop - blockSize;
}
function addHitbox (count) {
    for (var i=1; i <= count; i++) {
//        console.log (i);
        var currBlock = {};
        var x = document.getElementById("block" + i).offsetLeft
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

setTimeout (cycle, 1000);

function cycle () {
    jump();
    
    if (buttons ['37'] == true) {
        moveLeft ();
    }
    if (buttons ['39'] == true) {
        moveRight ();
    }
    
    yp = getBottom('player');
//    console.log (yp + " " + ysp);
    document.getElementById('player').style.bottom = (yp + ysp + 'px');
    setTimeout (cycle, gamespeed);
}



function moveRight() {
    if (hitboxCheck('right')) {} else {
        var posLeft = document.getElementById('player').offsetLeft;
        document.getElementById('player').style.left = (posLeft + xsp) + "px";
    }
}
function moveLeft() {
    if(hitboxCheck('left')) {} else {
        var posLeft = document.getElementById('player').offsetLeft;
        document.getElementById('player').style.left = (posLeft - xsp) + "px";
    }
}
function jump() {
    //
    if (hitboxCheck('bottom')) {
        var colBottom = colId;
        if (hitboxCheck('top')) {
        } else {
            console.log (getBottom('player') + ' ' + blocks[colId]['bottom'] + ' ' + blocks[colId]['bottom'] - 31 + ' ' + colId);
            document.getElementById('player').style.bottom = blocks[colId]['bottom'] - 31 + 'px';
            console.log (getBottom('player') + 'now');
            ysp = 0;
            //console.log(getBottom() + 'rtt' + blocks[colId]['bottom']);
        }
        document.getElementById('player').style.bottom = blocks[colBottom]['top'] + 'px';
        if (buttons[32]) {
            ysp = 5.5;
        } else {
            ysp = 0;
        }
    } else {
        if (ysp > -7) {
//            console.log("-1");
            ysp = ysp - 0.5;
        }
    }
}
function hitboxCheck (orientation) {
    var left = document.getElementById('player').offsetLeft;
    var bottom = getBottom('player');
    var right = document.getElementById('player').offsetLeft + blockSize;
    var top = getBottom('player') + blockSize;
    
    
    if (orientation == 'left') {
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
    if (orientation == 'right') {
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
    if (orientation == 'top') {
        for (i = 1; i <= blocksCount; i++) {
            if (right > blocks[i]['left']) {
                if (left < blocks[i]['right']) {
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
    if (orientation == 'bottom') {
        for (i = 1; i <= blocksCount; i++) {
            if (right > blocks[i]['left'] + 1) {
                if (left < blocks[i]['right'] - 1) {
                    if (bottom >= blocks[i]['bottom'] + 25) {
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
