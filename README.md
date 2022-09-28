Sales Taxes Problem Description:

There are a variety of items for sale at a store. When a customer purchases items, they receive a receipt. The receipt
lists all of the items purchased, the sales price of each item (with taxes included), the total sales taxes for all items,
and the total sales price.

Basic sales tax applies to all items at a rate of 10% of the item’s list price, with the exception of books, food, and
medical products, which are exempt from basic sales tax. An import duty (import tax) applies to all imported items at
a rate of 5% of the shelf price, with no exceptions.

Write an application that takes input for shopping baskets and returns receipts in the format shown below, calculating
all taxes and totals correctly. When calculating the sales tax, round the value up to the nearest 5 cents. For example, if
a taxable item costs $5.60, an exact 10% tax would be $0.56, and the final price after adding the rounded tax of $0.60
should be $6.20.

INPUT 1:
1 Book at 12.49
1 Book at 12.49
1 Music CD at 14.99
1 Chocolate bar at 0.85

OUTPUT 1:
Book: 24.98 (2 @ 12.49)
Music CD: 16.49
Chocolate bar: 0.85
Sales Taxes: 1.50
Total: 42.32

INPUT 2:
1 Imported box of chocolates at 10.00
1 Imported bottle of perfume at 47.50

OUTPUT 2:
Imported box of chocolates: 10.50
Imported bottle of perfume: 54.65
Sales Taxes: 7.65
Total: 65.15

INPUT 3:
1 Imported bottle of perfume at 27.99
1 Bottle of perfume at 18.99
1 Packet of headache pills at 9.75
1 Imported box of chocolates at 11.25
1 Imported box of chocolates at 11.25

OUTPUT 3:
Imported bottle of perfume: 32.19
Bottle of perfume: 20.89
Packet of headache pills: 9.75
Imported box of chocolates: 23.70 (2 @ 11.85)
Sales Taxes: 7.30
Total: 86.53
