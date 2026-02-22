const botResponses = {
    "ciao": "Ciao Angelo! Benvenuto nel tuo laboratorio digitale.",
    "amazon": "Trovi i miei 38 libri cliccando sul carosello o visitando la mia pagina autore Amazon.",
    "default": "Chiedimi pure dei miei 'libri' o di come 'contattarmi'."
};

async function inviaMessaggio() {
    const input = document.getElementById('user-input');
    const chatBox = document.getElementById('chat-display');
    if (!input || !chatBox || input.value.trim() === "") return;

    const msg = input.value.toLowerCase();
    chatBox.innerHTML += `<div><b>Tu:</b> ${input.value}</div>`;
    input.value = "";

    setTimeout(async () => {
        let response = "";
        if (msg.includes("contatt") || msg.includes("email")) {
            const res = await fetch('contatti.json').catch(() => null);
            const d = res ? await res.json().catch(() => null) : null;
            response = d?.email_destinatario ? `Scrivimi a: ${d.email_destinatario}` : "Contattami sui social!";
        } else {
            response = botResponses[msg] || botResponses["default"];
        }
        chatBox.innerHTML += `<div style="color:#cd2121;"><b>Bot:</b> ${response}</div>`;
        chatBox.scrollTop = chatBox.scrollHeight;
    }, 500);
}
