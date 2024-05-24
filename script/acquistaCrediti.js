// Funzione che aggiunge uno slash dopo aver digitato due numeri 
function addSlash() {
    var digit = document.getElementById("scadenza").value;
    if (digit.length == 2) {
        document.getElementById("scadenza").value = digit + "/";
        console.log(digit);
    }
}

// Acquisto credito => serve a salvare sullo storage il nuovo credito
function acquista(e) {
    e.preventDefault();
    if (e.target.reportValidity()) {
        //crediti -> local -> del tizio
        var c = document.querySelector("input[name='credito']:checked");
        utente.credito = Number(c.value) + Number(utente.credito);

        utenti[utente.username] = utente;
        localStorage.setItem('utenti', JSON.stringify(utenti));
        location.reload();
    }
}

// Visualizza crediti attuale dell'utente
function creditoUtente() {
    if (utente == undefined) { //
        window.location = "/login.html";
    }
    document.getElementById("credito").innerText = utente.credito + ' Crediti';
}