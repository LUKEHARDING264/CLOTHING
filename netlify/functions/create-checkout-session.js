const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        // Log the secret key (first few characters)
        const keyPreview = process.env.STRIPE_SECRET_KEY ? 
            `${process.env.STRIPE_SECRET_KEY.substring(0, 8)}...` : 
            'not set';
        console.log('Using Stripe key starting with:', keyPreview);

        const { line_items, success_url, cancel_url, customer_email } = JSON.parse(event.body);

        // Log the request data
        console.log('Creating session with:', {
            payment_method_types: ['card'],
            mode: 'payment',
            success_url,
            cancel_url,
            customer_email,
            line_items_count: line_items.length
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
            billing_address_collection: 'required'
        });

        console.log('Session created with ID:', session.id);

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: session.id })
        };
    } catch (error) {
        console.error('Stripe session creation error:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                error: error.message || 'Failed to create checkout session',
                details: error.stack
            })
        };
    }
}; 