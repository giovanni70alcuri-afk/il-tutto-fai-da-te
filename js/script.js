async function caricaDati(url) {
    try {
        const res = await fetch(url + '?v=' + new Date().getTime());
        return res.ok ? await res.json() : null;
    } catch (e) { return null; }
}

async function inizializzaSito() {
    // --- 1. SIDEBAR DESTRA (Riquadri Maglietta, Jimbo, ecc.) ---
    const datiDX = await caricaDati('sidebar.json');
    const contenitoreDX = document.getElementById('sidebar-sticky-container');
    
    if (datiDX && Array.isArray(datiDX) && contenitoreDX) {
        contenitoreDX.innerHTML = datiDX
            .filter(r => r.attivo === true) // Mostra solo quelli con "attivo": true
            .map(r => `
                <a href="${r.link}" target="_blank" class="riquadro-custom">
                    <img src="${r.immagine}" alt="${r.descrizione}">
                    <span>${r.descrizione}</span>
                </a>`).join('');
    }

    // --- 2. SIDEBAR SINISTRA (Menu Laterale) ---
    // Nota: Se vuoi che il menu sia dinamico dal JSON, lo script lo caricherebbe qui.
    // Al momento il tuo index.html ha già il menu fisso.

    // --- 3. CAROSELLO LIBRI ---
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

// Funzione per mostrare i video delle categorie
async function mostraCategoria(slug) {
    const area = document.getElementById('prodotti-lista');
    const titolo = document.getElementById('titolo-sezione');
    if (!area) return;

    area.innerHTML = "<p>Caricamento...</p>";
    const dati = await caricaDati(slug + '.json');
    
    if (titolo) titolo.innerText = slug.toUpperCase();

    if (!dati) {
        area.innerHTML = "<p>Nessun video trovato per questa categoria.</p>";
        return;
    }

    // Cerca la lista dentro il file (es. dati.elettronica o dati.video)
    const lista = Array.isArray(dati) ? dati : (dati[slug] || dati.video || dati.elenco_video);

    if (lista) {
        area.innerHTML = lista.map(item => `
            <div class="card-progetto" style="border:1px solid #003366; padding:15px; margin-bottom:20px; background:white; border-radius:8px;">
                <h3>${item.titolo}</h3>
                <p>${item.descrizione}</p>
                <a href="${item.link || item.url || '#'}" target="_blank" style="color:red; font-weight:bold;">Guarda Video →</a>
            </div>`).join('');
    }
}

document.addEventListener('DOMContentLoaded', inizializzaSito);
