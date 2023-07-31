import { createTRPCReact } from '@trpc/react-query';
import type { CatRouter } from '../../server/src/catRouter';
export type { Cat } from '../../server/src/db/schema';

export const catApi = createTRPCReact<CatRouter>();
