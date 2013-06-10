console.log('Starting Chat Server');

var io = require('socket.io').listen(8080);
var chatImageHash = {};
var usersInRoom = {};
var polls = [];
var currentPoll = null;
var voteLimiter = {};

io.sockets.on('connection', function (socket) {
  
  
  socket.on('joined', function(data){
		chatImageHash[data['uid']] = data['image'];
		usersInRoom[data['uid']] = data;
		socket.broadcast.emit('new_user', data);
		socket.emit('update_images', chatImageHash);
		socket.emit('refresh_users', usersInRoom);
		socket.set('uid',data['uid']);
		socket.emit('new_poll', currentPoll);
	});
  
  
  socket.on('message', function(data){
  	socket.broadcast.emit('broadcast_message', data);
  });
  
  
  socket.on('create_poll', function(data){
  	var password = data['password'];
  	if(password == 'poll587'){
  		createPoll(data['question'], data['choices']);
  	}
  });
  socket.on('vote_for', function(data){
  	var voteLimitObj = voteLimiter[data['uid']];
  	var ok = true;
  	if(voteLimitObj == null){
  		voteLimiter[data['uid']] = new Date();
  	} else {
  		var diff = (new Date()).getTime() - voteLimitObj.getTime();
  		if(diff < 30000){
  			ok = false;
  		} else {
  			voteLimiter[data['uid']] = new Date();
  		}
  	}
  	if(!ok)return;
  	var i = 0;
  	for(i = 0; i < currentPoll['choices'].length; i ++){
  		if(currentPoll['choices'][i]['id'] == data['choice']){
  			if(currentPoll['choices'][i]['votes'] == null){
  				currentPoll['choices'][i]['votes'] = 0;	
  			}
  			currentPoll['choices'][i]['votes'] += 1;
  		}
  	}
  	io.sockets.emit('update_poll', currentPoll['choices']);
  });
  
  socket.on('disconnect', function(){
  	socket.get('uid',function(err, uid){
  		delete chatImageHash[uid];
  		delete usersInRoom[uid];
  		delete voteLimiter[uid];
  		socket.broadcast.emit('update_users', {uid: uid, images: chatImageHash});
  	});
  	
  });
  
  
});


function createPoll(question, choices){
	var pollObject = {
		question: question,
		alive: true,
		choices: choices
	};
	
	polls.push(pollObject);
	currentPoll = pollObject;
	io.sockets.emit('new_poll', pollObject);
}
