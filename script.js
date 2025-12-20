// CLIENTES
const form = document.getElementById("formCliente");
const lista = document.getElementById("listaClientes");

const tecnico = document.getElementById("tecnico");
const cliente = document.getElementById("cliente");
const email = document.getElementById("email");
const telefone = document.getElementById("telefone");

let clientes = JSON.parse(localStorage.getItem("clientes")) || [];

function salvarClientes() {
  localStorage.setItem("clientes", JSON.stringify(clientes));
}

function renderClientes() {
  lista.innerHTML = "";

  clientes.forEach((c, i) => {
    const li = document.createElement("li");
    li.className = "cliente";

    li.innerHTML = `
      <span>${c.cliente}</span>
      <div class="botoes">
        <button class="excluir">Excluir</button>
        <button class="avaliar">Avaliação</button>
        <button class="telefone">Telefone</button>
      </div>
    `;

    li.querySelector(".excluir").onclick = () => {
      clientes.splice(i, 1);
      salvarClientes();
      renderClientes();
    };

    li.querySelector(".avaliar").onclick = () => {
      navigator.clipboard.writeText(
`Olá, tudo bem? 😊
Aqui é o "${c.tecnico}" da Soften.

Aproveitando, a avaliação foi enviada para o e-mail "${c.email}".
Obrigado pela colaboração! 💙`
      );
    };

    li.querySelector(".telefone").onclick = () => {
      navigator.clipboard.writeText(c.telefone.replace(/[\s-]/g, ""));
    };

    lista.appendChild(li);
  });
}

form.addEventListener("submit", e => {
  e.preventDefault();

  clientes.push({
    tecnico: tecnico.value,
    cliente: cliente.value,
    email: email.value,
    telefone: telefone.value
  });

  salvarClientes();
  renderClientes();

  cliente.value = "";
  email.value = "";
  telefone.value = "";
});

renderClientes();

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

let avaliacoes = JSON.parse(localStorage.getItem("avaliacoes")) || [0,0,0,0,0];

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
    let faltam = 0;
    while ((soma + faltam * 5) / (total + faltam) < 4.97) faltam++;
    faltamEl.textContent = `Faltam ${faltam}× 5⭐`;
  } else {
    faltamEl.textContent = "";
  }
}

stars.forEach((input, i) => {
  input.value = avaliacoes[i];
  input.addEventListener("input", () => {
    avaliacoes[i] = Number(input.value) || 0;
    salvarAvaliacoes();
    calcularAvaliacoes();
  });
});

calcularAvaliacoes();
