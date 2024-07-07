document.addEventListener("DOMContentLoaded", () => {
  let products = [
    { title: "Men's Shirt", price: 700, productImg: "https://via.placeholder.com/150", category: "Fashion" },
    { title: "Women's Dress", price: 1100, productImg: "https://via.placeholder.com/150", category: "Fashion" },
    { title: "Kid's Jacket", price: 640, productImg: "https://via.placeholder.com/150", category: "Fashion" },
    { title: "Men's Jeans", price: 1270, productImg: "https://via.placeholder.com/150", category: "Fashion" },
    { title: "Women's Skirt", price: 300, productImg: "https://via.placeholder.com/150", category: "Fashion" },
    { title: "Smartphone", price: 30000, productImg: "https://via.placeholder.com/150", category: "Electronics" },
    { title: "Laptop", price: 80000, productImg: "https://via.placeholder.com/150", category: "Electronics" },
    { title: "Tablet", price: 20000, productImg: "https://via.placeholder.com/150", category: "Electronics" },
    { title: "Smart Watch", price: 15000, productImg: "https://via.placeholder.com/150", category: "Electronics" },
    { title: "Bluetooth Speaker", price: 10000, productImg: "https://via.placeholder.com/150", category: "Electronics" },
    { title: "Sofa", price: 40000, productImg: "https://via.placeholder.com/150", category: "Home & Living" },
    { title: "Dining Table", price: 35000, productImg: "https://via.placeholder.com/150", category: "Home & Living" },
    { title: "Bed", price: 50000, productImg: "https://via.placeholder.com/150", category: "Home & Living" },
    { title: "Chair", price: 10000, productImg: "https://via.placeholder.com/150", category: "Home & Living" },
    { title: "Lamp", price: 5000, productImg: "https://via.placeholder.com/150", category: "Home & Living" },
    { title: "Treadmill", price: 70000, productImg: "https://via.placeholder.com/150", category: "Sports & Outdoors" },
    { title: "Bicycle", price: 30000, productImg: "https://via.placeholder.com/150", category: "Sports & Outdoors" },
    { title: "Yoga Mat", price: 2000, productImg: "https://via.placeholder.com/150", category: "Sports & Outdoors" },
    { title: "Tent", price: 15000, productImg: "https://via.placeholder.com/150", category: "Sports & Outdoors" },
    { title: "Hiking Boots", price: 10000, productImg: "https://via.placeholder.com/150", category: "Sports & Outdoors" },
    { title: "Novel", price: 1500, productImg: "https://via.placeholder.com/150", category: "Books & Stationery" },
    { title: "Notebook", price: 500, productImg: "https://via.placeholder.com/150", category: "Books & Stationery" },
    { title: "Pen Set", price: 1000, productImg: "https://via.placeholder.com/150", category: "Books & Stationery" },
    { title: "Textbook", price: 5000, productImg: "https://via.placeholder.com/150", category: "Books & Stationery" },
    { title: "Planner", price: 2000, productImg: "https://via.placeholder.com/150", category: "Books & Stationery" },
  ];

  const shopContent = document.getElementById("shop-content");

  function displayProducts(productList) {
    shopContent.innerHTML = '';
    productList.forEach((product) => {
      const productBox = document.createElement("div");
      productBox.classList.add("product-box");
      productBox.innerHTML = `
        <img src="${product.productImg}" alt="${product.title}" class="product-img" />
        <h2 class="product-title">${product.title}</h2>
        <span class="price">₹ ${product.price}</span>
        <div class="add-cart-icon">
          <i class="bx bx-shopping-bag add-cart"></i>
        </div>
      `;
      shopContent.appendChild(productBox);
    });

    // Add event listeners to "Add to Cart" buttons
    const addCartButtons = document.querySelectorAll('.add-cart');
    addCartButtons.forEach(button => {
      button.addEventListener('click', addCartClicked);
    });
  }

  displayProducts(products);

  document.getElementById("search-bar").addEventListener("input", (event) => {
    const query = event.target.value.toLowerCase();
    const filteredProducts = products.filter(product =>
      product.title.toLowerCase().includes(query)
    );
    displayProducts(filteredProducts);
  });

  window.filterProducts = (category) => {
    if (category === 'All') {
      displayProducts(products);
    } else {
      const filteredProducts = products.filter(product => product.category === category);
      displayProducts(filteredProducts);
    }
  };

  function addCartClicked(event) {
    const button = event.target;
    const productTitle = button.parentElement.parentElement.querySelector('.product-title').innerText;
    const product = products.find(p => p.title === productTitle);

    if (!product) {
      console.error("Product not found");
      return;
    }

    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const existingItem = cartItems.find(item => item.title === product.title);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cartItems.push({
        title: product.title,
        price: product.price,
        productImg: product.productImg,
        quantity: 1
      });
    }

    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    updateCartIcon();
    addProductToCart(product.title, product.price, product.productImg); // Ensure product title is passed
  }

  function updateCartIcon() {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);
    const cartIcon = document.querySelector("#cart-icon");
    cartIcon.setAttribute("data-quantity", totalQuantity);
  }

  updateCartIcon();

  // Cart functionality
  let cartIcon = document.querySelector("#cart-icon");
  let cart = document.querySelector(".cart");
  let closeCart = document.querySelector("#close-cart");

  if (cartIcon && cart && closeCart) {
    // Open Cart
    cartIcon.onclick = () => {
      cart.classList.add("cart-active");
    };

    // Close Cart
    closeCart.addEventListener("click", () => {
      cart.classList.remove("cart-active");
    });
  } else {
    console.error("One or more elements not found!");
  }

  // Making Add to cart
  // Cart Working JS
  if (document.readyState == "loading") {
    document.addEventListener("DOMContentLoaded", ready);
  } else {
    ready();
  }

  // Making Function
  function ready() {
    // Remove item From cart
    var removeCartButtons = document.getElementsByClassName("cart-remove");

    for (var i = 0; i < removeCartButtons.length; i++) {
      var button = removeCartButtons[i];
      button.addEventListener("click", removeCartItem);
    }
    // Quantity Change
    var quantityInputs = document.getElementsByClassName("cart-quantity");
    for (var i = 0; i < quantityInputs.length; i++) {
      var input = quantityInputs[i];
      input.addEventListener("change", quantityChanged);
    }
    // Add to cart
    var addCart = document.getElementsByClassName("add-cart");
    for (var i = 0; i < addCart.length; i++) {
      var button = addCart[i];
      button.addEventListener("click", addCartClicked);
    }
    loadCartItems();
  }

  // Remove Cart Item
  function removeCartItem(event) {
    var buttonClicked = event.target;
    buttonClicked.parentElement.remove();
    updateTotal();
    saveCartItems();
    updateCartIcon();
  }

  // Quantity Change
  function quantityChanged(event) {
    var input = event.target;
    if (isNaN(input.value) || input.value <= 0) {
      input.value = 1;
    }
    updateTotal();
    saveCartItems();
    updateCartIcon();
  }

  // Add to cart Function
  function addCartClicked(event) {
    var button = event.target;
    var shopProducts = button.parentElement.parentElement;
    var title =
      shopProducts.getElementsByClassName("product-title")[0].innerText;
    var price = parseFloat(shopProducts.getElementsByClassName("price")[0].innerText.replace("₹ ", ""));
    var productImg = shopProducts.getElementsByClassName("product-img")[0].src;

    addProductToCart(title, price, productImg);
    updateTotal();
    saveCartItems();
    updateCartIcon();
  }

  function addProductToCart(title, price, productImg) {
    var cartShopBox = document.createElement("div");
    cartShopBox.classList.add("cart-box");
    var cartItems = document.getElementsByClassName("cart-content")[0];
    var cartItemsNames = cartItems.getElementsByClassName("cart-product-title");
    for (var i = 0; i < cartItemsNames.length; i++) {
      if (cartItemsNames[i].innerText == title) {
        alert("You have already added this item to the cart");
        return;
      }
    }
    var cartBoxContent = `
      <img src="${productImg}" alt="" class="cart-img" />
      <div class="detail-box">
        <div class="cart-product-title">${title}</div>
        <div class="cart-price">${price}</div>
        <input
          type="number"
          name=""
          id=""
          value="1"
          class="cart-quantity"
        />
      </div>
      <!--Remove Item-->
      <i class="bx bx-trash-alt cart-remove"></i>`;
    cartShopBox.innerHTML = cartBoxContent;
    cartItems.append(cartShopBox);
    cartShopBox
      .getElementsByClassName("cart-remove")[0]
      .addEventListener("click", removeCartItem);
    cartShopBox
      .getElementsByClassName("cart-quantity")[0]
      .addEventListener("change", quantityChanged);
    saveCartItems();
    updateCartIcon();
  }

  // Update Total
  function updateTotal() {
    var cartContent = document.getElementsByClassName("cart-content")[0];
    var cartBoxes = cartContent.getElementsByClassName("cart-box");
    var total = 0;
    for (var i = 0; i < cartBoxes.length; i++) {
      var cartBox = cartBoxes[i];
      var priceElement = cartBox.getElementsByClassName("cart-price")[0];
      var quantityElement = cartBox.getElementsByClassName("cart-quantity")[0];
      var price = parseFloat(priceElement.innerText.replace("₹ ", ""));
      var quantity = quantityElement.value;
      total = total + price * quantity;
    }
    total = Math.round(total * 100) / 100;
    document.getElementsByClassName("total-price")[0].innerText = "₹" + total;
    localStorage.setItem("cartTotal", total);
  }

  // Keep Items in cart when page refresh with LocalStorage
  function saveCartItems() {
    var cartContent = document.getElementsByClassName("cart-content")[0];
    var cartBoxes = cartContent.getElementsByClassName("cart-box");
    var cartItems = [];

    for (var i = 0; i < cartBoxes.length; i++) {
      var cartBox = cartBoxes[i];
      var titleElement =
        cartBox.getElementsByClassName("cart-product-title")[0];
      var priceElement = cartBox.getElementsByClassName("cart-price")[0];
      var quantityElement = cartBox.getElementsByClassName("cart-quantity")[0];
      var productImg = cartBox.getElementsByClassName("cart-img")[0].src;

      var item = {
        title: titleElement.innerText,
        price: parseFloat(priceElement.innerText.replace("₹ ", "")),
        quantity: quantityElement.value,
        productImg: productImg,
      };
      cartItems.push(item);
    }
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }

  // Loads In Cart
  function loadCartItems() {
    var cartItems = localStorage.getItem("cartItems");
    if (cartItems) {
      cartItems = JSON.parse(cartItems);

      for (var i = 0; i < cartItems.length; i++) {
        var item = cartItems[i];
        addProductToCart(item.title, item.price, item.productImg);

        var cartBoxes = document.getElementsByClassName("cart-box");
        var cartBox = cartBoxes[cartBoxes.length - 1];
        var quantityElement =
          cartBox.getElementsByClassName("cart-quantity")[0];
        quantityElement.value = item.quantity;
      }
    }
    var cartTotal = localStorage.getItem("cartTotal");
    if (cartTotal) {
      document.getElementsByClassName("total-price")[0].innerText =
        "₹" + cartTotal;
    }
    updateCartIcon();
  }

  // Quantity in Cart Icon
  function updateCartIcon() {
    var cartBoxes = document.getElementsByClassName("cart-box");
    var quantity = 0;
    for (var i = 0; i < cartBoxes.length; i++) {
      var cartBox = cartBoxes[i];
      var quantityElement = cartBox.getElementsByClassName("cart-quantity")[0];
      quantity += parseInt(quantityElement.value);
    }
    var cartIcon = document.querySelector("#cart-icon");
    cartIcon.setAttribute("data-quantity", quantity);
  }

  // Clear cart item after successful payment
  function clearCart() {
    var cartContent = document.getElementsByClassName("cart-content")[0];
    cartContent.innerHTML = "";
    updateTotal();
    localStorage.removeItem("cartItems");
  }
});