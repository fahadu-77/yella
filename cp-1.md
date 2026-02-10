4 roles - [ customer, store staff, admin, deliveryboy]

permissions,
customer
 - add and remove items to the cart,

store staff
 - see all the pending orders in the system, can select and order
 and starts packing, mark order as packed

delivery boy
- assigned with an order, mark order picked, mark order delivered, mark ready for next order when reached the store

admin
- monitor all store operations like order status, pending orders, payment data, inventory update, etc

order status 
- order created, packing started by ss, packing complete, order collected by db, order delivered

inventory
- only remove a count when order is completed, updated by admin

- order cannot be cancelled when packing starts

- stripe payment integration (or need a research on that)