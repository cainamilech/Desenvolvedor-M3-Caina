import { Product } from "./Product";

const serverUrl = "http://localhost:5000";

function main() {
  console.log(serverUrl);

  //ELEMENTOS
  const carregarMais = document.getElementById("carregar-mais");
  const carregarMaisPrecoMenor = document.getElementById("mais-preco-menor");
  const carregarMaisPrecoMaior = document.getElementById("mais-preco-maior");
  const carregarMaisRecente = document.getElementById("carregar-mais-recente");
  const precoMaior = document.getElementById("preco-maior");
  const precoMenor = document.getElementById("preco-menor");
  const maisRecente = document.getElementById("mais-recente");

  //EVENTOS
  carregarMais.addEventListener("click", carregar9produtos);
  carregarMaisPrecoMenor.addEventListener("click", carregar9produtosPrecoMenor);
  carregarMaisPrecoMaior.addEventListener("click", carregar9produtosPrecoMaior);
  carregarMaisRecente.addEventListener("click", carregar9produtosMaisRecente);
  precoMenor.addEventListener("click", () => {
    window.location.hash = "#/ordenar-preco-menor";
  });
  precoMaior.addEventListener("click", () => {
    window.location.hash = "#/ordenar-preco-maior";
  });
  maisRecente.addEventListener("click", () => {
    window.location.hash = "#/ordenar-mais-recente";
  });

  // Consumir os primeiros 9 produtos da API
  async function fetchProducts() {
    try {
      const response = await fetch("http://localhost:5000/products");
      if (!response.ok) {
        throw new Error("Erro ao buscar os produtos");
      }
      allProducts = await response.json();
      //console.log(allProducts);
      carregar9produtos();
    } catch (error) {
      console.error(error);
    }
  }

  // Carregar os primeiros 9 produtos da API
  fetchProducts();

  // Função para renderizar os produtos na página
  function renderProducts(products: Product[]) {
    const productListDiv = document.getElementById("product-list");

    const productItems = products.map(
      (product) => `
      <div class="product">
          <img src="${product.image}" alt="${product.name}">
          <h2>${product.name}</h2>
          <p>Preço: R$ ${product.price.toFixed(2)}</p>
          <p>Parcelamento: ${
            product.parcelamento[0]
          }x de R$ ${product.parcelamento[1].toFixed(2)}</p>
          <p>Cor: ${product.color}</p>
          <p>Tamanhos disponíveis: ${product.size.join(", ")}</p>
          <p>Data de lançamento: ${product.date}</p>
      </div>
  `
    );

    productListDiv.innerHTML = productItems.join("");
  }

  // Quantidade de produtos já carregados
  let produtosCarregados = 0;

  // Armazenar todos os produtos
  let allProducts: Product[] = [];

  function carregar9produtos() {
    const carregarProdutos = allProducts.slice(0, produtosCarregados + 9);
    renderProducts(carregarProdutos);
    produtosCarregados += 9;
    //console.log(produtosCarregados);
    if (produtosCarregados >= allProducts.length) {
      carregarMais.style.display = "none"; //se a quantidade de produtos carregados for = ou > ao total de produtos, remover botao
    }
  }

  function carregar9produtosPrecoMenor() {
    //let produtosCarregados = 0;

    //const carregarProdutos = allProducts.slice(0, produtosCarregados + 9);
    produtosCarregados += 9;

    const sortedProductList = ordenarMenorPreco(allProducts);
    console.log(sortedProductList);
    renderProducts(sortedProductList);
    if (produtosCarregados >= allProducts.length) {
      carregarMaisPrecoMenor.style.display = "none"; //se a quantidade de produtos carregados for = ou > ao total de produtos, remover botao
    }
  }

  function carregar9produtosPrecoMaior() {
    produtosCarregados += 9;
    const sortedProductList = ordenarMaiorPreco(allProducts);
    console.log(sortedProductList);
    renderProducts(sortedProductList);
    if (produtosCarregados >= allProducts.length) {
      carregarMaisPrecoMaior.style.display = "none"; //se a quantidade de produtos carregados for = ou > ao total de produtos, remover botao
    }
  }

  function carregar9produtosMaisRecente() {
    produtosCarregados += 9;
    const sortedProductList = ordenarMaisRecente(allProducts);
    console.log(sortedProductList);
    renderProducts(sortedProductList);
    if (produtosCarregados >= allProducts.length) {
      carregarMaisRecente.style.display = "none"; //se a quantidade de produtos carregados for = ou > ao total de produtos, remover botao
    }
  }

  function ordenarMenorPreco(products: Product[]): Product[] {
    return products.slice().sort((a, b) => a.price - b.price);
  }

  function ordenarMaiorPreco(products: Product[]): Product[] {
    return products.slice().sort((a, b) => b.price - a.price);
  }

  function ordenarMaisRecente(products: Product[]): Product[] {
    return products.slice().sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    });
  }

  //ASSISTIR MUDANÇA DE HASH
  window.addEventListener("hashchange", () => {
    if (window.location.hash == "#/ordenar-preco-maior") {
      console.log("ordenando preco maior"); //para teste
      //Declarar quantidade inicial
      let produtosCarregados = 0;
      //Criar lista de todos os produtos em ordem de preco
      const produtosOrdenados = ordenarMaiorPreco(allProducts);
      //Separar apenas os 9 primeiros
      const carregarProdutos = produtosOrdenados.slice(
        0,
        produtosCarregados + 9
      );
      //Atualizar a quantidade, pra ter o controle do botão
      produtosCarregados += 9;
      //Atualizar a ordem dos 9
      const listaFinal = ordenarMaiorPreco(carregarProdutos);
      //Renderizar a lista final com o html da funcao render
      renderProducts(listaFinal);
      //Habilitar botão de ver mais
      carregarMaisPrecoMaior.style.display = "block";
      carregarMaisPrecoMenor.style.display = "none";
      carregarMais.style.display = "none";
      carregarMaisRecente.style.display = "none";
    } else if (window.location.hash == "#/ordenar-preco-menor") {
      console.log("ordenando preco menor"); //para testes
      //Declarar quantidade inicial
      let produtosCarregados = 0;
      //Criar lista de todos os produtos em ordem de preco
      const produtosOrdenados = ordenarMenorPreco(allProducts);
      //Separar apenas os 9 primeiros
      const carregarProdutos = produtosOrdenados.slice(
        0,
        produtosCarregados + 9
      );
      //Atualizar a quantidade, pra ter o controle do botão
      produtosCarregados += 9;
      //Atualizar a ordem dos 9
      const listaFinal = ordenarMenorPreco(carregarProdutos);
      //Renderizar a lista final com o html da funcao render
      renderProducts(listaFinal);
      //Habilitar botão de ver mais
      carregarMaisPrecoMenor.style.display = "block";
      carregarMaisPrecoMaior.style.display = "none";
      carregarMais.style.display = "none";
      carregarMaisRecente.style.display = "none";
    } else if (window.location.hash == "#/ordenar-mais-recente") {
      console.log("ordenando mais recente"); //para testes
      //Declarar quantidade inicial
      let produtosCarregados = 0;
      //Criar lista de todos os produtos em ordem de preco
      const produtosOrdenados = ordenarMaisRecente(allProducts);
      //Separar apenas os 9 primeiros
      const carregarProdutos = produtosOrdenados.slice(
        0,
        produtosCarregados + 9
      );
      //Atualizar a quantidade, pra ter o controle do botão
      produtosCarregados += 9;
      //Atualizar a ordem dos 9
      const listaFinal = ordenarMaisRecente(carregarProdutos);
      //Renderizar a lista final com o html da funcao render
      renderProducts(listaFinal);
      //Habilitar botão de ver mais
      carregarMaisRecente.style.display = "block";
      carregarMaisPrecoMenor.style.display = "none";
      carregarMaisPrecoMaior.style.display = "none";
      carregarMais.style.display = "none";
    } else if (window.location.hash == "") {
      carregarMaisPrecoMaior.style.display = "none";
      carregarMaisPrecoMenor.style.display = "none";
      carregarMaisRecente.style.display = "none";
    }
  });

  //document.getElementById("sortButton")?.addEventListener("click", () => {
  //  const sortedProductList = ordenarMenorPreco(allProducts);
  //console.log(sortedProductList);
  //renderProducts(sortedProductList);
  //});

  // DESCARTADO NO MOMENTO Carregar todos produtos da API
  //async function fetchAllProducts() {
  //  try {
  //    const response = await fetch("http://localhost:5000/products");
  //    if (!response.ok) {
  //      throw new Error("Erro ao buscar os produtos");
  //   }
  //   allProducts = await response.json();
  //   renderProducts(allProducts); // Renderizar todos os produtos
  //   const carregarMais = document.getElementById("carregar-mais");
  //   carregarMais ? (carregarMais.style.display = "none") : null; //Remover botão
  //} catch (error) {
  //  console.error(error);
  // }
  //}

  //teste para pegar o array
  //function waitForProducts() {
  //return new Promise((resolve) => {
  // Verificar se os produtos já foram carregados
  //if (allProducts.length > 0) {
  //resolve(allProducts);
  //} else {
  // Se não foram carregados, esperar até que sejam carregados pela função fetchProducts
  //const intervalId = setInterval(() => {
  //if (allProducts.length > 0) {
  //clearInterval(intervalId);
  //resolve(allProducts);
  //}
  //}, 100);
  //}
  //});
  //}

  // Exemplo de como acessar os produtos fora da função fetchProducts
  //waitForProducts().then((products) => {
  //console.log("Produtos carregados:", products);
  //  });
}

document.addEventListener("DOMContentLoaded", main);
