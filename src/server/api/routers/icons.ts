import { z } from 'zod';

import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from '~/server/api/trpc';

export const iconsRouter = createTRPCRouter({
    get: protectedProcedure
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
                    userId: ctx.session.user.id,
                },
                skip: input?.skip ?? 0,
                take: input?.take ?? 20,
                orderBy: {
                    createdAt: 'desc',
                },
            });

            return icons;
        }),
    getCommunityIcons: publicProcedure.query(async ({ ctx }) => {
        const icons = await ctx.prisma.icon.findMany({
            take: 40,
            orderBy: {
                createdAt: 'desc',
            },
        });

        return icons;
    }),
});
