var buttons = {};
var gamespeed = 10;
var blockSize = 30;
var ysp = 0.00;
var xsp = 5;
var blocks = {};
var obst = {};
var yp;
var blocksCount = 27;
var obstCount = 4;
var colId;
const BTN_SPACE = 32;
const BTN_LEFT = 37;
const BTN_RIGHT = 39;
var mapBlocks = [
    {bottom: 80, left: 100},
    {bottom: 50, left: 300},
    {bottom: 120, left: 100},
    {bottom: 50, left: 200},
    {bottom: 50, left: 300},
    {bottom: 90, left: 400},
    {bottom: 90, left: 200},
    {bottom: 90, left: 300},
    {bottom: 90, left: 400,},
    {bottom: 130, left: 500},
    {bottom: 130, left: 300},
    {bottom: 130, left: 200}
];
var mapObst = [];
var mapObj = {};

//startGame()
startCreate()

function startGame() {
    var player = document.getElementById('player');
    document.addEventListener('keydown', KeyDown);
    document.addEventListener('keyup', KeyUp);
//    create_blocks_from_json();
    addBlockHitboxJquery();
    addFieldHitbox();
//addBlockHitbox(blocksCount);
//addObstacleHitbox(obstCount);
    setTimeout(cycle, 1000);
}

function getBottom(id) {
//    console.log("getbottom from " + id)
    return document.getElementById('field').offsetHeight - document.getElementById(id).offsetTop - blockSize;
}
function addFieldHitbox() {
    var top = {};
    var bottom = {};
    var left = {};
    var right = {};
    
    bottom['left'] = 0;
    bottom['right'] = document.getElementById('field').offsetWidth;
    bottom['top'] = 0;
    bottom['bottom'] = -100;
    blocks[blocksCount + 1] = bottom;
    blocksCount = blocksCount + 1;
    
    top['left'] = 0;
    top['right'] = document.getElementById('field').offsetWidth;
    top['bottom'] = document.getElementById('field').offsetHeight;
    top['top'] = top['bottom'] + 100;
    blocks[blocksCount + 1] = top;
    blocksCount = blocksCount + 1;
    
    left['left'] = -100;
    left['right'] = 0;
    left['bottom'] = 0;
    left['top'] = document.getElementById('field').offsetHeight;
    blocks[blocksCount + 1] = left;
    blocksCount = blocksCount + 1;
    
    right['left'] = document.getElementById('field').offsetWidth;
    right['right'] = right['left'] + 100;
    right['bottom'] = 0;
    right['top'] = document.getElementById('field').offsetHeight;
    blocks[blocksCount + 1] = right;
    blocksCount = blocksCount + 1;
    
    console.log (blocks);
}

function addBlockHitboxJquery() {
    var i_blocks = 1;
    var i_obst = 1;
    $(".block, .obstacle").each(function() {
        var block = this;
        var currBlock = {};
        var x = block.offsetLeft;
        var y = getBottom(block.id);
        currBlock['left'] = x - 1;
        currBlock['right'] = x + blockSize + 1;
        currBlock['top'] = y + blockSize;
        currBlock['bottom'] = y;

        if ($(this).hasClass('block')) {
            blocks[i_blocks] = currBlock;
            i_blocks++;
        } else {
            obst[i_obst] = currBlock;
            i_obst++;
        }
    });
    blocksCount = $(".block").length;
    console.log(JSON.stringify(blocksCount));
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
        ysp = 7;
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
    if (liveOrDie()) {} else {
    }
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
function liveOrDie() {
    if (hitboxCheck('bad')) {
        gameOver();
        return true;
    }
}
function gameOver() {
    alert ('game over');
    document.getElementById('player').style.left = '235px';
    document.getElementById('player').style.bottom = '250px';
}

function handleY() {


    if (hitboxCheck('top')) {
//        console.log (getBottom('player') + ' ' + blocks[colId]['bottom'] + ' ' + (blocks[colId]['bottom'] - blockSize - 1) + ' ' + colId);
        player.style.bottom = blocks[colId]['bottom'] - blockSize - 1 + 'px';
//        console.log (getBottom('player') + 'now');
        ysp = 0;
        //console.log(getBottom() + 'rtt' + blocks[colId]['bottom']);
    }

    if (ysp > -5.5) {
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
    if (orientation === 'bad') {
        for (i = 1; i <= obstCount; i++) {
//            console.log ('check bad' + i);
            if (right > obst[i]['left'] + 1) {
                if (left < obst[i]['right'] - 1) {
                    if (top >= obst[i]['bottom']) {
                        if (bottom <= obst[i]['top']) {
                            return true;
                        }
                    }
                }
            }
        }
    }
}
function createObject(type, left, bottom) {
    if (type === 'block') {
        $("#field").append(`<div id="block${mapBlocks.length + 1}" class="block" style="left: ${left}px; bottom: ${bottom}px">`);
        var block = {left: left, bottom: bottom};
        mapBlocks[mapBlocks.length + 1] = block;
    }
    if (type === 'obst') {
        $("#field").append(`<div id="obst${left} ${bottom}" class="obstacle" style="left: ${left}px; bottom: ${bottom}px">`);
        var obst = {left: left, bottom: bottom};
        mapObst[mapObst.length + 1] = obst;
    }
    if (type === 'net') {
        var html = `<div id="net${left}_${bottom}" onclick=createSomething(${left}, ${bottom}) class="blockNet" style="left: ${left}px; bottom: ${bottom}px">`;
        console.log(html);
        $("#field").append(html);
    }
}










function startCreate() {
    addNetBlocks();
}
function addNetBlocks() {
    console.log ('hi ' + $('#field').height())

    for (i = 0; i < $('#field').height(); i = i + blockSize) {
        for (g = 0; g < $('#field').width(); g = g + blockSize) {
            console.log(i);
            console.log(g);
            createObject('net', g, i);
        }
    }
}
function createSomething(left, bottom) {
    var type = mapObj[x + ' ' + y]?mapObj[x + ' ' + y]:'empty';
    if (type == 'empty') {
        mapObj[x + ' ' + y] = 'block';
        createObject('block', left, bottom)
    }
    if (type == 'block') {
        mapObj[x + ' ' + y] = 'obst';
        createObject('obst', left, bottom)
    }
    if (type == 'obst') {
        mapObj[x + ' ' + y] = 'empty';
        $(`#obst${left} ${bottom}`).remove()
    }
}
