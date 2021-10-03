// Referencias html.

const lblNuevoTicket = document.querySelector('#lblNuevoTicket');

const btnCrear = document.querySelector('button');

// Socket config.

const socket = io();

socket.on('connect', () => {

    btnCrear.disabled = false;
});

socket.on('ultimo-ticket', ultimoTicket => {

    lblNuevoTicket.innerText = `Ticket N° ${ultimoTicket}`;
});

socket.on('disconnect', () => {

    btnCrear.disabled = true;
});

btnCrear.addEventListener('click', () => {

    socket.emit('crear-ticket', null, (ticket) => {

        lblNuevoTicket.innerText = ticket;
    });
});
