const app = {
  server: 'http://127.0.0.1:3000/classes/messages'
};

const entityMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  '\'': '&#39;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;'
};

let rooms = [];

app.init = function() {
  app.handleSubmit();
  app.handleRoomClick();
  app.handleUsernameClick();
  app.reload();
  app.fetch();
  setInterval(function() {
    app.clearMessages();
    app.fetch();
  }, 5000);
};

app.send = function(msg) {
  $.ajax({
    type: 'POST',
    data: JSON.stringify(msg),
    url: app.server,
    dataType: 'json',
    headers: {
      'Accept': 'application/json'
    },
    success: function() {
    }
  });
};

app.fetch = function() {
  $.ajax({
    method: 'GET',
    url: app.server,
    data: 'order=-createdAt',
    dataType: 'json',
    success: function(data) {
      let allMessages = data['results'];
      for (let i = 0; i < data.results.length; i++) {
        app.renderRoom(allMessages[i].room);
        app.renderMessage(allMessages[i]);
      }
    }
  });
};

app.escapeHTML = (string) => {
  return String(string).replace(/[&<>"'`=\/]/g, (s) => entityMap[s]);
};

app.clearMessages = function() {
  $('#chats').html('');
  $('#roomSelect').html('');
};

app.renderMessage = function(msg) {
  msg.username = app.escapeHTML(msg.username);
  msg.text = app.escapeHTML(msg.text);
  let message = `<div class=message id=${msg.room}> 
    <div class=username id=${msg.username}>${msg.username}</div>
    <div class=text>${msg.text}</div>
    <div class=room>${msg.room}</div>
  </div>`;
  $('#chats').prepend(message);
};

app.renderRoom = function(room) {
  if (! ($('#roomSelect').find(`option:contains(${room})`).length)) {
    $('#roomSelect').append(`<option value='${room}'> ${room} </option>`);
  }
};

app.handleRoomClick = function() {
  $('#roomSelect').on('change', function() {
    let selected = $('#roomSelect').val();
    $('#chats').children().toggle(false);
    $('#chats').children(`#${selected}`).toggle(true);
  });
};

app.handleUsernameClick = function() {
  $('#chats').on('click', '.username', function() {
    let className = $(this).text();
    $('.message').find(`#${className}`).parent().toggleClass('friend');
  });
};

app.handleSubmit = function() {
  $('.submit').click(function() {
    event.preventDefault();
    let msg = {};
    let username = window.location.search.slice(10);
    msg.username = username;
    msg.room = $('.roomInput').val();
    msg.text = $('.messageInput').val();
    msg.createdAt = new Date();
    msg.createdAt = msg.createdAt.toLocaleDateString();
    app.renderRoom(msg.room);
    app.send(msg);
    app.clearMessages();
    app.fetch();
  });
};

app.reload = function() {
  $('#reload').click(function() {
    app.clearMessages();
    app.init();
  });
};

$(document).ready(function() {
  app.init();
});