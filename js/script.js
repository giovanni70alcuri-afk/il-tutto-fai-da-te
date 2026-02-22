async function inizializzaSito() {
    // 1. CARICA LIBRI NEL CAROSELLO
    try {
        const resLibri = await fetch('libri.json');
        if (resLibri.ok) {
            const dati = await resLibri.json();
            const track = document.getElementById('track-libri');
            if (dati.libri && track) {
                let htmlLibri = dati.libri.map(l => `
                    <div class="slide-item">
                        <a href="${l.link_amazon}" target="_blank">
                            <img src="${l.copertina}" alt="${l.titolo}">
                        </a>
                    </div>`).join('');
                track.innerHTML = htmlLibri + htmlLibri;
            }
        }
    } catch (e) { console.error("Errore Libri:", e); }

    // 2. CARICA SIDEBAR DESTRA
    try {
        const resSidebar = await fetch('sidebar.json');
        if (resSidebar.ok) {
            const datiSidebar = await resSidebar.json();
            const container = document.getElementById('sidebar-sticky-container');
            if (container && datiSidebar.riquadri) {
                container.innerHTML = datiSidebar.riquadri.map(r => `
                    <a href="${r.link}" target="_blank" class="riquadro-custom">
                        <img src="${r.immagine}" alt="${r.titolo}">
                        <span>${r.titolo}</span>
                    </a>`).join('');
            }
        }
    } catch (e) { console.error("Errore Sidebar:", e); }

    // 3. CARICA FOOTER E TERMINI
    try {
        const resFooter = await fetch('footer.json');
        const resTermini = await fetch('termini.json');
        
        if (resFooter.ok && resTermini.ok) {
            const fDati = await resFooter.json();
            const tDati = await resTermini.json();
            const footerCont = document.getElementById('footer-sito');
            if (footerCont) {
                // Usiamo l'operatore || per evitare l'errore "undefined" se manca una scritta
                const motto = fDati.motto || "Il Laboratorio di Angelo";
                const copy = tDati.copyright || "© 2026 Angelo Cacioppo";
                const disc = tDati.disclaimer_amazon || "";
                footerCont.innerHTML = `<p>${motto}</p><p>${copy} | ${disc}</p>`;
            }
        }
    } catch (e) { console.error("Errore Footer:", e); }
}

// 4. FUNZIONE PER CARICARE LE CATEGORIE
async function mostraCategoria(nomeFile) {
    if (!nomeFile) return; // Sicurezza contro l'undefined
    try {
        const risposta = await fetch(`${nomeFile}.json`);
        if (!risposta.ok) throw new Error("File non trovato");
        
        const dati = await risposta.json();
        const contenitore = document.getElementById('prodotti-lista');
        const titoloPagina = document.getElementById('titolo-sezione');
        
        if (titoloPagina) titoloPagina.innerText = nomeFile.replace('_', ' ').toUpperCase();
        if (contenitore) {
            contenitore.innerHTML = ""; 
            const chiaveArray = Object.keys(dati)[0];
            const lista = dati[chiaveArray]; 
            
            if (Array.isArray(lista)) {
                lista.forEach(item => {
                    contenitore.innerHTML += `
                        <div class="card-progetto" style="border: 1px solid #003366; padding: 15px; margin-bottom: 10px; border-radius: 8px; background: white;">
                            <h3>${item.titolo || item.prodotto || 'Senza titolo'}</h3>
                            <p>${item.descrizione || item.info || ''}</p>
                            <a href="${item.link_articolo || item.link_amazon}" target="_blank" style="color:#cd2121; font-weight:bold;">Apri Dettagli →</a>
                        </div>`;
                });
            }
        }
    } catch (e) { console.error("Errore Categoria:", e); }
}

function toggleChat() {
    const chat = document.getElementById('bot-container');
    if (chat) chat.style.display = (chat.style.display === 'none' || chat.style.display === '') ? 'flex' : 'none';
}

document.addEventListener('DOMContentLoaded', inizializzaSito);
