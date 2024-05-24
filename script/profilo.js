// Prendo immagine del profilo dell'utente
function immagineProfilo() {
    var idEroe = utente.personaggioPreferito;
    getFromMarvel("public/characters/" + idEroe)
        .then(personaggio => {
            var p = personaggio.data.results[0]
            var url = p.thumbnail.path + '.' + p.thumbnail.extension;
            document.getElementById('imgProfiloNav').src = url;
        }
        )
}

function goToModificaProfilo() {
    window.location = "/modificaProfilo.html";
}

//Prendo le informazioni dell'utente 
function setProfilo() {
    document.getElementById("nome").value = utente.nome;
    document.getElementById("cognome").value = utente.cognome;
    document.getElementById("username").value = utente.username;
    document.getElementById("datanascita").value = utente.datanascita;

}

// Set profilo per navbar
function setProfiloNav() {
    document.getElementById("nomeCognomeNav").textContent = utente.nome + " " + utente.cognome;
    document.getElementById("userNav").textContent = utente.username;
    document.getElementById("dataNascitaNav").textContent = utente.datanascita;

}

function modificaUtente(e) {
    e.preventDefault();
    if (e.target.reportValidity()) {
        utente.nome = document.getElementById("nome").value;
        utente.cognome = document.getElementById("cognome").value;
        utente.datanascita = document.getElementById("datanascita").value;
        utente.personaggioPreferito = document.getElementById("personaggi").value;

        utenti[utente.username] = utente;
        localStorage.setItem('utenti', JSON.stringify(utenti));
        window.location = "/index.html";
    }
}
// Seleziona immagine profilo + visualizzazione 
function personaggi() {
    var select = document.getElementById("personaggi");
    fetch("./script/eroi.json")
        .then(response => response.json())
        .then(personaggi => {
            personaggi.forEach(personaggio => {
                var option = document.createElement("option");
                option.value = personaggio.id;
                option.text = personaggio.name;
                option.personaggio = personaggio;
                select.add(option);
            })
            document.getElementById("personaggi").value = utente.personaggioPreferito;
            cambiaSfondo(select);
        });
}

//Prendo link dell'immagine selezionata
function cambiaSfondo(s) {
    var p = s.options[s.selectedIndex].personaggio;
    var url = p.thumbnail.path + '.' + p.thumbnail.extension;
    document.getElementById('sfondo').src = url;
}

function goToModificaPassword() {
    window.location = "/modificaPassword.html";
}
function controllaPassword(p) {
    var password = p.value;
    // lunga > 8 ; almeno un carattere in maiuscolo e uno in minuscolo ; un numero
    if (password.length < 8) {
        document.getElementById("errorePassword").removeAttribute("hidden");
        return false;
    }
    if (password.search(/[a-z]/) == -1) {
        document.getElementById("errorePassword").removeAttribute("hidden");
        return false;
    }
    if (password.search(/[A-Z]/) == -1) {
        document.getElementById("errorePassword").removeAttribute("hidden");
        return false;
    }
    if (password.search(/[0-9]/) == -1) {
        document.getElementById("errorePassword").removeAttribute("hidden");
        return false;
    }
    document.getElementById("errorePassword").setAttribute('hidden', '');
    return true;
}

function confermaVecchiaPassword() {

    if (utente.password != document.getElementById("oldPassword").value) {
        document.getElementById("erroreOldPassword").removeAttribute("hidden");
        return false;
    }
    document.getElementById("erroreOldPassword").setAttribute("hidden", '');
    return true;
}

function confermaP(conferma) {
    var passwordConferma = conferma.value;
    var password = document.getElementById('password').value;
    if (passwordConferma != password) {
        document.getElementById("errorePasswordConferma").removeAttribute("hidden");
        return false;
    }
    document.getElementById("errorePasswordConferma").setAttribute('hidden', '');
    return true;
}

function modificaPassword(e) {
    e.preventDefault();
    if (e.target.reportValidity() &&
        confermaVecchiaPassword() &&
        confermaP(document.getElementById("confermaPassword")) &&
        controllaPassword(document.getElementById("password"))) {

        utente.password = document.getElementById("password").value;
        utenti[utente.username] = utente;
        localStorage.setItem('utenti', JSON.stringify(utenti));
        window.location = "/index.html";
    }
}

function goToIndex() {
    window.location = "/index.html";
}

function eliminaUtente() {
    delete utenti[utente.username]; //cancella l'utente connesso dalla mappa degli utenti

    localStorage.setItem('utenti', JSON.stringify(utenti)); //salva la modifica
    localStorage.removeItem('myAlbum-' + utente.username);

    //elimina tutti gli scambi proposti ma non ancora eseguiti 
    for (var i = scambi.length - 1; i >= 0; i--) {
        var scambio = scambi[i];
        if (scambio.scambioEffettuatoCon == undefined && scambio.utente == utente.username) {
            scambi.splice(i, 1); //cancella, a partire dall'indice i un elemento 
        }
    }
    localStorage.setItem('scambi', JSON.stringify(scambi));

    sessionStorage.removeItem("utente"); //toglie dalla sessione l'utente
    window.location = "/login.html";
}

