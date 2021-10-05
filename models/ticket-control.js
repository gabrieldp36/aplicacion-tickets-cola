const path = require('path');

const fs = require('fs');

class Ticket {

    constructor (numero, escritorio) {

        this.numero = numero;

        this.escritorio = escritorio;
    };
};

class TicketControl {

    constructor () {

        this.ultimo = 0;

        this.hoy = new Date().getDate();

        this.tickets = [];

        this. ultimos4 = [];

        this.escritoriosConectados = [];

        this.init();
    };

    get getToJson () {

        return {
            ultimo: this.ultimo,
            hoy: this.hoy,
            tickets: this.tickets,
            ultimos4: this.ultimos4,
            escritoriosConectados: this.escritoriosConectados
        };
    };

    init () {

        const {ultimo, hoy, tickets, ultimos4} = require('../db/data.json');

        if (hoy === this.hoy) {

            this.ultimo = ultimo;
            this.tickets = tickets;
            this.ultimos4 = ultimos4;
            this.escritoriosConectados = this.escritoriosConectados;

        } else {

            this.guardarDB();
        };
    };

    guardarDB() {

        const dbPath = path.join(__dirname, '../db/data.json');

        fs.writeFileSync( dbPath, JSON.stringify(this.getToJson) );
    };

    siguiente () {

        this.ultimo += 1;

        this.tickets.push( new Ticket(this.ultimo, null) );

        this.guardarDB();

        return `Ticket N° ${this.ultimo}`;
    };

    atenderTicket (escritorio) {

        // Validamos si existen tickets para ser atendidos.

        if (this.tickets.length === 0) {

            return null;
        };

        const ticket = this.tickets.shift();

        ticket.escritorio = escritorio;

        this.ultimos4.unshift(ticket);

        if (this.ultimos4 > 4) {

            this.ultimos4.splice(-1,1)
        };

        this.guardarDB();

        return ticket;
    };

    conectarEscritorio (escritorio) {

        this.escritoriosConectados.push(escritorio);
        
        this.guardarDB();
    };

    desconectarEscritorio (escritorio) {

        const indexNumber = this.escritoriosConectados.indexOf(escritorio);

        this.escritoriosConectados.splice(indexNumber, 1);
    
        this.guardarDB();
    };
};

module.exports = TicketControl;