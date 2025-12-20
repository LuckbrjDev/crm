// ====== CLIENTES ======
const form = document.getElementById("formCliente");
const listaClientes = document.getElementById("listaClientes");

const tecnicoInput = document.getElementById("tecnico");
const clienteInput = document.getElementById("cliente");
const emailInput = document.getElementById("email");
const telefoneInput = document.getElementById("telefone");

let clientes = JSON.parse(localStorage.getItem("clientes")) || [];

function salvarClientes() {
  localStorage.setItem("clientes", JSON.stringify(clientes));
}

function renderClientes() {
  listaClientes.innerHTML = "";

  clientes.forEach((c, index) => {
    const li = document.createElement("li");
    li.className = "cliente";

    const nome = document.createElement("span");
    nome.textContent = c.cliente;

    const botoes = document.createElement("div");
    botoes.className = "botoes";

    const btnExcluir = document.createElement("button");
    btnExcluir.textContent = "Excluir";
    btnExcluir.className = "excluir";
    btnExcluir.onclick = () => {
      clientes.splice(index, 1);
      salvarClientes();
      renderClientes();
    };

    const btnAvaliar = document.createElement("button");
    btnAvaliar.textContent = "Pedir Avaliação";
    btnAvaliar.className = "avaliar";
    btnAvaliar.onclick = () => {
      const msg = `Olá, tudo bem? 😊
Aqui é o "${c.tecnico}" da Soften.
Só passando para confirmar se ficou alguma dúvida ou pendência do nosso último atendimento — posso te ajudar em algo mais?

Aproveitando, percebi que a avaliação ainda está pendente.
O formulário foi enviado para seu e-mail "${c.email}".
Se puder dar uma olhadinha (inclusive no Spam), isso me ajuda muito!

Obrigado pela colaboração! 💙`;
      navigator.clipboard.writeText(msg);
      alert("Mensagem copiada!");
    };

    const btnTelefone = document.createElement("button");
    btnTelefone.textContent = "Telefone";
    btnTelefone.className = "telefone";
    btnTelefone.onclick = () => {
      const limpo = c.telefone.replace(/[\s-]/g, "");
      navigator.clipboard.writeText(limpo);
      alert("Telefone copiado!");
    };

    botoes.append(btnExcluir, btnAvaliar, btnTelefone);
    li.append(nome, botoes);
    listaClientes.appendChild(li);
  });
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const novoCliente = {
    tecnico: tecnicoInput.value,
    cliente: clienteInput.value,
    email: emailInput.value,
    telefone: telefoneInput.value
  };

  clientes.push(novoCliente);
  salvarClientes();
  renderClientes();

  clienteInput.value = "";
  emailInput.value = "";
  telefoneInput.value = "";
});

renderClientes();

// ====== AVALIAÇÕES ======
const stars = [1, 2, 3, 4, 5].map(n => document.getElementById(`star${n}`));
const mediaEl = document.getElementById("media");
const totalEl = document.getElementById("totalAvaliacoes");
const faltamEl = document.getElementById("faltam");

let avaliacoes = JSON.parse(localStorage.getItem("avaliacoes")) || [0, 0, 0, 0, 0];

function salvarAvaliacoes() {
  localStorage.setItem("avaliacoes", JSON.stringify(avaliacoes));
}

function calcularAvaliacoes() {
  let total = 0;
  let soma = 0;

  avaliacoes.forEach((qtd, i) => {
    total += qtd;
    soma += qtd * (i + 1);
  });

  const media = total === 0 ? 0 : soma / total;

  mediaEl.textContent = media.toFixed(2);
  totalEl.textContent = total;

  if (media < 4.97 && total > 0) {
    let faltam = 0;
    let novaMedia = media;

    while (novaMedia < 4.97) {
      faltam++;
      novaMedia = (soma + faltam * 5) / (total + faltam);
    }

    faltamEl.textContent = `Faltam ${faltam} avaliações 5⭐ para atingir média 4,97`;
  } else {
    faltamEl.textContent = "";
  }
}

stars.forEach((input, index) => {
  input.value = avaliacoes[index];
  input.addEventListener("input", () => {
    avaliacoes[index] = Number(input.value) || 0;
    salvarAvaliacoes();
    calcularAvaliacoes();
  });
});

calcularAvaliacoes();
