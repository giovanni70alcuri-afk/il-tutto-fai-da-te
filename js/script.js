async function inizializzaSito() {
    // 1. CARICA LIBRI NEL CAROSELLO
    try {
        const resLibri = await fetch('libri.json');
        const dati = await resLibri.json();
        const track = document.querySelector('.carosello-container');
        
        if (dati.libri && track) {
            let htmlLibri = dati.libri.map(l => `
                <div class="slide-item">
                    <a href="${l.link}" target="_blank">
                        <img src="${l.immagine}" alt="${l.titolo}">
                    </a>
                </div>
            `).join('');
            // Raddoppio per scorrimento infinito
            track.innerHTML = `<div class="slider-track">${htmlLibri + htmlLibri}</div>`;
        }
    } catch (e) { console.error("Errore Libri:", e); }

    // 2. CARICA SIDEBAR DESTRA (Slot Jimdo, Magliette, ecc.)
    try {
        const resSidebar = await fetch('sidebar.json');
        const datiSidebar = await resSidebar.json();
        const container = document.getElementById('sidebar-sticky-container');
        
        if (container && datiSidebar) {
            container.innerHTML = datiSidebar.map(r => {
                // Se lo slot non è attivo (come i tuoi slot VUOTI), non disegnare nulla
                if (!r.attivo) return '';
                
                // Disegna il riquadro per Jimdo o Magliette
                return `
                    <a href="${r.link}" target="_blank" class="riquadro-custom">
                        <img src="${r.immagine}" alt="${r.descrizione}">
                        <span>${r.descrizione}</span>
                    </a>`;
            }).join('');
        }
    } catch (e) { console.error("Errore Sidebar:", e); }
}

// Funzione per Aprire/Chiudere la Chat del Bot
function toggleChat() {
    const chat = document.getElementById('bot-container');
    if (chat.style.display === 'none' || chat.style.display === '') {
        chat.style.display = 'flex';
    } else {
        chat.style.display = 'none';
    }
}

// Avvia tutto al caricamento della pagina
document.addEventListener('DOMContentLoaded', inizializzaSito);
