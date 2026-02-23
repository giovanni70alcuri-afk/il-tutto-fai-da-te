async function caricaJSON(nome){
    try{
        const res = await fetch('json/' + nome + '.json?v=' + Date.now());
        return await res.json();
    }catch{
        return null;
    }
}

async function caricaSidebar(){
    const dati = await caricaJSON("sidebar");
    if(!dati) return;

    const sx = document.getElementById("sidebar-left");
    const dx = document.getElementById("sidebar-right");

    const html = dati.filter(x=>x.attivo).map(item=>`
        <div class="card-progetto">
            <img src="${item.immagine}" alt="IMMAGINE" style="width:100%">
            <p>${item.descrizione}</p>
        </div>
    `).join("");

    if(sx) sx.innerHTML = html;
    if(dx) dx.innerHTML = html;
}

async function mostraCategoria(slug){
    const area = document.getElementById("prodotti-lista");
    const titolo = document.getElementById("titolo-sezione");
    titolo.innerText = slug.replace('_', ' ');

    const dati = await caricaJSON(slug);
    if(!dati) return;

    const lista = dati[slug] || dati.video || dati.archivio_progetti || dati.recensioni || dati.elettronica || dati.restauro || [];

    area.innerHTML = lista.map(item=>`
        <div class="card-progetto">
            <h3>${item.titolo || item.attrezzo}</h3>
            <p>${item.descrizione || ""}</p>
            <p><i>IMMAGINE: ${item.immagine}</i></p>
        </div>
    `).join("");
}

document.addEventListener("DOMContentLoaded", caricaSidebar);
