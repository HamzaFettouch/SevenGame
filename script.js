
document.addEventListener("DOMContentLoaded", () => {
    const nomUsuari = localStorage.getItem('nomUsuari') || 'Jugador';
    document.getElementById('nom-usuari').textContent = nomUsuari;
    
    const dinersJugadorInicial = parseFloat(localStorage.getItem('dinersJugador')) || 100;
    let dinersJugador = dinersJugadorInicial;

    document.getElementById('diners-totals').textContent = dinersJugador.toFixed(2);

    const iniciaPartidaButton = document.getElementById('inicia-partida');
    const agafarCartaButton = document.getElementById('agafar-carta');
    const plantarseButton = document.getElementById('plantarse');
    const quantitatApostaInput = document.getElementById('quantitat-aposta');
    const llistaCartesJugador = document.getElementById('llista-cartes-jugador');
    const puntuacioJugadorDisplay = document.getElementById('puntuacio-jugador');
    const llistaCartesBanca = document.getElementById('llista-cartes-banca');
    const puntuacioBancaDisplay = document.getElementById('puntuacio-banca');
    const taulerJoc = document.getElementById('cartes-jugador');
    


    taulerJoc.style.display = 'none';

    agafarCartaButton.style.display = 'none';
    plantarseButton.style.display = 'none';

    let puntuacioJugador = 0;
    let puntuacioBanca = 0;
    let cartesJugador = [];
    let cartesBanca = [];
    let quantitatAposta = 0;

    const imatgesCartes = {};
    const valors = ["A", "2", "3", "4", "5", "6", "7", "J", "Q", "K"];
    const pals = ["S", "H", "D", "C"]; // Picas, cors, diamants, trevols

    valors.forEach(valor => {
        pals.forEach(palo => {
            const clau = `${valor}_${palo}`;
            imatgesCartes[clau] = `https://deckofcardsapi.com/static/img/${valor}${palo}.png`;
        });
    });

    function validarCarta(carta) {
        return carta in imatgesCartes;
    }

    function obtenirCartaAleatoria() {
        const valor = valors[Math.floor(Math.random() * valors.length)];
        const palo = pals[Math.floor(Math.random() * pals.length)];
        return `${valor}${palo}`; 
    }

    function obtenerImagenCarta(carta) {
        return `https://deckofcardsapi.com/static/img/${carta}.png`;
    }

    const valorsCartes = {
        "A": 1, "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7,
        "J": 0.5, "Q": 0.5, "K": 0.5
    };

    function calcularPuntuacio(cartes) {
        return cartes.reduce((total, carta) => {
            const valor = carta.slice(0, -1);
            return total + (valorsCartes[valor] || 0); 
        }, 0);
    }

    iniciaPartidaButton.addEventListener('click', () => {
        quantitatAposta = parseInt(quantitatApostaInput.value);

        if (isNaN(quantitatAposta) || quantitatAposta <= 0 || quantitatAposta > dinersJugador) {
            alert('Si us plau, introdueix una aposta vàlida.');
            return;
        }

        dinersJugador -= quantitatAposta;
        localStorage.setItem('dinersJugador', dinersJugador);

        document.getElementById('diners-totals').textContent = dinersJugador.toFixed(2);

        document.getElementById('seccio-aposta').style.display = 'none';
        agafarCartaButton.style.display = 'inline-block'; 
        plantarseButton.style.display = 'inline-block';

        puntuacioJugador = 0;
        puntuacioBanca = 0;
        cartesJugador = [];
        cartesBanca = [];

        cartesJugador.push(obtenirCartaAleatoria());

        actualitzarJoc();
        taulerJoc.style.display = 'block';
        quantitatApostaInput.disabled = true;
        iniciaPartidaButton.disabled = true;
    });

    function actualitzarJoc() {
        llistaCartesJugador.innerHTML = '';
        cartesJugador.forEach(carta => {
            const img = document.createElement('img');
            img.src = obtenerImagenCarta(carta);
            img.alt = `Carta ${carta}`;
            img.classList.add('carta');
            llistaCartesJugador.appendChild(img);
        });

        puntuacioJugador = calcularPuntuacio(cartesJugador);
        puntuacioJugadorDisplay.textContent = `Score: ${puntuacioJugador}`;

        llistaCartesBanca.innerHTML = '';
        cartesBanca.forEach(carta => {
            const img = document.createElement('img');
            img.src = obtenerImagenCarta(carta);
            img.alt = `Carta ${carta}`;
            img.classList.add('carta');
            llistaCartesBanca.appendChild(img);
        });

        puntuacioBancaDisplay.textContent = `Score: ${puntuacioBanca}`;

        if (puntuacioJugador > 7.5) {
            finalitzarPartida("You've passed 7 ½! you lost");
        }
    }

    agafarCartaButton.addEventListener('click', () => {
        cartesJugador.push(obtenirCartaAleatoria());
        actualitzarJoc();
    });

    plantarseButton.addEventListener('click', () => {
            const cartesBancaDiv = document.getElementById('cartes-banca');
            cartesBancaDiv.style.visibility = 'visible'; 
            cartesBancaDiv.style.overflow = 'visible';   
            tornBanca();
    });

    function tornBanca() {
    llistaCartesBanca.innerHTML = '';
    document.getElementById('cartes-banca').style.display = 'block'; 
    function mostrarCartaBanca(index) {
        if (index < cartesBanca.length) {
            const carta = cartesBanca[index];
            const img = document.createElement('img');
            img.src = obtenerImagenCarta(carta);
            img.alt = `Carta ${carta}`;
            img.classList.add('carta');
            llistaCartesBanca.appendChild(img);

            puntuacioBancaDisplay.textContent = `Score: ${calcularPuntuacio(cartesBanca.slice(0, index + 1))}`;
            
            setTimeout(() => mostrarCartaBanca(index + 1), 1000);
        } else {
            evaluarResultado();
        }
    }

    while (puntuacioBanca < 7.5 && puntuacioBanca <= puntuacioJugador) {
        const carta = obtenirCartaAleatoria();
        cartesBanca.push(carta);
        puntuacioBanca = calcularPuntuacio(cartesBanca);
    }

    mostrarCartaBanca(0);
}

function evaluarResultado() {
    if (puntuacioBanca > 7.5) {
        dinersJugador += quantitatAposta * 2; 
        finalitzarPartida("The bank has exceeded 7 ½! You've won.");
    } else if (puntuacioJugador > puntuacioBanca) {
        dinersJugador += quantitatAposta * 2; 
        finalitzarPartida("You've won!");
    } else if (puntuacioJugador === puntuacioBanca) {
        dinersJugador += quantitatAposta; 
        finalitzarPartida("It's a draw!");
    } else {
        finalitzarPartida("The bank has won.");
    }

    localStorage.setItem('dinersJugador', dinersJugador);

    document.getElementById('diners-totals').textContent = dinersJugador.toFixed(2);
}


function finalitzarPartida(missatge) {
    const seccioAposta = document.getElementById('seccio-aposta');
    const resultatPartida = document.getElementById('resultat-partida');
    const winContainer = document.getElementById('win-container'); 
    const loseContainer = document.getElementById('lose-container'); 
    const drawContainer = document.getElementById('draw-container');

    resultatPartida.textContent = missatge;
    resultatPartida.style.display = 'block';

    seccioAposta.style.display = 'none'; 
    agafarCartaButton.style.display = 'none';
    plantarseButton.style.display = 'none';

    taulerJoc.style.display = 'none';
    const cartesBancaDiv = document.getElementById('cartes-banca');
    cartesBancaDiv.style.visibility = 'hidden';
    cartesBancaDiv.style.overflow = 'hidden';

    quantitatApostaInput.disabled = false;
    iniciaPartidaButton.disabled = false;

    
    if (missatge.includes("You've won")) {
        winContainer.style.display = 'block'; 
        setTimeout(() => {
            winContainer.style.display = 'none'; 
            seccioAposta.style.display = 'flex'; 
        }, 3000);
    }
    else if (missatge.includes("The bank has won.") || missatge.includes("You've exceeded 7 ½! You've lost.") || missatge.includes("You've passed 7 ½! you lost")) {
        loseContainer.style.display = 'block';
        setTimeout(() => {
            loseContainer.style.display = 'none'; 
            seccioAposta.style.display = 'flex'; 
        }, 3000); 
    }
    else if (missatge.includes("It's a draw")) {
        drawContainer.style.display = 'block'; 
        setTimeout(() => {
            drawContainer.style.display = 'none'; 
            seccioAposta.style.display = 'flex'; 
        }, 3000); 
    }
}


});