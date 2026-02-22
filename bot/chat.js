// Risposte base del Bot
const botResponses = {
    "ciao": "Ciao Angelo! Benvenuto nel tuo laboratorio digitale. Come posso aiutarti oggi?",
    "prezzi": "I prezzi dei prodotti e le offerte aggiornate le trovi nelle sezioni 'Recensioni' e nei link Amazon dei miei libri.",
    "amazon": "Puoi trovare tutti i miei 38 libri cliccando sul carosello in alto o visitando la mia pagina autore su Amazon.",
    "default": "Al momento sto imparando! Puoi chiedermi dei miei 'libri', di 'Amazon', o come 'contattarmi'."
};

// Funzione per inviare il messaggio
async function inviaMessaggio() {
    const input = document.getElementById('user-input');
    const msg = input.value.toLowerCase().trim();
    const chatBox = document.getElementById('chat-display');
    
    if (msg === "") return;

    // Mostra messaggio dell'utente
    chatBox.innerHTML += `<div style="margin-bottom:10px;"><b>Tu:</b> ${input.value}</div>`;
    
    // Pulizia input immediata
    const messaggioUtente = input.value;
    input.value = "";

    // Risposta del Bot con piccolo ritardo per sembrare reale
    setTimeout(async () => {
        let response = "";

        // Logica intelligente per rispondere usando i JSON
        if (msg.includes("contatt") || msg.includes("email") || msg.includes("mail")) {
            try {
                const res = await fetch('contatti.json');
                const contatti = await res.json();
                response = `Puoi scrivermi alla mia Gmail: <b>${contatti.email_destinatario}</b>. Ti risponderò appena esco dal laboratorio!`;
            } catch (e) {
                response = "Puoi contattarmi tramite i link social che vedi nel menu a sinistra.";
            }
        } 
        else if (msg.includes("copyright") || msg.includes("regole")) {
            try {
                const res = await fetch('termini.json');
                const termini = await res.json();
                response = termini.copyright + ". " + termini.disclaimer_amazon;
            } catch (e) {
                response = "Tutti i contenuti sono protetti da copyright Angelo Cacioppo.";
            }
        }
        else {
            // Risposta standard se non trova parole chiave nei JSON
            response = botResponses[msg] || botResponses["default"];
        }

        chatBox.innerHTML += `<div style="margin-bottom:10px; color: #cd2121;"><b>Bot:</b> ${response}</div>`;
        chatBox.scrollTop = chatBox.scrollHeight;
    }, 600);
}

// Permette di inviare il messaggio premendo "INVIO" sulla tastiera
document.getElementById('user-input')?.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        inviaMessaggio();
    }
});
