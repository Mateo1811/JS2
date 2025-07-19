let cart = [];

const cartCount = document.getElementById("cart-count");
const cartItems = document.getElementById("cart-items");
const cartModal = document.getElementById("cart-modal");
const closeCart = document.getElementById("close-cart");
const checkoutButton = document.getElementById("checkout");
const totalElement = document.getElementById("total");
const purchaseModal = document.getElementById("purchase-modal");
const closePurchase = document.getElementById("close-purchase");
const emptyCartBtn = document.getElementById("empty-cart");

document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", function (event) {
        event.preventDefault();
        const productCard = button.closest(".card-product");
        const productName = productCard.querySelector("h3").textContent;
        const productPrice = parseFloat(productCard.querySelector(".price").textContent.replace("$", ""));
        const existingProduct = cart.find(item => item.name === productName);
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.push({ name: productName, price: productPrice, quantity: 1 });
        }
        updateCartCount();
        saveCart();
        updateTotal();
    });
});

function updateCartCount() {
    cartCount.textContent = cart.reduce((acc, item) => acc + item.quantity, 0);
}

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function displayCart() {
    cartItems.innerHTML = '';
    cart.forEach((item, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
            ${item.name} x${item.quantity} - $${item.price * item.quantity}
            <button class="qty-btn" data-index="${index}" data-action="increase">+</button>
            <button class="qty-btn" data-index="${index}" data-action="decrease">-</button>
        `;
        cartItems.appendChild(li);
    });

    document.querySelectorAll(".qty-btn").forEach(button => {
        const index = parseInt(button.dataset.index);
        const action = button.dataset.action;
        button.addEventListener("click", () => {
            if (action === "increase") {
                cart[index].quantity += 1;
            } else if (action === "decrease") {
                cart[index].quantity -= 1;
                if (cart[index].quantity <= 0) {
                    cart.splice(index, 1);
                }
            }
            updateCartCount();
            saveCart();
            updateTotal();
            displayCart();
        });
    });
}

function updateTotal() {
    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    totalElement.textContent = `Total: $${total}`;
}

document.getElementById("cart-icon").addEventListener("click", function () {
    cartModal.style.display = "flex";
    displayCart();
    updateTotal();
});

closeCart.addEventListener("click", function () {
    cartModal.style.display = "none";
});

checkoutButton.addEventListener("click", function () {
    purchaseModal.style.display = "flex";
    cart = [];
    updateCartCount();
    saveCart();
    updateTotal();
    cartModal.style.display = "none";
});

closePurchase.addEventListener("click", function () {
    purchaseModal.style.display = "none";
});

emptyCartBtn.addEventListener("click", function () {
    cart = [];
    updateCartCount();
    saveCart();
    updateTotal();
    displayCart();
});

function loadCart() {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
        updateTotal();
    }
}

loadCart();