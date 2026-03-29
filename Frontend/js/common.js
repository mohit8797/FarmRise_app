document.addEventListener('DOMContentLoaded', function() {
    // Get current page type (crop, fruit, or vegetable)
    const path = window.location.pathname;
    const pageType = path.includes('fruit') ? 'fruits' : 
                    path.includes('vegetable') ? 'vegetables' : 'crops';

    // DOM elements
    const modal = document.getElementById('product-modal');
    const addProductBtn = document.getElementById('add-product');
    const productForm = document.getElementById('product-form');
    const productList = document.querySelector('.product-list');
    const filterProducts = document.getElementById('filter-products');

    // Sample data for each category
    const sampleData = {
        crops: [
            {
                name: "Corn",
                price: 1.20,
                quantity: 500,
                image: "/Images/Crops/Maize.jpg",
                plantedDate: "2023-05-01",
                harvestDate: "2023-09-15",
                status: "Growing"
            },
            {
                name: "Wheat",
                price: 1.50,
                quantity: 300,
                image: "/Images/Crops/Wheat.jpg",
                plantedDate: "2023-06-01",
                harvestDate: "2023-10-01",
                status: "Growing"
            }
        ],
        fruits: [
            {
                name: "Apple",
                price: 2.50,
                quantity: 200,
                image: "/Images/Fruits/Apple.jpg",
                plantedDate: "2023-04-15",
                harvestDate: "2023-09-01",
                status: "Growing"
            },
            {
                name: "Banana",
                price: 1.80,
                quantity: 150,
                image: "/Images/Fruits/Bananas.jpg",
                plantedDate: "2023-03-20",
                harvestDate: "2023-08-15",
                status: "Growing"
            }
        ],
        vegetables: [
            {
                name: "Tomato",
                price: 1.00,
                quantity: 100,
                image: "/Images/Vegetables/Tomato.jpg",
                plantedDate: "2023-04-10",
                harvestDate: "2023-07-20",
                status: "Harvested"
            },
            {
                name: "Carrot",
                price: 0.80,
                quantity: 120,
                image: "/Images/Vegetables/Carrot.jpg",
                plantedDate: "2023-05-05",
                harvestDate: "2023-08-25",
                status: "Growing"
            }
        ]
    };

    // Load products from localStorage or initialize with sample data
    function loadProducts() {
        let products = JSON.parse(localStorage.getItem(pageType)) || sampleData[pageType];
        productList.innerHTML = '';
        
        products.forEach((product, index) => {
            addProductToDOM(product, index);
        });
    }

    // Add product to DOM
    function addProductToDOM(product, id) {
        const productItem = document.createElement('div');
        productItem.className = 'product-item';
        productItem.dataset.id = id;
        
        productItem.innerHTML = `
            <img src="${product.image}" alt="${product.name}" onerror="this.src='/Images/placeholder.jpg'">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p><strong>Price:</strong> $${product.price.toFixed(2)}/kg</p>
                <p><strong>Quantity:</strong> ${product.quantity} kg</p>
                <p><strong>Status:</strong> ${product.status}</p>
                <p><strong>Planted:</strong> ${formatDate(product.plantedDate)}</p>
                ${product.harvestDate ? `<p><strong>Harvest:</strong> ${formatDate(product.harvestDate)}</p>` : ''}
            </div>
            <div class="product-actions">
                <button class="view-details">View Details</button>
                <button class="edit-product">Edit</button>
                <button class="delete-product">Delete</button>
            </div>
        `;

        productList.appendChild(productItem);
        addProductEventListeners(productItem);
    }

    // Format date
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    // Save products to localStorage
    function saveProducts(products) {
        localStorage.setItem(pageType, JSON.stringify(products));
    }

    // Event listeners for product buttons
    function addProductEventListeners(productItem) {
        // View Details
        productItem.querySelector('.view-details').addEventListener('click', () => {
            const productId = productItem.dataset.id;
            const products = JSON.parse(localStorage.getItem(pageType)) || [];
            const product = products[productId];
            alert(`Details for ${product.name}\nPrice: $${product.price}/kg\nQuantity: ${product.quantity}kg\nStatus: ${product.status}`);
        });

        // Edit Product
        productItem.querySelector('.edit-product').addEventListener('click', () => {
            const productId = productItem.dataset.id;
            const products = JSON.parse(localStorage.getItem(pageType)) || [];
            const product = products[productId];
            
            document.getElementById('product-name').value = product.name;
            document.getElementById('product-price').value = product.price;
            document.getElementById('product-quantity').value = product.quantity;
            document.getElementById('product-image').value = product.image;
            document.getElementById('planted-date').value = product.plantedDate;
            document.getElementById('harvest-date').value = product.harvestDate || '';
            document.getElementById('product-status').value = product.status;
            
            productForm.dataset.mode = 'edit';
            productForm.dataset.id = productId;
            document.querySelector('.modal-content h2').textContent = `Edit ${product.name}`;
            modal.style.display = 'block';
        });

        // Delete Product
        productItem.querySelector('.delete-product').addEventListener('click', () => {
            if (confirm('Are you sure you want to delete this product?')) {
                const productId = productItem.dataset.id;
                let products = JSON.parse(localStorage.getItem(pageType)) || [];
                products.splice(productId, 1);
                saveProducts(products);
                productItem.remove();
            }
        });
    }

    // Form submission
    productForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const productData = {
            name: document.getElementById('product-name').value,
            price: parseFloat(document.getElementById('product-price').value),
            quantity: parseInt(document.getElementById('product-quantity').value),
            image: document.getElementById('product-image').value,
            plantedDate: document.getElementById('planted-date').value,
            harvestDate: document.getElementById('harvest-date').value || null,
            status: document.getElementById('product-status').value
        };

        let products = JSON.parse(localStorage.getItem(pageType)) || [];

        if (productForm.dataset.mode === 'edit') {
            // Update existing product
            const productId = productForm.dataset.id;
            products[productId] = productData;
        } else {
            // Add new product
            products.push(productData);
        }

        saveProducts(products);
        modal.style.display = 'none';
        loadProducts();
    });

    // Add product button
    addProductBtn.addEventListener('click', () => {
        productForm.reset();
        productForm.dataset.mode = 'add';
        document.querySelector('.modal-content h2').textContent = `Add New ${pageType.slice(0, -1)}`;
        modal.style.display = 'block';
    });

    // Filter products
    filterProducts.addEventListener('change', () => {
        const statusFilter = filterProducts.value;
        const productItems = document.querySelectorAll('.product-item');

        productItems.forEach(item => {
            const status = item.querySelector('.product-info p:nth-of-type(3)').textContent;
            item.style.display = (statusFilter === 'all' || status.includes(statusFilter)) ? 'block' : 'none';
        });
    });

    // Modal controls
    document.querySelector('.close').addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Initial load
    loadProducts();
});