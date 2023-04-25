import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

import { Configuration, OpenAIApi } from 'openai';
import { env } from '~/env.mjs';
import { TRPCError } from '@trpc/server';

const configuration = new Configuration({
    apiKey: env.DALLE_API_KEY,
});

const openai = new OpenAIApi(configuration);

const generateIcon = async (prompt: string): Promise<string> => {
    if (env.MOCK_DALLE === 'true') {
        return 'https://cdn.openai.com/labs/images/An%20oil%20painting%20by%20Matisse%20of%20a%20humanoid%20robot%20playing%20chess.webp?v=1';
    }

    const response = await openai.createImage({
        prompt,
        n: 1,
        size: '1024x1024',
    });

    return response.data.data[0]?.url ?? '';
};

export const generateRouter = createTRPCRouter({
    generateIcon: publicProcedure
        .input(
            z.object({
                prompt: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { count } = await ctx.prisma.user.updateMany({
                where: {
                    id: ctx.session?.user.id,
                    credits: {
                        gte: 1,
                    },
                },
                data: {
                    credits: {
                        decrement: 1,
                    },
                },
            });

            if (count <= 0) {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: 'You do not have enough credits',
                });
            }

            const url = await generateIcon(input.prompt);

            return {
                imageUrl: url ?? '',
            };
        }),
});
