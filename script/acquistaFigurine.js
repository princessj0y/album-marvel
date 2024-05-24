// Funzione che permetto di acquistare un determinato pacchetto
function pacchetto(numeroEstrarre) {
    var credito = 0;
    // In base al pacchetto selezionato, sceglie il costo dei crediti 
    if (numeroEstrarre == 5) {
        credito = 100;
    } else if (numeroEstrarre == 25) {
        credito = 500;
    } else if (numeroEstrarre == 50) {
        credito = 1000;
    } else if (numeroEstrarre == 100) {
        credito = 1500;
    } else {
        throw ("Errore");
    }

    // Se il credito non basta, mostra modal di avvisso di credito insufficiente 
    if (utente.credito < credito) {
        const myModal = new bootstrap.Modal('#avvisoBanner', {});
        myModal.show();
        return;
    }


    utente.credito = Number(utente.credito) - Number(credito);
    utenti[utente.username] = utente;
    localStorage.setItem('utenti', JSON.stringify(utenti)); //aggiorna il credito nel local storage 
    creditoUtente(); //funzione che si trova in acquistoCrediti.js, aggiona sulla pagina il credito che ha l'utente 

    document.getElementById('sbustaDiv').removeAttribute("hidden");
    document.getElementById('acquistaPacchetti').setAttribute("hidden", '');

    var card = document.getElementById('figurina');

    //Inizio generare  le figurine
    fetch("./script/eroi.json")
        .then(response => response.json())
        .then(personaggi => {
            var estratti = []; // array per i personaggi generati 
            for (var i = 0; i < numeroEstrarre; i++) {
                var rand = getRandomInt(0, personaggi.length);
                var personaggio = personaggi[rand];
                estratti.push(personaggio); // salvo i personaggi in un array 

                if (myAlbum[personaggio.id] == undefined) {
                    myAlbum[personaggio.id] = 1;
                } else {
                    myAlbum[personaggio.id] += 1; // aggiungo numero copie alla figurina 
                }
                // creazione della figurina
                var clone = card.cloneNode(true);
                clone.removeAttribute("hidden");
                clone.id = 'badge-' + i;
                clone.getElementsByClassName('card-title')[0].textContent = personaggio.name;
                var url = personaggio.thumbnail.path + '.' + personaggio.thumbnail.extension;
                clone.getElementsByClassName('card-img-top')[0].src = url;
                card.before(clone);
            }
            localStorage.setItem('myAlbum-' + username, JSON.stringify(myAlbum)); //salvo in album utente
        });
}


