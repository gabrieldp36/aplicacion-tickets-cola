// refresh ante navegación.

window.addEventListener( "pageshow", ( event ) => {
    
    const historyTraversal = event.persisted;
                      
    if ( historyTraversal ) {
      
        window.location.reload();
    };
});

// Referencias Html

const select = document.querySelector('#escritorio');

const divAlert = document.querySelector('.alert');

const strong = document.querySelector('strong');

divAlert.style.display = 'none'

// Populado de escritorios.

const incorporarEscritorios = (numeroEscritorios) => {
    for (let i = 0; i < numeroEscritorios; i++) {
        const option = document.createElement('option');
        option.text = `escritorio ${i+1}`;
        option.value = `escritorio ${i+1}`;
        select.add(option);
    };
};

incorporarEscritorios(10);

// Socket config.

const socket = io();

socket.on('escritorios-en-linea', escritoriosConectados => {

    if (escritoriosConectados.length > 0) {

        divAlert.style.display = '';

        divAlert.classList.add('alert', 'alert-info');

        strong.innerText = `Escritorios en línea:`;

        escritoriosConectados.forEach( (escritorio, index) => {

            const escritorioLowerCase = escritorio.replace( 'E', caracter => caracter.toLowerCase() );

            if (index < escritoriosConectados.length -1)
                
                strong.innerText += ` ${escritorioLowerCase}, `;

            else if (index === escritoriosConectados.length -1) {

                strong.innerText += ` ${escritorioLowerCase}.`;
            };   
        });
    };
});

socket.on('escritorios-conectados', escritoriosConectados => {

    if (escritoriosConectados.length > 0) {

        divAlert.style.display = ''

        divAlert.classList.add('alert', 'alert-info');

        const escritoriosMostrarPantalla = escritoriosConectados.map( (escritorio, index) => {

            const escritorioLowerCase = escritorio.replace( 'E', caracter => caracter.toLowerCase() );

            return ( index === 0 && escritoriosConectados.length === 1) ? ` ${escritorioLowerCase}.` : ` ${escritorioLowerCase}`;
        });

        strong.innerText = `Escritorios en línea: ${escritoriosMostrarPantalla}`;

        if (escritoriosMostrarPantalla.length > 1) {

            let ultimoEscritorio = escritoriosMostrarPantalla.pop();

            ultimoEscritorio = ` ${ultimoEscritorio}.`;

            escritoriosMostrarPantalla.push(ultimoEscritorio)

            strong.innerText = `Escritorios en línea: ${escritoriosMostrarPantalla}`;
        };
    };
});

socket.on('escritorio-desconectado', escritoriosEnLinea => {

    if (escritoriosEnLinea.length > 0) {

        divAlert.style.display = ''

        divAlert.classList.add('alert', 'alert-info');

        const escritoriosMostrarPantalla = escritoriosEnLinea.map( (escritorio, index) => {

            const escritorioLowerCase = escritorio.replace( 'E', caracter => caracter.toLowerCase() );

            return ( index === 0 && escritoriosEnLinea.length === 1) ? ` ${escritorioLowerCase}.` : ` ${escritorioLowerCase}`;
        });

        strong.innerText = `Escritorios en línea: ${escritoriosMostrarPantalla}`;

        if (escritoriosMostrarPantalla.length > 1) {

            let ultimoEscritorio = escritoriosMostrarPantalla.pop();

            ultimoEscritorio = ` ${ultimoEscritorio}.`;

            escritoriosMostrarPantalla.push(ultimoEscritorio)

            strong.innerText = `Escritorios en línea: ${escritoriosMostrarPantalla}`;
        };
       
    } else {

        divAlert.style.display = 'none';
    };
});