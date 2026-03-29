

// Global Variables
const bannerImages = [
    'https://images.unsplash.com/photo-1610348725531-843dff563e2c',
    'https://images.unsplash.com/photo-1610832958506-aa56368176cf',
    'https://images.unsplash.com/photo-1557844352-761f2565b576'
].map(img => `${img}?auto=format&fit=crop&q=80&w=1200`);

let products = [
    // Crops
    { id: 1, name: 'Maize', price: 25, farmer: 'Golden Harvest', image: '/Images/Crops/Maize.jpg', category: 'crops', stock: 470 },
    { id: 2, name: 'Wheat', price: 28, farmer: 'Green Plains', image: '/Images/Crops/Wheat.jpg', category: 'crops', stock: 360 },
    { id: 3, name: 'Rice', price: 32, farmer: 'Silver Grain Farm', image: '/Images/Crops/Rice.jpg', category: 'crops', stock: 540 },
    { id: 4, name: 'Coconut', price: 60, farmer: 'Coastline Farms', image: '/Images/Crops/Coconut.jpg', category: 'crops', stock: 180 },
    { id: 5, name: 'Coffee Beans', price: 220, farmer: 'Highland Coffee Co.', image: '/Images/Crops/Coffee.jpg', category: 'crops', stock: 90 },
    { id: 6, name: 'Sugarcane', price: 20, farmer: 'Sweet Fields', image: '/Images/Crops/Sugarcane.jpg', category: 'crops', stock: 420 },

    // Fruits
    { id: 7, name: 'Apple', price: 125, farmer: 'Hillside Orchards', image: '/Images/Fruits/Apple.jpg', category: 'fruits', stock: 320 },
    { id: 8, name: 'Banana', price: 45, farmer: 'Tropical Farms', image: '/Images/Fruits/Bananas.jpg', category: 'fruits', stock: 660 },
    { id: 9, name: 'Mango', price: 150, farmer: 'Summer Orchard', image: '/Images/Fruits/Mango.jpg', category: 'fruits', stock: 240 },
    { id: 10, name: 'Orange', price: 70, farmer: 'Citrus Valley', image: '/Images/Fruits/orange.jpg', category: 'fruits', stock: 290 },
    { id: 11, name: 'Strawberry', price: 90, farmer: 'Berry Fields', image: '/Images/Fruits/strawberry.jpg', category: 'fruits', stock: 180 },
    { id: 12, name: 'Green Grapes', price: 120, farmer: 'Vineyard Ventures', image: '/Images/Fruits/Green Grapes.jpg', category: 'fruits', stock: 210 },

    // Vegetables
    { id: 13, name: 'Tomato', price: 40, farmer: 'Red Farm', image: '/Images/Vegetables/Tomato.jpg', category: 'vegetables', stock: 590 },
    { id: 14, name: 'Carrot', price: 35, farmer: 'Root Valley', image: '/Images/Vegetables/Carrot.jpg', category: 'vegetables', stock: 510 },
    { id: 15, name: 'Onion', price: 30, farmer: 'Spice Fields', image: '/Images/Vegetables/Onion.jpg', category: 'vegetables', stock: 760 },
    { id: 16, name: 'Potato', price: 28, farmer: 'Earth Harvest', image: '/Images/Vegetables/Potato.webp', category: 'vegetables', stock: 840 },
    { id: 17, name: 'Cabbage', price: 32, farmer: 'Green Groves', image: '/Images/Vegetables/Cabbage.jpg', category: 'vegetables', stock: 340 },
    { id: 18, name: 'Cauliflower', price: 46, farmer: 'White Bloom Farms', image: '/Images/Vegetables/Cauliflower.jpg', category: 'vegetables', stock: 220 },
    { id: 19, name: 'Broccoli', price: 80, farmer: 'Healthy Greens', image: '/Images/Vegetables/brocoli.jpg', category: 'vegetables', stock: 170 },
    { id: 20, name: 'Green Capsicum', price: 55, farmer: 'Capsicum Corner', image: '/Images/Vegetables/Green Capsicum.jpg', category: 'vegetables', stock: 200 },
    { id: 21, name: 'Sweet Potato', price: 48, farmer: 'Sweet Root Farms', image: '/Images/Vegetables/patato.jpg', category: 'vegetables', stock: 255 },
    { id: 22, name: 'Mixed Veg Pack', price: 180, farmer: 'Seasonal Collection', image: '/Images/Vegetables/veg1.jpg', category: 'vegetables', stock: 130 }
];

const farmers = [
    {
        id: 1,
        name: 'Rajesh Kumar',
        location: 'Greater Noida',
        distance: 5,
        image: 'https://images.unsplash.com/photo-1592838064575-70ed626d3a0e?auto=format&fit=crop&q=80&w=500',
        products: ['Tomatoes', 'Spinach', 'Carrots']
    },
    {
        id: 2,
        name: 'Amit Singh',
        location: 'Noida Sector 62',
        distance: 8,
        image: 'https://images.unsplash.com/photo-1595438280062-88a7040a6d80?auto=format&fit=crop&q=80&w=500',
        products: ['Wheat', 'Rice', 'Pulses']
    },
    {
        id: 3,
        name: 'Priya Sharma',
        location: 'Knowledge Park III',
        distance: 2,
        image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=500',
        products: ['Strawberries', 'Apples', 'Mangoes']
    }
];

let cart = JSON.parse(localStorage.getItem('cart')) || [];
let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

let currentProductPage = 0;
const productPageSize = 8;
let allProducts = [];

// Utility Functions
function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error(`Error saving to localStorage (${key}):`, error);
    }
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
}

function getProductById(id) {
    return allProducts.find(p => p.id == id) || null;
}

function dedupeProducts(items) {
    const map = new Map();
    items.forEach(item => {
        const key = item.id || `${item.name}_${item.category}`;
        if (!map.has(key)) {
            map.set(key, item);
        }
    });
    return Array.from(map.values());
}

// Product Management
function loadProductsFromStorage() {
    try {
        const categories = ['crops', 'fruits', 'vegetables'];
        const loadedProducts = [];

        categories.forEach(category => {
            const storedItems = JSON.parse(localStorage.getItem(category)) || [];
            const convertedItems = storedItems.map(item => ({
                id: item.id || `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                name: item.name || 'New Product',
                price: item.price || 10,
                farmer: item.farmer || 'Your Farm',
                image: item.image || 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&q=80&w=500',
                category: item.category || category,
                stock: item.stock || 1
            }));

            convertedItems.forEach(product => {
                const exists = products.some(p => p.id == product.id || (p.name === product.name && p.category === product.category));
                if (!exists) loadedProducts.push(product);
            });
        });

        if (loadedProducts.length) {
            products.push(...loadedProducts);
        }

        return loadedProducts;
    } catch (error) {
        console.error('Error loading products from storage:', error);
        return [];
    }
}

function loadDashboardProducts() {
    try {
        // Keep this for compatibility; this function should not duplicate the products list.
        const categories = ['crops', 'fruits', 'vegetables'];
        const allItems = [];

        categories.forEach(category => {
            const storedItems = JSON.parse(localStorage.getItem(category)) || [];
            storedItems.forEach(item => {
                const normalizedId = item.id || `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
                if (products.some(p => p.id == normalizedId || (p.name === item.name && p.category === category))) return;

                allItems.push({
                    id: normalizedId,
                    name: item.name || 'Farm Product',
                    price: item.price || 0,
                    farmer: item.farmer || 'Your Farm',
                    image: item.image || 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&q=80&w=500',
                    category: item.category || category,
                    stock: item.stock || 1
                });
            });
        });

        return allItems;
    } catch (error) {
        console.error('Error loading dashboard products:', error);
        return [];
    }
}

// UI Rendering
function initializeBanner() {
    const bannerSlides = document.querySelector('.banner-slides');
    if (!bannerSlides) return;

    bannerImages.forEach((image, index) => {
        const slide = document.createElement('div');
        slide.className = `banner-slide ${index === 0 ? 'active' : ''}`;
        slide.innerHTML = `<img src="${image}" alt="Banner ${index + 1}">`;
        bannerSlides.appendChild(slide);
    });
}

function rotateBanner() {
    const slides = document.querySelectorAll('.banner-slide');
    if (!slides.length) return;

    let currentSlide = 0;
    setInterval(() => {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }, 5000);
}

function createProductCard(product) {
    const isFarmerProduct = product.farmer === 'Your Farm';
    const farmerBadge = isFarmerProduct ? '<span class="farmer-badge">From Your Farm</span>' : '';
    
    return `
        <div class="product-card" data-category="${product.category}" data-id="${product.id}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                ${farmerBadge}
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-farmer">${product.farmer}</p>
                <div class="product-footer">
                    <span class="product-price">${formatCurrency(product.price)}</span>
                    <button class="add-to-cart" data-product-id="${product.id}">
                        <i class="fas fa-cart-plus"></i> Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `;
}

function renderProductPage() {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;

    const startIndex = currentProductPage * productPageSize;
    const pageProducts = allProducts.slice(startIndex, startIndex + productPageSize);

    productsGrid.innerHTML = pageProducts.length > 0
        ? pageProducts.map(createProductCard).join('')
        : '<p class="no-products">No products available</p>';

    updateProductNavButtons();
}

function updateProductNavButtons() {
    const prevBtn = document.getElementById('products-prev');
    const nextBtn = document.getElementById('products-next');
    if (!prevBtn || !nextBtn) return;

    const maxPage = Math.ceil(allProducts.length / productPageSize) - 1;
    prevBtn.disabled = currentProductPage <= 0;
    nextBtn.disabled = currentProductPage >= maxPage;
}

function setupProductCarousel() {
    const prevBtn = document.getElementById('products-prev');
    const nextBtn = document.getElementById('products-next');
    if (!prevBtn || !nextBtn) return;

    prevBtn.addEventListener('click', () => {
        if (currentProductPage > 0) {
            currentProductPage -= 1;
            renderProductPage();
        }
    });

    nextBtn.addEventListener('click', () => {
        const maxPage = Math.ceil(allProducts.length / productPageSize) - 1;
        if (currentProductPage < maxPage) {
            currentProductPage += 1;
            renderProductPage();
        }
    });
}

function createFarmerCard(farmer) {
    return `
        <div class="farmer-card">
            <div class="farmer-info">
                <img src="${farmer.image}" alt="${farmer.name}" class="farmer-avatar" loading="lazy">
                <div class="farmer-details">
                    <h3>${farmer.name}</h3>
                    <p class="farmer-location">
                        <i class="fas fa-map-marker-alt"></i>
                        ${farmer.location} (${farmer.distance} km away)
                    </p>
                </div>
            </div>
            <div class="farmer-products">
                ${farmer.products.map(product => `
                    <span class="farmer-product">${product}</span>
                `).join('')}
            </div>
        </div>
    `;
}

// Cart Management
function updateCart() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const cartCount = document.querySelector('.cart-count');
    const emptyCartMsg = document.querySelector('.empty-cart-message');
    const checkoutBtn = document.querySelector('.checkout-btn');

    if (!cartItems || !cartTotal || !cartCount) return;

    // Save cart to localStorage
    saveToLocalStorage('cart', cart);

    // Update cart count
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;

    // Handle empty cart
    if (cart.length === 0) {
        cartItems.innerHTML = '';
        if (emptyCartMsg) emptyCartMsg.style.display = 'block';
        if (checkoutBtn) checkoutBtn.disabled = true;
        return;
    }

    if (emptyCartMsg) emptyCartMsg.style.display = 'none';
    if (checkoutBtn) checkoutBtn.disabled = false;

    // Render cart items
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item" data-product-id="${item.id}">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image" loading="lazy">
            <div class="cart-item-details">
                <h4 class="cart-item-name">${item.name}</h4>
                <p class="cart-item-price">${formatCurrency(item.price * item.quantity)}</p>
                <div class="cart-item-quantity">
                    <button class="quantity-btn minus" data-id="${item.id}">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn plus" data-id="${item.id}">+</button>
                </div>
            </div>
            <button class="remove-item" data-id="${item.id}">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');

    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = formatCurrency(total);
}

function updateQuantity(productId, change) {
    const itemIndex = cart.findIndex(item => item.id == productId);
    if (itemIndex > -1) {
        cart[itemIndex].quantity += change;
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }
        updateCart();
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id != productId);
    updateCart();
}

function addToCart(productId) {
    const product = getProductById(productId);
    if (!product) {
        console.error('Product not found:', productId);
        return;
    }

    const existingItem = cart.find(item => item.id == productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCart();
    
    // Show cart sidebar
    const cartSidebar = document.querySelector('.cart-sidebar');
    if (cartSidebar) cartSidebar.classList.add('open');
    
    // Show added notification
    showNotification(`${product.name} added to cart`);
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Search and Filter
function updateRecommendations() {
    const recommendationsGrid = document.getElementById('recommendations-grid');
    if (!recommendationsGrid) return;

    const recentCategories = [...new Set(searchHistory.map(item => item.category))];
    let recommendations = products.filter(product => 
        recentCategories.includes(product.category) &&
        !cart.some(cartItem => cartItem.id == product.id)
    );

    if (recommendations.length === 0) {
        // Fallback to random selection if no search history exists
        const candidates = products.filter(product => !cart.some(cartItem => cartItem.id == product.id));
        recommendations = candidates.sort(() => 0.5 - Math.random()).slice(0, 4);
    } else {
        recommendations = recommendations.slice(0, 4);
    }

    recommendationsGrid.innerHTML = recommendations.length > 0 
        ? recommendations.map(product => createProductCard(product)).join('')
        : '<p class="no-recommendations">Start searching for products to see personalized recommendations.</p>';
}

function filterProducts(category) {
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.style.display = (category === 'all' || card.dataset.category === category) 
            ? 'block' 
            : 'none';
    });
}

function searchProducts(query) {
    const productCards = document.querySelectorAll('.product-card');
    let hasResults = false;
    
    productCards.forEach(card => {
        const productName = card.querySelector('.product-name')?.textContent.toLowerCase();
        const farmer = card.querySelector('.product-farmer')?.textContent.toLowerCase();
        const category = card.dataset.category;
        
        if (productName?.includes(query) || farmer?.includes(query)) {
            card.style.display = 'block';
            hasResults = true;
            if (query.length > 2) {
                searchHistory.push({ term: query, category });
                saveToLocalStorage('searchHistory', searchHistory);
            }
        } else {
            card.style.display = 'none';
        }
    });
    
    const noResultsMsg = document.querySelector('.no-results-message');
    if (noResultsMsg) {
        noResultsMsg.style.display = hasResults ? 'none' : 'block';
    }
    
    if (query.length > 2) {
        updateRecommendations();
    }
}

// Update the initializeCheckout function
function initializeCheckout() {
    const checkoutBtn = document.querySelector('.checkout-btn');
    const checkoutModal = document.getElementById('checkout-modal');
    const confirmationModal = document.getElementById('confirmation-modal');
    const closeBtns = document.querySelectorAll('.close');
    const paymentMethod = document.getElementById('payment-method');
    const checkoutForm = document.getElementById('checkout-form');
    const continueShoppingBtn = document.getElementById('continue-shopping');

    if (!checkoutBtn || !checkoutModal) return;

    // Show checkout modal
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            showNotification('Your cart is empty!');
            return;
        }
        checkoutModal.style.display = 'block';
    });

    // Close modals
    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            checkoutModal.style.display = 'none';
            if (confirmationModal) confirmationModal.style.display = 'none';
        });
    });

    // Payment method selection
    if (paymentMethod) {
        paymentMethod.addEventListener('change', (e) => {
            document.querySelectorAll('.payment-details').forEach(el => {
                el.style.display = 'none';
            });
            
            const selectedMethod = e.target.value;
            const detailsElement = document.getElementById(`${selectedMethod}-details`);
            if (detailsElement) detailsElement.style.display = 'block';
        });
    }

    // Form submission - Updated with proper error handling
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Validate form
            const formData = new FormData(checkoutForm);
            const formValues = Object.fromEntries(formData.entries());
            
            // Basic validation
            if (!formValues.fullName || !formValues.email || !formValues.phone || !formValues.address || !formValues.paymentMethod) {
                showNotification('Please fill all required fields');
                return;
            }
            
            // Additional validation for payment methods
            if (formValues.paymentMethod === 'card') {
                const cardNumber = document.getElementById('card-number').value;
                const expiryDate = document.getElementById('expiry-date').value;
                const cvv = document.getElementById('cvv').value;
                
                if (!cardNumber || !expiryDate || !cvv) {
                    showNotification('Please fill all card details');
                    return;
                }
            } else if (formValues.paymentMethod === 'upi') {
                const upiId = document.getElementById('upi-id').value;
                if (!upiId) {
                    showNotification('Please enter your UPI ID');
                    return;
                }
            }
            
            try {
                // Process payment
                await processPayment();
                
                // Create order with proper structure
                const orderId = 'FR-' + Math.random().toString(36).substr(2, 8).toUpperCase();
                const orderTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                
                const order = {
                    id: orderId,
                    date: new Date().toISOString(),
                    customer: {
                        name: formValues.fullName,
                        email: formValues.email,
                        phone: formValues.phone,
                        address: formValues.address
                    },
                    items: cart.map(item => ({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                        farmer: item.farmer
                    })),
                    total: orderTotal,
                    paymentMethod: formValues.paymentMethod,
                    status: 'Processing'
                };
                
                // Save order to localStorage
                const orders = JSON.parse(localStorage.getItem('orders')) || [];
                orders.push(order);
                saveToLocalStorage('orders', orders);
                
                // Update farmer dashboard
                updateFarmerOrders(order);
                
                // Show confirmation
                if (confirmationModal) {
                    document.getElementById('order-id').textContent = orderId;
                    checkoutModal.style.display = 'none';
                    confirmationModal.style.display = 'block';
                }
                
                // Clear cart and update UI
                cart = [];
                saveToLocalStorage('cart', cart);
                updateCart();
                
                const cartSidebar = document.querySelector('.cart-sidebar');
                if (cartSidebar) cartSidebar.classList.remove('open');
                
                // Reset form
                checkoutForm.reset();
                
                // Send confirmation (simulated)
                sendConfirmationEmail(formValues.email, orderId, orderTotal);
            } catch (error) {
                showNotification(`Payment failed: ${error}`);
                console.error('Checkout error:', error);
            }
        });
    }

    // Continue shopping
    if (continueShoppingBtn && confirmationModal) {
        continueShoppingBtn.addEventListener('click', () => {
            confirmationModal.style.display = 'none';
        });
    }
}

// Update the processPayment function
function processPayment() {
    return new Promise((resolve, reject) => {
        // Simulate API call with timeout
        setTimeout(() => {
            // For demo purposes, we'll always succeed
            // In a real app, you would call your payment gateway
            resolve();
            
            // If you want to test failure (10% chance):
            // const isSuccess = Math.random() > 0.1;
            // isSuccess ? resolve() : reject('Payment could not be processed');
        }, 1500);
    });
}

function updateFarmerOrders(order) {
    try {
        const farmerOrders = JSON.parse(localStorage.getItem('farmerOrders')) || [];
        
        // Group items by farmer
        const farmerGroups = {};
        order.items.forEach(item => {
            const farmerName = item.farmer || 'Your Farm';
            if (!farmerGroups[farmerName]) {
                farmerGroups[farmerName] = [];
            }
            farmerGroups[farmerName].push({
                name: item.name,
                quantity: item.quantity,
                price: item.price
            });
        });
        
        // Create orders for each farmer
        for (const farmer in farmerGroups) {
            farmerOrders.push({
                orderId: order.id,
                date: order.date,
                customer: order.customer.name,
                items: farmerGroups[farmer],
                total: farmerGroups[farmer].reduce((sum, item) => sum + (item.price * item.quantity), 0),
                status: 'New'
            });
        }
        
        saveToLocalStorage('farmerOrders', farmerOrders);
    } catch (error) {
        console.error('Error updating farmer orders:', error);
    }
}

function sendConfirmationEmail(email, orderId, total) {
    console.log(`Confirmation email sent to ${email}`);
    console.log(`Order ID: ${orderId}`);
    console.log(`Total: ${formatCurrency(total)}`);
}

// Initialize Page
function initializePage() {
    // Initial products are static only
    allProducts = products.slice();

    // Initialize UI components
    initializeBanner();
    rotateBanner();

    // Render products and farmers
    renderProductPage();

    const farmersGrid = document.getElementById('farmers-grid');
    if (farmersGrid) {
        farmersGrid.innerHTML = farmers.map(createFarmerCard).join('');
    }

    // Initialize cart
    updateCart();
    updateRecommendations();

    // Initialize checkout system
    initializeCheckout();

    // Pagination controls
    setupProductCarousel();

}

function setupProductCarousel() {
    const prevBtn = document.getElementById('products-prev');
    const nextBtn = document.getElementById('products-next');
    if (!prevBtn || !nextBtn) return;

    prevBtn.addEventListener('click', () => {
        if (currentProductPage > 0) {
            currentProductPage -= 1;
            renderProductPage();
        }
    });

    nextBtn.addEventListener('click', () => {
        const maxPage = Math.ceil(allProducts.length / productPageSize) - 1;
        if (currentProductPage < maxPage) {
            currentProductPage += 1;
            renderProductPage();
        }
    });
}

function setupEventListeners() {
    // Cart toggle
    const cartButton = document.querySelector('.cart-button');
    const cartSidebar = document.querySelector('.cart-sidebar');
    const closeCart = document.querySelector('.close-cart');
    
    if (cartButton && cartSidebar) {
        cartButton.addEventListener('click', () => cartSidebar.classList.add('open'));
    }
    
    if (closeCart && cartSidebar) {
        closeCart.addEventListener('click', () => cartSidebar.classList.remove('open'));
    }
    
    // Add to cart
    document.addEventListener('click', (e) => {
        if (e.target.closest('.add-to-cart')) {
            const productId = e.target.closest('.add-to-cart').dataset.productId;
            if (productId) addToCart(productId);
        }
        
        // Quantity buttons
        if (e.target.closest('.quantity-btn')) {
            const btn = e.target.closest('.quantity-btn');
            const productId = btn.dataset.id;
            const isPlus = btn.classList.contains('plus');
            updateQuantity(productId, isPlus ? 1 : -1);
        }
        
        // Remove item
        if (e.target.closest('.remove-item')) {
            const productId = e.target.closest('.remove-item').dataset.id;
            removeFromCart(productId);
        }
    });
    
    // Category filter
    const categoryButtons = document.querySelectorAll('.category-btn');
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            filterProducts(button.dataset.category);
        });
    });
    
    // Search functionality
    const searchInput = document.querySelector('.search-box input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchProducts(e.target.value.toLowerCase());
        });
    }
    
    // Location detection
    const detectLocationBtn = document.querySelector('.location-detect');
    if (detectLocationBtn) {
        detectLocationBtn.addEventListener('click', () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    () => {
                        document.getElementById('location-input').value = 'Greater Noida';
                    },
                    () => {
                        showNotification('Unable to detect location. Please enter manually.');
                    }
                );
            } else {
                showNotification('Geolocation is not supported by your browser');
            }
        });
    }
}

// Start the application
document.addEventListener('DOMContentLoaded', initializePage);

