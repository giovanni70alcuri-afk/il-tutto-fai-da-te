// Funzione di utilità per caricare i JSON in sicurezza
async function fetchJSON(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Errore HTTP! Stato: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error(`Impossibile caricare ${url}:`, error);
        return null; // Restituisce null invece di bloccare tutto
    }
}

async function inizializzaSito() {
    console.log("Inizializzazione laboratorio in corso...");

    // 1. CAROSELLO LIBRI
    const datiLibri = await fetchJSON('libri.json');
    const track = document.getElementById('track-libri');
    if (datiLibri && datiLibri.libri && track) {
        track.innerHTML = datiLibri.libri.map(l => `
            <div class="slide-item">
                <a href="${l.link_amazon || '#'}" target="_blank">
                    <img src="${l.copertina}" alt="${l.titolo}" onerror="this.src='img/placeholder.jpg'">
                </a>
            </div>`).join('') + track.innerHTML; // Raddoppio gestito dinamicamente
    } else {
        if (track) track.parentElement.style.display = 'none'; // Nascondi se vuoto
    }

    // 2. SIDEBAR DESTRA
    const datiSidebar = await fetchJSON('sidebar.json');
    const containerSide = document.getElementById('sidebar-sticky-container');
    if (datiSidebar && datiSidebar.riquadri && containerSide) {
        containerSide.innerHTML = datiSidebar.riquadri.map(r => `
            <a href="${r.link}" target="_blank" class="riquadro-custom">
                <img src="${r.immagine}" alt="${r.titolo}" onerror="this.style.display='none'">
                <span>${r.titolo}</span>
            </a>`).join('');
    }

    // 3. FOOTER E TERMINI (Caricamento Parallelo)
    const [fDati, tDati] = await Promise.all([
        fetchJSON('footer.json'),
        fetchJSON('termini.json')
    ]);

    const footerCont = document.getElementById('footer-sito');
    if (footerCont) {
        const motto = fDati?.motto || "Il Tutto Fai Da Te";
        const copy = tDati?.copyright || "© 2026 Angelo Cacioppo";
        const disc = tDati?.disclaimer_amazon || "";
        footerCont.innerHTML = `<p>${motto}</p><p style="font-size:0.7rem">${copy} | ${disc}</p>`;
    }
}

// 4. MOSTRA CATEGORIA (con protezione undefined)
async function mostraCategoria(nomeFile) {
    if (!nomeFile || typeof nomeFile !== 'string') return;

    const contenitore = document.getElementById('prodotti-lista');
    const titoloPagina = document.getElementById('titolo-sezione');
    
    if (contenitore) contenitore.innerHTML = "<p>Caricamento in corso...</p>";

    const dati = await fetchJSON(`${nomeFile}.json`);
    
    if (!dati) {
        if (contenitore) contenitore.innerHTML = "<p>Contenuto non disponibile al momento.</p>";
        return;
    }

    if (titoloPagina) titoloPagina.innerText = nomeFile.replace('_', ' ').toUpperCase();
    
    const chiaveArray = Object.keys(dati)[0];
    const lista = dati[chiaveArray];

    if (Array.isArray(lista) && contenitore) {
        contenitore.innerHTML = lista.map(item => `
            <div class="card-progetto">
                <h3>${item.titolo || item.prodotto || 'Progetto'}</h3>
                <p>${item.descrizione || item.info || ''}</p>
                <a href="${item.link_articolo || item.link_amazon || '#'}" target="_blank" class="btn-link">Dettagli →</a>
            </div>`).join('');
    }
}

document.addEventListener('DOMContentLoaded', inizializzaSito);
