async function caricaDati(url) {
    try {
        const res = await fetch(url + '?v=' + new Date().getTime());
        return res.ok ? await res.json() : null;
    } catch (e) { return null; }
}

async function inizializzaSito() {
    // --- LATO DESTRO (Maglietta, Jimbo, ecc.) ---
    const datiDX = await caricaDati('sidebar.json');
    const contenitoreDX = document.getElementById('sidebar-sticky-container');
    if (datiDX && Array.isArray(datiDX) && contenitoreDX) {
        // Mostra solo quelli dove hai messo "attivo": true
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

    // --- CAROSELLO LIBRI (Sempre attivo) ---
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

// Funzione per mostrare i Video
async function mostraCategoria(slug) {
    const area = document.getElementById('prodotti-lista');
    const titolo = document.getElementById('titolo-sezione');
    if (!area) return;

    area.innerHTML = "<p>Caricamento in corso...</p>";
    const dati = await caricaDati(slug + '.json');
    
    if (titolo) titolo.innerText = slug.toUpperCase().replace('_', ' ');

    if (!dati) {
        area.innerHTML = "<p>Nessun contenuto trovato in " + slug + ".json</p>";
        return;
    }

    // Cerca la lista dentro il file (si adatta a come lo hai scritto tu)
    const lista = Array.isArray(dati) ? dati : (dati[slug] || dati.video || dati.elenco_video || dati.archivio_progetti);

    if (lista) {
        area.innerHTML = lista.map(item => `
            <div class="card-video" style="border:1px solid #003366; padding:20px; margin-bottom:20px; background:#fff; border-radius:10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
                <h3>${item.titolo || item.prodotto}</h3>
                <p>${item.descrizione || item.descrizione_breve || ''}</p>
                <a href="${item.link || item.link_articolo || '#'}" target="_blank" style="color:#cd2121; font-weight:bold; text-decoration:none;">Apri Progetto →</a>
            </div>`).join('');
    }
}

document.addEventListener('DOMContentLoaded', inizializzaSito);
