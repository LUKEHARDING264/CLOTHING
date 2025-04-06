// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(productId, name, price, size) {
    const item = {
        id: productId,
        name: name,
        price: price,
        size: size,
        quantity: 1
    };
    
    // Check if item already exists in cart
    const existingItem = cart.find(cartItem => 
        cartItem.id === productId && cartItem.size === size
    );
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push(item);
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showAddToCartMessage();
}

function removeFromCart(productId, size) {
    cart = cart.filter(item => !(item.id === productId && item.size === size));
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    displayCartItems();
}

function updateCartCount() {
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartButton = document.querySelector('.cart-button');
    if (cartCount > 0) {
        cartButton.setAttribute('data-count', cartCount);
    } else {
        cartButton.removeAttribute('data-count');
    }
}

function showAddToCartMessage() {
    const message = document.createElement('div');
    message.className = 'add-to-cart-message';
    message.textContent = 'Added to Cart!';
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.remove();
    }, 2000);
}

function displayCartItems() {
    const cartItems = document.querySelector('.cart-items');
    if (!cartItems) return;
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <p>Your cart is empty</p>
                <a href="index.html#collection" class="shop-now-button">SHOP NOW</a>
            </div>
        `;
        return;
    }
    
    let total = 0;
    cartItems.innerHTML = cart.map(item => {
        total += item.price * item.quantity;
        return `
            <div class="cart-item">
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <p>Size: ${item.size}</p>
                    <p>Quantity: ${item.quantity}</p>
                    <p>$${(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <button onclick="removeFromCart('${item.id}', '${item.size}')" class="remove-item">×</button>
            </div>
        `;
    }).join('');
    
    // Update cart summary
    const subtotal = document.querySelector('.summary-item:first-child span:last-child');
    const totalElement = document.querySelector('.summary-item.total span:last-child');
    if (subtotal) subtotal.textContent = `$${total.toFixed(2)}`;
    if (totalElement) totalElement.textContent = `$${total.toFixed(2)}`;
}

// Initialize cart count on page load
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    displayCartItems();

    // Add checkout button functionality
    const checkoutButton = document.querySelector('.checkout-button');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', () => {
            if (cart.length > 0) {
                window.location.href = 'checkout.html';
            } else {
                alert('Your cart is empty');
            }
        });
    }
});

// Add to cart button functionality
document.querySelectorAll('.add-to-cart-button').forEach(button => {
    button.addEventListener('click', () => {
        const productContainer = button.closest('.product-info');
        const productId = window.location.pathname.split('/').pop().replace('.html', '');
        const name = productContainer.querySelector('.product-title').textContent;
        const price = parseFloat(productContainer.querySelector('.price-value').textContent.replace('$', ''));
        const size = productContainer.querySelector('.size-select').value;
        
        if (!size) {
            alert('Please select a size');
            return;
        }
        
        addToCart(productId, name, price, size);
    });
}); 