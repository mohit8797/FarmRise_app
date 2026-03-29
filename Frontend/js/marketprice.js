document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const tableBody = document.getElementById('priceTableBody');
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const lastUpdateTime = document.getElementById('lastUpdateTime');
    const featuredProduct = document.getElementById('featuredProduct');
    const featuredUpdateTime = document.getElementById('featuredUpdateTime');
    const dataSources = document.getElementById('dataSources');
    const refreshBtn = document.getElementById('refreshBtn');
    const loadingOverlay = document.getElementById('loadingOverlay');

    // Market data API endpoints (simulated)
    const API_ENDPOINTS = {
        vegetables: 'https://api.example.com/vegetables',
        fruits: 'https://api.example.com/fruits',
        crops: 'https://api.example.com/crops'
    };

    // Data sources information
    const SOURCES = [
        "National Agricultural Market (eNAM)",
        "Agricultural Produce Market Committee (APMC)",
        "Farmers Market Database",
        "Government Price Monitoring"
    ];

    // Initialize with empty data
    let marketData = [];
    let featuredItem = null;

    // Initialize the page
    initMarketPage();

    // Initialize market page
    function initMarketPage() {
        showLoading();
        updateDataSources();
        fetchAllMarketData()
            .then(data => {
                marketData = data;
                featuredItem = getFeaturedItem(marketData);
                renderFeaturedItem(featuredItem);
                renderTable(marketData);
                updateTime();
                hideLoading();
            })
            .catch(error => {
                console.error('Error initializing market data:', error);
                hideLoading();
                // Fallback to sample data if API fails
                loadSampleData();
            });

        // Set up auto-refresh every 5 minutes
        setInterval(refreshData, 5 * 60 * 1000);
    }

    // Fetch market data from APIs
    async function fetchAllMarketData() {
        // In a real implementation, you would fetch from actual APIs
        // This is a simulation with timeout
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(generateMarketData());
            }, 1500);
        });
    }

    // Generate realistic market data
    function generateMarketData() {
        const products = [
            // Vegetables
            { name: 'Tomatoes', category: 'vegetables', basePrice: 40, volatility: 5 },
            { name: 'Potatoes', category: 'vegetables', basePrice: 25, volatility: 3 },
            { name: 'Onions', category: 'vegetables', basePrice: 30, volatility: 4 },
            { name: 'Carrots', category: 'vegetables', basePrice: 35, volatility: 3 },
            { name: 'Cabbage', category: 'vegetables', basePrice: 20, volatility: 2 },
            // Fruits
            { name: 'Apples', category: 'fruits', basePrice: 120, volatility: 10 },
            { name: 'Bananas', category: 'fruits', basePrice: 50, volatility: 5 },
            { name: 'Oranges', category: 'fruits', basePrice: 80, volatility: 8 },
            { name: 'Grapes', category: 'fruits', basePrice: 90, volatility: 12 },
            { name: 'Mangoes', category: 'fruits', basePrice: 150, volatility: 20 },
            // Crops
            { name: 'Rice', category: 'crops', basePrice: 60, volatility: 5 },
            { name: 'Wheat', category: 'crops', basePrice: 55, volatility: 4 },
            { name: 'Corn', category: 'crops', basePrice: 45, volatility: 3 },
            { name: 'Soybeans', category: 'crops', basePrice: 70, volatility: 6 },
            { name: 'Cotton', category: 'crops', basePrice: 85, volatility: 8 }
        ];

        const markets = [
            'Mumbai APMC', 'Delhi Mandi', 'Bangalore Market', 
            'Hyderabad Yard', 'Chennai Market', 'Kolkata Bazar'
        ];

        const now = new Date();
        const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        return products.map(product => {
            // Generate random price based on base price and volatility
            const price = product.basePrice + (Math.random() * product.volatility * 2 - product.volatility);
            const previousPrice = product.basePrice + (Math.random() * product.volatility * 2 - product.volatility);
            
            return {
                id: Math.random().toString(36).substr(2, 9),
                name: product.name,
                price: Math.round(price * 10) / 10,
                previousPrice: Math.round(previousPrice * 10) / 10,
                category: product.category,
                market: markets[Math.floor(Math.random() * markets.length)],
                lastUpdated: new Date(now.getTime() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
                image: `/Images/Market/${product.name.toLowerCase()}.jpg`
            };
        });
    }

    // Load sample data if API fails
    function loadSampleData() {
        marketData = [
            {
                id: 'sample1',
                name: 'Tomatoes',
                price: 42.5,
                previousPrice: 40.2,
                category: 'vegetables',
                market: 'Mumbai APMC',
                lastUpdated: new Date().toISOString(),
                image: '/Images/Market/tomatoes.jpg'
            },
            // Add more sample items as needed
        ];
        featuredItem = getFeaturedItem(marketData);
        renderFeaturedItem(featuredItem);
        renderTable(marketData);
        updateTime();
    }

    // Get featured item (highest price change)
    function getFeaturedItem(data) {
        if (!data || data.length === 0) return null;
        
        return data.reduce((max, item) => {
            const currentChange = Math.abs(item.price - item.previousPrice);
            const maxChange = Math.abs(max.price - max.previousPrice);
            return currentChange > maxChange ? item : max;
        }, data[0]);
    }

    // Format price change
    function formatPriceChange(current, previous) {
        const diff = current - previous;
        const percentChange = ((diff / previous) * 100).toFixed(1);
        
        if (diff > 0) {
            return `<span class="price-up">↑ ${percentChange}% (₹${diff.toFixed(1)})</span>`;
        } else if (diff < 0) {
            return `<span class="price-down">↓ ${Math.abs(percentChange)}% (₹${Math.abs(diff).toFixed(1)})</span>`;
        }
        return `<span class="price-neutral">→ 0%</span>`;
    }

    // Format date
    function formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffHours = Math.floor((now - date) / (1000 * 60 * 60));
        
        if (diffHours < 1) {
            const diffMinutes = Math.floor((now - date) / (1000 * 60));
            return `${diffMinutes}m ago`;
        } else if (diffHours < 24) {
            return `${diffHours}h ago`;
        } else {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
    }

    // Render featured item
    function renderFeaturedItem(item) {
        if (!item) return;
        
        featuredProduct.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="featured-image" onerror="this.src='/Images/Market/default.jpg'">
            <div class="featured-details">
                <h3 class="featured-name">${item.name}</h3>
                <div class="featured-price">₹${item.price.toFixed(1)}/kg</div>
                <div class="featured-change">${formatPriceChange(item.price, item.previousPrice)}</div>
                <div class="featured-market">${item.market}</div>
            </div>
        `;
        
        featuredUpdateTime.textContent = formatDate(item.lastUpdated);
    }

    // Render table data
    function renderTable(data) {
        tableBody.innerHTML = '';
        
        if (data.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="no-data">No matching products found</td>
                </tr>
            `;
            return;
        }
        
        data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <div class="product-cell">
                        <div class="product-icon">
                            <i class="fas fa-${item.category === 'vegetables' ? 'carrot' : item.category === 'fruits' ? 'apple-alt' : 'wheat-awn'}"></i>
                        </div>
                        ${item.name}
                    </div>
                </td>
                <td class="price-cell">₹${item.price.toFixed(1)}</td>
                <td class="change-cell">${formatPriceChange(item.price, item.previousPrice)}</td>
                <td class="market-cell">${item.market}</td>
                <td class="time-cell">${formatDate(item.lastUpdated)}</td>
            `;
            tableBody.appendChild(row);
        });
    }

    // Filter data based on search and category
    function filterData() {
        const searchTerm = searchInput.value.toLowerCase();
        const category = categoryFilter.value;

        const filteredData = marketData.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchTerm);
            const matchesCategory = category === 'all' || item.category === category;
            return matchesSearch && matchesCategory;
        });

        renderTable(filteredData);
    }

    // Update time display
    function updateTime() {
        const now = new Date();
        lastUpdateTime.textContent = now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }

    // Update data sources display
    function updateDataSources() {
        dataSources.textContent = SOURCES.join(', ');
    }

    // Refresh data
    function refreshData() {
        showLoading();
        fetchAllMarketData()
            .then(data => {
                marketData = data;
                featuredItem = getFeaturedItem(marketData);
                renderFeaturedItem(featuredItem);
                filterData(); // Re-apply current filters
                updateTime();
                hideLoading();
                
                // Show refresh confirmation
                showToast('Market data refreshed successfully');
            })
            .catch(error => {
                console.error('Error refreshing data:', error);
                hideLoading();
                showToast('Failed to refresh data. Using cached information.', 'error');
            });
    }

    // Show loading overlay
    function showLoading() {
        loadingOverlay.classList.add('active');
    }

    // Hide loading overlay
    function hideLoading() {
        loadingOverlay.classList.remove('active');
    }

    // Show toast notification
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }

    // Event listeners
    searchInput.addEventListener('input', filterData);
    categoryFilter.addEventListener('change', filterData);
    refreshBtn.addEventListener('click', refreshData);

    // Add toast styles dynamically
    const style = document.createElement('style');
    style.textContent = `
        .toast {
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 6px;
            color: white;
            font-weight: 500;
            transform: translateY(100px);
            opacity: 0;
            transition: all 0.3s ease;
            z-index: 1000;
        }
        .toast.show {
            transform: translateY(0);
            opacity: 1;
        }
        .toast-success {
            background-color: var(--primary-color);
        }
        .toast-error {
            background-color: var(--price-down);
        }
    `;
    document.head.appendChild(style);
});