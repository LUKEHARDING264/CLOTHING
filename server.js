const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Log environment variables (for debugging)
console.log('STRIPE_SECRET_KEY:', process.env.STRIPE_SECRET_KEY ? 'Set' : 'Not Set');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();

// Security headers middleware
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.setHeader('Content-Security-Policy', "default-src 'self' https://*.stripe.com; script-src 'self' https://*.stripe.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://*.stripe.com;");
    next();
});

// Enable CORS for all routes
app.use(cors({
    origin: ['https://eternalclothing.netlify.app', 'http://localhost:3000'],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Accept'],
    credentials: true,
}));

app.use(express.json());
app.use(express.static('.'));

// Create checkout session
app.post('/create-checkout-session', async (req, res) => {
    try {
        console.log('Creating checkout session with data:', req.body);
        
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: req.body.line_items,
            mode: 'payment',
            success_url: req.body.success_url,
            cancel_url: req.body.cancel_url,
            customer_email: req.body.customer_email,
            shipping_address_collection: {
                allowed_countries: ['US'],
            },
            billing_address_collection: 'required',
            metadata: {
                website: 'eternalclothing.netlify.app'
            }
        });

        console.log('Session created successfully:', session.id);
        res.json({ id: session.id });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).json({ error: error.message });
    }
});

// Handle webhook events
app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;
            console.log('Payment successful for session:', session.id);
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
});

// Handle 404 errors
app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 