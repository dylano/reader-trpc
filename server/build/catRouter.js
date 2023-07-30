"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.catRouter = exports.createContext = void 0;
const uuid_1 = require("uuid");
const zod_1 = __importDefault(require("zod"));
const server_1 = require("@trpc/server");
const Cat = zod_1.default.object({
    id: zod_1.default.string(),
    name: zod_1.default.string(),
    age: zod_1.default.number(),
});
const Cats = zod_1.default.array(Cat);
const createContext = ({ req, res, }) => ({}); // no context
exports.createContext = createContext;
const t = server_1.initTRPC.context().create();
let cats = [];
exports.catRouter = t.router({
    get: t.procedure
        .input(zod_1.default.string())
        .output(Cat)
        .query((opts) => {
        const { input } = opts;
        const foundCat = cats.find((cat) => cat.id === input);
        if (!foundCat) {
            throw new server_1.TRPCError({
                code: 'BAD_REQUEST',
                message: `could not find cat with id ${input}`,
            });
        }
        return foundCat;
    }),
    list: t.procedure.output(Cats).query(() => {
        return cats;
    }),
    create: t.procedure
        .input(zod_1.default.object({
        name: zod_1.default.string().max(50),
        age: zod_1.default
            .number()
            .min(0)
            .max(20, { message: 'surely this cat is already dead' }),
    }))
        .mutation((opts) => {
        const { input } = opts;
        const newCat = { id: (0, uuid_1.v4)(), name: input.name, age: input.age };
        cats.push(newCat);
        return newCat;
    }),
    delete: t.procedure
        .input(zod_1.default.object({ id: zod_1.default.string() }))
        .output(zod_1.default.string())
        .mutation((opts) => {
        const { input } = opts;
        const cat = cats.find((cat) => cat.id === input.id);
        if (cat) {
            cats = cats.filter((cat) => cat.id !== input.id);
            return `killed ${cat?.name}`;
        }
        return `all cats survived`;
    }),
});
