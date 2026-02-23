async function caricaBot(){
    const res = await fetch("chatbot/chatbot.json");
    return await res.json();
}

function toggleChat(){
    document.getElementById("chat-box").classList.toggle("chat-chiusa");
}

document.getElementById("chat-toggle").onclick = toggleChat;

async function inviaMessaggio(){
    const input = document.getElementById("chat-input");
    const chat = document.getElementById("chat-messages");
    if(!input.value.trim()) return;

    const msgUtente = input.value.toLowerCase();
    chat.innerHTML += `<div><b>tu:</b> ${input.value}</div>`;

    const cfg = await caricaBot();
    let risposta = cfg.default;

    // Automazione: se l'utente nomina una categoria, il bot la apre
    if(msgUtente.includes("elettronica")) {
        risposta = "Apro la sezione elettronica...";
        mostraCategoria('elettronica');
    } else if(msgUtente.includes("restauro")) {
        risposta = "Certamente, ecco il restauro.";
        mostraCategoria('restauro');
    } else if(msgUtente.includes("libri")) {
        risposta = "Ti consiglio di guardare i miei libri.";
        mostraCategoria('libri');
    }

    chat.innerHTML += `<div style='color:red'><b>bot:</b> ${risposta}</div>`;
    input.value="";
    chat.scrollTop = chat.scrollHeight;
}
