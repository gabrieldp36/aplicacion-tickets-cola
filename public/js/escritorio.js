// Referencias html.

const lblEscritorio = document.querySelector('h1');

const btnAtender = document.querySelector('button');

const lblticket = document.querySelector('small');

const divAlert = document.querySelector('.alert');

const lblPendientes = document.querySelector('#lblPendientes');

// Socket config.

const socket = io();

let escritorio = '';

const searchParams = new URLSearchParams(window.location.search);

divAlert.style.display = 'none';

if ( !searchParams.has('escritorio') ) {

    alert('Ingrese por favor la palabra escritorio seguida de un espacio, indicando el número de escritorio.');

    window.location = 'index.html';

} else if ( searchParams.has('escritorio') ) {

    escritorio = searchParams.get('escritorio');

    const escritorioNumero = escritorio.split(' ');

    escritorio = `Escritorio N° ${escritorioNumero[1]}`;

    socket.emit('escritorio-conectado', escritorio, ( {ok} ) => {

        if (!ok) {

            const escritorioLowerCase = escritorio.replace( 'E', caracter => caracter.toLowerCase() );

            alert(`El ${escritorioLowerCase} ya se encuentra conectado, por favor ingrese otro escritorio.`);

            window.location = 'index.html';
        };
    });

    lblEscritorio.innerText = escritorio;
};

socket.on('connect', () => {

    btnAtender.disabled = false;
});

socket.on('contador-ticket', contadorTicket => {

    lblPendientes.innerText = contadorTicket.length;
});

socket.on('broadcast-mensaje-restar-ticket', contadorTicket => {

    lblPendientes.innerText = contadorTicket.length;
});

socket.on('broadcast-mensaje-sumar-ticket', contadorTicket => {

    lblPendientes.innerText = contadorTicket.length;

    if (contadorTicket.length > 0) {

        divAlert.style.display = 'none';
    };
});

socket.on('disconnect', () => {

    btnAtender.disabled = true;
});

btnAtender.addEventListener('click', () => {

    socket.emit('atender-ticket', {escritorio}, ( {ok, ticket, msg, codigo, tickets} ) => {

        if (!ok) {

            if (codigo === 'escritorio') {

                lblticket.innerText = 'nadie.';

                divAlert.innerHTML = `<span> <strong> ${msg} </strong> </span>`;

                lblPendientes.innerText = tickets.length;

                divAlert.classList.add('alert', 'alert-danger', 'mt-2');

                return divAlert.style.display = '';

            } else {

                lblticket.innerText = 'nadie.';

                divAlert.innerHTML = `<span> <strong> ${msg} </strong> </span>`;

                lblPendientes.innerText = tickets.length;

                divAlert.classList.add('alert', 'alert-success', 'mt-2');

                return divAlert.style.display = '';
            };
        };

        lblticket.innerText = `Ticket N° ${ticket.numero}`;

        lblPendientes.innerText = tickets.length;
    });
});


