function loginUtente(e) {

    e.preventDefault();
    if (e.target.reportValidity()) {
        let utenti = JSON.parse(localStorage.getItem('utenti')) || {};
        var username = document.getElementById("username").value;
        var password = document.getElementById("password").value;

        var utenteTrovato = utenti[username];
        //errore utente
        if (utenteTrovato == undefined) {
            document.getElementById("erroreLogin").removeAttribute("hidden");
            return;
        }
        var passwordTrovata = utenteTrovato.password;
        //errore password
        if (passwordTrovata != password) {
            document.getElementById("erroreLogin").removeAttribute("hidden");
            return;
        }

        document.getElementById("erroreLogin").setAttribute("hidden", "");
        sessionStorage.setItem("utente", username);
        window.location = "/index.html";
    }

}