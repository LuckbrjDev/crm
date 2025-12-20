const form = document.getElementById('formCliente');
tecnico: tecnicoInput.value,
empresa: empresa.value,
email: email.value,
telefone: telefone.value,
avaliado: false,
data: new Date().toLocaleDateString('pt-BR')
};


clientes.push(cliente);
localStorage.setItem('clientes', JSON.stringify(clientes));
localStorage.setItem('tecnico', tecnicoInput.value);


empresa.value = email.value = telefone.value = '';
render();
});


busca.addEventListener('input', render);
exportar.addEventListener('click', exportarCSV);


function render(){
lista.innerHTML='';
const termo = busca.value.toLowerCase();


clientes.filter(c=>
c.empresa.toLowerCase().includes(termo) ||
c.tecnico.toLowerCase().includes(termo) ||
c.email.toLowerCase().includes(termo) ||
c.telefone.includes(termo)
).forEach((c,i)=>{
const li=document.createElement('li');
if(c.avaliado) li.classList.add('avaliado');
li.innerHTML=`
<div>
<strong>${c.empresa}</strong><br>
Técnico: ${c.tecnico}<br>
${c.email}<br>
${c.telefone}
</div>
<div class="acoes">
<button onclick="avaliar(${i})">Avaliado</button>
<button onclick="copiar(${i})">Telefone</button>
<button onclick="remover(${i})">Excluir</button>
</div>`;
lista.appendChild(li);
});
}


function remover(i){ clientes.splice(i,1); salvar(); }
function avaliar(i){ clientes[i].avaliado=!clientes[i].avaliado; salvar(); }
function copiar(i){ navigator.clipboard.writeText(clientes[i].telefone.replace(/\D/g,'')); }


function salvar(){ localStorage.setItem('clientes',JSON.stringify(clientes)); render(); }


function exportarCSV(){
let csv='Tecnico,Empresa,Email,Telefone,Avaliado,Data\n';
clientes.forEach(c=>csv+=`"${c.tecnico}","${c.empresa}","${c.email}","${c.telefone}","${c.avaliado?'Sim':'Não'}","${c.data}"\n`);
const a=document.createElement('a');
a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));
a.download='clientes.csv';
a.click();
}


function renderEstrelas(){
let total=0,soma=0,html='';
for(let i=1;i<=5;i++){ html+=`⭐${i}: ${estrelas[i]} `; total+=estrelas[i]; soma+=estrelas[i]*i; }
estrelasDiv.innerHTML=html;
if(!total) return;
const media=soma/total;
mediaDiv.innerText=`Média: ${media.toFixed(2)}`;
if(media<4.97){
const faltam=Math.ceil((4.97*total-soma)/(5-4.97));
faltamDiv.innerText=`Faltam ${faltam} avaliações 5⭐ para 4,97`;
}
}