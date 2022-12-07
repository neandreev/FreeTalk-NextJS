import { initTRPC } from '@trpc/server';
import superjson from 'superjson';

const t = initTRPC.create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

export const {
  router,
  middleware,
  mergeRouters,
  procedure: publicProcedure,
} = t;
