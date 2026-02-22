async function inizializzaSito() {
    // 1. LIBRI
    try {
        const resLibri = await fetch('libri.json');
        const libri = await resLibri.json();
        const track = document.querySelector('.carosello-container');
        let htmlLibri = libri.map(l => `<div class="slide-item"><a href="${l.link}" target="_blank"><img src="${l.immagine}" alt="${l.titolo}"></a></div>`).join('');
        track.innerHTML = `<div class="slider-track">${htmlLibri + htmlLibri}</div>`;
    } catch (e) { console.error("Errore Libri", e); }

    // 2. SIDEBAR DESTRA
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
    } catch (e) { console.error("Errore Sidebar", e); }
}

document.addEventListener('DOMContentLoaded', inizializzaSito);