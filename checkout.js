// Initialize Stripe
const stripe = Stripe('pk_test_your_actual_key_here'); // Replace with your actual publishable key

// Handle form submission
const form = document.getElementById('payment-form');
form.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const submitButton = document.querySelector('.submit-button');
    submitButton.disabled = true;
    submitButton.querySelector('#button-text').textContent = 'Processing...';
    
    try {
        // Get cart items
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Create line items for Stripe Checkout
        const lineItems = cart.map(item => ({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.name,
                    images: [item.image],
                },
                unit_amount: item.price * 100, // Convert to cents
            },
            quantity: item.quantity,
        }));

        // Create checkout session
        const response = await fetch('/create-checkout-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                line_items: lineItems,
                mode: 'payment',
                success_url: `${window.location.origin}/success.html`,
                cancel_url: `${window.location.origin}/cart.html`,
                customer_email: document.getElementById('email').value,
                shipping_address_collection: {
                    allowed_countries: ['US'],
                },
            }),
        });

        const session = await response.json();
        
        // Redirect to Stripe Checkout
        const result = await stripe.redirectToCheckout({
            sessionId: session.id
        });

        if (result.error) {
            throw new Error(result.error.message);
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('card-errors').textContent = 'An error occurred. Please try again.';
        submitButton.disabled = false;
        submitButton.querySelector('#button-text').textContent = 'PAY NOW';
    }
});

// Display cart items in order summary
function displayCheckoutItems() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const summaryItems = document.querySelector('.summary-items');
    
    if (cart.length === 0) {
        window.location.href = 'cart.html';
        return;
    }
    
    let total = 0;
    summaryItems.innerHTML = cart.map(item => {
        total += item.price * item.quantity;
        return `
            <div class="checkout-item">
                <div class="checkout-item-details">
                    <h3>${item.name}</h3>
                    <p>Size: ${item.size}</p>
                    <p>Quantity: ${item.quantity}</p>
                    <p>$${(item.price * item.quantity).toFixed(2)}</p>
                </div>
            </div>
        `;
    }).join('');
    
    document.getElementById('subtotal').textContent = `$${total.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
}

// Initialize checkout page
document.addEventListener('DOMContentLoaded', () => {
    displayCheckoutItems();
}); 