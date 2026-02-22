// --- CONFIGURAZIONE BOT ---
const botResponses = {
    "ciao": "Ciao Angelo! Benvenuto nel tuo laboratorio digitale.",
    "amazon": "Trovi i miei 38 libri cliccando sul carosello o visitando la mia pagina autore Amazon.",
    "default": "Chiedimi pure dei miei 'libri' o di come 'contattarmi'."
};

// --- FUNZIONI DI UTILITÀ ---
async function caricaDati(url) {
    try {
        const res = await fetch(url + '?v=' + new Date().getTime());
        return res.ok ? await res.json() : null;
    } catch (e) { return null; }
}

// --- LOGICA DEL CHATBOT ---
async function inviaMessaggio() {
    const input = document.getElementById('user-input');
    const chatBox = document.getElementById('chat-display');
    if (!input || !chatBox || input.value.trim() === "") return;

    const msg = input.value.toLowerCase();
    chatBox.innerHTML += `<div><b>Tu:</b> ${input.value}</div>`;
    input.value = "";

    setTimeout(async () => {
        let response = "";
        if (msg.includes("contatt") || msg.includes("email")) {
            const d = await caricaDati('contatti.json');
            response = d?.configurazione_contatto?.destinatario_email ? 
                       `Scrivimi a: ${d.configurazione_contatto.destinatario_email}` : 
                       "Contattami sui social o via email!";
        } else {
            response = botResponses[msg] || botResponses["default"];
        }
        chatBox.innerHTML += `<div style="color:#cd2121;"><b>Bot:</b> ${response}</div>`;
        chatBox.scrollTop = chatBox.scrollHeight;
    }, 500);
}

// --- INIZIALIZZAZIONE SITO (Sidebar e Libri) ---
async function inizializzaSito() {
    // 1. Sidebar Destra
    const datiDX = await caricaDati('sidebar.json');
    const contenitoreDX = document.getElementById('sidebar-sticky-container');
    if (datiDX && Array.isArray(datiDX) && contenitoreDX) {
        contenitoreDX.innerHTML = datiDX
            .filter(item => item.attivo === true)
            .map(item => `
                <div class="riquadro-custom" style="margin-bottom: 20px; text-align: center;">
                    <a href="${item.link}" target="_blank">
                        <img src="${item.immagine}" alt="${item.descrizione}" style="width: 100%; border-radius: 8px;">
                        <p style="margin-top: 5px; font-weight: bold;">${item.descrizione}</p>
                    </a>
                </div>`).join('');
    }

    // 2. Carosello Libri
    const datiLibri = await caricaDati('libri.json');
    const track = document.getElementById('track-libri');
    if (datiLibri && datiLibri.libri && track) {
        track.innerHTML = datiLibri.libri.map(l => `
            <div class="slide-item">
                <a href="${l.link || l.link_amazon}" target="_blank">
                    <img src="${l.immagine || l.copertina}" alt="Libro">
                </a>
            </div>`).join('');
    }
}

// --- FUNZIONE CATEGORIE VIDEO ---
async function mostraCategoria(slug) {
    const area = document.getElementById('prodotti-lista');
    const titolo = document.getElementById('titolo-sezione');
    if (!area) return;

    area.innerHTML = "<p>Caricamento...</p>";
    const dati = await caricaDati(slug + '.json');
    if (titolo) titolo.innerText = slug.toUpperCase().replace('_', ' ');

    if (!dati) {
        area.innerHTML = "<p>Nessun contenuto in " + slug + ".json</p>";
        return;
    }

    const lista = Array.isArray(dati) ? dati : (dati[slug] || dati.video || dati.elenco_video || dati.archivio_progetti);

    if (lista) {
        area.innerHTML = lista.map(item => `
            <div class="card-progetto">
                <h3>${item.titolo || item.prodotto || 'Progetto'}</h3>
                <p>${item.descrizione || item.descrizione_breve || ''}</p>
                <a href="${item.link || item.url || '#'}" target="_blank" class="btn-link">Apri Progetto →</a>
            </div>`).join('');
    }
}

// Partenza al caricamento
document.addEventListener('DOMContentLoaded', inizializzaSito);
