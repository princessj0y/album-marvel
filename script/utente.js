// Mappa degli utenti registrati, indicizzati per username
let utenti = JSON.parse(localStorage.getItem('utenti')) || {};

//Utente loggato in questo momento (sessione corrente)
var username = sessionStorage.getItem("utente");

// prende tutte le indormazione dell'utente
var utente = utenti[username];

//prende l'album dell'utente - mappa di id dell'erore e numero di copie
let myAlbum = JSON.parse(localStorage.getItem('myAlbum-' + username)) || {};

// prende tutti gli scamvi proposti dagli utenti
let scambi = JSON.parse(localStorage.getItem('scambi')) || [];