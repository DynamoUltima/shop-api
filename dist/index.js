"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const shop_1 = __importDefault(require("./src/shop"));
if (process.env.NODE_ENV === 'production') {
    console.log('Running in production mode.');
    dotenv_1.default.config({ path: '.prod.env' });
}
else {
    console.log('Running in development mode.');
    dotenv_1.default.config({ path: '.dev.env' });
}
// dotenv.config()
const { PORT } = process.env;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(shop_1.default);
app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
});
