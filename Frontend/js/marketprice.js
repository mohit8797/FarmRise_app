// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Sample data for market prices
    const marketData = [
        {
            id: 1,
            name: 'Tomatoes',
            price: 40,
            previousPrice: 38,
            category: 'vegetables',
            lastUpdated: '2025-02-20T10:30:00'
        },
        {
            id: 2,
            name: 'Apples',
            price: 120,
            previousPrice: 125,
            category: 'fruits',
            lastUpdated: '2025-02-20T10:30:00'
        },
        {
            id: 3,
            name: 'Rice',
            price: 60,
            previousPrice: 60,
            category: 'crops',
            lastUpdated: '2025-02-20T10:30:00'
        },
        // Add more items as needed
    ];

    const tableBody = document.getElementById('priceTableBody');
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const lastUpdateTime = document.getElementById('lastUpdateTime');

    // Function to format price change
    function formatPriceChange(current, previous) {
        const diff = current - previous;
        if (diff > 0) {
            return `<span class="price-up">↑ ${diff}</span>`;
        } else if (diff < 0) {
            return `<span class="price-down">↓ ${Math.abs(diff)}</span>`;
        }
        return `<span>--</span>`;
    }

    // Function to format date
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit'
        });
    }

    // Function to render table data
    function renderTable(data) {
        tableBody.innerHTML = '';
        data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name}</td>
                <td>₹${item.price}</td>
                <td>${formatPriceChange(item.price, item.previousPrice)}</td>
                <td>${formatDate(item.lastUpdated)}</td>
            `;
            tableBody.appendChild(row);
        });
    }

    // Filter function
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

    // Event listeners
    searchInput.addEventListener('input', filterData);
    categoryFilter.addEventListener('change', filterData);

    // Initial render
    renderTable(marketData);

    // Update time every minute
    function updateTime() {
        const now = new Date();
        lastUpdateTime.textContent = now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    
    updateTime();
    setInterval(updateTime, 60000);

    // Simulate live updates
    setInterval(() => {
        marketData.forEach(item => {
            // Randomly update prices
            if (Math.random() > 0.7) {
                item.previousPrice = item.price;
                item.price += Math.floor(Math.random() * 10) - 5;
                item.lastUpdated = new Date().toISOString();
            }
        });
        filterData();
    }, 5000);
});