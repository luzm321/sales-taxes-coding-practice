/*
 Print in receipt:
    1) All items purchased with total price including tax
    2) Each item with corresponding price
    3) All items total tax
 */

// Items for sale at store:
let products = [
    {
        "name": "Ramen Noodles",
        "type": "Food",
        "price": "5$",
        "import": false
    },
    {
        "name": "Television",
        "type": "Electronics",
        "price": "400$",
        "import": false
    },
    {
        "name": "Mexican Chips",
        "type": "Food",
        "price": "15$",
        "import": true
    },
    {
        "name": "Pokemon Plushie",
        "type": "Merchandise",
        "price": "25$",
        "import": true
    },
    {
        "name": "Playstation 5",
        "type": "Merchandise",
        "price": "1,000$",
        "import": true
    }
];

let appState = {
    cart: {},
    total: 0,
    totalTax: 0
};

//fxn to retrieve store item from mock db:
const getItemSelectedFromDatabase = (itemName) => {
    return products.find((product) => {
        if (itemName === product.name) {
            return product;
        }
    });
};

//method returns html representation of store products:
const renderPage = () => {
    return `
        <button id="removeAllItemsBtn">Remove All Items From Cart</button>
        <button id="clearReceiptBtn">Clear Receipt</button>
        ${
            products.map((product) => {
                return `
                    <div id="item${products.indexOf(product) + 1}">
                        <p>${product.name}</p>
                        <label for="item${products.indexOf(product) + 1}Price">Price:</label>
                        <p id="item${products.indexOf(product) + 1}Price">${product.price}</p>
                        <button id="purchaseItem${products.indexOf(product) + 1}">Add to Cart</button>
                    </div>
                `
            }).join("")
        }
    <button id="checkOut">CheckOut</button>
    <br/>
    <label for="receipt">Receipt</label>
    <p id="receipt"></id>
   `
}

const body = document.getElementById('body');
body.innerHTML = renderPage();