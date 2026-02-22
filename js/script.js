async function inizializzaSito() {
    // 1. CARICA LIBRI NEL CAROSELLO
    try {
        const resLibri = await fetch('libri.json');
        const dati = await resLibri.json();
        const track = document.getElementById('track-libri'); // Usiamo l'ID aggiunto nell'HTML
        
        if (dati.libri && track) {
            let htmlLibri = dati.libri.map(l => `
                <div class="slide-item">
                    <a href="${l.link_amazon}" target="_blank">
                        <img src="${l.copertina}" alt="${l.titolo}">
                    </a>
                </div>
            `).join('');
            track.innerHTML = htmlLibri + htmlLibri; // Raddoppio per scorrimento infinito
        }
    } catch (e) { console.error("Errore Libri:", e); }

    // 2. CARICA SIDEBAR DESTRA
    try {
        const resSidebar = await fetch('sidebar.json');
        const datiSidebar = await resSidebar.json();
        const container = document.getElementById('sidebar-sticky-container');
        
        if (container && datiSidebar.riquadri) {
            container.innerHTML = datiSidebar.riquadri.map(r => `
                <a href="${r.link}" target="_blank" class="riquadro-custom">
                    <img src="${r.immagine}" alt="${r.titolo}">
                    <span>${r.titolo}</span>
                </a>`).join('');
        }
    } catch (e) { console.error("Errore Sidebar:", e); }

    // 3. CARICA FOOTER E TERMINI (Copyright e Disclaimer)
    try {
        const resFooter = await fetch('footer.json');
        const resTermini = await fetch('termini.json');
        const fDati = await resFooter.json();
        const tDati = await resTermini.json();
        const footerCont = document.getElementById('footer-sito');
        if (footerCont) {
            footerCont.innerHTML = `<p>${fDati.motto}</p><p>${tDati.copyright} | ${tDati.disclaimer_amazon}</p>`;
        }
    } catch (e) { console.error("Errore Footer:", e); }
}

// 4. FUNZIONE PER CARICARE LE CATEGORIE (Elettronica, Restauro, ecc.)
async function mostraCategoria(nomeFile) {
    try {
        const risposta = await fetch(`${nomeFile}.json`);
        const dati = await risposta.json();
        const contenitore = document.getElementById('prodotti-lista');
        const titoloPagina = document.getElementById('titolo-sezione');
        
        titoloPagina.innerText = nomeFile.replace('_', ' ').toUpperCase();
        contenitore.innerHTML = ""; 

        // Individua l'array corretto nel JSON (es. "schede_elettronica" o "recensioni")
        const chiaveArray = Object.keys(dati)[0];
        const lista = dati[chiaveArray]; 
        
        lista.forEach(item => {
            contenitore.innerHTML += `
                <div class="card-progetto" style="border: 1px solid #003366; padding: 15px; margin-bottom: 10px; border-radius: 8px; background: white;">
                    <h3>${item.titolo || item.prodotto}</h3>
                    <p>${item.descrizione || item.info || ''}</p>
                    <a href="${item.link_articolo || item.link_amazon}" target="_blank" style="color:#cd2121; font-weight:bold;">Apri Dettagli →</a>
                </div>`;
        });
    } catch (e) { console.error("Errore Categoria:", e); }
}

// Funzione per Aprire/Chiudere la Chat del Bot
function toggleChat() {
    const chat = document.getElementById('bot-container');
    chat.style.display = (chat.style.display === 'none' || chat.style.display === '') ? 'flex' : 'none';
}

// Avvia tutto al caricamento della pagina
document.addEventListener('DOMContentLoaded', inizializzaSito);
