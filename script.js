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

function getDirection(id) {
    var currentDirection = [0, 0];
    var i = 0;
    while (id[i] !== '.')
        currentDirection[0] = currentDirection[0]*10 + parseInt(id[i++]);
    while (++i < id.length)
        currentDirection[1] = currentDirection[1]*10 + parseInt(id[i]);
    return currentDirection;
}

function fill(row, column) {
    var current = queue ? 'X' : 'O';
    table[row][column] = current;
    $('#' + row + '\\.' + column).html(current).css('font-size', 750/size);
    var finish = checkIfFinished(row, column);
    if (finish === 'W') {
        $('#status').html(finish).css('color', '#0F0');
    } else if (finish === 'L') {
        $('#status').html(finish).css('color', '#F00');
    } else if (finish === 'D') {
        $('#status').html(finish).css('color', '#BBB');
    }
    queue = !queue;
    myQueue = !myQueue;
    if (!myQueue && !finished)
        randomField();
}

function checkIfFinished(row, column) {
    var color = myQueue ? '#0F0' : '#F00';
    var status = myQueue ? 'W' : 'L';
    var current = queue ? 'X' : 'O';
    var check;
    // horizontal line
    check = true;
    for (var i = 0; i < size; i++)
        if (table[row][i] !== current)
            check = false;
    if (check) {
        for (i = 0; i < size; i++)
            $('#' + row + '\\.' + i).css('color', color);
        finished = true;
        return status;
    }
    // vertical line
    check = true;
    for (i = 0; i < size; i++)
        if (table[i][column] !== current)
            check = false;
    if (check) {
        for (i = 0; i < size; i++)
            $('#' + i + '\\.' + column).css('color', color);
        finished = true;
        return status;
    }
    // diagonals
    check = true;
    if (row === column) {
        for (i = 0; i < size; i++)
            if (table[i][i] !== table[0][0])
                check = false;
        if (check) {
            for (i = 0; i < size; i++)
                $('#' + i + '\\.' + i).css('color', color);
            finished = true;
            return status;
        }
    }
    // opposite diagonal
    check = true;
    if (row + column === size - 1) {
        for (i = 0; i < size; i++)
            if (table[i][size - 1 - i] !== table[0][size - 1])
                check = false;
        if (check) {
            var j;
            for (i = 0; i < size; i++) {
                j = size - 1 - i;
                $('#' + i + '\\.' + j).css('color', color);
            }
            finished = true;
            return status;
        }
    }
    check = true;
    for (i = 0; i < size; i++)
        for (j = 0; j < size; j++)
            if (!table[i][j])
                check = false;
    return check ? 'D' : false;
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
