// CLIENTES
const form = document.getElementById("formCliente");
const lista = document.getElementById("listaClientes");
const totalClientesEl = document.getElementById("totalClientes");
const toast = document.getElementById("toast");

const tecnico = document.getElementById("tecnico");
const cliente = document.getElementById("cliente");
const email = document.getElementById("email");
const telefone = document.getElementById("telefone");

function carregarStorage(chave, valorPadrao) {
  try {
    const dados = JSON.parse(localStorage.getItem(chave));
    return Array.isArray(dados) ? dados : valorPadrao;
  } catch {
    return valorPadrao;
  }
}

let clientes = carregarStorage("clientes", []);

function salvarClientes() {
  localStorage.setItem("clientes", JSON.stringify(clientes));
}

function renderClientes() {
  lista.innerHTML = "";
  totalClientesEl.textContent = clientes.length;

  if (!clientes.length) {
    const vazio = document.createElement("li");
    vazio.className = "empty-state";
    vazio.textContent = "Nenhum cliente cadastrado.";
    lista.appendChild(vazio);
    return;
  }

  clientes.forEach((c, i) => {
    const li = document.createElement("li");
    li.className = "cliente";

    const clienteInfo = document.createElement("div");
    clienteInfo.className = "cliente-info";

    const nomeCliente = document.createElement("span");
    nomeCliente.className = "cliente-nome";
    nomeCliente.textContent = c.cliente;

    const detalhes = document.createElement("div");
    detalhes.className = "cliente-detalhes";

    const emailCliente = document.createElement("span");
    emailCliente.textContent = c.email;

    const telefoneCliente = document.createElement("span");
    telefoneCliente.textContent = c.telefone;

    const tecnicoCliente = document.createElement("span");
    tecnicoCliente.textContent = `Técnico: ${c.tecnico}`;

    detalhes.append(emailCliente, telefoneCliente, tecnicoCliente);
    clienteInfo.append(nomeCliente, detalhes);

    const botoes = document.createElement("div");
    botoes.className = "botoes";

    const excluir = document.createElement("button");
    excluir.className = "excluir";
    excluir.type = "button";
    excluir.textContent = "Excluir";

    const avaliar = document.createElement("button");
    avaliar.className = "avaliar";
    avaliar.type = "button";
    avaliar.textContent = "Avaliação";

    const copiarTelefone = document.createElement("button");
    copiarTelefone.className = "telefone";
    copiarTelefone.type = "button";
    copiarTelefone.textContent = "Telefone";

    botoes.append(excluir, avaliar, copiarTelefone);
    li.append(clienteInfo, botoes);

    excluir.onclick = () => {
      clientes.splice(i, 1);
      salvarClientes();
      renderClientes();
    };

    avaliar.onclick = () => {
      copiarTexto(
`Olá, tudo bem? 😊
Aqui é o "${c.tecnico}" da Soften.
Percebi que a avaliação referente ao meu atendimento ainda está pendente. O formulário foi enviado para seu e-mail "${c.email}".
Se puder dar uma olhadinha (inclusive no Spam), essa avaliação me ajuda muito!
Obrigado pela colaboração! 💙`,
        avaliar,
        "Avaliação",
        "Mensagem de avaliação copiada."
      );
    };

    copiarTelefone.onclick = () => {
      copiarTexto(
        c.telefone.replace(/[^\d+]/g, ""),
        copiarTelefone,
        "Telefone",
        "Telefone copiado."
      );
    };

    lista.appendChild(li);
  });
}

form.addEventListener("submit", e => {
  e.preventDefault();

  clientes.push({
    tecnico: tecnico.value.trim(),
    cliente: cliente.value.trim(),
    email: email.value.trim(),
    telefone: telefone.value.trim()
  });

  salvarClientes();
  renderClientes();

  cliente.value = "";
  email.value = "";
  telefone.value = "";
});

renderClientes();

async function copiarTexto(texto, botao, textoOriginal, mensagem) {
  try {
    await navigator.clipboard.writeText(texto);
    botao.textContent = "Copiado";
    mostrarToast(mensagem);
    setTimeout(() => {
      botao.textContent = textoOriginal;
    }, 1400);
  } catch {
    mostrarToast("Não foi possível copiar automaticamente.");
  }
}

function mostrarToast(mensagem) {
  toast.textContent = mensagem;
  toast.classList.add("visivel");
  setTimeout(() => {
    toast.classList.remove("visivel");
  }, 2200);
}

// AVALIAÇÕES
const stars = [
  document.getElementById("star1"),
  document.getElementById("star2"),
  document.getElementById("star3"),
  document.getElementById("star4"),
  document.getElementById("star5")
];

const mediaEl = document.getElementById("media");
const totalEl = document.getElementById("totalAvaliacoes");
const faltamEl = document.getElementById("faltam");

let avaliacoes = carregarStorage("avaliacoes", [0,0,0,0,0]).slice(0, 5);
while (avaliacoes.length < 5) avaliacoes.push(0);

function salvarAvaliacoes() {
  localStorage.setItem("avaliacoes", JSON.stringify(avaliacoes));
}

function calcularAvaliacoes() {
  let total = 0, soma = 0;

  avaliacoes.forEach((q, i) => {
    total += q;
    soma += q * (i + 1);
  });

  const media = total ? soma / total : 0;
  mediaEl.textContent = media.toFixed(2);
  totalEl.textContent = total;

  if (media < 4.97 && total > 0) {
    const faltam = Math.ceil((4.97 * total - soma) / 0.03);
    faltamEl.textContent = `Faltam ${faltam}× 5⭐`;
  } else {
    faltamEl.textContent = "";
  }
}

stars.forEach((input, i) => {
  input.value = avaliacoes[i];
  input.addEventListener("input", () => {
    avaliacoes[i] = Math.max(0, Number(input.value) || 0);
    input.value = avaliacoes[i];
    salvarAvaliacoes();
    calcularAvaliacoes();
  });
});

calcularAvaliacoes();
