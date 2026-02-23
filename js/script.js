// Funzione per caricare le Sidebar
async function caricaSidebars() {
    try {
        // Carica Sidebar Sinistra (Social/Menu)
        const resSx = await fetch('json/sidebarsx.json');
        const dataSx = await resSx.json();
        const containerSx = document.getElementById('sidebar-left');
        
        dataSx.forEach(item => {
            if(item.attivo) {
                containerSx.innerHTML += `
                    <a href="${item.link}" style="text-decoration:none; color:black;">
                        <img src="${item.immagine}" style="width:40px; height:40px;"><br>
                        <small>${item.descrizione}</small>
                    </a>`;
            }
        });

        // Carica Sidebar Destra (Magliette/Jimbo)
        const resDx = await fetch('json/sidebardx.json');
        const dataDx = await resDx.json();
        const containerDx = document.getElementById('sidebar-right');
        
        dataDx.forEach(item => {
            if(item.attivo) {
                containerDx.innerHTML += `
                    <a href="${item.link}" class="card-dx">
                        <img src="${item.immagine}" alt="foto">
                        <span>${item.descrizione}</span>
                    </a>`;
            }
        });

    } catch (error) {
        console.error("Errore nel caricamento dei dati JSON:", error);
    }
}

// Avvia tutto al caricamento della pagina
window.onload = caricaSidebars;
