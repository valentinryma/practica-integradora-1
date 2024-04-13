const socket = io();
let user;

const chatBox = document.getElementById('chat-messages');

// Autenticar usuario
Swal.fire({
    title: "Identificar",
    input: "text",
    text: "Ingrese nombre de usuario",
    inputValidator: (value) => {
        if (!value) {
            return "Error: Ingrese un nombre de usuario válido.";
        }
        return false;
    },
    allowOutsideClick: false
})
    .then(input => {
        user = input.value;

        // Enviar evento con el user al socket cliente
        socket.emit('user-joined', user);
    })

// Enviar mensaje al Servidor ]----
// Funcion: Emite el mensaje y user al Servidor, para que este lo envie efectivamente.
const f_send_message = () => {
    const messageInput = document.getElementById('message-input');
    const message = messageInput.value.trim();

    if (message !== '') {
        socket.emit('message', { user, message });
        messageInput.value = '';
    }
}

const f_write_message = (data) => {
    const { user, message } = data;
    const newMessage = document.createElement('div');
    newMessage.innerText = `${user} dice: ${message}`
    chatBox.appendChild(newMessage);
    chatBox.scrollTop = chatBox.scrollHeight;
}



// DOM: Al presionar Enter o Click sobre el boton enviar: Emite el evento con el user y mensaje. (Al servidor)
document.getElementById('send-btn').addEventListener('click', f_send_message);
document.getElementById('message-input').addEventListener('keyup', function (event) {
    if (event.key === "Enter") {
        f_send_message(event);
    }
});

// Renderizar Mensaje 
// Recibe un mensaje del servidor, enviado por este u otro socket, y lo renderiza.
socket.on('message', (data) => {
    f_write_message(data);
})

// Recibir Historial de mensajes. 
socket.on('messageLogs', (messageLogs) => {
    for (const data of messageLogs) {
        f_write_message(data);
    }
})

socket.on('user-joined', (user) => {
    Swal.fire({
        html: `Usuario <b>${user}</b> se ha conectado`,
        toast: true,
        position: 'top-right',

    })
})