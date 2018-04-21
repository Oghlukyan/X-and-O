var table = [];

var queue = true;   //true=X  false=O
var myQueue;
var size;
var finished = false;

$(function () {
    startModal();
});

function startModal() {
    $('#startModal').modal({
        keyboard: false,
        backdrop: 'static'
    });
    $('.choose-buttons').on('click', function () {
        size = parseInt($('#size').val());
        if (size) {
            if (size >= 3 && size <= 60){
                $('#error').html('');
                makeTable();
                $('.field').css('width', 100.0/size + '%');
                var id = $(this).attr('id');
                myQueue = (id === 'x');
                $('#startModal').modal('hide');
                $('#you').html(myQueue ? 'X' : 'O');
                if (!myQueue)
                    randomField();
            } else {
                $('#error').html("Size can't be less then 3 and more then 60").css('color', '#F00');
            }
        } else {
            $('#error').html('Choose size').css('color', '#F00');
        }
    });
}

function makeTable() {
    var field = '';
    for (var i = 0; i < size; i++){
        table.push([]);
        field += '<div id="' + i + '" class="row">';
        for (var j = 0; j < size; j++){
            field += '<div class="field border">\n' +
                     '    <div id="' + i + '.' + j + '" class="content" onclick="fieldClickListener(this)">\n' +
                     '    </div>\n' +
                     '</div>';
            table[i].push('');
        }
        field += '</div>';
    }
    $('#table_container').append(field);
}

function getDirection(id) {
    var currentDirection = [0, 0];
    var i = 0;
    while (id[i] !== '.')
        currentDirection[0] = currentDirection[0]*10 + parseInt(id[i++]);
    while (++i < id.length)
        currentDirection[1] = currentDirection[1]*10 + parseInt(id[i]);
    return currentDirection;
}

function fieldClickListener(element) {
    var id = $(element).attr('id');
    var currentDirection = getDirection(id);
    if (!finished && !table[currentDirection[0]][currentDirection[1]])
        fill(currentDirection[0], currentDirection[1]);
}

function randomField() {
    var id;
    var currentDirection = [];
    do {
        id = '' + parseInt(Math.random()*size) + '.' + parseInt(Math.random()*size);
        currentDirection = getDirection(id);
    } while (table[currentDirection[0]][currentDirection[1]]);
    fill(currentDirection[0], currentDirection[1]);
}

function fill(row, column) {
    var current = queue ? "X" : "O";
    table[row][column] = current;
    $('#' + row + '\\.' + column).html(current).css('font-size', 750/size);
    queue = !queue;
    myQueue = !myQueue;
    blockFilled(row, column);
}

function blockFilled(row, column) {
    var finish = checkIfFinished(row, column);
    if (finish === 'W') {
        $('#status').html(finish).css('color', '#0F0');
    } else if (finish === 'L'){
        $('#status').html(finish).css('color', '#F00');
    } else if (finish === 'D'){
        $('#status').html(finish).css('color', '#BBB');
    } else {
        if (!myQueue) {
            randomField();
        }
    }
}

function checkIfFinished(row, column) {
    var color = myQueue ? '#F00' : '#0F0';
    var status = myQueue ? 'L' : 'W';
    var check;
    var a, b;
    // diagonal
    for (var i = -2; i <= 0; i++) {
        if (row+i < 0 || row+i+2 >= size || column+i < 0 || column+i+2 >= size)
            continue;
        check = 0;
        for (var j = 0; j <= 2; j++)
            if (table[row][column] === table[row+i+j][column+i+j])
                check++;
        if (check === 3) {
            a = 0;
            b = 0;
            for (j = 0; j <= 2; j++) {
                a = row+i+j;
                b = column+i+j;
                $('#' + a + '\\.' + b).css('color', color);
            }
            finished = true;
            return status;
        }
    }
    // opposite diagonal
    for (i = -2; i <= 0; i++) {
        if (row+i < 0 || row-i+2 >= size || column+i-2 < 0 || column+i >= size)
            continue;
        check = 0;
        for (j = 0; j <= 2; j++)
            if (table[row][column] === table[row+i+j][column-i-j])
                check++;
        if (check === 3) {
            a = 0;
            b = 0;
            for (j = 0; j <= 2; j++) {
                a = row+i+j;
                b = column-i-j;
                $('#' + a + '\\.' + b).css('color', color);
            }
            finished = true;
            return status;
        }
    }
    // horizontal
    for (i = -2; i <= 0; i++) {
        if (column+i < 0 || column+i+2 >= size)
            continue;
        check = 0;
        for (j = 0; j <= 2; j++)
            if (table[row][column] === table[row][column+i+j])
                check++;
        if (check === 3) {
            b = 0;
            for (j = 0; j <= 2; j++) {
                b = column+i+j;
                $('#' + row + '\\.' + b).css('color', color);
            }
            finished = true;
            return status;
        }
    }
    // vertical
    for (i = -2; i <= 0; i++) {
        if (row+i < 0 || row+i+2 >= size)
            continue;
        check = 0;
        for (j = 0; j <= 2; j++)
            if (table[row][column] === table[row+i+j][column])
                check++;
        if (check === 3) {
            a = 0;
            for (j = 0; j <= 2; j++) {
                a = row+i+j;
                $('#' + a + '\\.' + column).css('color', color);
            }
            finished = true;
            return status;
        }
    }
    for (i = 0; i < size; i++)
        for (j = 0; j < size; j++)
            if (!table[i][j])
                return false;
    return 'D';
}

function replay() {
    queue = true;   //true=X  false=O
    finished = false;
    for (var i = 0; i < size; i++){
        for (var j = 0; j < size; j++){
            $('#' + i+j).empty();
            table[i][j] = '';
        }
    }
    $('#status').empty();
    $('#you').empty();
    $('#table_container').empty();
    $('#startModal').modal('show');
}
