// Initialize Stripe
const stripe = Stripe('your_publishable_key'); // Replace with your Stripe publishable key
const elements = stripe.elements();

// Create card Element and mount it
const card = elements.create('card', {
    style: {
        base: {
            color: '#ffffff',
            fontFamily: '"Orbitron", sans-serif',
            fontSize: '16px',
            '::placeholder': {
                color: '#aab7c4'
            },
            backgroundColor: 'transparent'
        },
        invalid: {
            color: '#ff0000',
            iconColor: '#ff0000'
        }
    }
});
card.mount('#card-element');

// Handle form submission
const form = document.getElementById('payment-form');
form.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const {token, error} = await stripe.createToken(card);
    
    if (error) {
        const errorElement = document.getElementById('card-errors');
        errorElement.textContent = error.message;
    } else {
        // Send token to your server
        submitOrder(token.id);
    }
});

// Handle real-time validation errors
card.addEventListener('change', ({error}) => {
    const displayError = document.getElementById('card-errors');
    if (error) {
        displayError.textContent = error.message;
    } else {
        displayError.textContent = '';
    }
});

// Function to submit order to your server
async function submitOrder(token) {
    const submitButton = document.querySelector('.submit-button');
    submitButton.disabled = true;
    submitButton.querySelector('#button-text').textContent = 'Processing...';
    
    try {
        // Here you would typically send the order to your server
        // For now, we'll simulate a successful order
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Clear cart
        localStorage.removeItem('cart');
        
        // Redirect to success page
        window.location.href = 'success.html';
    } catch (error) {
        console.error('Error:', error);
        submitButton.disabled = false;
        submitButton.querySelector('#button-text').textContent = 'PAY NOW';
        document.getElementById('card-errors').textContent = 'An error occurred. Please try again.';
    }
}

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