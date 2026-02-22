async function inizializzaSito() {
    console.log("Laboratorio di Angelo: Avvio sistema...");

    // 1. CARICA LIBRI NEL CAROSELLO
    try {
        const resLibri = await fetch('libri.json');
        if (resLibri.ok) {
            const dati = await resLibri.json();
            const track = document.getElementById('track-libri');
            
            if (dati.libri && track) {
                // Usiamo "l.link" e "l.immagine" perché sono i nomi nel tuo JSON
                let htmlLibri = dati.libri.map(l => `
                    <div class="slide-item">
                        <a href="${l.link || '#'}" target="_blank">
                            <img src="${l.immagine}" alt="${l.titolo || 'Libro'}" onerror="this.style.display='none'">
                        </a>
                    </div>
                `).join('');
                track.innerHTML = htmlLibri + htmlLibri; // Doppia lista per scorrimento fluido
            }
        }
    } catch (e) { console.error("Errore Caricamento Libri:", e); }

    // 2. CARICA SIDEBAR DESTRA
    try {
        const resSidebar = await fetch('sidebar.json');
        if (resSidebar.ok) {
            const datiSidebar = await resSidebar.json();
            const container = document.getElementById('sidebar-sticky-container');
            
            if (container && datiSidebar.riquadri) {
                container.innerHTML = datiSidebar.riquadri.map(r => `
                    <a href="${r.link || '#'}" target="_blank" class="riquadro-custom">
                        <img src="${r.immagine}" alt="${r.titolo || 'Info'}" onerror="this.style.display='none'">
                        <span>${r.titolo || ''}</span>
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
                // Se i dati mancano, usiamo testi di riserva per evitare "undefined"
                const motto = fDati.motto || "Passione per il Fai Da Te";
                const copy = tDati.copyright || "© 2026 Angelo Cacioppo";
                const amazon = tDati.disclaimer_amazon || "";
                footerCont.innerHTML = `<p>${motto}</p><p>${copy} | ${amazon}</p>`;
            }
        }
    } catch (e) { console.error("Errore Footer:", e); }
}

// 4. FUNZIONE PER CARICARE LE CATEGORIE (Elettronica, Restauro, ecc.)
async function mostraCategoria(nomeFile) {
    if (!nomeFile || nomeFile === 'undefined') return;

    try {
        const risposta = await fetch(`${nomeFile}.json`);
        if (!risposta.ok) throw new Error("File non trovato");

        const dati = await risposta.json();
        const contenitore = document.getElementById('prodotti-lista');
        const titoloPagina = document.getElementById('titolo-sezione');
        
        if (titoloPagina) titoloPagina.innerText = nomeFile.replace('_', ' ').toUpperCase();
        
        if (contenitore) {
            contenitore.innerHTML = ""; 

            // Trova il primo array disponibile nel JSON
            const chiaveArray = Object.keys(dati)[0];
            const lista = dati[chiaveArray]; 
            
            if (Array.isArray(lista)) {
                lista.forEach(item => {
                    // Supporta sia "titolo/descrizione" che "prodotto/info"
                    const titolo = item.titolo || item.prodotto || "Progetto";
                    const desc = item.descrizione || item.info || "";
                    const link = item.link_articolo || item.link_amazon || item.link || "#";

                    contenitore.innerHTML += `
                        <div class="card-progetto" style="border: 1px solid #003366; padding: 15px; margin-bottom: 10px; border-radius: 8px; background: white;">
                            <h3>${titolo}</h3>
                            <p>${desc}</p>
                            <a href="${link}" target="_blank" style="color:#cd2121; font-weight:bold;">Apri Dettagli →</a>
                        </div>`;
                });
            }
        }
    } catch (e) { 
        console.error("Errore Categoria:", e);
        const contenitore = document.getElementById('prodotti-lista');
        if (contenitore) contenitore.innerHTML = "<p>Contenuto in arrivo...</p>";
    }
}

// Funzione Chat Bot
function toggleChat() {
    const chat = document.getElementById('bot-container');
    if (chat) {
        chat.style.display = (chat.style.display === 'none' || chat.style.display === '') ? 'flex' : 'none';
    }
}

// Avvio automatico
document.addEventListener('DOMContentLoaded', inizializzaSito);
