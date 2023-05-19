import { z } from 'zod';

import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';

import Stripe from 'stripe';
import { env } from '~/env.mjs';

const stripe = new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: '2022-11-15' });

export const checkoutRouter = createTRPCRouter({
    create: protectedProcedure.mutation(async ({ ctx }) => {
        const session = await stripe.checkout.sessions.create({
            line_items: [{ price: env.STRIPE_PRICE_ID, quantity: 1 }],
            mode: 'payment',
            payment_method_types: ['card'],
            success_url: `${env.HOST_NAME}/generate`,
            cancel_url: `${env.HOST_NAME}`,
            metadata: {
                userId: ctx.session.user.id,
            },
        });

        return {
            session,
        };
    }),
});
