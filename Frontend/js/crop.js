document.addEventListener('DOMContentLoaded', function() {
    // Crops page functionality
    const addCropButton = document.getElementById('add-crop');
    const filterCrops = document.getElementById('filter-crops');

    if (addCropButton) {
        addCropButton.addEventListener('click', function() {
            alert('Add new crop functionality to be implemented');
        });
    }

    if (filterCrops) {
        filterCrops.addEventListener('change', function() {
            const selectedFilter = this.value;
            const cropItems = document.querySelectorAll('.crop-item');

            cropItems.forEach(item => {
                const status = item.querySelector('.crop-info p:first-of-type').textContent;
                if (selectedFilter === 'all' || status.includes(selectedFilter)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }

    // Add event listeners for view details and edit buttons
    const viewDetailsButtons = document.querySelectorAll('.view-details');
    const editCropButtons = document.querySelectorAll('.edit-crop');

    viewDetailsButtons.forEach(button => {
        button.addEventListener('click', function() {
            const cropName = this.closest('.crop-item').querySelector('h3').textContent;
            alert(`View details for ${cropName}`);
        });
    });

    editCropButtons.forEach(button => {
        button.addEventListener('click', function() {
            const cropName = this.closest('.crop-item').querySelector('h3').textContent;
            alert(`Edit ${cropName}`);
        });
    });
});