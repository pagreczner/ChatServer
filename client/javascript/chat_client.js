var socket = io.connect('http://localhost:8080');



socket.on('broadcast_message', function(data){
	var messages = document.querySelectorAll('#messages')[0];
	var messageDiv = document.createElement('div');
	var messageHTML = "<h5>"+data['handle']+"</h5>";
	messageHTML += "<p>"+data['message']+"</p>";
	messageDiv.innerHTML = messageHTML;
	messages.appendChild(messageDiv);
});


function enterMessage(){
	var isSubmit = (event.keyCode == 13);
	var handle = (document.querySelectorAll('#handle-name')[0]).value;
	var message = (document.querySelectorAll('#message')[0]).value;
	if(isSubmit){
			socket.emit('message', {
				handle: handle,
				message: message
			});
	}
}
