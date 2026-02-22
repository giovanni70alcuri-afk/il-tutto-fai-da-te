const botResponses = {
    "ciao": "Ciao! Benvenuto su Il Tutto Fai Da Te. Come posso aiutarti?",
    "prezzi": "I prezzi sono nel file dati.json. Vuoi che cerchi un prodotto?",
    "default": "Non ho capito, ma sto imparando! Prova a chiedermi di 'idraulica' o 'prezzi'."
};

function inviaMessaggio() {
    const input = document.getElementById('user-input');
    const msg = input.value.toLowerCase();
    const chatBox = document.getElementById('chat-display');
    if (msg.trim() === "") return;
    chatBox.innerHTML += `<div><b>Tu:</b> ${input.value}</div>`;
    setTimeout(() => {
        let response = botResponses[msg] || botResponses["default"];
        chatBox.innerHTML += `<div><b>Bot:</b> ${response}</div>`;
        chatBox.scrollTop = chatBox.scrollHeight;
    }, 500);
    input.value = "";
}