document.addEventListener("DOMContentLoaded", () => {
    const nomUsuari = localStorage.getItem('nomUsuari') || 'Jugador';
    document.getElementById('nom-usuari').textContent = nomUsuari;

    const iniciaPartidaButton = document.getElementById('inicia-partida');
    const agafarCartaButton = document.getElementById('agafar-carta');
    const plantarseButton = document.getElementById('plantarse');
    const reiniciarButton = document.getElementById('reiniciar-partida');
    const revisarCartesButton = document.getElementById('revisar-cartes');
    const infoUsuari = document.getElementById('info-usuari');
    const quantitatApostaInput = document.getElementById('quantitat-aposta');
    const llistaCartesJugador = document.getElementById('llista-cartes-jugador');
    const puntuacioJugadorDisplay = document.getElementById('puntuacio-jugador');
    const llistaCartesBanca = document.getElementById('llista-cartes-banca');
    const puntuacioBancaDisplay = document.getElementById('puntuacio-banca');
    const taulerJoc = document.getElementById('tauler-joc');
    const finalPartida = document.getElementById('final-partida');
    const estatPartida = document.getElementById('estat-partida');
    const missatgeFinal = document.getElementById('missatge-final');

    let dinersJugador = 100;
    let puntuacioJugador = 0;
    let puntuacioBanca = 0;
    let cartesJugador = [];
    let cartesBanca = [];
    let quantitatAposta = 0;

    const valorsCartes = {
        1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, "J": 0.5, "Q": 0.5, "K": 0.5
    };

    function obtenirCartaAleatoria() {
        const valorCarta = Math.floor(Math.random() * 7) + 1;
        return valorCarta;
    }

    function calcularPuntuacio(cartes) {
        return cartes.reduce((total, carta) => total + valorsCartes[carta], 0);
    }

    iniciaPartidaButton.addEventListener('click', () => {
        quantitatAposta = parseInt(quantitatApostaInput.value);

        if (isNaN(quantitatAposta) || quantitatAposta <= 0 || quantitatAposta > dinersJugador) {
            alert('Si us plau, introdueix una aposta vàlida.');
            return;
        }

        dinersJugador -= quantitatAposta;
        puntuacioJugador = 0;
        puntuacioBanca = 0;
        cartesJugador = [];
        cartesBanca = [];
        
        cartesJugador.push(obtenirCartaAleatoria());
        cartesBanca.push(obtenirCartaAleatoria());
        
        actualitzarJoc();
        taulerJoc.style.display = 'block';
        quantitatApostaInput.disabled = true;
        iniciaPartidaButton.disabled = true;
    });

    function actualitzarJoc() {
        llistaCartesJugador.innerHTML = cartesJugador.join(', ');
        puntuacioJugador = calcularPuntuacio(cartesJugador);
        puntuacioJugadorDisplay.textContent = `Puntuació: ${puntuacioJugador}`;
        
        llistaCartesBanca.innerHTML = cartesBanca.join(', ');
        puntuacioBancaDisplay.textContent = `Puntuació: ${puntuacioBanca}`;
        
        if (puntuacioJugador > 7.5) {
            finalitzarPartida("Has superat 7 ½! Has perdut.");
        }
    }

    agafarCartaButton.addEventListener('click', () => {
        cartesJugador.push(obtenirCartaAleatoria());
        actualitzarJoc();
    });

    plantarseButton.addEventListener('click', () => {
        tornBanca();
    });

    function tornBanca() {
        while (puntuacioBanca < 7.5) {
            const decisioAleatoria = Math.random();
            if (puntuacioBanca < 5.5 || (decisioAleatoria > 0.3 && puntuacioBanca < 7)) {
                cartesBanca.push(obtenirCartaAleatoria());
                puntuacioBanca = calcularPuntuacio(cartesBanca);
            } 
            else {
                break;
            }
        }

        if (puntuacioBanca > 7.5) {
            dinersJugador += quantitatAposta * 2;
            finalitzarPartida("La banca ha superat 7 ½! Has guanyat.");
        } 
        else if (puntuacioBanca > puntuacioJugador) {
            finalitzarPartida("La banca ha guanyat!");
        } 
        else if (puntuacioBanca < puntuacioJugador) {
            dinersJugador += quantitatAposta * 2;
            finalitzarPartida("Has guanyat!");
        } 
        else {
            dinersJugador += quantitatAposta;
            finalitzarPartida("És un empat.");
        }
    }

function finalitzarPartida(missatge) {
    estatPartida.textContent = missatge;


    missatgeFinal.innerHTML = `
        ${missatge}<br><br>
        <strong>Les teves cartes:</strong> ${cartesJugador.join(", ")} (Puntuació: ${puntuacioJugador})<br>
        <strong>Cartes de la banca:</strong> ${cartesBanca.join(", ")} (Puntuació: ${puntuacioBanca})
    `;


    if (missatge.includes("has guanyat")) {
        dinersJugador += quantitatAposta; 
        reiniciarButton.classList.remove("perdut");
        reiniciarButton.classList.add("guanyat");
    } else if (missatge.includes("has perdut")) {
        dinersJugador -= quantitatAposta;
        reiniciarButton.classList.remove("guanyat");
        reiniciarButton.classList.add("perdut");
    }

    taulerJoc.style.display = "none";
    finalPartida.style.display = "block";
    reiniciarButton.style.display = "block"; 
    infoUsuari.textContent = `Jugador: ${nomUsuari} - ${dinersJugador} €`;
}

reiniciarButton.addEventListener("click", () => {
    quantitatApostaInput.disabled = false;
    iniciaPartidaButton.disabled = false;
    quantitatApostaInput.value = "";
    cartesJugador = [];
    cartesBanca = [];
    puntuacioJugador = 0;
    puntuacioBanca = 0;

    taulerJoc.style.display = "none";
    finalPartida.style.display = "none";
    infoUsuari.textContent = `Jugador: ${nomUsuari} - ${dinersJugador} €`;
    
    reiniciarButton.classList.remove("guanyat", "perdut");
    reiniciarButton.style.display = "none";
});


});
