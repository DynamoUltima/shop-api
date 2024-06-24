"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pg_1 = require("pg");
const drizzle_orm_1 = require("drizzle-orm");
const router = express_1.default.Router();
const node_postgres_1 = require("drizzle-orm/node-postgres");
const schema_1 = require("./db/schema");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const pool = new pg_1.Pool({ connectionString: `${process.env.DATABASE_URL}`, ssl: { rejectUnauthorized: false } });
const db = (0, node_postgres_1.drizzle)(pool);
// Error handler for database queries
const handleQueryError = (err, res) => {
    console.error('Error executing query:', err);
    res.status(500).json({ error: 'An error occurred while executing the query.' });
};
// Get all products
router.get('/products', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rows = yield db.select().from(schema_1.products);
        res.json(rows);
    }
    catch (err) {
        handleQueryError(err, res);
    }
}));
// Get a single product by ID
router.get('/products/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const rows = yield db.select().from(schema_1.products).where((0, drizzle_orm_1.eq)(schema_1.products.id, +id));
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Product not found.' });
        }
        res.json(rows[0]);
    }
    catch (err) {
        handleQueryError(err, res);
    }
}));
// Create a new order with multiple products and a user email
router.post('/orders', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { customer_email, products: orderBody } = req.body;
        const order = yield db.transaction((trx) => __awaiter(void 0, void 0, void 0, function* () {
            const [newOrder] = yield trx.insert(schema_1.orders).values({ customer_email: customer_email }).returning();
            const productPrices = yield Promise.all(orderBody.map((orderItem) => __awaiter(void 0, void 0, void 0, function* () {
                const [res] = yield db.select().from(schema_1.products).where((0, drizzle_orm_1.eq)(schema_1.products.id, +orderItem.product_id));
                return res.product_price;
            })));
            const orderProducts = yield Promise.all(orderBody.map((orderItem, index) => __awaiter(void 0, void 0, void 0, function* () {
                const total = (+productPrices[index] * +orderItem.quantity).toFixed(2);
                const [orderProduct] = yield trx.insert(schema_1.order_items).values({ order_id: newOrder.id, product_id: orderItem.product_id, quantity: orderItem.quantity, total: +total }).returning();
                return orderProduct;
            })));
            // Update the total price of the order
            const total = orderProducts.reduce((acc, curr) => {
                return acc + curr.total;
            }, 0);
            const [updatedOrder] = yield trx
                .update(schema_1.orders)
                .set({ total: total.toFixed(2) })
                .where((0, drizzle_orm_1.eq)(schema_1.orders.id, newOrder.id))
                .returning();
            return Object.assign(Object.assign({}, updatedOrder), { products: orderProducts });
        }));
        res.json(order);
    }
    catch (err) {
        handleQueryError(err, res);
    }
}));
exports.default = router;
