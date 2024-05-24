/* Controlla requisiti della password:
- stringa almeno lunga 8 caratteri 
- almeno un caraterre maiuscolo e uno miniscolo
- almeno un carattere numerico
*/
function controllaPassword(p) {
    var password = p.value;

    if (password.length < 8) { // stringa > 8
        document.getElementById("errorePassword").removeAttribute("hidden");
        return false;
    }
    if (password.search(/[a-z]/) == -1) { // carattere minuscolo
        document.getElementById("errorePassword").removeAttribute("hidden");
        return false;
    }
    if (password.search(/[A-Z]/) == -1) { //carattere maisculo 
        document.getElementById("errorePassword").removeAttribute("hidden");
        return false;
    }
    if (password.search(/[0-9]/) == -1) { //carattere numerico
        document.getElementById("errorePassword").removeAttribute("hidden");
        return false;
    }
    document.getElementById("errorePassword").setAttribute('hidden', '');
    return true;
}

//Controlla se la password e la password di conferma coincidono
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

//Controlla che l'username scelto non sia già presente nello storage 
function verificaUsername(user) {
    let utenti = JSON.parse(localStorage.getItem('utenti')) || {}; //mappa degli utenti {}
    var username = user.value;
    var utenteTrovato = utenti[username];

    if (utenteTrovato != undefined) {
        document.getElementById("erroreUsername").removeAttribute("hidden");
        return false;
    }
    document.getElementById("erroreUsername").setAttribute('hidden', '');
    return true;
}

// Funzione che cambia l'immagine di profilo dato il personaggio scelto
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
            cambiaSfondo(select); //chiama funzione
        });

}

// Trova url del personaggio selezionato 
function cambiaSfondo(s) {
    var p = s.options[s.selectedIndex].personaggio;
    var url = p.thumbnail.path + '.' + p.thumbnail.extension;
    document.getElementById('sfondo').src = url;
}

//Salva tutte le infomazioni dell'utente nel local storage 
function salvaUtente(e) {
    //username, nome, cognome, password, datadinascita,eroepreferito, CREDITO = 0
    e.preventDefault();
    if (e.target.reportValidity() &&
        confermaP(document.getElementById("confermaPassword")) &&
        controllaPassword(document.getElementById("password")) &&
        verificaUsername(document.getElementById("username"))) {

        let credito = 0;
        var utente = {
            username: document.getElementById('username').value,
            nome: document.getElementById('nome').value,
            cognome: document.getElementById('cognome').value,
            password: document.getElementById('password').value,
            datanascita: document.getElementById('datanascita').value,
            personaggioPreferito: document.getElementById('personaggi').value,
            credito: credito
        };

        let utenti = JSON.parse(localStorage.getItem('utenti')) || {};
        var utenteTrovato = utenti[utente.username];
        if (utenteTrovato != undefined) {
            return;
        }
        utenti[utente.username] = utente;
        localStorage.setItem('utenti', JSON.stringify(utenti));
        window.location = "/login.html";
    }

}




