const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Log environment variables (for debugging)
console.log('STRIPE_SECRET_KEY:', process.env.STRIPE_SECRET_KEY ? 'Set' : 'Not Set');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();

// Enable CORS for all routes
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
}));

app.use(express.json());
app.use(express.static('.'));

// Create checkout session
app.post('/create-checkout-session', async (req, res) => {
    try {
        if (!process.env.STRIPE_SECRET_KEY) {
            throw new Error('Stripe secret key is not configured');
        }

        console.log('Request body:', req.body);
        console.log('Creating checkout session with items:', req.body.line_items);
        
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: req.body.line_items,
            mode: 'payment',
            success_url: `${req.body.success_url}`,
            cancel_url: req.body.cancel_url,
            customer_email: req.body.customer_email,
            shipping_address_collection: {
                allowed_countries: ['US'],
            },
            shipping_options: [
                {
                    shipping_rate_data: {
                        type: 'fixed_amount',
                        fixed_amount: {
                            amount: 500, // $5.00
                            currency: 'usd',
                        },
                        display_name: 'Standard shipping',
                        delivery_estimate: {
                            minimum: {
                                unit: 'business_day',
                                value: 5,
                            },
                            maximum: {
                                unit: 'business_day',
                                value: 7,
                            },
                        },
                    },
                },
            ],
        });

        console.log('Session created:', session.id);
        res.json({ id: session.id });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).json({ error: error.message });
    }
});

// Handle webhook events
app.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;
            console.log('Checkout session completed!');
            // Here you can add code to update your database, send emails, etc.
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    res.json({received: true});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 