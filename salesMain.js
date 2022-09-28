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