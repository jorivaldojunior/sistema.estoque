// Variáveis globais
let idProduto = localStorage.getItem("ultimoId") ? parseInt(localStorage.getItem("ultimoId")) + 1 : 1;
let produtoAtual; // Variável para armazenar o produto em edição

// Função para navegar para a lista de produtos
function navigateToListaProdutos() {
  document.getElementById("cadastroProdutoScreen").classList.add("hidden");
  document.getElementById("estoqueZeradoScreen").classList.add("hidden");
  document.getElementById("listaProdutosScreen").classList.remove("hidden");
  exibirProdutos();
}

// Função para navegar para a tela de cadastro de produto
function navigateToCadastroProduto() {
  document.getElementById("listaProdutosScreen").classList.add("hidden");
  document.getElementById("estoqueZeradoScreen").classList.add("hidden");
  document.getElementById("cadastroProdutoScreen").classList.remove("hidden");
}

// Função para navegar para a tela de produtos com estoque zerado
function navigateToEstoqueZerado() {
  document.getElementById("listaProdutosScreen").classList.add("hidden");
  document.getElementById("estoqueZeradoScreen").classList.remove("hidden");
  exibirEstoqueZerado();
}

// Função para gerar um novo ID
function gerarId() {
  return idProduto.toString().padStart(3, "0"); // ID no formato 001, 002, etc.
}

// Função para cadastrar um novo produto
function cadastrarProduto() {
  const nome = document.getElementById("nomeProduto").value;
  const marca = document.getElementById("marcaProduto").value;
  const quantidade = document.getElementById("quantidadeProduto").value;
  const dataRecebimento = document.getElementById("dataRecebimento").value;

  if (nome && marca && quantidade && dataRecebimento) {
    const id = gerarId();

    let produtos = JSON.parse(localStorage.getItem("produtos")) || [];
    produtos.push({
      id,
      nome,
      marca,
      quantidade,
      dataRecebimento,
      ultimaMovimentacao: "",
      colaborador: "",
    });
    localStorage.setItem("produtos", JSON.stringify(produtos));
    localStorage.setItem("ultimoId", idProduto);
    idProduto++;

    Swal.fire("Sucesso!", "Produto cadastrado com sucesso!", "success");
    document.getElementById("produtoForm").reset();
  } else {
    Swal.fire("Erro!", "Preencha todos os campos.", "error");
  }
}

// Função para exibir os produtos com estoque zerado
function exibirEstoqueZerado() {
  const listaEstoqueZerado = document.getElementById("listaEstoqueZerado");
  listaEstoqueZerado.innerHTML = "";

  const produtos = JSON.parse(localStorage.getItem("produtos")) || [];
  const produtosZerados = produtos.filter((produto) => produto.quantidade == 0);

  if (produtosZerados.length > 0) {
    produtosZerados.forEach((produto) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td class="border px-4 py-2">${produto.id}</td>
        <td class="border px-4 py-2">${produto.nome}</td>
        <td class="border px-4 py-2">${produto.marca}</td>
        <td class="border px-4 py-2">${produto.quantidade}</td>
        <td class="border px-4 py-2">${produto.dataRecebimento}</td>
        <td class="border px-4 py-2">${produto.ultimaMovimentacao || "N/A"}</td>
        <td class="border px-4 py-2">${produto.colaborador || "N/A"}</td>
      `;
      listaEstoqueZerado.appendChild(row);
    });
  } else {
    const row = document.createElement("tr");
    row.innerHTML = `<td colspan="7" class="border px-4 py-2 text-center">Nenhum produto com estoque zerado.</td>`;
    listaEstoqueZerado.appendChild(row);
  }
}

// Função para abrir o modal de edição de produto
function abrirModalEditar(id) {
  const produtos = JSON.parse(localStorage.getItem("produtos")) || [];
  produtoAtual = produtos.find((produto) => produto.id === id);

  if (produtoAtual) {
    document.getElementById("editarNome").value = produtoAtual.nome;
    document.getElementById("editarMarca").value = produtoAtual.marca;
    document.getElementById("editarQuantidade").value = produtoAtual.quantidade;
    document.getElementById("editarDataRecebimento").value = produtoAtual.dataRecebimento;
    document.getElementById("nomeColaborador").value = "";

    document.getElementById("editarModal").classList.remove("hidden");
  }
}

// Função para atualizar um produto
function atualizarProduto() {
  const nome = document.getElementById("editarNome").value;
  const marca = document.getElementById("editarMarca").value;
  const quantidade = document.getElementById("editarQuantidade").value;
  const nomeColaborador = document.getElementById("nomeColaborador").value;
  const dataMovimentacao = new Date().toLocaleString(); // Data e hora da última movimentação

  if (nome && marca && quantidade !== "" && nomeColaborador) {
    produtoAtual.nome = nome;
    produtoAtual.marca = marca;
    produtoAtual.quantidade = quantidade;
    produtoAtual.ultimaMovimentacao = dataMovimentacao;
    produtoAtual.colaborador = nomeColaborador;

    let produtos = JSON.parse(localStorage.getItem("produtos")) || [];
    produtos = produtos.map((produto) =>
      produto.id === produtoAtual.id ? produtoAtual : produto
    );
    localStorage.setItem("produtos", JSON.stringify(produtos));

    exibirProdutos();
    fecharModal();
    Swal.fire("Sucesso!", "Produto atualizado com sucesso!", "success");
  } else {
    Swal.fire("Erro!", "Preencha todos os campos.", "error");
  }
}

// Função para fechar o modal de edição
function fecharModal() {
  document.getElementById("editarModal").classList.add("hidden");
}

// Função para confirmar a exclusão de um produto
function confirmarExclusao(id) {
  Swal.fire({
    title: "Tem certeza?",
    text: "Você não poderá reverter esta ação!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Sim, excluir!",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      excluirProduto(id);
    }
  });
}

// Função para excluir um produto
function excluirProduto(id) {
  let produtos = JSON.parse(localStorage.getItem("produtos")) || [];
  produtos = produtos.filter((produto) => produto.id !== id);
  localStorage.setItem("produtos", JSON.stringify(produtos));

  exibirProdutos();
  Swal.fire("Excluído!", "O produto foi excluído.", "success");
}

// Ao carregar a página, exibir os produtos cadastrados
window.onload = function () {
  exibirProdutos();
};

// Função para filtrar produtos conforme o usuário digita no campo de busca
function filtrarProdutos() {
  const filtro = document.getElementById("filtroProduto").value.toLowerCase();
  const sugestoes = document.getElementById("sugestoes");
  sugestoes.innerHTML = ""; // Limpa as sugestões anteriores
  sugestoes.classList.add("hidden"); // Esconde a lista de sugestões inicialmente

  if (filtro.length > 0) {
    const produtos = JSON.parse(localStorage.getItem("produtos")) || [];
    const produtosFiltrados = produtos.filter((produto) =>
      produto.nome.toLowerCase().startsWith(filtro)
    );

    if (produtosFiltrados.length > 0) {
      produtosFiltrados.forEach((produto) => {
        const li = document.createElement("li");
        li.classList.add("px-4", "py-2", "hover:bg-gray-200", "cursor-pointer");
        li.textContent = produto.nome;
        li.onclick = function () {
          abrirModalEditar(produto.id);
          document.getElementById("filtroProduto").value = ""; // Limpa o campo de busca
          sugestoes.classList.add("hidden"); // Oculta as sugestões
        };
        sugestoes.appendChild(li);
      });
      sugestoes.classList.remove("hidden"); // Exibe as sugestões
    }
  }
}
 
// Função para redirecionar para a página inicial (index.html)
document.getElementById("btnFechar").addEventListener("click", function () {
  window.location.href = "index.html"; // Redireciona para a página inicial
});

function verificarLogin() {
  // Captura os valores inseridos pelo usuário
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  // Definindo usuário e senha corretos (você pode mudar conforme necessidade)
  const usuarioCorreto = "aldo"; // Defina o nome de usuário correto
  const senhaCorreta = "manutencao"; // Defina a senha correta

  // Verifica se o usuário e senha estão corretos
  if (username === usuarioCorreto && password === senhaCorreta) {
    // Se estiver correto, redireciona para "pagina1.html"
    window.location.href = "pagina1.html";
  } else {
    // Se estiver incorreto, exibe um alerta de erro com SweetAlert2
    Swal.fire({
      icon: "error",
      title: "Login inválido",
      text: "Usuário ou senha incorretos!",
    });
  }
}





let carrinho = [];
let produtoAtualParaPedido = null;

// Função para exibir produtos na tabela
function exibirProdutos() {
  const listaProdutos = document.getElementById("listaProdutos");
  listaProdutos.innerHTML = "";

  const produtos = JSON.parse(localStorage.getItem("produtos")) || [];
  produtos.forEach((produto) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="border px-4 py-2">${produto.id}</td>
      <td class="border px-4 py-2">${produto.nome}</td>
      <td class="border px-4 py-2">${produto.marca}</td>
      <td class="border px-4 py-2">${produto.quantidade}</td>
      <td class="border px-4 py-2">${produto.dataRecebimento}</td>
      <td class="border px-4 py-2">${produto.ultimaMovimentacao || "N/A"}</td>
      <td class="border px-4 py-2">${produto.colaborador || "N/A"}</td>
      <td class="border px-4 py-2">
        <button onclick="abrirModalPedir('${produto.id}')" class="bg-green-500 hover:bg-green-600 text-white py-1 px-2 rounded">Pedir</button>
      </td>
    `;
    listaProdutos.appendChild(row);
  });
}

// Função para abrir o modal de pedido com informações do produto selecionado
function abrirModalPedir(id) {
  const produtos = JSON.parse(localStorage.getItem("produtos")) || [];
  produtoAtualParaPedido = produtos.find(produto => produto.id === id);

  if (produtoAtualParaPedido) {
    document.getElementById("pedidoNomeProduto").value = produtoAtualParaPedido.nome;
    document.getElementById("pedidoMarcaProduto").value = produtoAtualParaPedido.marca;
    document.getElementById("pedidoQuantidade").value = ""; // Limpa a quantidade
    document.getElementById("modalPedido").classList.remove("hidden");
  }
}

// Função para adicionar o produto ao carrinho
function adicionarAoCarrinho() {
  const quantidade = document.getElementById("pedidoQuantidade").value;
  if (quantidade > 0) {
    carrinho.push({ ...produtoAtualParaPedido, quantidade });
    atualizarContadorCarrinho();
    fecharModalPedido();
  } else {
    Swal.fire("Erro!", "Informe uma quantidade válida para o pedido.", "error");
  }
}

// Função para fechar o modal de pedido
function fecharModalPedido() {
  document.getElementById("modalPedido").classList.add("hidden");
}

// Função para atualizar o contador do carrinho
function atualizarContadorCarrinho() {
  document.getElementById("contadorCarrinho").innerText = carrinho.length;
}

// Função para abrir o modal do carrinho
function abrirCarrinho() {
  const listaCarrinho = document.getElementById("listaCarrinho");
  listaCarrinho.innerHTML = "";

  if (carrinho.length === 0) {
    listaCarrinho.innerHTML = "<li class='text-gray-600'>Carrinho vazio.</li>";
  } else {
    carrinho.forEach(produto => {
      const li = document.createElement("li");
      li.innerHTML = `${produto.nome} (Marca: ${produto.marca}) - Quantidade: ${produto.quantidade}`;
      listaCarrinho.appendChild(li);
    });
  }

  document.getElementById("modalCarrinho").classList.remove("hidden");
}

// Função para fechar o modal do carrinho
function fecharModalCarrinho() {
  document.getElementById("modalCarrinho").classList.add("hidden");
}

// Função para enviar o pedido via WhatsApp
function enviarPedidoWhatsApp() {
  if (carrinho.length > 0) {
    let mensagem = "Pedido de Compra:\n\n";
    carrinho.forEach(produto => {
      mensagem += `- Produto: ${produto.nome} (Marca: ${produto.marca}) - Quantidade: ${produto.quantidade}\n`;
    });

    const numeroWhatsApp = "5511999999999"; // Número do WhatsApp para enviar o pedido
    const url = `https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${encodeURIComponent(mensagem)}`;

    window.open(url, "_blank");
    fecharModalCarrinho();
  } else {
    Swal.fire("Erro!", "O carrinho está vazio.", "error");
  }
}

// Exibe produtos ao carregar a página
window.onload = function () {
  exibirProdutos();
};



// Função para exibir produtos na tabela
function exibirProdutos() {
  const listaProdutos = document.getElementById("listaProdutos");
  listaProdutos.innerHTML = ""; // Limpa a lista de produtos

  const produtos = JSON.parse(localStorage.getItem("produtos")) || [];
  produtos.forEach((produto) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="border px-4 py-2">${produto.id}</td>
      <td class="border px-4 py-2">${produto.nome}</td>
      <td class="border px-4 py-2">${produto.marca}</td>
      <td class="border px-4 py-2">${produto.quantidade}</td>
      <td class="border px-4 py-2">${produto.dataRecebimento}</td>
      <td class="border px-4 py-2">${produto.ultimaMovimentacao || "N/A"}</td>
      <td class="border px-4 py-2">${produto.colaborador || "N/A"}</td>
      <td class="border px-4 py-2">
        <button onclick="abrirModalPedir('${produto.id}')" class="bg-green-500 hover:bg-green-600 text-white py-1 px-2 rounded">Pedir</button>
        <button onclick="abrirModalEditar('${produto.id}')" class="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded">Editar</button>
        <button onclick="confirmarExclusao('${produto.id}')" class="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded">Excluir</button>
      </td>
    `;
    listaProdutos.appendChild(row);
  });
}



