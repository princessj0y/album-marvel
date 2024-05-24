// Trovo e stampo sulla pagina  tutte le figurine che non ho ancora nella mia collezione
function elencoNonPosseduti() {
    var select = document.getElementById("richiesta");
    fetch("./script/eroi.json")
        .then(response => response.json())
        .then(personaggi => {
            personaggi.forEach(personaggio => {
                if (myAlbum[personaggio.id] == undefined || myAlbum[personaggio.id] == 0) {
                    var option = document.createElement("option");
                    option.value = personaggio.id;
                    option.text = personaggio.name;
                    option.personaggio = personaggio;
                    select.add(option);
                }
            })
            cambiaSfondo(select, document.getElementById('imgRichiesta'));
        });
}

// Trovo e stampo sulla pagina l'elenco delle figurine he hanno almeno più di una copia 
function elencoDoppioni() {
    var select = document.getElementById("proposta");
    fetch("./script/eroi.json")
        .then(response => response.json())
        .then(personaggi => {
            personaggi.forEach(personaggio => {
                if (myAlbum[personaggio.id] > 1) {
                    var option = document.createElement("option");
                    option.value = personaggio.id;
                    option.text = personaggio.name;
                    option.personaggio = personaggio;
                    select.add(option);
                }
            })
            cambiaDoppione();
        });
}

//Quando seleziono da una select cambio l'immagine corrispondente  
function cambiaSfondo(s, img) {
    var p = s.options[s.selectedIndex].personaggio;
    var url = p.thumbnail.path + '.' + p.thumbnail.extension;
    img.src = url;
}
// Funzione che permette di visualizzare le copie di una figurina 
function cambiaDoppione() {
    var s = document.getElementById("proposta");
    var img = document.getElementById('imgProposta')
    var p = s.options[s.selectedIndex].personaggio;
    cambiaSfondo(s, img);
    document.getElementById('nCopie').textContent = myAlbum[p.id] + " copie";

}


function effettuaRichiestaScambio(e) {
    e.preventDefault();
    if (e.target.reportValidity()) {
        var richiesta = document.getElementById('richiesta').value;
        var proposta = document.getElementById('proposta').value;
        //Creo un oggetto di scambio 
        var scambio = {
            utente: utente.username,
            richiede: richiesta,
            propone: proposta
        }
        scambi.push(scambio); //Salvo l'oggetto 
        localStorage.setItem('scambi', JSON.stringify(scambi)); //salvo nel local storage 
        // Mostra il modal di successo  
        const myModal = new bootstrap.Modal('#successModal', {});
        document.getElementById("messaggioSuccess").textContent = "Richiesta di scambio registrata con successo!";
        myModal.show();
        // Quando chiudo il modal page, ricarica la pagina
        const myModalEl = document.getElementById('successModal')
        myModalEl.addEventListener('hidden.bs.modal', event => {
            location.reload();
        })
    }
}

// Gestione dei tre bottoni nella pagina di scambio 
function show(n) {
    if (n == 3) {
        document.getElementById('richiestaScambioDiv').removeAttribute("hidden");
        document.getElementById('storicoDiv').setAttribute("hidden", '');
        document.getElementById('centroScambioDiv').setAttribute("hidden", '');
        document.getElementById('btnRichiesta').classList.add('active');
        document.getElementById('btnStorico').classList.remove('active');
        document.getElementById('btnCentroScambi').classList.remove('active');

    } else if (n == 2) {
        document.getElementById('richiestaScambioDiv').setAttribute("hidden", '');
        document.getElementById('storicoDiv').removeAttribute("hidden");
        document.getElementById('centroScambioDiv').setAttribute("hidden", '');
        document.getElementById('btnRichiesta').classList.remove('active');
        document.getElementById('btnStorico').classList.add('active');
        document.getElementById('btnCentroScambi').classList.remove('active');
    } else {
        document.getElementById('richiestaScambioDiv').setAttribute("hidden", '');
        document.getElementById('storicoDiv').setAttribute("hidden", '');
        document.getElementById('centroScambioDiv').removeAttribute("hidden");
        document.getElementById('btnRichiesta').classList.remove('active');
        document.getElementById('btnStorico').classList.remove('active');
        document.getElementById('btnCentroScambi').classList.add('active');

    }
}

// Funzione che permette di visualizzare tutti gli scambi presenti nel centro scambi che 
// non sono stati ancora completati 
function centroScambi() {
    var card = document.getElementById('myCard')
    fetch("./script/eroi.json")
        .then(response => response.json())
        .then(personaggi => {
            scambi.forEach((scambio, i) => { // prendo tutti gli scambi presenti  nello storage
                if (scambio.scambioEffettuatoCon == undefined) { // prendo solo quelli non conclusi 
                    var clone = card.cloneNode(true);
                    clone.removeAttribute("hidden");
                    clone.id = 'badge-' + i;
                    var propone = personaggi.find(personaggio => personaggio.id == scambio.propone)
                    var richiede = personaggi.find(personaggio => personaggio.id == scambio.richiede)

                    if (scambio.utente == utente.username) { //Non puoi effettuare lo scambio con te stesso
                        clone.getElementsByClassName('scambia-btn')[0].classList.add("disabled");
                        var tooltip = new bootstrap.Tooltip(clone.getElementsByClassName('err-tooltip')[0]);
                        tooltip.setContent({ '.tooltip-inner': 'Non puoi scambiare con te stesso' })
                    } else if (myAlbum[scambio.richiede] <= 1 || myAlbum[scambio.richiede] == undefined) { //non hai la carta che l'utente vuole
                        clone.getElementsByClassName('scambia-btn')[0].classList.add("disabled");
                        var tooltip = new bootstrap.Tooltip(clone.getElementsByClassName('err-tooltip')[0]);
                        tooltip.setContent({ '.tooltip-inner': 'Non hai abbastanza copie della carta richiesta' })
                    } else if ((myAlbum[scambio.propone] != 0 && myAlbum[scambio.propone] != undefined)) { // hai già la carta proposta
                        clone.getElementsByClassName('scambia-btn')[0].classList.add("disabled");
                        var tooltip = new bootstrap.Tooltip(clone.getElementsByClassName('err-tooltip')[0]);
                        tooltip.setContent({ '.tooltip-inner': 'Possiedi già la carta proposta!' })
                    } else {
                        // Bottone 'Scambia'  richiama funzione sotto 
                        clone.getElementsByClassName('scambia-btn')[0].onclick = () => {
                            effettuaScambio(scambio);
                        };
                    }

                    clone.getElementsByClassName('nome-placeholder')[0].textContent = propone.name;
                    clone.getElementsByClassName('eroe-placeholder')[0].textContent = "Richiede: " + richiede.name;
                    clone.getElementsByClassName('username-placeholder')[0].textContent = scambio.utente;

                    var url = propone.thumbnail.path + '.' + propone.thumbnail.extension;
                    clone.getElementsByClassName('card-img-top')[0].src = url;
                    card.before(clone);
                    console.log(scambio, i);
                }
            })

        });

}

// Accetta una richietsa di scambio 
function effettuaScambio(scambio) {
    scambio.scambioEffettuatoCon = utente.username;
    scambio.data = new Date();
    localStorage.setItem('scambi', JSON.stringify(scambi));

    if (myAlbum[scambio.propone] == undefined) {
        myAlbum[scambio.propone] = 1;
    } else {
        myAlbum[scambio.propone]++;
    }
    myAlbum[scambio.richiede]--;

    let albumScambio = JSON.parse(localStorage.getItem('myAlbum-' + scambio.utente)) || {};

    if (albumScambio[scambio.richiede] == undefined) {
        albumScambio[scambio.richiede] = 1;
    } else {
        albumScambio[scambio.richiede]++;
    }
    albumScambio[scambio.propone]--;

    localStorage.setItem('myAlbum-' + username, JSON.stringify(myAlbum));
    localStorage.setItem('myAlbum-' + scambio.utente, JSON.stringify(albumScambio));


    const myModal = new bootstrap.Modal('#successModal', {});
    document.getElementById("messaggioSuccess").textContent = "Scambio effettuato con successo!";
    myModal.show();
    // Dopo aver chiudo il modal, ricarico la pagina 
    const myModalEl = document.getElementById('successModal')
    myModalEl.addEventListener('hidden.bs.modal', event => {
        location.reload();
    })

}

// Visualizzo tutti gli scambi effettuati dall'utente 
function storico() {
    var card = document.getElementById('storicoCard')

    fetch("./script/eroi.json")
        .then(response => response.json())
        .then(personaggi => {
            scambi.forEach((scambio, i) => {
                if (scambio.scambioEffettuatoCon == utente.username ||
                    (scambio.scambioEffettuatoCon != undefined && scambio.utente == utente.username)) {
                    var clone = card.cloneNode(true);
                    clone.removeAttribute("hidden");
                    clone.id = 'storico-' + i;
                    var ottenuto = personaggi.find(personaggio => personaggio.id == scambio.propone)
                    var scambiato = personaggi.find(personaggio => personaggio.id == scambio.richiede)

                    clone.getElementsByClassName('titolo')[0].textContent = ottenuto.name + " - " + scambiato.name;

                    if (scambio.utente == utente.username) {
                        clone.getElementsByClassName('utente')[0].textContent = "Scambio proposto a: " + scambio.scambioEffettuatoCon;
                    } else {
                        clone.getElementsByClassName('utente')[0].textContent = "Scambio accettato da: " + scambio.utente;
                    }
                    var url = ottenuto.thumbnail.path + '.' + ottenuto.thumbnail.extension;
                    clone.getElementsByClassName('img-ottenuto')[0].src = url;
                    url = scambiato.thumbnail.path + '.' + scambiato.thumbnail.extension;
                    clone.getElementsByClassName('img-scambiato')[0].src = url;
                    clone.getElementsByClassName('data')[0].textContent = new Date(scambio.data).toLocaleString();
                    card.before(clone);
                }
            })

        });
}

