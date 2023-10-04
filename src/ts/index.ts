import { Product } from "./Product";

const serverUrl = "http://localhost:5000";

function main() {
  console.log(serverUrl);

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

  //Evento carregar mais
  const carregarMais = document.getElementById("carregar-mais");
  carregarMais.addEventListener("click", carregar9produtos);

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
  function waitForProducts() {
    return new Promise((resolve) => {
      // Verificar se os produtos já foram carregados
      if (allProducts.length > 0) {
        resolve(allProducts);
      } else {
        // Se não foram carregados, esperar até que sejam carregados pela função fetchProducts
        const intervalId = setInterval(() => {
          if (allProducts.length > 0) {
            clearInterval(intervalId);
            resolve(allProducts);
          }
        }, 100);
      }
    });
  }

  // Exemplo de como acessar os produtos fora da função fetchProducts
  waitForProducts().then((products) => {
    console.log("Produtos carregados:", products);
  });
}

document.addEventListener("DOMContentLoaded", main);
