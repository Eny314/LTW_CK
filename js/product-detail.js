// Load product details from URL parameters
document.addEventListener('DOMContentLoaded', function() {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const productName = urlParams.get('name');
    const productPrice = urlParams.get('price');
    const productImage = urlParams.get('img');

    // Update product details if parameters exist
    if (productName && productPrice && productImage) {
        // Resolve image path (support passing just a filename in URL)
        const imgSrc = resolveImagePath(productImage);
        // Update product name
        const nameElement = document.querySelector('.product-name');
        if (nameElement) {
            nameElement.textContent = productName;
        }

        // Update product price
        const priceElement = document.querySelector('.product-price');
        if (priceElement) {
            priceElement.textContent = formatCurrency(parseInt(productPrice));
        }

        // Update product image
        const imageElement = document.querySelector('.product-image');
        if (imageElement) {
            imageElement.src = imgSrc;
            imageElement.alt = productName;
        }

        // Update add to cart button
        const addToCartBtn = document.querySelector('.btn-add-to-cart');
        if (addToCartBtn) {
            addToCartBtn.setAttribute('data-name', productName);
            addToCartBtn.setAttribute('data-price', productPrice);
            addToCartBtn.setAttribute('data-image', imgSrc);
            
            // Add click handler
            addToCartBtn.addEventListener('click', function(e) {
                e.preventDefault();
                const name = this.getAttribute('data-name');
                const price = parseInt(this.getAttribute('data-price'));
                const image = this.getAttribute('data-image');
                
                if (typeof addToCart === 'function') {
                    addToCart(name, price, image);
                }
            });
        }
    }
});

// Format currency helper
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', { 
        style: 'currency', 
        currency: 'VND' 
    }).format(amount);
}

// Normalize/resolve image path from URL parameter
function resolveImagePath(imgParam) {
    if (!imgParam) return '';
    // If absolute URL or already contains 'Models/assets/img', keep as is
    if (/^https?:\/\//.test(imgParam)) return imgParam;
    if (imgParam.includes('Models/assets/img') || imgParam.startsWith('../')) return imgParam;
    // If comes as 'assets/img/...', normalize to '../Models/assets/img/...'
    if (imgParam.startsWith('assets/')) return '../Models/' + imgParam.replace(/^\/?/, '');
    // Otherwise, assume it's a filename like 'vegetable-item-9.jpg'
    return '../Models/assets/img/' + imgParam.replace(/^\/?/, '');
}
