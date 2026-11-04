const foods = [
    {
        name: "Idli",
        price: 30,
        image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500"
    },
    {
        name: "Dosa",
        price: 50,
        image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500"
    },
    {
        name: "Masala Dosa",
        price: 70,
        image: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=500"
    },
    {
        name: "Pongal",
        price: 40,
        image:  "https://images.unsplash.com/photo-1626500155537-93690c24099e?w=500"
    },
    {
        name: "Poori",
        price: 45,
        image:  "https://images.pexels.com/photos/31150256/pexels-photo-31150256.jpeg?auto=compress&cs=tinysrgb&w=500"

    },
    {
        name: "Chapati",
        price: 40,
        image: "https://commons.wikimedia.org/wiki/Special:FilePath/Chapati%20roti.jpg"
    },
    {
        name: "Veg Fried Rice",
        price: 80,
        image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500"
    },
    {
        name: "Chicken Fried Rice",
        price: 120,
        image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500"
    },
    {
        name: "Veg Noodles",
        price: 70,
        image:  "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500"
    },
    {
        name: "Sandwich",
        price: 60,
        image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500"
    },
    {
        name: "Tea",
        price: 15,
        image:"https://commons.wikimedia.org/wiki/Special:FilePath/Indian%20Chai.jpg" 
    },
    {
        name: "Fresh Juice",
        price: 40,
        image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=500"
    }
];

let cart = [];
let total = 0;
let orders = JSON.parse(
    localStorage.getItem("canteenOrders") || "[]"
);

function displayMenu() {
    const menu = document.getElementById("menu");

    menu.innerHTML = foods.map((food, index) => `
        <div class="food">
            <img src="${food.image}"
                 alt="${food.name}"
                 onerror="this.src='https://placehold.co/500x300?text=Food'">
            <h3>${food.name}</h3>
            <p>₹${food.price}</p>
            <button onclick="addToCart(${index})">
                Add to Cart
            </button>
        </div>
    `).join("");
}

function addToCart(index) {
    const food = foods[index];
    const item = cart.find(x => x.name === food.name);

    if (item) {
        item.qty++;
    } else {
        cart.push({
            name: food.name,
            price: food.price,
            qty: 1
        });
    }

    displayCart();
}

function changeQty(index, amount) {
    cart[index].qty += amount;

    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
    }

    displayCart();
}

function removeItem(index) {
    cart.splice(index, 1);
    displayCart();
}

function displayCart() {
    const cartDiv = document.getElementById("cart");
    total = 0;

    cartDiv.innerHTML = cart.map((item, index) => {
        total += item.price * item.qty;

        return `
            <div class="cart-item">
                <strong>${item.name}</strong>
                <p>₹${item.price} × ${item.qty}
                   = ₹${item.price * item.qty}</p>
                <button class="qty-btn"
                    onclick="changeQty(${index}, -1)">−</button>
                ${item.qty}
                <button class="qty-btn"
                    onclick="changeQty(${index}, 1)">+</button>
                <button class="remove-btn"
                    onclick="removeItem(${index})">Remove</button>
            </div>
        `;
    }).join("");

    document.getElementById("total").textContent = total;
}

function placeOrder() {
    const name = document.getElementById("studentName").value.trim();
    const regNo = document.getElementById("regNo").value.trim();

    if (!name || !regNo) {
        alert("Please enter your name and register number!");
        return;
    }

    if (cart.length === 0) {
        alert("Please add food items first!");
        return;
    }

    const order = {
        id: Date.now(),
        name: name,
        regNo: regNo,
        items: cart.map(item => ({ ...item })),
        total: total,
        status: "Order Placed",
        date: new Date().toLocaleString()
    };

    orders.unshift(order);

    localStorage.setItem(
        "canteenOrders",
        JSON.stringify(orders)
    );

    alert("Order placed successfully! Total: ₹" + total);

    cart = [];
    displayCart();
    displayHistory();
}

function displayHistory() {
    const history = document.getElementById("history");

    if (orders.length === 0) {
        history.innerHTML = "<p>No orders yet.</p>";
        return;
    }

    history.innerHTML = orders.map(order => `
        <div class="history-item">
            <h3>Order #${order.id}</h3>
            <p>Student: ${escapeHTML(order.name)}</p>
            <p>Register No: ${escapeHTML(order.regNo)}</p>
            <p>Items: ${order.items.map(item =>
                escapeHTML(item.name) + " × " + item.qty
            ).join(", ")}</p>
            <p>Total: ₹${order.total}</p>
            <p>Date: ${order.date}</p>
            <p class="status">Status: ${order.status}</p>
        </div>
    `).join("");
}

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

displayMenu();
displayCart();
displayHistory();
