const form = document.getElementById('formCliente');
const lista = document.getElementById('listaClientes');


let clientes = JSON.parse(localStorage.getItem('clientes')) || [];


renderizar();


form.addEventListener('submit', e => {
e.preventDefault();


const cliente = {
tecnico: tecnico.value,
empresa: empresa.value,
email: email.value,
telefone: telefone.value
};


clientes.push(cliente);
salvar();
form.reset();
});


function salvar() {
localStorage.setItem('clientes', JSON.stringify(clientes));
renderizar();
}


function renderizar() {
lista.innerHTML = '';


clientes.forEach((c, i) => {
const li = document.createElement('li');
li.className = 'cliente';


li.innerHTML = `
<div>
<strong>${c.empresa}</strong>
Técnico: ${c.tecnico}<br>
Email: ${c.email}<br>
Tel: ${c.telefone}
</div>
<div class="acoes">
<button class="btn-avaliacao" onclick="pedirAvaliacao(${i})">Avaliação</button>
<button class="btn-telefone" onclick="copiarTelefone(${i})">Telefone</button>
<button class="btn-excluir" onclick="excluir(${i})">Excluir</button>
</div>
`;


lista.appendChild(li);
});
}


function excluir(index) {
clientes.splice(index, 1);
salvar();
}


function pedirAvaliacao(index) {
const c = clientes[index];
const msg = `Olá, tudo bem? 😊\nAqui é o ${c.tecnico} da Soften. Só passando para confirmar se ficou alguma dúvida ou pendência do nosso último atendimento — posso te ajudar em algo mais?\n\nAproveitando, percebi que a avaliação ainda está pendente. O formulário foi enviado para seu e-mail ${c.email}. Se puder dar uma olhadinha (inclusive no Spam), isso me ajuda muito!\n\nObrigado pela colaboração! 💙`;


navigator.clipboard.writeText(msg);
alert('Mensagem copiada para a área de transferência!');
}


function copiarTelefone(index) {
let tel = clientes[index].telefone;
tel = tel.replace(/[^0-9]/g, '');
navigator.clipboard.writeText(tel);
alert('Telefone copiado: ' + tel);
}