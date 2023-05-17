import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

export const iconsRouter = createTRPCRouter({
    get: publicProcedure
        .input(
            z
                .object({
                    skip: z.number().min(0).optional(),
                    take: z.number().min(0).optional(),
                })
                .optional()
        )
        .query(async ({ ctx, input }) => {
            const icons = await ctx.prisma.icon.findMany({
                where: {
                    userId: ctx.session?.user.id,
                },
                skip: input?.skip ?? 0,
                take: input?.take ?? 20,
            });

            return icons;
        }),
});
