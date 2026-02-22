async function inizializzaSito() {
    // 1. CARICA LIBRI NEL CAROSELLO
    try {
        const resLibri = await fetch('libri.json');
        const dati = await resLibri.json();
        const track = document.querySelector('.carosello-container');
        
        if (dati.libri) {
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

    // 2. CARICA SIDEBAR DESTRA
    try {
        const resSidebar = await fetch('sidebar.json');
        const datiSidebar = await resSidebar.json();
        const container = document.getElementById('sidebar-sticky-container');
        if (container) {
            container.innerHTML = datiSidebar.map(r => {
                if (!r.attivo) return '';
                return `<a href="${r.link}" target="_blank" class="riquadro-custom"><img src="${r.immagine}" alt="${r.descrizione}"><span>${r.descrizione}</span></a>`;
            }).join('');
        }
    } catch (e) { console.error("Errore Sidebar:", e); }
}

// Funzione per Aprire/Chiudere la Chat
function toggleChat() {
    const chat = document.getElementById('bot-container');
    if (chat.style.display === 'none' || chat.style.display === '') {
        chat.style.display = 'flex';
    } else {
        chat.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', inizializzaSito);
