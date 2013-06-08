console.log('Starting Chat Server');

var io = require('socket.io').listen(8080);
var chatImageHash = {}
var usersInRoom = {};
io.sockets.on('connection', function (socket) {
  
  
  socket.on('joined', function(data){
		chatImageHash[data['uid']] = data['image'];
		usersInRoom[data['uid']] = data;
		socket.broadcast.emit('new_user', data);
		socket.emit('update_images', chatImageHash);
		socket.emit('refresh_users', usersInRoom);
		socket.set('uid',data['uid']);
	});
  
  
  socket.on('message', function(data){
  	socket.broadcast.emit('broadcast_message', data);
  });
  
  
  socket.on('disconnect', function(){
  	socket.get('uid',function(err, uid){
  		delete chatImageHash[uid];
  		delete usersInRoom[uid];
  		socket.broadcast.emit('update_users', {uid: uid, images: chatImageHash});
  	});
  	
  });
  
  
});
