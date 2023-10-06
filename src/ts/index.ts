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

  // Função auxiliar para verificar se o preço está dentro da faixa selecionada
  function isPriceInRange(price: number, priceRange: string): boolean {
    const [min, max] = priceRange.split("-").map(parseFloat);
    return price >= min && price <= max;
  }

  // Função para filtrar e renderizar produtos
  function filterAndRenderProducts(): void {
    // Crie arrays para armazenar as seleções de tamanhos, cores e faixa de preço
    const selectedSizes: string[] = [];
    const selectedColors: string[] = [];
    const selectedPrices: string[] = [];

    carregarMais.style.display = "none";

    // Verifique as seleções de tamanho
    const sizeCheckboxes: NodeListOf<HTMLInputElement> =
      document.querySelectorAll('input[id^="size-"]:checked');
    sizeCheckboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        selectedSizes.push(checkbox.value);
      }
    });

    // Verifique as seleções de cores
    const colorCheckboxes: NodeListOf<HTMLInputElement> =
      document.querySelectorAll('input[id^="color-"]:checked');

    colorCheckboxes.forEach((checkbox) => {
      selectedColors.push(checkbox.value);
    });

    // Verifique as seleções de faixa de preço
    const priceCheckboxes: NodeListOf<HTMLInputElement> =
      document.querySelectorAll('input[id^="price-"]:checked');
    priceCheckboxes.forEach((checkbox) => {
      selectedPrices.push(checkbox.value);
    });

    // Filtrar os produtos com base nas seleções
    const filteredProducts: Product[] = allProducts.filter((product) => {
      // Filtro de tamanho
      if (
        selectedSizes.length > 0 &&
        !selectedSizes.some((size) => product.size.includes(size))
      ) {
        return false;
      }

      // Filtro de cor
      if (
        selectedColors.length > 0 &&
        !selectedColors.some(
          (color) => product.color.toLowerCase() === color.toLowerCase()
        )
      ) {
        return false;
      }

      // Filtro de faixa de preço
      if (selectedPrices.length > 0) {
        const productPrice: number = product.price;
        if (
          !selectedPrices.some((priceRange) =>
            isPriceInRange(productPrice, priceRange)
          )
        ) {
          return false;
        }
      }

      return true;
    });

    renderProducts(filteredProducts);
  }

  // Ouvinte de eventos para o botão "Limpar Seleções"
  document.getElementById("clearButton")?.addEventListener("click", () => {
    // Desmarque todos os checkboxes selecionados
    const checkboxes: NodeListOf<HTMLInputElement> = document.querySelectorAll(
      'input[type="checkbox"]'
    );
    checkboxes.forEach((checkbox) => {
      checkbox.checked = false;
    });
    filterAndRenderProducts();
  });

  // Adicione ouvintes de eventos de "change" aos checkboxes
  const sizeCheckboxes: NodeListOf<HTMLInputElement> =
    document.querySelectorAll('input[id^="size-"]');
  sizeCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", filterAndRenderProducts);
  });

  const colorCheckboxes: NodeListOf<HTMLInputElement> =
    document.querySelectorAll('input[id^="color-"]');
  colorCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", filterAndRenderProducts);
  });

  const priceCheckboxes: NodeListOf<HTMLInputElement> =
    document.querySelectorAll('input[id^="price-"]');
  priceCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", filterAndRenderProducts);
  });
}

document.addEventListener("DOMContentLoaded", main);
