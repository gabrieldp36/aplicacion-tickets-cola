const TicketControl = require("../models/ticket-control");

const ticketControl = new TicketControl();

const socketController =  (socket) => {

    // Cuando un cliente se conecta.

    socket.emit('ultimo-ticket', ticketControl.ultimo);

    socket.emit('contador-ticket', ticketControl.tickets);

    socket.emit('escritorios-en-linea', ticketControl.escritoriosConectados);

    socket.emit('ultimos-4-tickets', ticketControl.ultimos4);

    socket.on('escritorio-conectado', (escritorio, callback) => {

        if ( ticketControl.escritoriosConectados.includes(escritorio) ) {

            return callback({

                ok: false,
            });
        };

        ticketControl.escritoriosConectados.push(escritorio);
        
        ticketControl.guardarDB();

        socket.broadcast.emit('escritorios-conectados', ticketControl.escritoriosConectados);
        
        socket.on('disconnect', () => {

            const indexNumber = ticketControl.escritoriosConectados.indexOf(escritorio);

            ticketControl.escritoriosConectados.splice(indexNumber, 1);
        
            ticketControl.guardarDB();

            socket.broadcast.emit('escritorio-desconectado', ticketControl.escritoriosConectados);
        });            
    });

    socket.on('crear-ticket', (payload, callback) => {

        const ticket = ticketControl.siguiente();

        callback(ticket);

        socket.broadcast.emit('broadcast-mensaje-sumar-ticket', ticketControl.tickets);
    });

    socket.on('atender-ticket', ( {escritorio}, callback ) => {

        const tickets = ticketControl.tickets;

        if (!escritorio) {

            return callback({

                ok: false,
                codigo: 'escritorio',
                tickets,
                msg: 'Por favor envíe un escritorio.'
            });
        };

        const ticket = ticketControl.atenderTicket(escritorio);

        socket.broadcast.emit('broadcast-mensaje-restar-ticket', tickets);

        socket.broadcast.emit('ultimos-4-tickets', ticketControl.ultimos4);

        if (!ticket) {

            return callback({

                ok: false,
                codigo: 'ticket',
                tickets,
                msg:'Se han antendido todos los tickets.'
            });
            
        } else {

            callback({

                ok: true,
                tickets,
                ticket
            });

            socket.broadcast.emit('audio-ticket');
        };
    });
};

module.exports = {

    socketController
};