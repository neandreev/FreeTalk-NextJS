import type { AppRouter } from '../../pages/api/trpc/[trpc]';
import { createTRPCClient } from '@trpc/client';

export const client = createTRPCClient<AppRouter>({
  url: 'http://localhost:5000/trpc',
});
