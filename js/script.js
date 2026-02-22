// Funzione per leggere i file JSON
async function caricaDati(url) {
    try {
        const risposta = await fetch(url + '?v=' + new Date().getTime());
        if (!risposta.ok) return null;
        return await risposta.json();
    } catch (e) { return null; }
}

async function inizializzaSito() {
    // CARICHIAMO I LIBRI NEL CAROSELLO
    const datiLibri = await caricaDati('libri.json');
    const contenitoreLibri = document.getElementById('track-libri');
    
    if (datiLibri && datiLibri.libri && contenitoreLibri) {
        contenitoreLibri.innerHTML = datiLibri.libri.map(libro => `
            <div class="slide-item">
                <a href="${libro.link || libro.link_amazon || '#'}" target="_blank">
                    <img src="${libro.immagine || libro.copertina}" alt="Libro">
                </a>
            </div>`).join('');
    }

    // CARICHIAMO LA SIDEBAR DESTRA
    const datiSidebar = await caricaDati('sidebar.json');
    const contenitoreSidebar = document.getElementById('sidebar-sticky-container');
    if (datiSidebar && contenitoreSidebar) {
        const lista = Array.isArray(datiSidebar) ? datiSidebar : (datiSidebar.riquadri || []);
        contenitoreSidebar.innerHTML = lista.filter(r => r.attivo !== false).map(r => `
            <a href="${r.link || '#'}" target="_blank" class="riquadro-custom">
                <img src="${r.immagine || r.foto}" alt="Link">
                <span>${r.descrizione || r.titolo}</span>
            </a>`).join('');
    }
}

// FUNZIONE PER MOSTRARE I VIDEO E I POST
async function mostraCategoria(nomeFile) {
    const areaPost = document.getElementById('prodotti-lista');
    const titoloSezione = document.getElementById('titolo-sezione');
    
    if (areaPost) areaPost.innerHTML = "<p>Sto cercando i file nel laboratorio...</p>";

    const dati = await caricaDati(nomeFile + '.json');
    if (titoloSezione) titoloSezione.innerText = nomeFile.toUpperCase();

    if (!dati) {
        if (areaPost) areaPost.innerHTML = "<p>Nessun contenuto trovato per " + nomeFile + "</p>";
        return;
    }

    const chiave = Object.keys(dati)[0];
    const listaPost = Array.isArray(dati) ? dati : dati[chiave];

    if (Array.isArray(listaPost) && areaPost) {
        areaPost.innerHTML = listaPost.map(item => `
            <div style="border:1px solid #ccc; padding:15px; margin-bottom:15px; border-radius:10px; background:#fff;">
                <h3>${item.titolo || item.prodotto}</h3>
                <p>${item.descrizione || item.info || ''}</p>
                <a href="${item.link || item.link_amazon || '#'}" target="_blank" style="color:red; font-weight:bold;">Guarda Dettagli →</a>
            </div>`).join('');
    }
}

document.addEventListener('DOMContentLoaded', inizializzaSito);
