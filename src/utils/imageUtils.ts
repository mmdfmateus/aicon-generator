import { env } from '~/env.mjs';

export const getImageUrl = (iconId: string) =>
    `https://${env.NEXT_PUBLIC_AWS_BUCKET_NAME}.s3.amazonaws.com/${iconId}`;
