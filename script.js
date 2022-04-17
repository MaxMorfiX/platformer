var buttons = {};
var gamespeed = 10;
var blockSize = 30;
var ysp = 0.00;
var xsp = 5;
var blocks = {};
var obst = {};
var yp;
var blocksCount;
var obstCount;
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
var startMap = {"0_300":"block","30_300":"block","60_300":"block","90_300":"block","120_240":"obst","150_240":"obst","180_240":"obst","210_300":"block","240_300":"block","270_300":"block","300_300":"block","330_330":"obst","360_330":"obst","330_300":"block","360_300":"block","390_300":"block","420_300":"block","450_300":"block","480_300":"block","510_300":"block","330_420":"obst","360_420":"obst","300_450":"block","330_450":"block","360_450":"block","390_450":"block","510_330":"obst","600_300":"obst","600_270":"block","630_270":"block","660_270":"block","540_210":"obst","570_210":"obst","510_240":"obst","690_270":"block","720_270":"block","750_270":"block","780_300":"obst","780_330":"obst","780_360":"obst","780_270":"block"}

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
        player.style.bottom = '330px';
//        console.log ('ggame start' + gamemode);
        addHitboxJquery();
        addFieldHitbox();
        setTimeout(cycle, 10);
        gameStarted = true;
    }
}
function restartGame() {
    document.removeEventListener('keydown', restartGame);
    console.log('boo');
    $('#gameOver').hide();
    $('#PABTR').hide();
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
    blocksCount = $('.block').length;
    obstCount = $('.obstacle').length;
//    console.log(JSON.stringify('blocks - ' + blocks + '                  obstacles - ' + obst));
}

function KeyDown(e){
    buttons[e.which] = true;
//   console.log (buttons);
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
//    console.log (yp + SEPARATOR + ysp);
    player.style.bottom = (yp + ysp + 'px');
    
    liveOrDie();
    
    if (gamemode == 'play') {
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
function liveOrDie() {
    if (hitboxCheck('bad')) {
        gameOver();
        return true;
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
    player.style.left = '30px';
    player.style.bottom = '330px';
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
    $('.block, .obstacle').remove();
    mapObj = {};
    save()
}
function createSomething(left, bottom) {
    var type = mapObj[left + SEPARATOR + bottom] ? mapObj[left + SEPARATOR + bottom] : 'empty';
    if (type == 'empty') {
        mapObj[left + SEPARATOR + bottom] = 'block';
        createObject('block', left, bottom);
//        console.log ($(`#block ${left}${bottom}`));
    }
    if (type == 'block') {
        mapObj[left + SEPARATOR + bottom] = 'obst';
        $(`#block${left}${bottom}`).remove();
        createObject('obst', left, bottom);
//        console.log ();
    }
    if (type == 'obst') {
        mapObj[left + SEPARATOR + bottom] = 'empty';
        $(`#obst${left}${bottom}`).remove();
//        console.log ();
    }
    save();
}
function createObject(type, left, bottom) {
    if (type === 'block') {
        field.append(`<div id="block${left}${bottom}" class="block" style="left: ${left}px; bottom: ${bottom}px">`);
    }
    if (type === 'obst') {
        field.append(`<div id="obst${left}${bottom}" class="obstacle" style="left: ${left}px; bottom: ${bottom}px">`);
    }
    if (type === 'net') {
        var html = `<div id="net${left}${bottom}" onclick='createSomething(${left}, ${bottom})', class="blockNet" style="display: none; z-index: 5; left: ${left}px; bottom: ${bottom}px">`;
        field.append(html);
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
    $('#button').show();
    $('#right').show();
    $('#jump').show();
    $('#left').show();
    $('#clearAll').show();
    $('#gameOver').show();
    $('#PABTR').show();
    
    $('#field').css('display', 'block');
    $('#field').width(x);
    $('#field').height(y);
    
    $('#left').offset({left: 80, top: field.height() - 180});
    $('#right').offset({left: 250, top: field.height() - 180});
    $('#jump').offset({left: field.width() - 250, top: field.height() - 300});
    $('#button').offset({left: 10, top: $('#field').height() + 10});
    $('#clearAll').offset({left: field.width() - 150, top: $('#field').height() + 10});
    
    
    
    $('#gameOver').offset({left: field.width() / 2 - 450, top: field.height() / 2 - 135});
    $('#PABTR').offset({left: $('#gameOver').offset().left + 210, top: $('#gameOver').offset().top + 215});
    
    $('#PABTR').hide();
    $('#gameOver').hide();
}
/*
var name = prompt("Name");
$("#load_button").click(onLoad);
//  addBlockHitbox(blocksCount);
//  create_blocks_from_json();
//  addObstacleHitbox(obstCount);
*/
