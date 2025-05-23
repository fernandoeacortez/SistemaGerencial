// Dados globais
let alunos = [];
let usuarioLogado = false;
let relatoriosLogado = false;

const usuarioCorreto = "admin";
const senhaCorreta = "1234";

// Elementos
const telaLogin = document.getElementById("telaLogin");
const sistema = document.getElementById("sistema");

const inputUsuario = document.getElementById("usuario");
const inputSenha = document.getElementById("senha");
const mensagemErro = document.getElementById("mensagemErro");

const menuLinks = document.querySelectorAll(".menu-link");
const tituloGuiaSelecionada = document.getElementById("tituloGuiaSelecionada");

const estatisticas = document.getElementById("estatisticas");
const totalAlunosSpan = document.getElementById("totalAlunos");
const planosUnicosSpan = document.getElementById("planosUnicos");

const formAluno = document.getElementById("formAluno");
const secaoTabela = document.getElementById("secaoTabela");
const tabelaAlunosBody = document.querySelector("#tabelaAlunos tbody");

// Variáveis para edição
let modoEdicao = false;
let indiceEdicao = null;

// Função para verificar login inicial
function verificarLogin() {
  const usuario = inputUsuario.value.trim();
  const senha = inputSenha.value.trim();

  if (usuario === usuarioCorreto && senha === senhaCorreta) {
    usuarioLogado = true;
    mensagemErro.textContent = "";
    telaLogin.classList.add("oculto");
    sistema.classList.remove("oculto");
    carregarGuia("Início");
  } else {
    mensagemErro.textContent = "Usuário ou senha incorretos.";
  }
}

// Adiciona evento para navegação no menu
menuLinks.forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const guia = e.target.getAttribute("data-guia");

    // Se for Relatórios e ainda não logado na guia Relatórios, mostra login da guia Relatórios
    if (guia === "Relatórios" && !relatoriosLogado) {
      carregarGuiaRelatoriosLogin();
      return;
    }

    // Se for Relatórios e já estiver logado, carrega área de relatórios
    if (guia === "Relatórios" && relatoriosLogado) {
      carregarGuiaRelatorios();
      return;
    }

    // Para outras guias, carrega normalmente
    relatoriosLogado = false; // Se mudar de guia, reseta login de Relatórios
    carregarGuia(guia);
  });
});

// Carrega a guia inicial, cadastro ou mostra estatísticas
function carregarGuia(guia) {
  tituloGuiaSelecionada.textContent = guia;

  // Remove área de relatórios se existir
  const secaoRelatoriosExistente = document.getElementById("secaoRelatorios");
  if (secaoRelatoriosExistente) secaoRelatoriosExistente.remove();

  // Reset visibilidades
  estatisticas.classList.add("oculto");
  formAluno.classList.add("oculto");
  secaoTabela.classList.add("oculto");

  if (guia === "Início") {
    estatisticas.classList.remove("oculto");
    atualizarEstatisticas();
  } else if (guia === "Cadastro de Aluno") {
    formAluno.classList.remove("oculto");
    secaoTabela.classList.remove("oculto");
    mostrarAlunosTabela();
    limparFormulario();
  }
}

// Atualiza os números de estatísticas
function atualizarEstatisticas() {
  totalAlunosSpan.textContent = alunos.length;
  const planos = [...new Set(alunos.map(a => a.plano))];
  planosUnicosSpan.textContent = planos.length;
}

// Mostra alunos na tabela de cadastro (com botões editar/excluir)
function mostrarAlunosTabela() {
  tabelaAlunosBody.innerHTML = "";
  alunos.forEach((aluno, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${aluno.nome}</td>
      <td>${aluno.idade}</td>
      <td>${aluno.cpf}</td>
      <td>${aluno.telefone}</td>
      <td>${aluno.endereco}</td>
      <td>${aluno.plano}</td>
      <td>
        <button class="acao editar" data-index="${index}">Editar</button>
        <button class="acao excluir" data-index="${index}">Excluir</button>
      </td>
    `;
    tabelaAlunosBody.appendChild(tr);
  });

  // Eventos dos botões editar e excluir
  document.querySelectorAll(".acao.editar").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const idx = e.target.getAttribute("data-index");
      carregarAlunoParaEdicao(idx);
    });
  });
  document.querySelectorAll(".acao.excluir").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const idx = e.target.getAttribute("data-index");
      if (confirm("Deseja realmente excluir este aluno?")) {
        alunos.splice(idx, 1);
        mostrarAlunosTabela();
        atualizarEstatisticas();
      }
    });
  });
}

// Carrega aluno no formulário para edição
function carregarAlunoParaEdicao(index) {
  const aluno = alunos[index];
  document.getElementById("nome").value = aluno.nome;
  document.getElementById("idade").value = aluno.idade;
  document.getElementById("cpf").value = aluno.cpf;
  document.getElementById("telefone").value = aluno.telefone;
  document.getElementById("endereco").value = aluno.endereco;
  document.getElementById("plano").value = aluno.plano;

  modoEdicao = true;
  indiceEdicao = index;
}

// Limpa o formulário de cadastro
function limparFormulario() {
  formAluno.reset();
  modoEdicao = false;
  indiceEdicao = null;
}

// Trata envio do formulário de cadastro
formAluno.addEventListener("submit", (e) => {
  e.preventDefault();

  // Pega dados do formulário
  const novoAluno = {
    nome: document.getElementById("nome").value.trim(),
    idade: parseInt(document.getElementById("idade").value),
    cpf: document.getElementById("cpf").value.trim(),
    telefone: document.getElementById("telefone").value.trim(),
    endereco: document.getElementById("endereco").value.trim(),
    plano: document.getElementById("plano").value,
  };

  if (modoEdicao) {
    alunos[indiceEdicao] = novoAluno;
  } else {
    alunos.push(novoAluno);
  }

  mostrarAlunosTabela();
  atualizarEstatisticas();
  limparFormulario();
});

// --- Guias Relatórios ---

// Carrega o login da guia Relatórios
function carregarGuiaRelatoriosLogin() {
  tituloGuiaSelecionada.textContent = "Relatórios";

  // Remove outras seções visíveis
  estatisticas.classList.add("oculto");
  formAluno.classList.add("oculto");
  secaoTabela.classList.add("oculto");

  // Remove área de relatórios caso exista
  const secaoRelatoriosExistente = document.getElementById("secaoRelatorios");
  if (secaoRelatoriosExistente) secaoRelatoriosExistente.remove();

  // Cria o container do login da guia Relatórios
  const secaoRelatorios = document.createElement("section");
  secaoRelatorios.id = "secaoRelatorios";

  secaoRelatorios.innerHTML = `
    <h2>Login Relatórios</h2>
    <input type="text" id="relatorioUsuario" placeholder="Usuário" required />
    <input type="password" id="relatorioSenha" placeholder="Senha" required />
    <button id="btnConfirmarRelatorio" style="
      background-color: #27ae60; 
      color: white; 
      border: none; 
      padding: 10px 20px; 
      border-radius: 5px; 
      cursor: pointer;
      margin-top: 10px;
    ">Confirmar</button>
    <p id="mensagemErroRelatorios" class="erro"></p>
  `;

  sistema.querySelector(".main-content").appendChild(secaoRelatorios);

  // Evento do botão confirmar do login Relatórios
  document.getElementById("btnConfirmarRelatorio").addEventListener("click", () => {
    const usuario = document.getElementById("relatorioUsuario").value.trim();
    const senha = document.getElementById("relatorioSenha").value.trim();
    const erroMsg = document.getElementById("mensagemErroRelatorios");

    if (usuario === usuarioCorreto && senha === senhaCorreta) {
      erroMsg.textContent = "";
      relatoriosLogado = true;
      carregarGuiaRelatorios();
    } else {
      erroMsg.textContent = "Usuário ou senha incorretos.";
    }
  });
}

// Carrega a área principal dos relatórios (após login na guia Relatórios)
function carregarGuiaRelatorios() {
  tituloGuiaSelecionada.textContent = "Relatórios";

  // Remove outras seções visíveis
  estatisticas.classList.add("oculto");
  formAluno.classList.add("oculto");
  secaoTabela.classList.add("oculto");

  // Remove login anterior da guia Relatórios
  const secaoRelatoriosExistente = document.getElementById("secaoRelatorios");
  if (secaoRelatoriosExistente) secaoRelatoriosExistente.remove();

  // Cria a seção de relatórios com filtros e tabela
  const secaoRelatorios = document.createElement("section");
  secaoRelatorios.id = "secaoRelatorios";

  secaoRelatorios.innerHTML = `
    <h2>TechGym Relatórios</h2>
    <form id="formRelatorios" style="display:flex; gap:15px; flex-wrap: wrap; margin-bottom:20px; align-items:center;">
      <input list="listaNomes" id="filtroNome" placeholder="Nome do Aluno" style="padding:8px; border-radius:5px; border:1px solid #ccc;" />
      <datalist id="listaNomes"></datalist>
      
      <input type="text" id="filtroCPF" placeholder="CPF (11 dígitos)" maxlength="11" style="padding:8px; border-radius:5px; border:1px solid #ccc;" />
      
      <select id="filtroPlano" style="padding:8px; border-radius:5px; border:1px solid #ccc;">
        <option value="" selected>Todos os Planos</option>
        <option value="Anual">Anual</option>
        <option value="Semestral">Semestral</option>
        <option value="Mensal">Mensal</option>
      </select>

      <button type="submit" style="
        background-color: #27ae60; 
        color: white; 
        border: none; 
        padding: 10px 20px; 
        border-radius: 5px; 
        cursor: pointer;
      ">Gerar Relatório</button>
    </form>

    <table id="tabelaRelatorios" style="width:100%; border-collapse: collapse; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
      <thead style="background-color:#2c3e50; color:white;">
        <tr>
          <th>Nome</th>
          <th>Idade</th>
          <th>CPF</th>
          <th>Telefone</th>
          <th>Endereço</th>
          <th>Plano</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
  `;

  sistema.querySelector(".main-content").appendChild(secaoRelatorios);

  preencherDatalistNomes();

  // Evento do formulário filtro de relatórios
  document.getElementById("formRelatorios").addEventListener("submit", (e) => {
    e.preventDefault();
    gerarRelatorio();
  });

  // Ao abrir, mostra todos alunos
  gerarRelatorio();
}

// Preenche datalist dos nomes dos alunos para autocomplete
function preencherDatalistNomes() {
  const datalist = document.getElementById("listaNomes");
  datalist.innerHTML = "";
  const nomesUnicos = [...new Set(alunos.map(a => a.nome))];
  nomesUnicos.forEach(nome => {
    const option = document.createElement("option");
    option.value = nome;
    datalist.appendChild(option);
  });
}

// Gera relatório baseado nos filtros preenchidos
function gerarRelatorio() {
  const nomeFiltro = document.getElementById("filtroNome").value.trim().toLowerCase();
  const cpfFiltro = document.getElementById("filtroCPF").value.trim();
  const planoFiltro = document.getElementById("filtroPlano").value;

  const tabelaRelatoriosBody = document.querySelector("#tabelaRelatorios tbody");
  tabelaRelatoriosBody.innerHTML = "";

  let alunosFiltrados = alunos.filter(aluno => {
    let condNome = true, condCPF = true, condPlano = true;

    if (nomeFiltro !== "") {
      condNome = aluno.nome.toLowerCase().includes(nomeFiltro);
    }
    if (cpfFiltro !== "") {
      condCPF = aluno.cpf.includes(cpfFiltro);
    }
    if (planoFiltro !== "") {
      condPlano = aluno.plano === planoFiltro;
    }

    return condNome && condCPF && condPlano;
  });

  if (alunosFiltrados.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td colspan="6" style="text-align:center; padding:15px;">Nenhum aluno encontrado.</td>`;
    tabelaRelatoriosBody.appendChild(tr);
    return;
  }

  alunosFiltrados.forEach(aluno => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${aluno.nome}</td>
      <td>${aluno.idade}</td>
      <td>${aluno.cpf}</td>
      <td>${aluno.telefone}</td>
      <td>${aluno.endereco}</td>
      <td>${aluno.plano}</td>
    `;
    tabelaRelatoriosBody.appendChild(tr);
  });
}

// Ao carregar a página, mostra tela de login inicial
window.onload = () => {
  telaLogin.classList.remove("oculto");
  sistema.classList.add("oculto");
};










