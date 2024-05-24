const stripeKey = 'Stripe_Key';
const endpointSecret = 'Endpoint_Secret';

const stripe = require('stripe')(stripeKey);

const AWS = require('aws-sdk');

AWS.config.update({ region: 'us-east-1' });
const ddb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    console.log(JSON.stringify(event));
    const sig = event.headers['Stripe-Signature'];
    console.log(sig);

    let stripeEvent;

    try {
        stripeEvent = stripe.webhooks.constructEvent(event.body, sig, endpointSecret);
        console.log('stripe event', stripeEvent);
    } catch (err) {
        console.log('err', JSON.stringify(err));
        return {
            statusCode: 500,
            body: JSON.stringify({}),
            isBase64Encoded: false,
        };
    }

    const response = {
        statusCode: 200,
        body: JSON.stringify({}),
        isBase64Encoded: false,
    };
    switch (stripeEvent.type) {
        case 'checkout.session.completed':
            const checkoutSessionCompleted = stripeEvent.data.object;
            const userId = checkoutSessionCompleted.client_reference_id;
            console.log('userid', userId);

            const params = {
                TableName: 'User-z7km3owmkbdehmycacmydeppv4-master',
                Key: {
                    id: userId, // assuming 'id' is the primary key of your table
                },
                UpdateExpression: 'set paymentVerified = :v',
                ExpressionAttributeValues: {
                    ':v': true,
                },
            };
            await ddb.update(params).promise();
            return response;
        default:
            console.log(`Unhandled event type ${event.type}`);
            return response;
    }
};
