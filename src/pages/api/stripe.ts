import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { env } from '~/env.mjs';
import { buffer } from 'micro';
import { prisma } from '~/server/db';

const stripe = new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: '2022-11-15' });

export const config = {
    api: {
        bodyParser: false,
    },
};

const webhook = async (request: NextApiRequest, response: NextApiResponse) => {
    if (request.method === 'POST') {
        const buf = await buffer(request);
        const sig = request.headers['stripe-signature'] as string;

        let event;

        try {
            event = stripe.webhooks.constructEvent(
                buf,
                sig,
                env.STRIPE_WEBHOOK_SECRET
            );
        } catch (err) {
            const message =
                err instanceof Error ? err.message : 'Unknown error';
            response.status(400).send(`Webhook Error: ${message}`);
            return;
        }

        // Handle the event
        switch (event.type) {
            case 'checkout.session.completed':
                const checkoutSessionCompleted = event.data.object as {
                    id: string;
                    metadata: {
                        userId: string;
                    };
                };

                await prisma.user.update({
                    where: {
                        id: checkoutSessionCompleted.metadata.userId,
                    },
                    data: {
                        credits: {
                            increment: 5,
                        },
                    },
                });

                break;
            case 'payment_intent.succeeded':
                const paymentIntentSucceeded = event.data.object;
                // Then define and call a function to handle the event payment_intent.succeeded
                break;
            // ... handle other event types
            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        // Return a 200 response to acknowledge receipt of the event
        response.json({});
        return;
    }

    response.setHeader('Allow', 'POST');
    response.status(405).end('Method Not Allowed');
    return;
};

export default webhook;
