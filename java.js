document.addEventListener("DOMContentLoaded", function () {
    console.log("JavaScript Loaded");

    updateBasketCount(); // Updates basket count on page load

    const addToBasketButtons = document.querySelectorAll(".add-to-basket");

    if (addToBasketButtons.length > 0) {
        addToBasketButtons.forEach(button => {
            button.addEventListener("click", function () {
                const itemName = this.getAttribute("data-name");
                const itemPrice = parseFloat(this.getAttribute("data-price")); // Convert price to number
                const itemImage = this.getAttribute("data-image");

                if (!itemName || isNaN(itemPrice)) {
                    console.error("Invalid product data:", itemName, itemPrice, itemImage);
                    return;
                }

                let basket = JSON.parse(localStorage.getItem("basket")) || [];

                basket.push({ 
                    name: itemName, 
                    price: itemPrice, 
                    image: itemImage 
                });

                localStorage.setItem("basket", JSON.stringify(basket));

                updateBasketCount();
                alert(`${itemName} added to basket!`);
            });
        });
    }

    // If on the basket page, load items
    if (document.getElementById("basket-items")) {
        loadBasket();
    }

    // Checkout form submission
    if (document.getElementById("checkout-form")) {
        document.getElementById("checkout-form").addEventListener("submit", function (event) {
            event.preventDefault();

            let name = document.getElementById("name").value;
            let email = document.getElementById("email").value;
            let address = document.getElementById("address").value;
            let cardNumber = document.getElementById("card-number").value;
            let expiryDate = document.getElementById("expiry-date").value;
            let cvv = document.getElementById("cvv").value;

            if (name && email && address && cardNumber && expiryDate && cvv) {
                alert(`Thank you for your purchase, ${name}! Your order has been placed.`);
                clearBasket();
            } else {
                alert("Please fill in all the details before proceeding.");
            }
        });
    }
});

// Function to update basket count in navbar
function updateBasketCount() {
    let basket = JSON.parse(localStorage.getItem("basket")) || [];
    let basketCountElement = document.getElementById("basket-count");

    if (basketCountElement) {
        basketCountElement.textContent = basket.length;
    }
}

// Function to load basket items into basket.html
function loadBasket() {
    let basket = JSON.parse(localStorage.getItem("basket")) || [];
    const basketContainer = document.getElementById("basket-items");
    let totalPrice = 0;

    if (basket.length === 0) {
        basketContainer.innerHTML = "<p class='text-center'>Your basket is empty.</p>";
    } else {
        basketContainer.innerHTML = "";
        basket.forEach((item, index) => {
            let itemPrice = parseFloat(item.price) || 0; // Ensure price is a number

            let itemCard = document.createElement("div");
            itemCard.className = "col-md-4";
            itemCard.innerHTML = `
                <div class="card">
                    <img src="${item.image}" class="card-img-top" alt="${item.name}">
                    <div class="card-body">
                        <h5 class="card-title">${item.name}</h5>
                        <p class="card-text">Price: £${itemPrice.toFixed(2)}</p>
                        <button class="btn btn-danger" onclick="removeFromBasket(${index})">Remove</button>
                    </div>
                </div>
            `;
            basketContainer.appendChild(itemCard);
            totalPrice += itemPrice;
        });

        document.getElementById("total-price").textContent = totalPrice.toFixed(2); // Ensure total price is displayed
    }
}

// Function to remove an item from the basket
function removeFromBasket(index) {
    let basket = JSON.parse(localStorage.getItem("basket")) || [];
    basket.splice(index, 1);
    localStorage.setItem("basket", JSON.stringify(basket));
    loadBasket();
    updateBasketCount();
}

// Function to clear the entire basket
function clearBasket() {
    localStorage.removeItem("basket");
    loadBasket();
    updateBasketCount();
}