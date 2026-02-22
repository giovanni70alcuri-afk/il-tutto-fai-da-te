// Funzione per caricare i dati senza errori
async function fetchSicuro(url) {
    try {
        const res = await fetch(url + '?v=' + new Date().getTime());
        if (!res.ok) return null;
        return await res.json();
    } catch (e) { return null; }
}

async function inizializzaSito() {
    console.log("Ripristino ordine nel laboratorio...");

    // --- 1. CAROSELLO LIBRI ---
    const datiLibri = await fetchSicuro('libri.json');
    const track = document.getElementById('track-libri');
    
    // Puliamo il track prima di inserire (evita doppioni strani)
    if (track) track.innerHTML = ""; 

    if (datiLibri && datiLibri.libri && track) {
        const htmlLibri = datiLibri.libri.map(l => {
            const img = l.immagine || l.copertina;
            const lnk = l.link || l.link_amazon || "#";
            if (!img) return '';
            return `
                <div class="slide-item">
                    <a href="${lnk}" target="_blank">
                        <img src="${img}" alt="${l.titolo || 'Libro'}">
                    </a>
                </div>`;
        }).join('');
        
        // Inserisce SOLO nel track del carosello
        track.innerHTML = htmlLibri + htmlLibri; 
    }

    // --- 2. SIDEBAR DESTRA ---
    const datiSidebar = await fetchSicuro('sidebar.json');
    const sideCont = document.getElementById('sidebar-sticky-container');
    if (sideCont && datiSidebar) {
        sideCont.innerHTML = ""; // Pulizia
        const lista = Array.isArray(datiSidebar) ? datiSidebar : (datiSidebar.riquadri || []);
        sideCont.innerHTML = lista.filter(r => r.attivo !== false).map(r => `
            <a href="${r.link || '#'}" target="_blank" class="riquadro-custom">
                <img src="${r.immagine || r.foto}" alt="${r.descrizione}">
                <span>${r.descrizione}</span>
            </a>`).join('');
    }

    // --- 3. FOOTER ---
    const f = await fetchSicuro('footer.json');
    const t = await fetchSicuro('termini.json');
    const footer = document.getElementById('footer-sito');
    if (footer) {
        footer.innerHTML = `<p>${f?.motto || "Il Tutto Fai Da Te"}</p>
                            <p>${t?.copyright || "© 2026 Angelo Cacioppo"}</p>`;
    }
}

// --- 4. FUNZIONE POST (Categoria) ---
async function mostraCategoria(nomeFile) {
    if (!nomeFile || nomeFile === 'undefined') return;
    
    const contenitorePost = document.getElementById('prodotti-lista');
    const titoloPagina = document.getElementById('titolo-sezione');
    
    if (contenitorePost) contenitorePost.innerHTML = "<p>Caricamento...</p>";

    const dati = await fetchSicuro(`${nomeFile}.json`);
    if (titoloPagina) titoloPagina.innerText = nomeFile.replace('_', ' ').toUpperCase();

    if (!dati) {
        if (contenitorePost) contenitorePost.innerHTML = "<p>Nessun post trovato in questa sezione.</p>";
        return;
    }

    // Trova l'array dei dati (non importa come si chiama nel JSON)
    const chiave = Object.keys(dati)[0];
    const lista = Array.isArray(dati) ? dati : dati[chiave];

    if (Array.isArray(lista) && contenitorePost) {
        contenitorePost.innerHTML = lista.map(item => `
            <div class="card-progetto" style="border:1px solid #003366; padding:15px; margin-bottom:20px; border-radius:8px; background:white; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
                <h3>${item.titolo || item.prodotto || 'Progetto'}</h3>
                <p>${item.descrizione || item.info || ''}</p>
                <a href="${item.link || item.link_amazon || '#'}" target="_blank" style="color:#cd2121; font-weight:bold;">Leggi Dettagli →</a>
            </div>`).join('');
    }
}

document.addEventListener('DOMContentLoaded', inizializzaSito);
