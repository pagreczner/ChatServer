console.log('Starting Chat Server');

var io = require('socket.io').listen(8080);
var chatImageHash = {}
io.sockets.on('connection', function (socket) {
  
  
  socket.on('joined', function(data){
		socket.broadcast.emit('new_user', data);
		socket.emit('update_images', chatImageHash);
		chatImageHash[data['uid']] = data['image'];
	});
  
  
  socket.on('message', function(data){
  	socket.broadcast.emit('broadcast_message', data);
  });
  
});
