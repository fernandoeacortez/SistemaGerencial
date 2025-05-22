// Login
function verificarLogin() {
  const usuario = document.getElementById("usuario").value;
  const senha = document.getElementById("senha").value;
  const mensagemErro = document.getElementById("mensagemErro");

  if (usuario === "usuario" && senha === "senha") {
    document.getElementById("telaLogin").classList.add("oculto");
    document.getElementById("sistema").classList.remove("oculto");
    renderizarTabela();
  } else {
    mensagemErro.textContent = "Usuário ou senha incorretos.";
  }
}

// Login com tecla Enter
document.getElementById("telaLogin").addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    verificarLogin();
  }
});

// Variáveis globais e referências
const form = document.getElementById("formAluno");
const tabela = document.querySelector("#tabelaAlunos tbody");
const secaoTabela = document.getElementById("secaoTabela");
const tituloGuiaSelecionada = document.getElementById("tituloGuiaSelecionada");
const menuLinks = document.querySelectorAll(".menu-link");

let alunos = JSON.parse(localStorage.getItem("alunos")) || [];
let graficoPlanos;

// Salvar alunos no localStorage
function salvarAlunos() {
  localStorage.setItem("alunos", JSON.stringify(alunos));
}

// Atualizar estatísticas
function atualizarEstatisticas() {
  document.getElementById("totalAlunos").textContent = alunos.length;
  const planos = [...new Set(alunos.map(aluno => aluno.plano))];
  document.getElementById("planosUnicos").textContent = planos.length;
}

// Atualizar gráfico de planos
function atualizarGraficoPlanos() {
  const contagemPlanos = {};
  alunos.forEach(aluno => {
    contagemPlanos[aluno.plano] = (contagemPlanos[aluno.plano] || 0) + 1;
  });

  const labels = Object.keys(contagemPlanos);
  const dados = Object.values(contagemPlanos);
  const cores = ['#3498db', '#e67e22', '#2ecc71', '#9b59b6', '#f1c40f'];

  const config = {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        label: 'Distribuição de Planos',
        data: dados,
        backgroundColor: cores.slice(0, labels.length),
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  };

  if (graficoPlanos) graficoPlanos.destroy();

  const ctx = document.getElementById('graficoPlanos').getContext('2d');
  graficoPlanos = new Chart(ctx, config);
}

// Renderizar tabela de alunos
function renderizarTabela() {
  tabela.innerHTML = "";
  alunos.forEach((aluno, index) => {
    const row = tabela.insertRow();
    row.innerHTML = `
      <td>${aluno.nome}</td>
      <td>${aluno.idade}</td>
      <td>${aluno.cpf}</td>
      <td>${aluno.telefone}</td>
      <td>${aluno.endereco}</td>
      <td>${aluno.plano}</td>
      <td>
        <button class="acao editar" onclick="editarAluno(${index})">Editar</button>
        <button class="acao excluir" onclick="removerAluno(${index})">Excluir</button>
      </td>
    `;
  });

  atualizarEstatisticas();
  atualizarGraficoPlanos();
}

// Validar e salvar novo aluno
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const idade = parseInt(document.getElementById("idade").value.trim());
  const cpf = document.getElementById("cpf").value.trim();
  const telefone = document.getElementById("telefone").value.trim();
  const endereco = document.getElementById("endereco").value.trim();
  const plano = document.getElementById("plano").value;

  if (!nome || !idade || !cpf || !telefone || !endereco || !plano) {
    alert("Preencha todos os campos.");
    return;
  }

  if (idade < 1 || idade > 120) {
    alert("Idade deve ser entre 1 e 120 anos.");
    return;
  }

  if (!/^\d{11}$/.test(cpf)) {
    alert("CPF deve conter exatamente 11 dígitos.");
    return;
  }

  if (!/^\d{10,11}$/.test(telefone)) {
    alert("Telefone deve conter entre 10 e 11 dígitos.");
    return;
  }

  alunos.push({ nome, idade, cpf, telefone, endereco, plano });
  salvarAlunos();
  renderizarTabela();
  form.reset();
});

// Editar aluno
function editarAluno(index) {
  const aluno = alunos[index];
  document.getElementById("nome").value = aluno.nome;
  document.getElementById("idade").value = aluno.idade;
  document.getElementById("cpf").value = aluno.cpf;
  document.getElementById("telefone").value = aluno.telefone;
  document.getElementById("endereco").value = aluno.endereco;
  document.getElementById("plano").value = aluno.plano;

  alunos.splice(index, 1);
  salvarAlunos();
  renderizarTabela();
}

// Remover aluno
function removerAluno(index) {
  if (confirm("Tem certeza que deseja excluir este aluno?")) {
    alunos.splice(index, 1);
    salvarAlunos();
    renderizarTabela();
  }
}

// Atualiza título da guia selecionada e mostra formulário/tabela conforme guia
function atualizarTituloGuia(nomeGuia) {
  tituloGuiaSelecionada.textContent = nomeGuia;
  form.classList.add("oculto");
  secaoTabela.classList.add("oculto");

  if (nomeGuia === "Cadastro de Aluno") {
    form.classList.remove("oculto");
  } else if (nomeGuia === "Alunos") {
    secaoTabela.classList.remove("oculto");
  }
}

// Navegação do menu
menuLinks.forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const guia = e.target.getAttribute("data-guia");
    atualizarTituloGuia(guia);
  });
});

// Inicialização da tela
window.onload = () => {
  atualizarTituloGuia("Início");
  atualizarEstatisticas();
  atualizarGraficoPlanos();
};





