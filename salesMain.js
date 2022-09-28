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
        "name": "The Pragmatic Programmer",
        "type": "Book",
        "price": "25$",
        "import": true
    },
    {
        "name": "Stethoscope",
        "type": "Medical",
        "price": "100$",
        "import": false
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

// ADD/REMOVE ITEMS FROM CART METHODS:
const removeAllItemsFromCart = () => {
    alert(`All items have been removed from your cart Items Removed: ${Object.keys(appState.cart)}`);
    appState.cart = {};
};

const addItemToCart = (itemName) => {
    let productFound = getItemSelectedFromDatabase(itemName);
    let allCalculatedTaxAmounts;
    if (appState.cart[productFound.name]) {
        // ANOTHER ITEM
        allCalculatedTaxAmounts = calculateTaxesOfItem(productFound);
        updateExistingItemObject(productFound, allCalculatedTaxAmounts)
    } else {
        // NEW ITEM
        allCalculatedTaxAmounts = calculateTaxesOfItem(productFound);
        createNewItemObject(productFound, allCalculatedTaxAmounts);
    }
    alert(`${itemName} has been added to cart`);
};

// CREATE/UPDATE ITEM OBJECT METHODS:
const updateExistingItemObject = (item, allCalculatedTaxAmounts) => {
    let itemInCart = appState.cart[item.name];
    let newItemQuantity = itemInCart.quantity + 1;
    let newTotalPrice = itemInCart.totalPrice + convertFromCurrency(item.price);
    let newPriceAfterTax = (parseFloat(itemInCart.totalPriceAfterTax) + allCalculatedTaxAmounts.priceTotalAfterTax).toFixed(2);
    let accruedImportTax = (parseFloat(itemInCart.accruedImportTax) + allCalculatedTaxAmounts.importTax).toFixed(2);
    let accruedSalesTax = (parseFloat(itemInCart.accruedSalesTax) + allCalculatedTaxAmounts.salesTax).toFixed(2);
    let accruedOverallTax = (parseFloat(itemInCart.accruedOverallTax) + allCalculatedTaxAmounts.addedTax).toFixed(2);

    itemInCart.quantity = newItemQuantity;
    itemInCart.totalPrice = newTotalPrice;
    itemInCart.totalPriceAfterTax = newPriceAfterTax;
    itemInCart.accruedImportTax = accruedImportTax;
    itemInCart.accruedSalesTax = accruedSalesTax;
    itemInCart.accruedOverallTax = accruedOverallTax;
};

const createNewItemObject = (item, allCalculatedTaxAmounts) => {
    const itemPrice = convertFromCurrency(item.price);
    let newItem = {
        itemName: item.name,
        itemRetailPrice: itemPrice,
        accruedOverallTax: allCalculatedTaxAmounts.addedTax,
        addedTax: allCalculatedTaxAmounts.addedTax,
        importTax: allCalculatedTaxAmounts.importTax,
        salesTax: allCalculatedTaxAmounts.salesTax,
        accruedImportTax: allCalculatedTaxAmounts.importTax,
        accruedSalesTax: allCalculatedTaxAmounts.salesTax,
        totalPrice: itemPrice,
        totalPriceAfterTax: allCalculatedTaxAmounts.priceTotalAfterTax,
        isImport: item.import,
        type: item.type,
        quantity: 1
    };
    appState.cart[item.name] = newItem;
};

const setTotal = (newValue) => {
    appState.total = newValue;
};

const setTotalTax = (newValue) => {
    appState.totalTax = newValue;
};

//converts string format to number format of product price:
const convertFromCurrency = (numberInStringForm) => {
    let newNumber;
    if (numberInStringForm.toString().includes('$')) {
        newNumber = numberInStringForm.replace('$', '');
    } else {
        newNumber = numberInStringForm;
    }
    // This line is in case numbers with a comma are passed. The toString() is there in case theres a number passed and not a string.
    // Without this line the code will break, because you cannot do a replace on a number.
    newNumber = parseFloat(newNumber.toString().replace(/,/g, ''));
    return newNumber;
};

const calculateTotalPrice = () => {
    let itemsArray = Object.values(appState.cart);
    let total = 0;
    itemsArray.forEach((item) => {
        //? Need parseFloat as parseInt will only parse the leading part of the string that defines a whole number.
        //? Reference: https://stackoverflow.com/questions/28894971/problems-with-javascript-parseint-decimal-string
        total += parseFloat(item.totalPriceAfterTax);
    });
    return total;
}

//TAX CALCULATION METHODS:
const calculateTaxesForAllPurchasedItems = () => {
    let itemsArray = Object.values(appState.cart);
    let totalTaxes = 0;
    itemsArray.forEach((item) => {
        totalTaxes += parseFloat(item.accruedOverallTax);
    });
    return totalTaxes;
};

const calculateImportTax = (product) => {
    let totalPriceAfterImportTax = 0;
    let importTax = 0;
    let itemTax = .05
    let productPrice;

    productPrice = convertFromCurrency(product.price);

    if(product.import) {
        //Round up then add to original price to get the total with tax.
        let calculatedPriceAfter5PercentTax = (productPrice * itemTax) + productPrice;
        //Reference: https://stackoverflow.com/questions/10413573/rounding-up-to-the-nearest-0-05-in-javascript
        let roundedToNearest5Cent = (Math.ceil(calculatedPriceAfter5PercentTax*20)/20);
        totalPriceAfterImportTax += roundedToNearest5Cent;
        importTax = totalPriceAfterImportTax - productPrice;
    } else {
        totalPriceAfterImportTax += productPrice;
    }
    return {totalPriceAfterImportTax: totalPriceAfterImportTax, importTax: importTax};
};

const calculateSalesTax = (product) => {
    //This calculates the total amount you paid after sales taxes with exception of product types in conditions below:
    let totalPriceAfterSalesTax = 0;
    let salesTax = 0;
    let itemTax = .10;
    if (product.type !== "Food" && product.type !== "Medical" && product.type !== "Book") {
        let productPrice = convertFromCurrency(product.price);
        let calculatedPriceAfter10PercentTax = (productPrice * itemTax) + productPrice;
        // This rounds up to the nearest 5 cents:
        let roundedToNearest5Cent = (Math.ceil(calculatedPriceAfter10PercentTax*20)/20)
        totalPriceAfterSalesTax += roundedToNearest5Cent;
        salesTax = totalPriceAfterSalesTax - productPrice;
    }
    return {totalPriceAfterSalesTax: totalPriceAfterSalesTax, salesTax: salesTax};
};

//method to calc both import & sales taxes of product
const calculateTaxesOfItem = (productToTax) => {
    let productPrice = convertFromCurrency(productToTax.price)
    let importTaxCalculationResults = calculateImportTax(productToTax);
    let salesTaxCalculationResults = calculateSalesTax(productToTax);
    console.log('sales tax', salesTaxCalculationResults, importTaxCalculationResults);
    let importTax = importTaxCalculationResults.importTax;
    let salesTax = salesTaxCalculationResults.salesTax;
    let itemPriceAfterAllTaxes =  (importTax + salesTax) + productPrice
    let addedTax = importTax + salesTax;
    return {
        addedTax: addedTax,
        importTax: importTax,
        salesTax: salesTax,
        priceTotalAfterTax: itemPriceAfterAllTaxes
    };
}

// EVENT LISTENERS:
document.addEventListener('click', (event) => {
    if(event.target.id.includes('purchaseItem')) {
        let itemName = event.target.parentElement.children[0].textContent;
        addItemToCart(itemName)
    }
});

document.addEventListener('click', (event) => {
    if(event.target.id === 'checkOut') {
        // This is where the calculations need to happen.
        setTotalTax(calculateTaxesForAllPurchasedItems());
        setTotal(calculateTotalPrice());
        document.getElementById("receipt").innerHTML = renderReceipt();
        appState.cart = {};
    }
});

document.addEventListener('click', (event) => {
    if(event.target.id === 'removeAllItemsBtn') {
        removeAllItemsFromCart();
    }
});

document.addEventListener('click', (event) => {
    if(event.target.id === 'clearReceiptBtn') {
        document.getElementById("receipt").innerHTML = '';
    }
});

// RENDER METHODS:
const renderReceipt = () => {
    return `
        ${
        Object.keys(appState.cart).map((item) => {
            return `
                        <p>${appState.cart[item].itemName} at ${appState.cart[item].itemRetailPrice}$</p>
                        ${
                            Object.keys(appState.cart).length > 1 ? `<p>${appState.cart[item].totalPriceAfterTax}$</p>` : ''
                        }
                        ${
                            appState.cart[item].quantity > 1 ? `<p>(${appState.cart[item].quantity} @ ${appState.cart[item].itemRetailPrice}$)</p>` : ''
                        }
                    `
        }).join("")
    }
        <label for="totalTax">Sales Taxes:</label>
        <p id="totalTax">${appState.totalTax}$</p>
        <label for="totalPrice">Total:</label>
        <p id="totalPrice">${appState.total}$</p>
    `
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
    <br/>
    <label for="receipt">Receipt:</label>
    <p id="receipt"></id>
   `
}

const body = document.getElementById('body');
body.innerHTML = renderPage();