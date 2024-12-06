$(document).ready(function() {
    function load_posts(limit1 = 5, offset = 0){
        console.log(limit1);
        console.log(offset);

        $.ajax({
            url: `/posts/?limit=${limit1}&offset=${offset}`,
            type: "GET",
            success: display_post,
            error: function (error) {
                console.log(`Error ${error}`);
            }
        });
    }

    function display_post(data){
        var board = $('#board');
        console.log(' data loaded');
        console.log(data)
        // console.log(data.results.length)

        for(var i = 0; i < data.results.length; ++i){
            $('<div />').html('title:' + data.results[i].title).appendTo(board);
            $('<div />').html('content:' + data.results[i].content).appendTo(board);
            $('<hr />').appendTo(board);
        }
    }

    // var board = $('#board');
    var board = document.getElementById("board");
    var board_offset = 0;
    board.onscroll = function() {
        if( board.scrollTop === (board.scrollHeight - board.offsetHeight))
        {
            // offset += limit;
            board_offset += 5;
            load_posts(5, board_offset);
        }
    };
    load_posts(5, 0);
});
