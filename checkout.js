// Initialize Stripe
const stripe = Stripe('pk_test_51R9wfTFJFbllHThtN1VRMV6Eb78ur9LPNPB1hRDiAwJS5cak7LZ93hYRfZ5z4bh4pkxQv7Czpwfwr6hspEU3qat100o71kebrW');

// Display cart items in order summary
function displayCheckoutItems() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const summaryItems = document.querySelector('.summary-items');
    
    if (cart.length === 0) {
        window.location.href = 'cart.html';
        return;
    }
    
    let subtotal = 0;
    summaryItems.innerHTML = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        return `
            <div class="checkout-item">
                <div class="checkout-item-details">
                    <h3>${item.name}</h3>
                    <p>Size: ${item.size}</p>
                    <p>Quantity: ${item.quantity}</p>
                    <p>$${itemTotal.toFixed(2)}</p>
                </div>
            </div>
        `;
    }).join('');
    
    const shipping = 5.00;
    const total = subtotal + shipping;
    
    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
}

// Handle form submission
const form = document.getElementById('payment-form');
form.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const submitButton = document.querySelector('.submit-button');
    submitButton.disabled = true;
    submitButton.querySelector('#button-text').textContent = 'Processing...';
    
    try {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        if (cart.length === 0) {
            throw new Error('Your cart is empty');
        }

        // Create line items for Stripe Checkout
        const lineItems = cart.map(item => ({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.name,
                },
                unit_amount: Math.round(item.price * 100),
            },
            quantity: item.quantity,
        }));

        // Add shipping cost
        lineItems.push({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: 'Standard Shipping',
                },
                unit_amount: 500,
            },
            quantity: 1,
        });

        // Create checkout session
        const response = await fetch('/.netlify/functions/create-checkout-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                line_items: lineItems,
                success_url: 'https://eternalclothing.netlify.app/success.html',
                cancel_url: 'https://eternalclothing.netlify.app/cart.html',
                customer_email: document.getElementById('email').value,
            }),
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'An error occurred while creating the checkout session');
        }

        // Redirect to Stripe Checkout
        const result = await stripe.redirectToCheckout({
            sessionId: data.id
        });

        if (result.error) {
            throw new Error(result.error.message);
        }
    } catch (error) {
        console.error('Checkout Error:', error);
        const errorElement = document.getElementById('card-errors');
        errorElement.textContent = error.message || 'An error occurred. Please try again.';
        errorElement.style.display = 'block';
        submitButton.disabled = false;
        submitButton.querySelector('#button-text').textContent = 'PAY NOW';
    }
});

// Initialize checkout page
document.addEventListener('DOMContentLoaded', () => {
    displayCheckoutItems();
}); 