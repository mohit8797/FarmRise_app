document.addEventListener('DOMContentLoaded', function() {
    const cropSearch = document.getElementById('crop-search');
    const searchBtn = document.getElementById('search-btn');
    const resultsContainer = document.getElementById('results-container');
    
    // Sample crop database
    const cropDatabase = {
        "tomato": {
            name: "Tomato",
            image: "https://images.unsplash.com/photo-1594282408489-4d58b1fe2d8e",
            description: "Tomatoes are warm-season crops that grow best at temperatures between 70-75°F (21-24°C).",
            details: {
                "Growing Season": "Spring to summer (after last frost)",
                "Time to Harvest": "60-85 days after planting",
                "Soil pH": "6.0-6.8 (slightly acidic)",
                "Water Needs": "1-2 inches per week (more during fruiting)",
                "Sunlight": "Full sun (6-8 hours daily)",
                "Common Varieties": "Cherry, Beefsteak, Roma, Heirloom"
            }
        },
        "wheat": {
            name: "Wheat",
            image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef",
            description: "Wheat is a cereal grain grown worldwide, thriving in temperate climates with well-drained soil.",
            details: {
                "Growing Season": "Winter or spring (depending on variety)",
                "Time to Harvest": "7-8 months (winter), 4 months (spring)",
                "Soil pH": "6.0-7.0 (neutral)",
                "Water Needs": "12-15 inches during growing season",
                "Sunlight": "Full sun",
                "Common Varieties": "Hard Red, Soft White, Durum"
            }
        },
        "rice": {
            name: "Rice",
            image: "https://images.unsplash.com/photo-1606787366850-de6330128bfc",
            description: "Rice is a staple food crop that requires warm temperatures and plenty of water for cultivation.",
            details: {
                "Growing Season": "Warm season (requires 75°F+ soil temp)",
                "Time to Harvest": "3-6 months depending on variety",
                "Soil pH": "5.5-6.5 (slightly acidic)",
                "Water Needs": "Flooded fields or constant moisture",
                "Sunlight": "Full sun",
                "Common Varieties": "Basmati, Jasmine, Arborio, Brown"
            }
        },
        "potato": {
            name: "Potato",
            image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655",
            description: "Potatoes are cool-season tubers that grow underground from planted seed potatoes.",
            details: {
                "Growing Season": "Early spring (2-4 weeks before last frost)",
                "Time to Harvest": "70-120 days depending on variety",
                "Soil pH": "5.0-6.0 (slightly acidic)",
                "Water Needs": "1-2 inches per week (consistent moisture)",
                "Sunlight": "Full sun",
                "Common Varieties": "Russet, Yukon Gold, Red, Fingerling"
            }
        }
    };

    // Search functionality
    searchBtn.addEventListener('click', performSearch);
    cropSearch.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') performSearch();
    });

    // Popular search terms
    document.querySelectorAll('.popular-searches span').forEach(span => {
        span.addEventListener('click', function() {
            cropSearch.value = this.textContent;
            performSearch();
        });
    });

    function performSearch() {
        const query = cropSearch.value.trim().toLowerCase();
        
        if (!query) {
            alert('Please enter a crop name to search');
            return;
        }

        // Clear previous results
        resultsContainer.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Searching...</div>';
        
        // Simulate API call delay
        setTimeout(() => {
            displayResults(query);
        }, 800);
    }

    function displayResults(query) {
        // Find matching crops
        const matchedCrops = [];
        
        for (const [key, crop] of Object.entries(cropDatabase)) {
            if (key.includes(query) || crop.name.toLowerCase().includes(query)) {
                matchedCrops.push(crop);
            }
        }

        // Display results
        if (matchedCrops.length === 0) {
            resultsContainer.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <h3>No results found for "${query}"</h3>
                    <p>Try searching for: tomato, wheat, rice, or potato</p>
                </div>
            `;
            return;
        }

        let resultsHTML = '';
        
        matchedCrops.forEach(crop => {
            let detailsHTML = '';
            for (const [key, value] of Object.entries