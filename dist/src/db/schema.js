"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.order_items = exports.orders = exports.products = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.products = (0, pg_core_1.pgTable)('products', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    product_name: (0, pg_core_1.varchar)('product_name', { length: 100 }).notNull(),
    product_category: (0, pg_core_1.varchar)('product_category', { length: 100 }).notNull(),
    product_description: (0, pg_core_1.text)('product_description').notNull(),
    product_price: (0, pg_core_1.doublePrecision)('product_price').notNull(),
    product_stock: (0, pg_core_1.integer)('product_stock').notNull(),
    product_image: (0, pg_core_1.text)('product_image').notNull(),
});
exports.orders = (0, pg_core_1.pgTable)('orders', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    customer_email: (0, pg_core_1.varchar)('customer_email', { length: 100 }).notNull(),
    total: (0, pg_core_1.doublePrecision)('total').default(0)
});
exports.order_items = (0, pg_core_1.pgTable)('order_items', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    order_id: (0, pg_core_1.integer)('order_id')
        .notNull()
        .references(() => exports.orders.id),
    product_id: (0, pg_core_1.integer)('product_id')
        .notNull()
        .references(() => exports.products.id),
    quantity: (0, pg_core_1.integer)('quantity').notNull(),
    total: (0, pg_core_1.doublePrecision)('total').default(0),
});
