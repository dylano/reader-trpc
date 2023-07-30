"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_2 = require("@trpc/server/adapters/express");
const cors_1 = __importDefault(require("cors"));
const catRouter_1 = require("./catRouter");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use('/cat', (0, express_2.createExpressMiddleware)({
    router: catRouter_1.catRouter,
    createContext: catRouter_1.createContext,
}));
app.listen(8080, () => {
    console.log('Server running on port 8080');
});
