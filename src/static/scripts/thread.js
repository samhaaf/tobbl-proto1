/**
 * Created by samuel on 10/1/16.
 */
function open_socket(){
    var namespace = '/_thread';
    var socket = io.connect('http://' + document.domain + ':' + location.port + namespace);
    return socket
}

function thread_id() {return window.location.href.split('/')[4]}


function document_ready(){
    var socket = open_socket();
    
    socket.on('render_thread', function(json){
        render_thread(json)
    });

    socket.on('new_post', function(post){
        console.log(post);
        insert_post(post)
    });

    // socket.on('render_thread', function(json){
    //     var thread = json['thread'];
    //     $(`div#thread_${thread.id} > .thread_data .thread_title`).text(thread.body);
    //     var elements = json['elements'];
    //     for (var key in elements){
    //         if (elements.hasOwnProperty(key)){
    //             var el = elements[key];
    //             el['time'] = new Date(1000*el['timestamp']).toUTCString();
    //             if (el['label'] == 'comment'){
    //                 insert_comment(el, 'thread', thread.id)d
    //             }if (el['label'] == 'prompt'){
    //                 insert_prompt(el, 'thread', thread.id);
    //             }
    //         }
    //     }
    //     socket.emit('update_scores', 'Thread', json['thread_id'])
    // });

    socket.emit('render_thread', thread_id());
    console.log('here')
}


function render_thread(json){
    // This
    // delete all content
    // var content = document.getElementById("content");
    // while (content.firstChild) {
    //     content.removeChild(content.firstChild)}

    for (var post in json['posts']){
        insert_post(json['posts'][post])
    }
}

function insert_post(post){
    var post_div = document.getElementById("posts");
    var post_time = new Date(0);
    post_time.setUTCSeconds(post['time']);
    var current_time = new Date();
    // console.log(current_time.);
    var time = post_time;

    console.log(post_time);
    $(  `<div class="post" id="${post['id']}">` +
        `   <div class="score_box">` +
        `       <button onclick="upvote(${post['id']})">+</button>` +
        `       <t id="score" class="post_score">${post['score']}</t>` +
        `   </div>` +
        `   <t id="author" >${post['author']}:</t>` +
        `   <t class="post_body">${post['body']}</t>` +
        `   <t class="post_time">${time}</t>` +
        `</div>`
    ).appendTo(post_div);
}

function submit_post(){
    var textbox = $(`div#reply_box > textarea`);
    open_socket().emit('new_post', {
        'body':textbox.val(),
        'thread_id': thread_id() // vulnerability
    });
    textbox.val('');
}

function upvote(post_id){
    open_socket().emit('upvote',{
        'post_id': post_id
    });
}