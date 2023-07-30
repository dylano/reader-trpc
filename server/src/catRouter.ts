import { v4 as uuid } from 'uuid';
import z from 'zod';
import { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import { inferAsyncReturnType, initTRPC, TRPCError } from '@trpc/server';

const Cat = z.object({
  id: z.string(),
  name: z.string(),
  age: z.number(),
});
const Cats = z.array(Cat);

export type Cat = z.infer<typeof Cat>;
export type Cats = z.infer<typeof Cats>;

export const createContext = ({
  req,
  res,
}: CreateExpressContextOptions) => ({}); // no context
type Context = inferAsyncReturnType<typeof createContext>;
const t = initTRPC.context<Context>().create();

let cats: Cat[] = [];

export const catRouter = t.router({
  get: t.procedure
    .input(z.string())
    .output(Cat)
    .query((opts) => {
      const { input } = opts;
      const foundCat = cats.find((cat) => cat.id === input);
      if (!foundCat) {
        throw new TRPCError({
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
    .input(
      z.object({
        name: z.string().max(50),
        age: z
          .number()
          .min(0)
          .max(20, { message: 'surely this cat is already dead' }),
      })
    )
    .mutation((opts) => {
      const { input } = opts;
      const newCat: Cat = { id: uuid(), name: input.name, age: input.age };
      cats.push(newCat);
      return newCat;
    }),
  delete: t.procedure
    .input(z.object({ id: z.string() }))
    .output(z.string())
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

export type CatRouter = typeof catRouter;
