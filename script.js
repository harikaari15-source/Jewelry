// ===== GLOBAL VARIABLES =====
let cart = JSON.parse(localStorage.getItem('luxeCart')) || [];

// ===== INITIALIZE ON PAGE LOAD =====
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    
    // Initialize cart page if on cart.html
    if (window.location.pathname.includes('cart.html')) {
        displayCartItems();
    }
    
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
    
    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
    
    // Add scroll animations
    addScrollAnimations();
    
    // Add header scroll effect
    addHeaderScrollEffect();
    
    // Add parallax effect
    addParallaxEffect();
    
    // Add smooth reveal animations
    addRevealAnimations();
    
    // Add floating animation to product badges
    addFloatingBadges();
    
    // Initialize filter buttons with text wrapping
    wrapFilterButtons();
});

// ===== HEADER SCROLL EFFECT =====
function addHeaderScrollEffect() {
    const header = document.querySelector('header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
}

// ===== PARALLAX EFFECT =====
function addParallaxEffect() {
    const hero = document.querySelector('.hero');
    
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxSpeed = 0.5;
            hero.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
        });
    }
}

// ===== REVEAL ANIMATIONS =====
function addRevealAnimations() {
    const reveals = document.querySelectorAll('.section-title, .collection-card, .feature-box, .value-card, .timeline-item, .faq-item');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });
    
    reveals.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(50px)';
        element.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
        revealObserver.observe(element);
    });
}

// ===== FLOATING BADGES =====
function addFloatingBadges() {
    const badges = document.querySelectorAll('.product-badge');
    
    badges.forEach(badge => {
        badge.style.animation = 'float 3s ease-in-out infinite';
    });
}

// ===== WRAP FILTER BUTTON TEXT =====
function wrapFilterButtons() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        const text = btn.textContent;
        btn.innerHTML = `<span>${text}</span>`;
    });
}

// ===== SHOPPING CART FUNCTIONS =====

/**
 * Add item to cart
 */
function addToCart(productName, price) {
    // Check if item already exists in cart
    const existingItem = cart.find(item => item.name === productName);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: productName,
            price: price,
            quantity: 1,
            id: Date.now() // unique identifier
        });
    }
    
    // Save to localStorage
    localStorage.setItem('luxeCart', JSON.stringify(cart));
    
    // Update cart count with animation
    updateCartCount();
    
    // Animate cart icon
    animateCartIcon();
    
    // Show elegant notification
    showNotification(`"${productName}" added to cart! 💎`);
}

/**
 * Animate cart icon when item added
 */
function animateCartIcon() {
    const cartCount = document.getElementById('cart-count');
    
    if (cartCount) {
        cartCount.style.animation = 'none';
        setTimeout(() => {
            cartCount.style.animation = 'cartBounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        }, 10);
    }
}

/**
 * Update cart item quantity
 */
function updateQuantity(itemId, change) {
    const item = cart.find(item => item.id === itemId);
    
    if (item) {
        item.quantity += change;
        
        // Remove item if quantity is 0
        if (item.quantity <= 0) {
            removeFromCart(itemId);
            return;
        }
        
        // Save to localStorage
        localStorage.setItem('luxeCart', JSON.stringify(cart));
        
        // Refresh cart display
        displayCartItems();
        updateCartCount();
    }
}

/**
 * Remove item from cart
 */
function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    localStorage.setItem('luxeCart', JSON.stringify(cart));
    displayCartItems();
    updateCartCount();
    showNotification('Item removed from cart');
}

/**
 * Update cart count badge
 */
function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountElement.textContent = totalItems;
        
        // Hide badge if cart is empty
        if (totalItems === 0) {
            cartCountElement.style.display = 'none';
        } else {
            cartCountElement.style.display = 'inline';
        }
    }
}

/**
 * Display cart items on cart page
 */
function displayCartItems() {
    const cartItemsContainer = document.getElementById('cartItems');
    
    if (!cartItemsContainer) return;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">🛍️</div>
                <h3>Your cart is empty</h3>
                <p>Start adding beautiful jewelry to your collection</p>
                <a href="products.html" class="btn btn-primary">Continue Shopping</a>
            </div>
        `;
        updateCartSummary(0, 0, 0);
        return;
    }
    
    let cartHTML = '';
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        cartHTML += `
            <div class="cart-item">
                <div class="cart-item-image">💍</div>
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <p>Price: $${item.price.toLocaleString()}</p>
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span class="quantity-display">${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
                </div>
                <div class="cart-item-price">
                    <div class="price">$${itemTotal.toLocaleString()}</div>
                </div>
            </div>
        `;
    });
    
    cartItemsContainer.innerHTML = cartHTML;
    
    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + tax;
    
    updateCartSummary(subtotal, tax, total);
}

/**
 * Update cart summary
 */
function updateCartSummary(subtotal, tax, total) {
    const subtotalElement = document.getElementById('subtotal');
    const taxElement = document.getElementById('tax');
    const totalElement = document.getElementById('total');
    const shippingElement = document.getElementById('shipping');
    
    if (subtotalElement) subtotalElement.textContent = `$${subtotal.toLocaleString()}`;
    if (taxElement) taxElement.textContent = `$${tax.toFixed(2)}`;
    if (totalElement) totalElement.innerHTML = `<strong>$${total.toLocaleString()}</strong>`;
    
    // Update shipping based on subtotal
    if (shippingElement) {
        if (subtotal >= 500) {
            shippingElement.textContent = 'FREE';
        } else {
            shippingElement.textContent = '$25.00';
        }
    }
}

/**
 * Apply promo code
 */
function applyPromo() {
    const promoInput = document.getElementById('promoCode');
    const promoCode = promoInput.value.trim().toUpperCase();
    
    const validCodes = {
        'LUXE10': 0.10,
        'SAVE20': 0.20,
        'FIRST15': 0.15
    };
    
    if (validCodes[promoCode]) {
        const discount = validCodes[promoCode];
        showNotification(`Promo code applied! ${discount * 100}% off`);
        // In a real application, you would apply the discount to the total
    } else if (promoCode) {
        showNotification('Invalid promo code', 'error');
    }
    
    promoInput.value = '';
}

/**
 * Proceed to checkout
 */
function proceedToCheckout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }
    
    // In a real application, this would redirect to checkout page
    showNotification('Proceeding to secure checkout... (Demo)');
    
    // For demo purposes, just show an alert
    setTimeout(() => {
        alert('This is a demo. In a real application, you would be redirected to a secure checkout page.');
    }, 1000);
}

// ===== PRODUCT FILTERING =====

/**
 * Filter products by category
 */
function filterProducts(category) {
    const products = document.querySelectorAll('.product-card');
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    // Update active button
    filterBtns.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Filter products
    products.forEach(product => {
        if (category === 'all' || product.dataset.category === category) {
            product.style.display = 'block';
            // Add fade-in animation
            product.style.animation = 'fadeIn 0.5s';
        } else {
            product.style.display = 'none';
        }
    });
}

// ===== CONTACT FORM =====

/**
 * Handle contact form submission
 */
function handleContactSubmit(event) {
    event.preventDefault();
    
    // Get form data
    const formData = new FormData(event.target);
    const data = {};
    
    formData.forEach((value, key) => {
        data[key] = value;
    });
    
    // Log form data (in production, send to server)
    console.log('Contact form submitted:', data);
    
    // Show success message
    const successMessage = document.getElementById('successMessage');
    if (successMessage) {
        successMessage.classList.add('show');
        
        // Scroll to success message
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Reset form
        event.target.reset();
        
        // Hide success message after 5 seconds
        setTimeout(() => {
            successMessage.classList.remove('show');
        }, 5000);
    }
    
    /* In a real application, you would send data to server:
    fetch('/api/contact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        console.log('Success:', result);
        showSuccessMessage();
    })
    .catch(error => {
        console.error('Error:', error);
        alert('There was an error. Please try again.');
    });
    */
}

// ===== NOTIFICATIONS =====

/**
 * Show notification message
 */
function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Create icon based on type
    const icon = type === 'success' ? '✓' : '⚠';
    
    notification.innerHTML = `
        <div class="notification-icon">${icon}</div>
        <div class="notification-content">
            <div class="notification-message">${message}</div>
        </div>
    `;
    
    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '100px',
        right: '-400px',
        padding: '1.2rem 1.5rem',
        background: type === 'success' 
            ? 'linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)'
            : 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
        color: type === 'success' ? '#1a1a1a' : '#fff',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
        zIndex: '10000',
        fontWeight: '600',
        minWidth: '300px',
        maxWidth: '400px',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        fontFamily: 'Montserrat, sans-serif',
        fontSize: '0.95rem',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.2)'
    });
    
    // Style icon
    const iconElement = notification.querySelector('.notification-icon');
    Object.assign(iconElement.style, {
        width: '35px',
        height: '35px',
        borderRadius: '50%',
        background: type === 'success' ? 'rgba(26,26,26,0.1)' : 'rgba(255,255,255,0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.2rem',
        fontWeight: 'bold',
        flexShrink: '0'
    });
    
    // Add to page
    document.body.appendChild(notification);
    
    // Slide in animation
    setTimeout(() => {
        notification.style.transition = 'right 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        notification.style.right = '20px';
    }, 10);
    
    // Remove after 3.5 seconds
    setTimeout(() => {
        notification.style.transition = 'right 0.4s ease-in, opacity 0.4s ease-in';
        notification.style.right = '-400px';
        notification.style.opacity = '0';
        setTimeout(() => {
            notification.remove();
        }, 400);
    }, 3500);
}

// Add animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes cartBounce {
        0%, 100% {
            transform: scale(1);
        }
        25% {
            transform: scale(1.3);
        }
        50% {
            transform: scale(0.9);
        }
        75% {
            transform: scale(1.1);
        }
    }
    
    @keyframes float {
        0%, 100% {
            transform: translateY(0px);
        }
        50% {
            transform: translateY(-10px);
        }
    }
    
    @keyframes shimmer {
        0% {
            background-position: -1000px 0;
        }
        100% {
            background-position: 1000px 0;
        }
    }
    
    @keyframes glow {
        0%, 100% {
            box-shadow: 0 0 5px rgba(212, 175, 55, 0.3),
                        0 0 10px rgba(212, 175, 55, 0.2),
                        0 0 15px rgba(212, 175, 55, 0.1);
        }
        50% {
            box-shadow: 0 0 10px rgba(212, 175, 55, 0.5),
                        0 0 20px rgba(212, 175, 55, 0.4),
                        0 0 30px rgba(212, 175, 55, 0.3);
        }
    }
`;
document.head.appendChild(style);

// ===== SCROLL ANIMATIONS =====

/**
 * Add scroll animations to elements
 */
function addScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe product cards
    document.querySelectorAll('.product-card, .collection-card, .feature-box, .value-card').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(element);
    });
}

// ===== SMOOTH SCROLLING =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// ===== CLEAR CART FUNCTION (for testing) =====
function clearCart() {
    if (confirm('Are you sure you want to clear your cart?')) {
        cart = [];
        localStorage.setItem('luxeCart', JSON.stringify(cart));
        displayCartItems();
        updateCartCount();
        showNotification('Cart cleared');
    }
}

// ===== FORM VALIDATION =====

/**
 * Validate email format
 */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Validate phone format
 */
function validatePhone(phone) {
    const re = /^[\d\s\-\+\(\)]+$/;
    return phone === '' || re.test(phone);
}

// Real-time validation for email and phone inputs
document.addEventListener('DOMContentLoaded', function() {
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            if (this.value && !validateEmail(this.value)) {
                this.style.borderColor = '#e74c3c';
                showNotification('Please enter a valid email address', 'error');
            } else {
                this.style.borderColor = '#ddd';
            }
        });
    }
    
    if (phoneInput) {
        phoneInput.addEventListener('blur', function() {
            if (!validatePhone(this.value)) {
                this.style.borderColor = '#e74c3c';
                showNotification('Please enter a valid phone number', 'error');
            } else {
                this.style.borderColor = '#ddd';
            }
        });
    }
});

// ===== SEARCH FUNCTIONALITY (Optional Enhancement) =====

/**
 * Search products
 */
function searchProducts(query) {
    const products = document.querySelectorAll('.product-card');
    const searchTerm = query.toLowerCase();
    
    products.forEach(product => {
        const productName = product.querySelector('h3').textContent.toLowerCase();
        const productCategory = product.querySelector('.product-category').textContent.toLowerCase();
        
        if (productName.includes(searchTerm) || productCategory.includes(searchTerm)) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
}

// Console message for developers
console.log('%cLuxe Jewelry Website', 'color: #d4af37; font-size: 24px; font-weight: bold;');
console.log('%cDeveloped with ❤️', 'color: #666; font-size: 14px;');
