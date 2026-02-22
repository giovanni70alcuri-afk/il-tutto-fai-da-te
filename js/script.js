// --- FUNZIONE DI CARICAMENTO ---
async function caricaDati(url) {
    try {
        const res = await fetch(url + '?v=' + Date.now());
        if (!res.ok) return null;
        return await res.json();
    } catch (e) { 
        console.error("Errore caricamento: " + url);
        return null; 
    }
}

// --- INIZIALIZZAZIONE (SIDEBAR E LIBRI) ---
async function inizializzaSito() {
    // Carica Sidebar Destra
    const datiDX = await caricaDati('sidebar.json');
    const contDX = document.getElementById('sidebar-sticky-container');
    if (datiDX && contDX) {
        contDX.innerHTML = datiDX.filter(i => i.attivo === true).map(i => `
            <div class="riquadro-custom" style="margin-bottom:20px; text-align:center;">
                <a href="${i.link}" target="_blank">
                    <img src="${i.immagine}" alt="${i.descrizione}" style="width:100%; border-radius:8px;">
                    <p><b>${i.descrizione}</b></p>
                </a>
            </div>`).join('');
    }

    // Carica Carosello Libri
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

// --- MOSTRA VIDEO E PROGETTI (INTELLIGENTE) ---
async function mostraCategoria(slug) {
    const area = document.getElementById('prodotti-lista');
    const titoloSezione = document.getElementById('titolo-sezione');
    if (!area) return;

    area.innerHTML = "<p>Caricamento in corso...</p>";
    const dati = await caricaDati(slug + '.json');
    
    if (titoloSezione) titoloSezione.innerText = slug.toUpperCase().replace('_', ' ');

    if (!dati) {
        area.innerHTML = "<p>Nessun contenuto trovato in " + slug + ".json</p>";
        return;
    }

    // Trova la lista giusta dentro il JSON (cerca tutte le tue varianti)
    const lista = Array.isArray(dati) ? dati : (dati[slug] || dati.video || dati.archivio_progetti || dati.recensioni || dati.restauro || dati.elettronica);

    if (lista && lista.length > 0) {
        area.innerHTML = lista.map(item => {
            // "Traduciamo" i nomi diversi in uno solo
            const titolo = item.titolo || item.prodotto || item.attrezzo || "Progetto senza titolo";
            const link = item.link || item.link_articolo || item.link_amazon || item.url || "#";
            const descrizione = item.descrizione || item.descrizione_breve || "";

            return `
                <div class="card-progetto">
                    <h3>${titolo}</h3>
                    <p>${descrizione}</p>
                    <a href="${link}" target="_blank" class="btn-link">Apri Contenuto →</a>
                </div>`;
        }).join('');
    } else {
        area.innerHTML = "<p>Categoria vuota.</p>";
    }
}

// Avvio al caricamento della pagina
document.addEventListener('DOMContentLoaded', inizializzaSito);
