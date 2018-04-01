var table = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""]
];
var queue = true;   //true=X  false=O
var myQueue;
var finished = false;

$(function () {
    startModal();
    $('.field').on('click', function () {
        var id = $(this).attr('id') + 'text';
        if (!finished && !table[id[0]][id[1]])
            fill(id);
    });
});

function startModal() {
    $('#startModal').modal({
        keyboard: false,
        backdrop: 'static'
    });
    $('.choose-buttons').on('click', function () {
        var id = $(this).attr('id');
        myQueue = (id === 'x');
        $('#startModal').modal('hide');
        $('#you').html(myQueue ? 'X' : 'O');
        if (!myQueue)
            randomField();
    });
}

function randomField() {
    if (!finished) {
        var id;
        do {
            id = "" + parseInt(Math.random()*3) + parseInt(Math.random()*3);
        } while (table[id[0]][id[1]]);
        fill(id + 'text');
    }
}

function fill(id) {
    var current = queue ? "X" : "O";
    var color = myQueue ? '#1ac312' : '#bc4a33' ;
    table[id[0]][id[1]] = current;
    $('#' + id).html(current).css('color', color);
    queue = !queue;
    myQueue = !myQueue;
    blockFilled();
}

function blockFilled() {
    var j;
    var color = myQueue ? '#FF0000' : '#00FF00';
    for (var i = 0; i < 3; i++) {
        if (table[i][0] === table[i][1] && table[i][1] === table[i][2] && table[i][1] !== "") {
            for (j = 0; j < 3; j++)
                $('#' + i + j + 'text').css('color', color);
            finished = true;
            break;
        } else if (table[0][i] === table[1][i] && table[1][i] === table[2][i] && table[1][i] !== "") {
            for (j = 0; j < 3; j++)
                $('#' + j + i + 'text').css('color', color);
            finished = true;
            break;
        } else if (table[0][0] === table[1][1] && table[1][1] === table[2][2] && table[1][1] !== "") {
            for (j = 0; j < 3; j++)
                $('#' + j+''+j + 'text').css('color', color);
            finished = true;
            break;
        } else if (table[0][2] === table[1][1] && table[1][1] === table[2][0] && table[1][1] !== "") {
            for (j = 0; j < 3; j++)
                $('#' + j + '' + (2-j) + 'text').css('color', color);
            finished = true;
            break;
        }
    }
    if (finished){
        $('#status').html(!myQueue? 'W' : 'L').css('color', !myQueue? '#00FF00' : '#FF0000');
    } else {
        if (!myQueue) {
            randomField();
        }
    }
}

function replay() {
    queue = true;   //true=X  false=O
    finished = false;
    for (var i = 0; i < 3; i++){
        for (var j = 0; j < 3; j++){
            $('#' + i+j + 'text').empty();
            table[i][j] = '';
        }
    }
    $('#status').empty();
    $('#you').empty();
    $('#startModal').modal('show');
}
