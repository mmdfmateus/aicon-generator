import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

import { Configuration, OpenAIApi } from 'openai';
import { env } from '~/env.mjs';
import { TRPCError } from '@trpc/server';
import AWS from 'aws-sdk';
import { getImageUrl } from '~/utils/imageUtils';
import { createApi } from 'unsplash-js';
import axios from 'axios';

const unsplashApi = createApi({
    accessKey: env.UNSPLASH_ACCESS_KEY,
});

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

const generateIcon = async (prompt: string, amount = 1): Promise<string[]> => {
    if (env.MOCK_DALLE === 'true') {
        const { response, errors, type } = await unsplashApi.search.getPhotos({
            query: prompt,
            page: 1,
            perPage: amount,
            orientation: 'squarish',
        });

        if (type === 'error') {
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: `Something wrong happened when fetching from Unsplash: ${errors[0]}`,
            });
        }

        const imgs = await Promise.all(
            response.results.map(
                async (photo) =>
                    await fetchImageBase64(`${photo.urls.small}.jpg`)
            )
        );
        return imgs;
    }

    const response = await openai.createImage({
        prompt,
        n: amount,
        size: '512x512',
        response_format: 'b64_json',
    });

    return response.data.data.map((result) => result.b64_json ?? '');
};

const storeIconsAsync = async (
    ctx: any,
    prompt: string,
    base64EncodedImage: string
): Promise<{ id: string }> => {
    const icon = await ctx.prisma.icon.create({
        data: {
            prompt: prompt,
            userId: ctx.session?.user.id,
        },
    });

    await s3
        .putObject({
            Bucket: env.AWS_BUCKET_NAME,
            Body: Buffer.from(base64EncodedImage, 'base64'),
            Key: icon.id,
            ContentEncoding: 'base64',
            ContentType: 'image/png',
        })
        .promise();

    return icon;
};

const fetchImageBase64 = async (imageUrl: string) => {
    const imageBase64 = Buffer.from(
        (
            await axios.get(imageUrl, {
                responseType: 'arraybuffer',
            })
        ).data,
        'utf-8'
    ).toString('base64');

    return imageBase64;
};

export const generateRouter = createTRPCRouter({
    generateIcon: publicProcedure
        .input(
            z.object({
                prompt: z.string(),
                color: z.string(),
                amount: z.number().min(1).max(4),
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
                        decrement: input.amount,
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

            const base64EncodedImages = await generateIcon(
                env.MOCK_DALLE ? input.prompt : finalPrompt,
                input.amount
            );

            const icons = await Promise.all(
                base64EncodedImages.map(
                    async (img) => await storeIconsAsync(ctx, input.prompt, img)
                )
            );

            return icons.map((icon) => getImageUrl(icon.id));
        }),
});
