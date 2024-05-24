/*Gestione dell'intero album dell'utente*/
function album() {

    const urlParams = new URLSearchParams(window.location.search); //prende parametri dall'url 
    const page = Number(urlParams.get('page') || 1); //prende il numero attuale della pagina (|| or prende la prima pagina se non presente)
    const q = urlParams.get('q') || ""; //prende parametro per la query di ricerca 
    const s = Number(urlParams.get('s') || 0); //prende parametro della select 

    //rende visibili i parametri scelti nella pagina:
    document.getElementById("seleziona").value = s;
    document.getElementById("ricerca").value = q;

    //clono preventivamente 100 carte con placeholder per mostrare contenuto immediatamente all'utente 
    var card = document.getElementById('myCard')
    for (var i = 0; i < 100; i++) {
        var clone = card.cloneNode(true);
        clone.removeAttribute("hidden");
        clone.id = 'badge-' + i;
        card.before(clone);
    }

    // In base ai parametri scelti, effettuo una richiesta diversa:
    // 1. se la select mostra tutte le carte, posso fare la richiesta all'API di marvel
    // 2. se la select richiede solo o carte possedute o doppioni, non posso effettuare
    //    la richiesta all'API perché mi restituirebbe 100 eroi, da cui poi ne toglierei
    //    alcuni, quindi non avrei le pagine di 100 e i numeri di pagina sarebbero sbagliati
    var richiesta;
    if (s == 0) {
        const offset = 100 * (page - 1); // mostro 100 personaggi per pagina, quindi trovo il primo personaggio della pagina corrente 
        var param = "";
        if (q == undefined || q == "") {
            param = "&limit=100&offset=" + offset;
        } else {
            param = "&limit=100&offset=" + offset + "&nameStartsWith=" + q;
        }
        richiesta = getFromMarvel("public/characters", param)
            .then(response => { return { personaggi: response.data.results, total: response.data.total } });
    } else {
        richiesta = fetch("./script/eroi.json")
            .then(response => response.json())
            .then(personaggi => {
                // Filter è una funzione che permette di 'filtrare' l'array in base alle condizioni date
                var query = personaggi.filter(personaggio => {
                    // Tieni solo i personaggi che iniziano con il nome richiesto
                    return personaggio.name.toLowerCase().startsWith(q.toLowerCase());
                });
                if (s == 2) {
                    query = query.filter(personaggio => myAlbum[personaggio.id] > 1); // Tieni i doppioni
                } else {
                    query = query.filter(personaggio => myAlbum[personaggio.id] > 0); // Tieni i posseduti
                }
                return {
                    // Dall'array filtrata, vogliamo prendere solo i 100 personaggi della pagina corrente
                    // Slice quindi prende l'array e restituisce la sotto-array che va dal primo indice al secondo dato
                    // es. pagina 2, restituisce i personaggi da 100 a 200 
                    personaggi: query.slice((page - 1) * 100, (page) * 100),
                    total: query.length
                }
            });
    }

    // Gestisco il risultato della richiesta effettuata stampando le carte sulla pagina 
    richiesta.then(data => {
        const personaggi = data.personaggi;
        if (personaggi.length == 0) { // Condizione che stampa su pagina la scrtta 'Nessun risultato' 
            document.getElementById("zero").removeAttribute("hidden");
        }
        personaggi.forEach((personaggio, i) => { //Stampa le carte 
            var clone = document.getElementById('badge-' + i)
            if (myAlbum[personaggio.id] == undefined || myAlbum[personaggio.id] == 0) {
                clone.getElementsByClassName('card-img-top')[0].classList.add("bw"); //se non posseggo la carta, metto filtro bianco e nero 
            } else if (myAlbum[personaggio.id] != 1) {
                clone.getElementsByClassName('card-text')[0].textContent = myAlbum[personaggio.id] + " copie"; //stampa numero di copie della carta
            } else {
                clone.getElementsByClassName('card-text')[0].textContent = "\u200b"; // stampa un carattere vuoto per mantere il layout se posseggo solo una carta
            }
            clone.getElementsByClassName('card-text')[0].classList.remove("placeholder");
            clone.getElementsByClassName('link')[0].href = "infoPage.html?value=" + personaggio.id;
            clone.getElementsByClassName('card-title')[0].textContent = personaggio.name;
            clone.getElementsByClassName('card-title')[0].classList.remove("placeholder");
            clone.getElementsByClassName('card-body')[0].classList.remove("placeholder-glow");
            var url = personaggio.thumbnail.path + '.' + personaggio.thumbnail.extension;
            clone.getElementsByClassName('card-img-top')[0].src = url;
            card.before(clone);
        })

        // Nell'ultima pagina potrei avere meno di 100 carte. Dato che ho già 
        // stampato 100 placeholder, devo rimuovere quelli in eccesso
        for (var i = personaggi.length; i < 100; i++) {
            var c = document.getElementById('badge-' + i);
            c.parentElement.removeChild(c);
        }

        // Paginazione:
        const totPagine = Math.ceil(data.total / 100); //data.total=numero totale di eroi che soddisfano la ricerca
        var npage = document.getElementById('npage')
        for (let i = totPagine; i >= 1; i--) {
            var clone = npage.cloneNode(true);
            clone.removeAttribute("hidden");
            clone.id = 'page-' + i;
            clone.getElementsByClassName('page-link')[0].textContent = i;
            clone.getElementsByClassName('page-link')[0].href = "index.html?page=" + i + "&q=" + q + "&s=" + s;
            if (i == page) { // se la pagina corrente è uguale a i, metti active 
                clone.getElementsByClassName('page-link')[0].classList.add("active");
            }
            npage.after(clone);
        }

        if (page <= 1) {
            document.getElementById("disabilitaIndietro").classList.add("disabled");
        } else {
            document.getElementById("indietro").href = "index.html?page=" + (page - 1) + "&q=" + q + "&s=" + s;
        }

        if (page >= totPagine) {
            document.getElementById("disabilitaAvanti").classList.add("disabled");
        } else {
            document.getElementById("avanti").href = "index.html?page=" + (page + 1) + "&q=" + q + "&s=" + s;
        }
    });
}

// Funzione che mi conta il numero di figurine che ho in possesso contati singolarmente)
function contaFigurine() {
    fetch("./script/eroi.json")
        .then(response => response.json())
        .then(personaggi => {
            var tot = personaggi.length;
            var inpossesso = Object.keys(myAlbum).filter(personaggio => myAlbum[personaggio] > 0).length; //lunghezza array dato filtro
            document.getElementById("possessoFigurine").textContent = inpossesso + " / " + tot;
        })
}

// Funzione he serve per la ricera di un determinato personaggio: 
// setta i parametri di ricerca, ricardicando la pagina ti rimanda alla funzione sopra (func album)
function cerca(event) {
    if (event && event.preventDefault)
        event.preventDefault();
    var txt = document.getElementById("ricerca").value;
    var s = document.getElementById("seleziona").value;
    window.location = "index.html?q=" + txt + "&s=" + s;
}