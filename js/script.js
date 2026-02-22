// Funzione per caricare i dati senza rompere il sito
async function fetchSicuro(url) {
    try {
        const res = await fetch(url);
        if (!res.ok) return null;
        return await res.json();
    } catch (e) {
        return null;
    }
}

async function inizializzaSito() {
    // 1. CAROSELLO LIBRI
    const datiLibri = await fetchSicuro('libri.json');
    const track = document.getElementById('track-libri');
    if (datiLibri && datiLibri.libri && track) {
        track.innerHTML = datiLibri.libri
            .filter(l => l.immagine) // Evita errori 404
            .map(l => `
                <div class="slide-item">
                    <a href="${l.link || '#'}" target="_blank">
                        <img src="${l.immagine}" alt="${l.titolo || 'Libro'}">
                    </a>
                </div>`).join('') + track.innerHTML;
    }

    // 2. SIDEBAR DESTRA
    const datiSidebar = await fetchSicuro('sidebar.json');
    const sideContainer = document.getElementById('sidebar-sticky-container');
    if (datiSidebar && datiSidebar.riquadri && sideContainer) {
        sideContainer.innerHTML = datiSidebar.riquadri.map(r => `
            <a href="${r.link || '#'}" target="_blank" class="riquadro-custom">
                <img src="${r.immagine}" alt="${r.titolo || 'Info'}">
                <span>${r.titolo || ''}</span>
            </a>`).join('');
    }

    // 3. FOOTER E TERMINI
    const fDati = await fetchSicuro('footer.json');
    const tDati = await fetchSicuro('termini.json');
    const footerCont = document.getElementById('footer-sito');
    if (footerCont) {
        const motto = fDati?.motto || "Passione per il Fai Da Te";
        const copy = tDati?.copyright || "© 2026 Angelo Cacioppo";
        const disc = tDati?.disclaimer_amazon || "";
        footerCont.innerHTML = `<p>${motto}</p><p>${copy} | ${disc}</p>`;
    }
}

// 4. FUNZIONE CATEGORIE
async function mostraCategoria(nomeFile) {
    if (!nomeFile || nomeFile === 'undefined') return;
    const contenitore = document.getElementById('prodotti-lista');
    const titoloPagina = document.getElementById('titolo-sezione');
    
    if (contenitore) contenitore.innerHTML = "<p>Caricamento...</p>";
    
    const dati = await fetchSicuro(`${nomeFile}.json`);
    if (!dati) {
        if (contenitore) contenitore.innerHTML = "<p>Contenuto non trovato.</p>";
        return;
    }

    if (titoloPagina) titoloPagina.innerText = nomeFile.replace('_', ' ').toUpperCase();
    const chiaveArray = Object.keys(dati)[0];
    const lista = dati[chiaveArray];

    if (Array.isArray(lista) && contenitore) {
        contenitore.innerHTML = lista.map(item => `
            <div class="card-progetto" style="border:1px solid #003366; padding:15px; margin-bottom:10px; border-radius:8px; background:white;">
                <h3>${item.titolo || item.prodotto || 'Progetto'}</h3>
                <p>${item.descrizione || item.info || ''}</p>
                <a href="${item.link || item.link_amazon || item.link_articolo || '#'}" target="_blank" style="color:#cd2121; font-weight:bold;">Apri Dettagli →</a>
            </div>`).join('');
    }
}

function toggleChat() {
    const chat = document.getElementById('bot-container');
    if (chat) chat.style.display = (chat.style.display === 'none' || chat.style.display === '') ? 'flex' : 'none';
}

document.addEventListener('DOMContentLoaded', inizializzaSito);
