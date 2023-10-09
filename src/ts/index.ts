import { Product } from "./Product";

const serverUrl = "http://localhost:5000";

function main() {
  console.log(serverUrl);

  //ELEMENTOS CARREGAMENTO
  const listaProdutos = document.getElementById("lista-produtos");
  const precoMaior = document.getElementById("preco-maior");
  const precoMenor = document.getElementById("preco-menor");
  const maisRecente = document.getElementById("mais-recente");
  const carregarMais = document.getElementById("carregar-mais");
  const carregarMaisPrecoMenor = document.getElementById("mais-preco-menor");
  const carregarMaisPrecoMaior = document.getElementById("mais-preco-maior");
  const carregarMaisRecente = document.getElementById("carregar-mais-recente");

  //ELEMENTOS FILTROS E ORDENAÇÃO
  const limparSelecoes = document.getElementById("limpar");
  const ordenar = document.getElementById("ordenar");
  const botoesOcultos = document.getElementById("ocultos");
  const verTodasCores = document.getElementById("ver-todas-cores");
  const verMenosCores = document.getElementById("ver-menos-cores");
  const todasCores = document.getElementById("todas-cores");

  //ELEMENTOS CARRINHO
  const carrinho = document.getElementById("carrinho");
  const modalCarrinho = document.getElementById("modal-carrinho");
  const sacola = document.getElementById("sacola");
  const fecharCarrinho = document.getElementById("fechar-carrinho");
  const continuarComprando = document.getElementById("continuar-comprando");
  const finalizar = document.getElementById("finalizar");
  const vazio = document.getElementById("vazio");
  const totalQtd = document.getElementById("total-qtd");
  const totalValue = document.getElementById("total-preco");
  const carrinhoTotal = document.getElementById("carrinho-total");

  //ELEMENTOS LAYOUT MOBILE
  const modalFiltros = document.getElementById("modal-filtros");
  const fecharFiltro = document.getElementById("fechar-filtro");
  const abrirModalFiltros = document.getElementById("abrir-modal-filtros");
  const abrirCoresMobile = document.getElementById("cores-mobile");
  const abrirTamanhosMobile = document.getElementById("tamanhos-mobile");
  const abrirPrecosMobile = document.getElementById("precos-mobile");
  const labelsTamanhos = document.getElementById("labels-tamanhos");
  const labelsPrecos = document.getElementById("labels-precos");
  const todasCoresMobile = document.getElementById("labels-cores-mobile");
  const aplicar = document.getElementById("aplicar");
  const modalOrdem = document.getElementById("modal-ordem");
  const abrirModalOrdem = document.getElementById("abrir-modal-ordem");
  const fecharOrdem = document.getElementById("fechar-ordem");
  const maisRecenteMobile = document.getElementById("mais-recente-mobile");
  const maiorPrecoMobile = document.getElementById("maior-preco-mobile");
  const menorPrecoMobile = document.getElementById("menor-preco-mobile");

  //EVENTOS RENDERIZAÇÃO

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
      <div class="middle-main__container__produtos__produto">
          <figure>
            <img src="${product.image}" alt="${product.name}">
          </figure>
          
          <h2>${product.name}</h2>

          <p class="middle-main__container__produtos__produto__preco">R$ ${product.price
            .toFixed(2)
            .replace(".", ",")}</p>

          <p class="middle-main__container__produtos__produto__parcelamento">até ${
            product.parcelamento[0]
          }x de R$${product.parcelamento[1].toFixed(2).replace(".", ",")}</p>
          
          <!--COMENTADO, PARA DEPOIS CONFERIR FUNCIONAMENTO 
          <p>Cor: ${product.color}</p>
          <p>Tamanhos disponíveis: ${product.size.join(", ")}</p>
          <p>Data de lançamento: ${product.date}</p>-->

          <button class="add-to-cart-button" data-product-id="${
            product.id
          }">COMPRAR</button>
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

  //Quantidade de produtos já carregados
  let produtosCarregados = 0;

  //Armazenar produtos
  let allProducts: Product[] = [];

  //Objeto para rastrear produtos no carrinho e suas quantidades
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
    carregarMaisRecente.style.display = "flex";
    carregarMaisPrecoMenor.style.display = "none";
    carregarMaisPrecoMaior.style.display = "none";
    carregarMais.style.display = "none";
    botoesOcultos.style.display = "none";
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
    carregarMaisPrecoMaior.style.display = "flex";
    carregarMaisPrecoMenor.style.display = "none";
    carregarMais.style.display = "none";
    carregarMaisRecente.style.display = "none";
    botoesOcultos.style.display = "none";
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
    carregarMaisPrecoMenor.style.display = "flex";
    carregarMaisPrecoMaior.style.display = "none";
    carregarMais.style.display = "none";
    carregarMaisRecente.style.display = "none";
    botoesOcultos.style.display = "none";
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
      modalCarrinho.style.display = "flex";
      vazio.style.display = "none";
      finalizar.style.display = "flex";

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      //Chamar função para calcular o novo valor total
      const totalPrice = calcularPrecoTotal(carrinhoProdutos);
      totalValue.textContent = `Valor Total: R$ ${totalPrice
        .toFixed(2)
        .replace(".", ",")}`;
    }
  }

  //Função para renderizar o carrinho
  function renderCart() {
    const carrinhoHTML = Object.values(carrinhoProdutos).map(
      (cartItem) => `
      <div class="cart-item">
        <div>
          <figure>
            <img src="${cartItem.product.image}" alt="${cartItem.product.name}">
          </figure>
        </div>
        
        <div class="cart-item__nome">
          <h3>${cartItem.product.name}</h3>

          <div class="cart-item__nome__qtd">
            <button class="decrease-quantity-button" data-product-id="${
              cartItem.product.id
            }">-</button>
            <p>Qtd ${cartItem.quantity}</p>
            <button class="increase-quantity-button" data-product-id="${
              cartItem.product.id
            }">+</button>
          </div>
        </div>      

        <p class="preco-item">R$${cartItem.product.price
          .toFixed(2)
          .replace(".", ",")}</p>

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
    cartCount.textContent = `${totalQuantity}`;
    totalQtd.textContent = `Total de produtos: ${totalQuantity}`;

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

    if (totalQuantity === 0) {
      vazio.style.display = "flex";
      finalizar.style.display = "none";
      carrinhoTotal.style.display = "none";
    } else {
      carrinhoTotal.style.display = "flex";
    }
  }

  //Função para remover um produto do carrinho completamente
  function removeFromCart(event: Event) {
    const button = event.target as HTMLButtonElement;
    const productId = button.dataset.productId;

    if (carrinhoProdutos[productId]) {
      delete carrinhoProdutos[productId];
      renderCart();

      // Chamar função para calcular o novo valor total
      const totalPrice = calcularPrecoTotal(carrinhoProdutos);
      totalValue.textContent = `Valor Total: R$ ${totalPrice
        .toFixed(2)
        .replace(".", ",")}`;
    }
  }

  //Função para aumentar a quantidade de um produto no carrinho
  function increaseQuantity(event: Event) {
    const button = event.target as HTMLButtonElement;
    const productId = button.dataset.productId;

    if (carrinhoProdutos[productId]) {
      carrinhoProdutos[productId].quantity++;
      renderCart();
      // Chamar função para calcular o novo valor total
      const totalPrice = calcularPrecoTotal(carrinhoProdutos);
      totalValue.textContent = `Valor Total: R$ ${totalPrice
        .toFixed(2)
        .replace(".", ",")}`;
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
      // Chamar função para calcular o novo valor total
      const totalPrice = calcularPrecoTotal(carrinhoProdutos);
      totalValue.textContent = `Valor Total: R$ ${totalPrice
        .toFixed(2)
        .replace(".", ",")}`;
    }
  }

  function calcularPrecoTotal(
    carrinhoProdutos: Record<string, { product: Product; quantity: number }>
  ) {
    let totalPrice = 0;
    for (const productId in carrinhoProdutos) {
      const cartItem = carrinhoProdutos[productId];
      totalPrice += cartItem.product.price * cartItem.quantity;
    }
    return totalPrice;
  }

  //Abrir e fechar carrinho
  sacola.addEventListener("click", () => {
    modalCarrinho.style.display = "flex";
  });
  fecharCarrinho.addEventListener("click", () => {
    modalCarrinho.style.display = "none";
  });
  continuarComprando.addEventListener("click", () => {
    modalCarrinho.style.display = "none";
  });

  //FILTROS
  //Verificar preço dentro da faixa selecionada
  function faixaDePreco(price: number, priceRange: string): boolean {
    const [min, max] = priceRange.split("-").map(parseFloat);
    return price >= min && price <= max;
  }

  //Função para verificar se nenhum filtro está selecionado
  function nenhumFiltroSelecionado(): boolean {
    const sizeCheckboxes: NodeListOf<HTMLInputElement> =
      document.querySelectorAll('input[id^="size-"]:checked');
    const colorCheckboxes: NodeListOf<HTMLInputElement> =
      document.querySelectorAll('input[id^="color-"]:checked');
    const priceCheckboxes: NodeListOf<HTMLInputElement> =
      document.querySelectorAll('input[id^="price-"]:checked');

    return (
      sizeCheckboxes.length === 0 &&
      colorCheckboxes.length === 0 &&
      priceCheckboxes.length === 0 &&
      opcaoOrdenacao === ""
    );
  }

  // Eventos de clique para ordenar produtos
  maisRecente.addEventListener("click", () => {
    opcaoOrdenacao = "maisRecente";
    renderMaisRecente();
    filtrarRenderizar();
    if (produtosCarregados > 8) {
      carregarMaisPrecoMaior.style.display = "none";
      carregarMaisPrecoMenor.style.display = "none";
      carregarMais.style.display = "none";
    }
  });
  maisRecenteMobile.addEventListener("click", () => {
    modalOrdem.style.display = "none";
    opcaoOrdenacao = "maisRecente";
    renderMaisRecente();
    filtrarRenderizar();
    if (produtosCarregados > 8) {
      carregarMaisPrecoMaior.style.display = "none";
      carregarMaisPrecoMenor.style.display = "none";
      carregarMais.style.display = "none";
    }
  });

  precoMaior.addEventListener("click", () => {
    opcaoOrdenacao = "precoMaior";
    renderPrecoMaior();
    filtrarRenderizar();
    if (produtosCarregados > 8) {
      carregarMaisPrecoMenor.style.display = "none";
      carregarMaisRecente.style.display = "none";
      carregarMais.style.display = "none";
    }
  });
  maiorPrecoMobile.addEventListener("click", () => {
    modalOrdem.style.display = "none";
    opcaoOrdenacao = "precoMaior";
    renderPrecoMaior();
    filtrarRenderizar();
    if (produtosCarregados > 8) {
      carregarMaisPrecoMenor.style.display = "none";
      carregarMaisRecente.style.display = "none";
      carregarMais.style.display = "none";
    }
  });

  precoMenor.addEventListener("click", () => {
    opcaoOrdenacao = "precoMenor";
    renderPrecoMenor();
    filtrarRenderizar();
    if (produtosCarregados > 8) {
      carregarMaisPrecoMaior.style.display = "none";
      carregarMaisRecente.style.display = "none";
      carregarMais.style.display = "none";
    }
  });
  menorPrecoMobile.addEventListener("click", () => {
    modalOrdem.style.display = "none";
    opcaoOrdenacao = "precoMenor";
    renderPrecoMenor();
    filtrarRenderizar();
    if (produtosCarregados > 8) {
      carregarMaisPrecoMaior.style.display = "none";
      carregarMaisRecente.style.display = "none";
      carregarMais.style.display = "none";
    }
  });

  let opcaoOrdenacao: string = "";

  //Filtrar e renderizar produtos
  function filtrarRenderizar(): void {
    if (nenhumFiltroSelecionado()) {
      //Se nenhum filtro estiver selecionado, renderiza apenas os 9 primeiros produtos
      if (opcaoOrdenacao === "maisRecente") {
        return;
      } else if (opcaoOrdenacao === "precoMaior") {
        return;
      } else if (opcaoOrdenacao === "precoMenor") {
        return;
      }
      const carregarProdutos = allProducts.slice(0, 9);
      opcaoOrdenacao = "";
      renderProducts(carregarProdutos);
      carregarMais.style.display = "flex";
    } else {
      // Filtros selecionados, continua a lógica

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
      let filteredProducts: Product[] = allProducts.filter((product) => {
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

      filteredProducts = ordenarProdutosComOpcaoSelecionada(
        filteredProducts
      ).slice(0, 9);
      renderProducts(filteredProducts);
      if (filteredProducts.length < 8) {
        carregarMaisPrecoMaior.style.display = "none";
        carregarMaisPrecoMenor.style.display = "none";
        carregarMaisRecente.style.display = "none";
      } else {
        carregarMais.style.display = "flex";
      }
    }
  }

  // Função para ordenar produtos com base na opção selecionada
  function ordenarProdutosComOpcaoSelecionada(products: Product[]): Product[] {
    if (opcaoOrdenacao === "maisRecente") {
      return ordenarMaisRecente(products);
    } else if (opcaoOrdenacao === "precoMaior") {
      return ordenarMaiorPreco(products);
    } else if (opcaoOrdenacao === "precoMenor") {
      return ordenarMenorPreco(products);
    } else {
      return products; //Se nenhuma opção estiver selecionada, retornar os produtos sem ordenação
    }
  }

  //Assistir checkboxes de filtros
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

  //Mudar classe quando selecionado
  sizeCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      const parentLabel = checkbox.closest("label");
      if (checkbox.checked) {
        parentLabel.classList.add("selecionado");
      } else {
        parentLabel.classList.remove("selecionado");
      }
    });
  });

  //Limpar seleções de filtros
  limparSelecoes.addEventListener("click", () => {
    const checkboxes: NodeListOf<HTMLInputElement> = document.querySelectorAll(
      'input[type="checkbox"]'
    );
    checkboxes.forEach((checkbox) => {
      checkbox.checked = false;
    });
    carregarProdutos();
    //Seleciona todos os elementos <label> com a classe .selecionado e remove.
    const labelsSelecionados = document.querySelectorAll("label.selecionado");
    labelsSelecionados.forEach((label) => {
      label.classList.remove("selecionado");
    });
  });

  //VER TODAS CORES
  verTodasCores.addEventListener("click", () => {
    todasCores.style.display = "flex";
    verTodasCores.style.display = "none";
    verMenosCores.style.display = "flex";
  });
  verMenosCores.addEventListener("click", () => {
    todasCores.style.display = "none";
    verTodasCores.style.display = "inherit";
    verMenosCores.style.display = "none";
  });

  //BOTOES ORDENAR
  ordenar.addEventListener("click", () => {
    if (botoesOcultos.style.display === "block") {
      botoesOcultos.style.display = "none";
    } else {
      botoesOcultos.style.display = "block";
    }
  });

  document.addEventListener("click", (event) => {
    const targetNode = event.target as Node;
    //click fora da div ordenar, esconde os botões
    if (!ordenar.contains(targetNode)) {
      botoesOcultos.style.display = "none";
    }
  });

  botoesOcultos.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  //FILTROS MOBILE
  abrirModalFiltros.addEventListener("click", () => {
    modalFiltros.style.display = "flex";
  });

  fecharFiltro.addEventListener("click", () => {
    modalFiltros.style.display = "none";
  });

  aplicar.addEventListener("click", () => {
    modalFiltros.style.display = "none";
  });

  let coresVisiveis = false;
  abrirCoresMobile.addEventListener("click", () => {
    if (coresVisiveis) {
      todasCoresMobile.style.display = "none";
      coresVisiveis = false;
    } else {
      todasCoresMobile.style.display = "flex";
      coresVisiveis = true;
    }
  });

  let tamanhosVisiveis = false;
  abrirTamanhosMobile.addEventListener("click", () => {
    if (tamanhosVisiveis) {
      labelsTamanhos.style.display = "none";
      tamanhosVisiveis = false;
    } else {
      labelsTamanhos.style.display = "flex";
      tamanhosVisiveis = true;
    }
  });

  let precosVisiveis = false;
  abrirPrecosMobile.addEventListener("click", () => {
    if (precosVisiveis) {
      labelsPrecos.style.display = "none";
      precosVisiveis = false;
    } else {
      labelsPrecos.style.display = "flex";
      precosVisiveis = true;
    }
  });

  //ORDEM MOBILE
  // menorPrecoMobile.addEventListener("click", () => {
  //   modalOrdem.style.display = "none";
  //   renderPrecoMenor();
  // });
  // maiorPrecoMobile.addEventListener("click", () => {
  //   modalOrdem.style.display = "none";
  //   renderPrecoMaior();
  // });
  // maisRecenteMobile.addEventListener("click", () => {
  //   modalOrdem.style.display = "none";
  //   renderMaisRecente();
  // });
  abrirModalOrdem.addEventListener("click", () => {
    modalOrdem.style.display = "block";
  });
  fecharOrdem.addEventListener("click", () => {
    modalOrdem.style.display = "none";
  });

  //EVITAR BUGS EM REDIMENSIONAMENTO DE TELA
  window.addEventListener("resize", () => {
    if (window.innerWidth < 1025) {
      verTodasCores.style.display = "none";
      verMenosCores.style.display = "none";
      modalFiltros.style.display = "none";
      todasCores.style.display = "none";
    }
    if (window.innerWidth > 1024) {
      modalFiltros.style.display = "flex";
      todasCoresMobile.style.display = "none";
      verTodasCores.style.display = "inherit";
    }
  });
}

document.addEventListener("DOMContentLoaded", main);
