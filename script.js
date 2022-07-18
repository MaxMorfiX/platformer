var buttons = {};
var gamespeed = 15;
var blockSize = 30;
var ysp = 0.00;
var xsp = 5;
var blocks = {};
var obst = {};
var end = {};
var yp;
var blocksCount;
var obstCount;
var endsCount;
var colId;
const BTN_SPACE = 32;
const BTN_LEFT = 37;
const BTN_RIGHT = 39;
const BTN_UP = 38;
const SEPARATOR = '_';
var mapObj = {};
var gameStarted = false;
var player = document.getElementById('player');
var field = $("#field");
var gamemode = 'create';
var live = true;
var device;
var startMap = {"0_300":"block","30_300":"block","60_300":"block","90_330":"block","120_330":"block","0_180":"block","30_180":"block","90_180":"block","60_180":"block","90_210":"obst","120_210":"obst","120_180":"block","150_180":"block","90_300":"obst","120_300":"obst","60_330":"block","150_330":"block","240_90":"block","210_150":"block","270_120":"block","210_90":"block","180_90":"block","150_90":"block","120_90":"obst","90_90":"obst","60_90":"block","180_300":"block","300_150":"block","300_180":"block","300_210":"block","300_240":"block","120_360":"block","90_360":"block","0_330":"end","300_390":"obst","30_90":"block","0_90":"block","0_120":"end","270_210":"block","330_270":"block","330_240":"block","90_390":"obst","60_390":"obst","60_360":"block","150_300":"block","360_270":"block","360_300":"block","180_150":"block","360_330":"block","360_360":"block","360_390":"block","330_390":"obst","210_300":"block","240_300":"block"};

$("#left, #right, #jump").click(restartGameIfNeeded);
document.addEventListener('keydown', KeyDown);
document.addEventListener('keyup', KeyUp);

getDevice();
fitToSize();
startCreate();

function startGame() {
    if (!gameStarted) {
        if (device == 'phone') {
            $('#left').show();
            $('#right').show();
            $('#jump').show();
        }
        $('.blockNet').remove();
        live = true;
        player.style.left = '30px';
        player.style.bottom = '210px';
//        console.log ('ggame start' + gamemode);
        addHitboxJquery();
        addFieldHitbox();
        setTimeout(cycle, 10);
        gameStarted = true;
    }
}
function restartGame() {
    document.removeEventListener('keydown', restartGame);
    $('#LC').hide();
    $('#gameOver').hide();
    $('#PABTR').hide();
    $('#greenPABTR').hide();
    gameStarted = false;
    startGame();
}
function restartGameIfNeeded() {
    if(live == false && gamemode == 'play') {
        restartGame();
    }
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
//    console.log (blocks);
}

function addHitboxJquery() {
    var i_blocks = 1;
    var i_obst = 1;
    var i_ends = 1;
    $(".block, .obstacle, .end").each(function() {
        var block = this;
        var currBlock = {};
        var x = block.offsetLeft;
        var y = $(block).bottom();
        currBlock['left'] = x;
        currBlock['right'] = x + blockSize;
        currBlock['top'] = y + blockSize;
        currBlock['bottom'] = y;

        if ($(this).hasClass('block')) {
            blocks[i_blocks] = currBlock;
            i_blocks++;
        } else if($(this).hasClass('obstacle')) {
            obst[i_obst] = currBlock;
            i_obst++;
        } else {
            end[i_ends] = currBlock;
            i_ends++;
        }
    });
    blocksCount = $('.block').length;
    obstCount = $('.obstacle').length;
    endsCount = $('.end').length;
//    console.log(JSON.stringify('blocks - ' + blocks + '                  obstacles - ' + obst));
}

function KeyDown(e){
    buttons[e.which] = true;
   console.log (buttons);
}
function KeyUp(e) {
    if(buttons[e.which]) {
    buttons[e.which] = false;
//    console.log (buttons);
    }
}

function cycle() {
    var isAtBottom = handleY();
    if (isAtBottom && buttons[BTN_UP]) {
        ysp = 7;
    }
    
    if (buttons[BTN_LEFT]) {
        moveLeft();
    }
    if (buttons[BTN_RIGHT]) {
        moveRight();
    }
    
    yp = getBottom('player');
    player.style.bottom = (yp + ysp + 'px');
    
    gameWinOrNot();
    liveOrDie();
    
    if (gamemode === 'play') {
        if (live) {
            setTimeout (cycle, gamespeed);
        } else {
            gameStarted = false;
        }
    } else {
        gameStarted = false;
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

function gameWinOrNot() {
    if(hitboxCheck('good')) {
        gameWin();
    }
}
function gameWin() {
    live = false;
    $('#LC').show();
    $('#greenPABTR').show();
    document.addEventListener('keydown', restartGame)
}

function liveOrDie() {
    if (hitboxCheck('bad')) {
        gameOver();
    }
}
function gameOver() {
    buttons = {};
    live = false;
    $('#gameOver').show();
    $('#PABTR').show();
    document.addEventListener('keydown', restartGame)
}

function handleY() {


    if (hitboxCheck('top')) {
//        console.log (getBottom('player') + SEPARATOR + blocks[colId]['bottom'] + SEPARATOR + (blocks[colId]['bottom'] - blockSize - 1) + SEPARATOR + colId);
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
                    if (top >= obst[i]['bottom'] + 1) {
                        if (bottom <= obst[i]['top'] - 1) {
                            return true;
                        }
                    }
                }
            }
        }
    }
    if (orientation === 'good') {
        for (i = 1; i <= endsCount; i++) {
//            console.log ('check good' + i);
            if (right > end[i]['left']) {
                if (left < end[i]['right']) {
                    if (top >= end[i]['bottom']) {
                        if (bottom <= end[i]['top']) {
                            return true;
                        }
                    }
                }
            }
        }
    }
}







function playOrCreate () {
    if (gamemode == 'play') {
        gamemode = 'create';
        $('#button').css('background', 'url("textures/play.png")');
        startCreate();
    } else {
        if (gamemode == 'create') {
            gamemode = 'play';
            $('#button').css('background', 'url("textures/create.png")');
            $('#clearAll').hide()
            startGame();
        }
    }
}









function startCreate() {
    document.removeEventListener('keydown', restartGame);
    $('#gameOver').hide();
    $('#PABTR').hide();
    $('#LC').hide();
    $('#greenPABTR').hide();
    player.style.left = '30px';
    player.style.bottom = '210px';
    $('#left').hide();
    $('#right').hide();
    $('#jump').hide();
    load();
    $('#clearAll').show()
    console.log (gamemode);
    gameStarted = false;
    addNetBlocks();
}
function addNetBlocks() {
//    console.log ('hi ' + field.height())

    for (i = 0; i < field.height(); i = i + blockSize) {
        for (g = 0; g < field.width(); g = g + blockSize) {
//            console.log(i);
//            console.log(g);
            createObject('net', g, i);
        }
    }

    $(".blockNet").show();

}
function clearAll() {
    $('.block, .obstacle, .end').remove();
    mapObj = {};
    save()
}
function createSomething(left, bottom) {
    var type = mapObj[left + SEPARATOR + bottom] ? mapObj[left + SEPARATOR + bottom] : 'empty';
    if (type == 'empty') {
        mapObj[left + SEPARATOR + bottom] = 'block';
        $(`#block${left}${SEPARATOR}${bottom}, #obst${left}${SEPARATOR}${bottom}, #end${left}${SEPARATOR}${bottom}`).remove();
        createObject('block', left, bottom);
//        console.log ('block ' + left + ' ' + bottom);
    } else if (type == 'block') {
        mapObj[left + SEPARATOR + bottom] = 'obst';
        $(`#block${left}${SEPARATOR}${bottom}, #obst${left}${SEPARATOR}${bottom}, #end${left}${SEPARATOR}${bottom}`).remove();
        createObject('obst', left, bottom);
//        console.log ('obst ' + left + ' ' + bottom);
    } else if (type == 'obst') {
        mapObj[left + SEPARATOR + bottom] = 'end';
        $(`#block${left}${SEPARATOR}${bottom}, #obst${left}${SEPARATOR}${bottom}, #end${left}${SEPARATOR}${bottom}`).remove();
        createObject('end', left, bottom);
//        console.log ('end ' + left + ' ' + bottom);
    } else if (type == 'end') {
        mapObj[left + SEPARATOR + bottom] = 'empty';
        $(`#block${left}${SEPARATOR}${bottom}, #obst${left}${SEPARATOR}${bottom}, #end${left}${SEPARATOR}${bottom}`).remove();
//        console.log ('empty ' + left + ' ' + bottom);
    }
    save();
}
function createObject(type, left, bottom) {
    if (type === 'block') {
        field.append(`<div id="block${left}${SEPARATOR}${bottom}" class="block" style="left: ${left}px; bottom: ${bottom}px">`);
    } else if (type === 'obst') {
        field.append(`<div id="obst${left}${SEPARATOR}${bottom}" class="obstacle" style="left: ${left}px; bottom: ${bottom}px">`);
    } else if (type === 'net') {
        var html = `<div id="net${left}${SEPARATOR}${bottom}" onclick='createSomething(${left}, ${bottom})', class="blockNet" style="display: none; z-index: 5; left: ${left}px; bottom: ${bottom}px">`;
        field.append(html);
    } else if (type === 'end') {
        field.append(`<div id="end${left}${SEPARATOR}${bottom}" class="end" style="left: ${left}px; bottom: ${bottom}px">`);
    }
}

function save() {
    localStorage.setItem('map', JSON.stringify(mapObj));
}
function load() {
    var map = JSON.parse(localStorage.getItem('map'));
    for (var key in map) {
        var parts = key.split(SEPARATOR);
        if (parts.length !== 2) {
            console.log('Some error in loading map');
            continue;
        }
        mapObj[parts[0] + SEPARATOR + parts[1]] = map[key];
        createObject(map[key], parts[0], parts[1]);
    }
    if($(".block, .obstacle").length == 0) {
        for (var key in startMap) {
            var parts = key.split(SEPARATOR);
            if (parts.length !== 2) {
                console.log('Some error in loading start map');
                continue;
            }
            mapObj[parts[0] + SEPARATOR + parts[1]] = startMap[key];
            createObject(startMap[key], parts[0], parts[1]);
        }
        save();
    }
}





function getDevice() {
    var userAgent = window.navigator.userAgent,
        platform = window.navigator?.userAgentData?.platform ?? window.navigator.platform,
        macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
        windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
        iosPlatforms = ['iPhone', 'iPad', 'iPod'];
        
        if(iosPlatforms.indexOf(platform) !== -1 || /Android/.test(userAgent)) {
            device = 'phone';
        } else {
            device = 'pc';
        }
    console.log(device);
}
function fitToSize() {
    var y = Math.floor(window.innerHeight/blockSize) - 2;
    var x = Math.floor(window.innerWidth/blockSize) - 1;
    x = x * blockSize;
    y = y * blockSize;
    console.log(x + 'px and ' + y + 'px');
    $('#button, #jump, #clearAll, #gameOver, #LC, .LRButtons, .PABTR').show();
    
    $('#field').css('display', 'block');
    $('#field').width(x);
    $('#field').height(y);
    
    $('#left').offset({left: 80, top: field.height() - 180});
    $('#right').offset({left: 250, top: field.height() - 180});
    $('#jump').offset({left: field.width() - 250, top: field.height() - 300});
    $('#button').offset({left: 10, top: $('#field').height() + 10});
    $('#clearAll').offset({left: field.width() - 150, top: $('#field').height() + 10});
    
    
    
    $('#LC').offset({left: field.width() / 2 - 450, top: field.height() / 2 - 40});
    $('#gameOver').offset({left: field.width() / 2 - 450, top: field.height() / 2 - 135});
    $('.PABTR').offset({left: $('#gameOver').offset().left + 210, top: $('#gameOver').offset().top + 215});
    
    $('.PABTR, #gameOver, #LC').hide();
}
/*
var name = prompt("Name");
$("#load_button").click(onLoad);
//  addBlockHitbox(blocksCount);
//  create_blocks_from_json();
//  addObstacleHitbox(obstCount);
*/
