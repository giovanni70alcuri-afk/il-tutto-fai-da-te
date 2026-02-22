async function inizializzaSito() {
    // 1. CARICAMENTO LIBRI NEL CAROSELLO
    try {
        const resLibri = await fetch('libri.json');
        const dati = await resLibri.json();
        
        // Accediamo alla proprietà "libri" del file JSON
        const listaLibri = dati.libri; 
        
        const track = document.querySelector('.carosello-container');
        if (track && listaLibri) {
            let htmlLibri = listaLibri.map(l => `
                <div class="slide-item">
                    <a href="${l.link}" target="_blank">
                        <img src="${l.immagine}" alt="${l.titolo}">
                    </a>
                </div>
            `).join('');
            
            // Creiamo l'effetto scorrimento infinito raddoppiando gli elementi
            track.innerHTML = `<div class="slider-track">${htmlLibri + htmlLibri}</div>`;
        }
    } catch (e) { 
        console.error("Errore nel caricamento libri.json: ", e); 
    }

    // 2. SIDEBAR DESTRA (PRODOTTI/BANNER)
    try {
        const resSidebar = await fetch('sidebar.json');
        const datiSidebar = await resSidebar.json();
        const container = document.getElementById('sidebar-sticky-container');
        
        if (container && datiSidebar) {
            container.innerHTML = datiSidebar.map(r => {
                if (!r.attivo) return '';
                return `
                    <a href="${r.link}" target="_blank" class="riquadro-custom">
                        <img src="${r.immagine}" alt="${r.descrizione}">
                        <span>${r.descrizione}</span>
                    </a>`;
            }).join('');
        }
    } catch (e) { 
        console.error("Errore nel caricamento sidebar.json: ", e); 
    }
}

document.addEventListener('DOMContentLoaded', inizializzaSito);
