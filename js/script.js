async function caricaSito() {
    try {
        // 1. Carica Sidebar Sinistra
        const resSx = await fetch('json/sidebarsx.json');
        const dataSx = await resSx.json();
        const containerSx = document.getElementById('sidebar-left');
        dataSx.forEach(item => {
            if(item.attivo) {
                containerSx.innerHTML += `<a href="${item.link}"><img src="${item.immagine}" width="40"><br>${item.descrizione}</a><br><br>`;
            }
        });

        // 2. Carica Sidebar Destra (Le 6 caselle)
        const resDx = await fetch('json/sidebardx.json');
        const dataDx = await resDx.json();
        const containerDx = document.getElementById('sidebar-right');
        dataDx.forEach(item => {
            if(item.attivo) {
                containerDx.innerHTML += `<a href="${item.link}" class="card-dx"><img src="${item.immagine}"><span>${item.descrizione}</span></a>`;
            }
        });

        // 3. Carica Video (Griglia Centrale)
        const resVid = await fetch('json/video.json');
        const dataVid = await resVid.json();
        const containerVid = document.getElementById('main-video-container');
        dataVid.forEach(v => {
            containerVid.innerHTML += `<div class="video-card"><h3>${v.titolo}</h3></div>`; // Esempio semplificato
        });

    } catch (e) { console.error("Errore caricamento dati", e); }
}

caricaSito();
