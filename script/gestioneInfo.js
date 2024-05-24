const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('value') || "";

//Dato Id del personnagio, faccio chiamata api con id  e stampo informazioni
function trovaPersonaggio() {

    getFromMarvel("public/characters/" + id) //chiamata api con id 
        .then(personaggio => {
            personaggio = personaggio.data.results[0];
            document.getElementById("nome").textContent = personaggio.name;
            document.getElementById('namePage').textContent = personaggio.name;
            document.getElementById("descrizione").textContent = personaggio.description;
            var url = personaggio.thumbnail.path + '.' + personaggio.thumbnail.extension;
            document.getElementsByClassName('img-fluid')[0].src = url;

            var card = document.getElementById('linkRisorse')
            for (var i = 0; i < personaggio.urls.length; i++) {
                var clone = card.cloneNode(true);
                clone.removeAttribute("hidden");
                clone.getElementsByClassName('reindirizzamento')[0].textContent = personaggio.urls[i].type;
                clone.getElementsByClassName('reindirizzamento')[0].href = personaggio.urls[i].url;
                card.before(clone);
            }
        }
        )
}

//Trovo i fumetti dato id 
function trovaFumetti() {
    getFromMarvel("public/characters/" + id + "/comics")
        .then(fumetti => {
            fumetti = fumetti.data.results;
            var card = document.getElementById('linkRisorseFumetti')
            for (let i = 0; i < fumetti.length; i++) {
                var clone = card.cloneNode(true);
                clone.removeAttribute("hidden");
                clone.getElementsByClassName('reindirizzamentoFumetti')[0].textContent = fumetti[i].title;
                clone.getElementsByClassName('reindirizzamentoFumetti')[0].onclick = () => {
                    showFumetto(fumetti[i].id);
                };
                card.before(clone);
            }
        })
}

// Trovo serie dato id
function trovaSerie() {
    getFromMarvel("public/characters/" + id + "/series")
        .then(serie => {
            serie = serie.data.results;
            var card = document.getElementById('linkRisorseSerie')
            for (let i = 0; i < serie.length; i++) {
                var clone = card.cloneNode(true);
                clone.removeAttribute("hidden");
                clone.getElementsByClassName('reindirizzamentoSerie')[0].textContent = serie[i].title;
                clone.getElementsByClassName('reindirizzamentoSerie')[0].onclick = () => {
                    showSerie(serie[i].id);
                };
                card.before(clone);
            }
        })
}

// Trovo storie dato id
function trovaStorie() {
    getFromMarvel("public/characters/" + id + "/stories")
        .then(storie => {
            storie = storie.data.results;
            var card = document.getElementById('linkRisorseStorie')
            for (let i = 0; i < storie.length; i++) {
                var clone = card.cloneNode(true);
                clone.removeAttribute("hidden");
                clone.getElementsByClassName('reindirizzamentoStorie')[0].textContent = storie[i].title;
                clone.getElementsByClassName('reindirizzamentoStorie')[0].onclick = () => {
                    showStorie(storie[i].id);
                };
                card.before(clone);
            }
        })
}

// Trovo eventi dato id
function trovaEventi() {
    getFromMarvel("public/characters/" + id + "/events")
        .then(eventi => {
            eventi = eventi.data.results;
            var card = document.getElementById('linkRisorseEventi')
            for (let i = 0; i < eventi.length; i++) {
                var clone = card.cloneNode(true);
                clone.removeAttribute("hidden");
                clone.getElementsByClassName('reindirizzamentoEventi')[0].textContent = eventi[i].title;
                clone.getElementsByClassName('reindirizzamentoEventi')[0].onclick = () => {
                    showEventi(eventi[i].id);
                };
                card.before(clone);
            }
        })
}
//Tutte le funzioni in basso servono a visualizzare sul modal della pagina le informazioni 
function showFumetto(id) {
    var modal = document.getElementById('infoModal');
    modal.getElementsByClassName('img-modal')[0].src = "./img/default-image-icon-missing-picture-page-vector-40546530.jpg";
    modal.getElementsByClassName('modal-title')[0].textContent = "";
    modal.getElementsByClassName('desc')[0].innerHTML = "Nessuna descrizione.";

    getFromMarvel("public/comics/" + id)
        .then(fumetto => {

            console.log(fumetto);
            fumetto = fumetto.data.results[0];
            modal.getElementsByClassName('modal-title')[0].textContent = fumetto.title;
            if (fumetto.description != undefined) {
                modal.getElementsByClassName('desc')[0].innerHTML = DOMPurify.sanitize(fumetto.description);
            }
            if (fumetto.thumbnail != undefined) {
                var url = fumetto.thumbnail.path + '.' + fumetto.thumbnail.extension;
                modal.getElementsByClassName('img-modal')[0].src = url;
            }
        })
}

function showSerie(id) {
    var modal = document.getElementById('infoModal');
    modal.getElementsByClassName('img-modal')[0].src = "./img/default-image-icon-missing-picture-page-vector-40546530.jpg";
    modal.getElementsByClassName('modal-title')[0].textContent = "";
    modal.getElementsByClassName('desc')[0].innerHTML = "Nessuna descrizione.";

    getFromMarvel("public/series/" + id)
        .then(serie => {
            serie = serie.data.results[0];
            modal.getElementsByClassName('modal-title')[0].textContent = serie.title;
            if (serie.description != undefined) {
                modal.getElementsByClassName('desc')[0].innerHTML = DOMPurify.sanitize(serie.description);
            }
            if (serie.thumbnail != undefined) {
                var url = serie.thumbnail.path + '.' + serie.thumbnail.extension;
                modal.getElementsByClassName('img-modal')[0].src = url;
            }
        })
}

function showStorie(id) {
    var modal = document.getElementById('infoModal');
    modal.getElementsByClassName('img-modal')[0].src = "./img/default-image-icon-missing-picture-page-vector-40546530.jpg";
    modal.getElementsByClassName('modal-title')[0].textContent = "";
    modal.getElementsByClassName('desc')[0].innerHTML = "Nessuna descrizione.";

    getFromMarvel("public/stories/" + id)
        .then(storia => {
            storia = storia.data.results[0];
            modal.getElementsByClassName('modal-title')[0].textContent = storia.title;
            if (storia.description != undefined) {
                modal.getElementsByClassName('desc')[0].innerHTML = DOMPurify.sanitize(storia.description);
            }
            if (storia.thumbnail != undefined) {
                var url = storia.thumbnail.path + '.' + storia.thumbnail.extension;
                modal.getElementsByClassName('img-modal')[0].src = url;
            }
        })
}

function showEventi(id) {
    var modal = document.getElementById('infoModal');
    modal.getElementsByClassName('img-modal')[0].src = "./img/default-image-icon-missing-picture-page-vector-40546530.jpg";
    modal.getElementsByClassName('modal-title')[0].textContent = "";
    modal.getElementsByClassName('desc')[0].innerHTML = "Nessuna descrizione.";

    getFromMarvel("public/events/" + id)
        .then(evento => {
            evento = evento.data.results[0];
            modal.getElementsByClassName('modal-title')[0].textContent = evento.title;

            if (evento.description != undefined) {
                modal.getElementsByClassName('desc')[0].innerHTML = DOMPurify.sanitize(evento.description);
            }
            if (evento.thumbnail != undefined) {
                var url = evento.thumbnail.path + '.' + evento.thumbnail.extension;
                modal.getElementsByClassName('img-modal')[0].src = url;
            }

        })
}