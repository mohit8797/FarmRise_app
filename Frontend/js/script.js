// Banner Slideshow
const bannerImages = [
    'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1557844352-761f2565b576?auto=format&fit=crop&q=80&w=1200',
];

const products = [
    {
        id: 1,
        name: 'Organic Tomatoes',
        price: 40,
        farmer: 'Green Valley Farm',
        image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=500',
        category: 'vegetables'
    },
    {
        id: 2,
        name: 'Fresh Spinach',
        price: 30,
        farmer: 'Sunrise Organics',
        image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&q=80&w=500',
        category: 'vegetables'
    },
    {
        id: 3,
        name: 'Organic Carrots',
        price: 35,
        farmer: 'Nature\'s Best',
        image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&q=80&w=500',
        category: 'vegetables'
    },
    {
        id: 4,
        name: 'Fresh Strawberries',
        price: 80,
        farmer: 'Berry Fields',
        image: 'https://images.unsplash.com/photo-1518635017498-87f514b751ba?auto=format&fit=crop&q=80&w=500',
        category: 'fruits'
    },
    {
        id: 5,
        name: 'Organic Wheat',
        price: 45,
        farmer: 'Golden Fields',
        image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=500',
        category: 'crops'
    },
    {
        id: 6,
        name: 'Fresh Apples',
        price: 120,
        farmer: 'Hillside Orchards',
        image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&q=80&w=500',
        category: 'fruits'
    }
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

// Cart Management
let cart = [];
let searchHistory = [];

function initializeBanner() {
    const bannerSlides = document.querySelector('.banner-slides');
    
    bannerImages.forEach((image, index) => {
        const slide = document.createElement('div');
        slide.className = `banner-slide ${index === 0 ? 'active' : ''}`;
        
        const img = document.createElement('img');
        img.src = image;
        img.alt = `Banner ${index + 1}`;
        
        slide.appendChild(img);
        bannerSlides.appendChild(slide);
    });
}

function rotateBanner() {
    const slides = document.querySelectorAll('.banner-slide');
    let currentSlide = 0;
    
    setInterval(() => {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }, 5000);
}

function createProductCard(product) {
    return `
        <div class="product-card" data-category="${product.category}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-farmer">${product.farmer}</p>
                <div class="product-footer">
                    <span class="product-price">₹${product.price}</span>
                    <button class="add-to-cart" data-product-id="${product.id}">Add to Cart</button>
                </div>
            </div>
        </div>
    `;
}

function createFarmerCard(farmer) {
    return `
        <div class="farmer-card">
            <div class="farmer-info">
                <img src="${farmer.image}" alt="${farmer.name}" class="farmer-avatar">
                <div class="farmer-details">
                    <h3>${farmer.name}</h3>
                    <p class="farmer-location">
                        <i class="lucide-map-pin"></i>
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

function updateCart() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const cartCount = document.querySelector('.cart-count');
    
    cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <h4 class="cart-item-name">${item.name}</h4>
                <p class="cart-item-price">₹${item.price}</p>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
        </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `₹${total}`;
}

function updateQuantity(productId, change) {
    const itemIndex = cart.findIndex(item => item.id === productId);
    if (itemIndex > -1) {
        cart[itemIndex].quantity += change;
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }
    }
    updateCart();
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCart();
    document.querySelector('.cart-sidebar').classList.add('open');
}

function updateRecommendations() {
    const recommendationsGrid = document.getElementById('recommendations-grid');
    if (!recommendationsGrid) return;

    // Get unique categories from search history
    const recentCategories = [...new Set(searchHistory.map(item => item.category))];
    const recommendations = products.filter(product => 
        recentCategories.includes(product.category) &&
        !cart.some(cartItem => cartItem.id === product.id)
    ).slice(0, 4);

    if (recommendations.length > 0) {
        recommendationsGrid.innerHTML = recommendations.map(product => createProductCard(product)).join('');
    } else {
        recommendationsGrid.innerHTML = '<p>Search for products to get personalized recommendations!</p>';
    }
}

function initializeProducts() {
    const productsGrid = document.getElementById('products-grid');
    productsGrid.innerHTML = products.map(product => createProductCard(product)).join('');
}

function initializeFarmers() {
    const farmersGrid = document.getElementById('farmers-grid');
    farmersGrid.innerHTML = farmers.map(farmer => createFarmerCard(farmer)).join('');
}

function filterProducts(category) {
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    initializeBanner();
    rotateBanner();
    initializeProducts();
    initializeFarmers();
    updateRecommendations();
    
    // Cart toggle
    const cartButton = document.querySelector('.cart-button');
    const cartSidebar = document.querySelector('.cart-sidebar');
    const closeCart = document.querySelector('.close-cart');
    
    cartButton.addEventListener('click', () => {
        cartSidebar.classList.add('open');
    });
    
    closeCart.addEventListener('click', () => {
        cartSidebar.classList.remove('open');
    });
    
    // Add to cart functionality
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart')) {
            const productId = parseInt(e.target.dataset.productId);
            addToCart(productId);
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
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const productCards = document.querySelectorAll('.product-card');
        
        productCards.forEach(card => {
            const productName = card.querySelector('.product-name').textContent.toLowerCase();
            const farmer = card.querySelector('.product-farmer').textContent.toLowerCase();
            const category = card.dataset.category;
            
            if (productName.includes(query) || farmer.includes(query)) {
                card.style.display = 'block';
                if (query.length > 2) {
                    searchHistory.push({ term: query, category });
                    updateRecommendations();
                }
            } else {
                card.style.display = 'none';
            }
        });
    });

    // Location detection
    const detectLocationBtn = document.querySelector('.location-detect');
    detectLocationBtn.addEventListener('click', () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    // In a real application, you would use these coordinates
                    // to fetch nearby farmers from your backend
                    document.getElementById('location-input').value = 'Greater Noida';
                    // For demo purposes, we'll just show all farmers
                    initializeFarmers();
                },
                (error) => {
                    alert('Unable to detect location. Please enter manually.');
                }
            );
        } else {
            alert('Geolocation is not supported by your browser');
        }
    });
});