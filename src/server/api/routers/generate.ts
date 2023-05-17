import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

import { Configuration, OpenAIApi } from 'openai';
import { env } from '~/env.mjs';
import { TRPCError } from '@trpc/server';
import { base64Image } from '~/data/b64Image';
import AWS from 'aws-sdk';
import { getImageUrl } from '~/utils/imageUtils';

const s3 = new AWS.S3({
    credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    },
    region: 'us-east-1',
});

const configuration = new Configuration({
    apiKey: env.DALLE_API_KEY,
});

const openai = new OpenAIApi(configuration);

const generateIcon = async (prompt: string): Promise<string> => {
    if (env.MOCK_DALLE === 'true') {
        return base64Image;
        // return 'https://cdn.openai.com/labs/images/An%20oil%20painting%20by%20Matisse%20of%20a%20humanoid%20robot%20playing%20chess.webp?v=1';
    }

    const response = await openai.createImage({
        prompt,
        n: 1,
        size: '512x512',
        response_format: 'b64_json',
    });

    return response.data.data[0]?.b64_json ?? '';
};

export const generateRouter = createTRPCRouter({
    generateIcon: publicProcedure
        .input(
            z.object({
                prompt: z.string(),
                color: z.string(),
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

            const finalPrompt = `a modern icon in ${input.color} of ${input.prompt}, 3d rendered, metallic material, minimalistic, high resolution`;

            const base64Encoded = await generateIcon(finalPrompt);

            const icon = await ctx.prisma.icon.create({
                data: {
                    prompt: input.prompt,
                    userId: ctx.session?.user.id,
                },
            });

            await s3
                .putObject({
                    Bucket: env.AWS_BUCKET_NAME,
                    Body: Buffer.from(base64Encoded, 'base64'),
                    Key: icon.id,
                    ContentEncoding: 'base64',
                    ContentType: 'image/png',
                })
                .promise();

            return {
                imageUrl: getImageUrl(icon.id),
            };
        }),
});
