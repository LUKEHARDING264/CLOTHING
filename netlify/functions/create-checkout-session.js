const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event, context) => {
    // Only allow POST
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { line_items, success_url, cancel_url, customer_email } = JSON.parse(event.body);

        console.log('Creating checkout session with data:', {
            line_items,
            success_url,
            cancel_url,
            customer_email
        });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items,
            mode: 'payment',
            success_url,
            cancel_url,
            customer_email,
            shipping_address_collection: {
                allowed_countries: ['US'],
            },
            billing_address_collection: 'required',
            metadata: {
                website: 'eternalclothing.netlify.app'
            }
        });

        console.log('Session created successfully:', session.id);

        return {
            statusCode: 200,
            body: JSON.stringify({ id: session.id })
        };
    } catch (error) {
        console.error('Error creating checkout session:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
}; 