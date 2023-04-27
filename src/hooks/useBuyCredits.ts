import { loadStripe } from '@stripe/stripe-js';
import { env } from '~/env.mjs';
import { api } from '~/utils/api';

const stripePromise = loadStripe(env.STRIPE_PUBLIC_KEY);

export const useBuyCredits = () => {
    const checkout = api.checkout.create.useMutation();

    return {
        buyCredits: async () => {
            const response = await checkout.mutateAsync();
            const stripe = await stripePromise;

            await stripe?.redirectToCheckout({
                sessionId: response.session.id,
            });
        },
    };
};
