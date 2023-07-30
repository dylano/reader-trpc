import { createTRPCReact } from '@trpc/react-query';
import type { CatRouter } from '../../server/src/catRouter';

export const catApi = createTRPCReact<CatRouter>();
