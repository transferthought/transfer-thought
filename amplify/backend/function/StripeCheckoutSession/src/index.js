/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 *
 */
const YOUR_DOMAIN = 'http://localhost:8080';
const stripeKey = 'Stripe_Key';
const stripe = require('stripe')(stripeKey);

exports.handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);
    const priceId = event['queryStringParameters']['price-id'];
    if (priceId) {
        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${YOUR_DOMAIN}?success=true`,
            cancel_url: `${YOUR_DOMAIN}?canceled=true`,
        });
        return {
            statusCode: 200,
            //  Uncomment below to enable CORS requests
            //  headers: {
            //      "Access-Control-Allow-Origin": "*",
            //      "Access-Control-Allow-Headers": "*"
            //  },
            body: JSON.stringify({ url: session.url }),
        };
    } else {
        return {
            statusCode: 200,
            //  Uncomment below to enable CORS requests
            //  headers: {
            //      "Access-Control-Allow-Origin": "*",
            //      "Access-Control-Allow-Headers": "*"
            //  },
            body: JSON.stringify({ error: 'no price' }),
        };
    }
};
