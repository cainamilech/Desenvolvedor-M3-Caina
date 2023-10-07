import { Product } from "./Product";

const serverUrl = "http://localhost:5000";

function main() {
  console.log(serverUrl);

  //ELEMENTOS
  const listaProdutos = document.getElementById("lista-produtos");
  const precoMaior = document.getElementById("preco-maior");
  const precoMenor = document.getElementById("preco-menor");
  const maisRecente = document.getElementById("mais-recente");
  const carregarMais = document.getElementById("carregar-mais");
  const carregarMaisPrecoMenor = document.getElementById("mais-preco-menor");
  const carregarMaisPrecoMaior = document.getElementById("mais-preco-maior");
  const carregarMaisRecente = document.getElementById("carregar-mais-recente");
  const limparSelecoes = document.getElementById("limpar");

  //EVENTOS
  maisRecente.addEventListener("click", renderMaisRecente);
  precoMaior.addEventListener("click", renderPrecoMaior);
  precoMenor.addEventListener("click", renderPrecoMenor);
  carregarMais.addEventListener("click", carregarProdutos);
  carregarMaisPrecoMenor.addEventListener(
    "click",
    carregarMaisProdutosPrecoMenor
  );
  carregarMaisPrecoMaior.addEventListener(
    "click",
    carregarMaisProdutosPrecoMaior
  );
  carregarMaisRecente.addEventListener(
    "click",
    carregarMaisProdutosMaisRecente
  );

  async function fetchProducts() {
    try {
      const response = await fetch("http://localhost:5000/products");
      if (!response.ok) {
        throw new Error("Erro ao buscar os produtos");
      }
      allProducts = await response.json();
      carregarProdutos();
    } catch (error) {
      console.error(error);
    }
  }

  fetchProducts();

  //Função para renderizar os produtos na página
  function renderProducts(products: Product[]) {
    const produtos = products.map(
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
          <button class="add-to-cart-button" data-product-id="${
            product.id
          }">Adicionar ao Carrinho</button>
      </div>
  `
    );

    listaProdutos.innerHTML = produtos.join("");

    //Assistir eventos de adicionar ao carrinho
    const addToCartButtons = document.querySelectorAll(".add-to-cart-button");
    addToCartButtons.forEach((button) => {
      button.addEventListener("click", addToCart);
    });
  }

  //CARRINHO

  //Função para adicionar um produto ao carrinho
  function addToCart(event: Event) {
    const button = event.target as HTMLButtonElement;
    const productId = button.dataset.productId;

    const productToAdd = allProducts.find(
      (product) => product.id === productId
    );

    if (productToAdd) {
      if (!carrinhoProdutos[productId]) {
        //Se o produto não estiver no carrinho, add com quantidade 1
        carrinhoProdutos[productId] = { product: productToAdd, quantity: 1 };
      } else {
        //Se o produto já estiver no carrinho, aumenta a quantidade
        carrinhoProdutos[productId].quantity++;
      }

      renderCart(); //Renderizar carrinho com novo produto
    }
  }

  //Função para renderizar o carrinho
  function renderCart() {
    const carrinhoHTML = Object.values(carrinhoProdutos).map(
      (cartItem) => `
      <div class="cart-item">
        <h3>${cartItem.product.name}</h3>
        <p>Preço: R$ ${cartItem.product.price.toFixed(2)}</p>
        <p>Quantidade: ${cartItem.quantity}</p>
        <button class="decrease-quantity-button" data-product-id="${
          cartItem.product.id
        }">-</button>
        <button class="increase-quantity-button" data-product-id="${
          cartItem.product.id
        }">+</button>
        <button class="remove-from-cart-button" data-product-id="${
          cartItem.product.id
        }">Remover</button>
      </div>
    `
    );

    carrinho.innerHTML = carrinhoHTML.join("");

    //Total das quantidades de todos os produtos no carrinho
    const totalQuantity = Object.values(carrinhoProdutos).reduce(
      (total, cartItem) => total + cartItem.quantity,
      0
    );

    //Atualizar rotulo de quantidade no icone
    const cartCount = document.getElementById("cart-count");
    totalQuantity > 0
      ? (cartCount.textContent = `${totalQuantity}`)
      : (cartCount.textContent = "");

    //Remover produto do carrinho
    const removeButtons = document.querySelectorAll(".remove-from-cart-button");
    removeButtons.forEach((button) => {
      button.addEventListener("click", removeFromCart);
    });

    //Eventos de somar e subtrair produtos
    const decreaseButtons = document.querySelectorAll(
      ".decrease-quantity-button"
    );
    decreaseButtons.forEach((button) => {
      button.addEventListener("click", decreaseQuantity);
    });

    const increaseButtons = document.querySelectorAll(
      ".increase-quantity-button"
    );
    increaseButtons.forEach((button) => {
      button.addEventListener("click", increaseQuantity);
    });
  }

  //Função para remover um produto do carrinho completamente
  function removeFromCart(event: Event) {
    const button = event.target as HTMLButtonElement;
    const productId = button.dataset.productId;

    if (carrinhoProdutos[productId]) {
      delete carrinhoProdutos[productId];
      renderCart();
    }
  }

  //Função para aumentar a quantidade de um produto no carrinho
  function increaseQuantity(event: Event) {
    const button = event.target as HTMLButtonElement;
    const productId = button.dataset.productId;

    if (carrinhoProdutos[productId]) {
      carrinhoProdutos[productId].quantity++;
      renderCart();
    }
  }

  //Função para diminuir a quantidade de um produto no carrinho
  function decreaseQuantity(event: Event) {
    const button = event.target as HTMLButtonElement;
    const productId = button.dataset.productId;

    if (
      carrinhoProdutos[productId] &&
      carrinhoProdutos[productId].quantity > 1
    ) {
      carrinhoProdutos[productId].quantity--;
      renderCart();
    }
  }

  // Quantidade de produtos já carregados
  let produtosCarregados = 0;
  // Armazenar produtos
  let allProducts: Product[] = [];
  //Carrinho
  const carrinho = document.getElementById("carrinho");
  // Objeto para rastrear produtos no carrinho e suas quantidades
  const carrinhoProdutos: {
    [productId: string]: { product: Product; quantity: number };
  } = {};

  //CARREGAMENTO DE PRODUTOS

  function carregarProdutos() {
    const carregarProdutos = allProducts.slice(0, produtosCarregados + 9);
    renderProducts(carregarProdutos);
    produtosCarregados += 9;
    if (produtosCarregados >= allProducts.length) {
      carregarMais.style.display = "none"; //se a quantidade de produtos carregados for = ou > ao total de produtos, remover botao
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

  function renderMaisRecente() {
    //Declarar quantidade inicial
    let produtosCarregados = 0;
    //Criar lista de todos os produtos em ordem de preco
    const produtosOrdenados = ordenarMaisRecente(allProducts);
    //Separar apenas os 9 primeiros
    const carregarProdutos = produtosOrdenados.slice(0, produtosCarregados + 9);
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
  }

  function renderPrecoMaior() {
    let produtosCarregados = 0;
    //Criar lista de todos os produtos em ordem de preco
    const produtosOrdenados = ordenarMaiorPreco(allProducts);
    //Separar apenas os 9 primeiros
    const carregarProdutos = produtosOrdenados.slice(0, produtosCarregados + 9);
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
  }

  function renderPrecoMenor() {
    let produtosCarregados = 0;
    //Criar lista de todos os produtos em ordem de preco
    const produtosOrdenados = ordenarMenorPreco(allProducts);
    //Separar apenas os 9 primeiros
    const carregarProdutos = produtosOrdenados.slice(0, produtosCarregados + 9);
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
  }

  function carregarMaisProdutosPrecoMenor() {
    produtosCarregados += 9;
    const listaFinal = ordenarMenorPreco(allProducts);
    renderProducts(listaFinal);
    if (produtosCarregados >= allProducts.length) {
      carregarMaisPrecoMenor.style.display = "none"; //se a quantidade de produtos carregados for = ou > ao total de produtos, remover botao
    }
  }

  function carregarMaisProdutosPrecoMaior() {
    produtosCarregados += 9;
    const listaFinal = ordenarMaiorPreco(allProducts);
    renderProducts(listaFinal);
    if (produtosCarregados >= allProducts.length) {
      carregarMaisPrecoMaior.style.display = "none"; //se a quantidade de produtos carregados for = ou > ao total de produtos, remover botao
    }
  }

  function carregarMaisProdutosMaisRecente() {
    produtosCarregados += 9;
    const listaFinal = ordenarMaisRecente(allProducts);
    renderProducts(listaFinal);
    if (produtosCarregados >= allProducts.length) {
      carregarMaisRecente.style.display = "none"; //se a quantidade de produtos carregados for = ou > ao total de produtos, remover botao
    }
  }

  //FILTROS

  //Verificar preço dentro da faixa selecionada
  function faixaDePreco(price: number, priceRange: string): boolean {
    const [min, max] = priceRange.split("-").map(parseFloat);
    return price >= min && price <= max;
  }

  //Filtrar e renderizar produtos
  function filtrarRenderizar(): void {
    //Arrays para armazenar as seleções de tamanhos, cores e faixa de preço.
    const selectedSizes: string[] = [];
    const selectedColors: string[] = [];
    const selectedPrices: string[] = [];

    carregarMais.style.display = "none";

    //Verificar as seleções de tamanho
    const sizeCheckboxes: NodeListOf<HTMLInputElement> =
      document.querySelectorAll('input[id^="size-"]:checked');
    sizeCheckboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        selectedSizes.push(checkbox.value);
      }
    });

    //Verificar as seleções de cores
    const colorCheckboxes: NodeListOf<HTMLInputElement> =
      document.querySelectorAll('input[id^="color-"]:checked');

    colorCheckboxes.forEach((checkbox) => {
      selectedColors.push(checkbox.value);
    });

    //Verificar as seleções de faixa de preço
    const priceCheckboxes: NodeListOf<HTMLInputElement> =
      document.querySelectorAll('input[id^="price-"]:checked');
    priceCheckboxes.forEach((checkbox) => {
      selectedPrices.push(checkbox.value);
    });

    //Filtrar os produtos com base nas seleções
    const filteredProducts: Product[] = allProducts.filter((product) => {
      // Filtro de tamanho
      if (
        selectedSizes.length > 0 &&
        !selectedSizes.some((size) => product.size.includes(size))
      ) {
        return false;
      }

      //Filtro de cor
      if (
        selectedColors.length > 0 &&
        !selectedColors.some(
          (color) => product.color.toLowerCase() === color.toLowerCase()
        )
      ) {
        return false;
      }

      //Filtro de faixa de preço
      if (selectedPrices.length > 0) {
        const productPrice: number = product.price;
        if (
          !selectedPrices.some((priceRange) =>
            faixaDePreco(productPrice, priceRange)
          )
        ) {
          return false;
        }
      }

      return true;
    });

    renderProducts(filteredProducts);
  }

  //Assistir checkboxes
  const sizeCheckboxes: NodeListOf<HTMLInputElement> =
    document.querySelectorAll('input[id^="size-"]');
  sizeCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", filtrarRenderizar);
  });

  const colorCheckboxes: NodeListOf<HTMLInputElement> =
    document.querySelectorAll('input[id^="color-"]');
  colorCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", filtrarRenderizar);
  });

  const priceCheckboxes: NodeListOf<HTMLInputElement> =
    document.querySelectorAll('input[id^="price-"]');
  priceCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", filtrarRenderizar);
  });

  //Limpar Seleções
  limparSelecoes.addEventListener("click", () => {
    const checkboxes: NodeListOf<HTMLInputElement> = document.querySelectorAll(
      'input[type="checkbox"]'
    );
    checkboxes.forEach((checkbox) => {
      checkbox.checked = false;
    });
    carregarProdutos();
    carregarMais.style.display = "block";
  });
}

document.addEventListener("DOMContentLoaded", main);
