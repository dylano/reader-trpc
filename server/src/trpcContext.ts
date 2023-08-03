import { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import { inferAsyncReturnType } from '@trpc/server';

export const createContext = ({
  req,
  res,
}: CreateExpressContextOptions) => ({}); // no context

export type Context = inferAsyncReturnType<typeof createContext>;
