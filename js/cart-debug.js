// Debug version of cart.js
console.log('Cart.js loaded');

// Khởi tạo giỏ hàng từ localStorage nếu có, không thì tạo mới
let cart = JSON.parse(localStorage.getItem('cart')) || [];
console.log('Initial cart:', cart);

// Hàm cập nhật số lượng hiển thị trên icon giỏ hàng
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    console.log('Updating cart count, element:', cartCount);
    if (cartCount) {
        const total = cart.reduce((total, item) => total + (parseInt(item.quantity) || 0), 0);
        console.log('New cart total:', total);
        cartCount.textContent = total;
    }
}

// Hàm định dạng giá
function formatPrice(price) {
    // Chuyển giá thành số, loại bỏ các ký tự không phải số
    const numericPrice = price.toString().replace(/[^\d]/g, '');
    console.log('Formatting price:', price, 'to:', numericPrice);
    return parseInt(numericPrice);
}

// Hàm thêm sản phẩm vào giỏ hàng
function addToCart(name, price, image) {
    console.log('Adding to cart:', { name, price, image });
    
    // Chuẩn hóa giá
    const normalizedPrice = formatPrice(price);
    console.log('Normalized price:', normalizedPrice);
    
    // Tìm sản phẩm trong giỏ hàng
    const existingItem = cart.find(item => item.name === name);
    console.log('Existing item:', existingItem);
    
    if (existingItem) {
        // Nếu sản phẩm đã có trong giỏ, tăng số lượng
        existingItem.quantity = (existingItem.quantity || 0) + 1;
        console.log('Updated quantity for existing item:', existingItem);
    } else {
        // Nếu chưa có, thêm sản phẩm mới
        const newItem = {
            name: name,
            price: normalizedPrice,
            image: image,
            quantity: 1
        };
        cart.push(newItem);
        console.log('Added new item:', newItem);
    }
    
    // Lưu giỏ hàng vào localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    console.log('Cart saved to localStorage:', cart);
    
    // Cập nhật số lượng hiển thị
    updateCartCount();
    
    // Hiển thị thông báo
    alert('Đã thêm ' + name + ' vào giỏ hàng!');
}

// Thêm sự kiện click cho các nút "Add to cart"
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded');
    
    // Cập nhật số lượng ban đầu
    updateCartCount();
    
    // Thêm sự kiện cho các nút thêm vào giỏ hàng
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    console.log('Found add-to-cart buttons:', addToCartButtons.length);
    
    addToCartButtons.forEach((button, index) => {
        console.log(`Button ${index}:`, {
            name: button.getAttribute('data-name'),
            price: button.getAttribute('data-price')
        });
        
        button.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Add to cart button clicked');
            
            const name = this.getAttribute('data-name');
            const price = this.getAttribute('data-price');
            const productContainer = this.closest('.fruite-item');
            const image = productContainer.querySelector('img').src;
            
            console.log('Product details:', { name, price, image });
            addToCart(name, price, image);
        });
    });
});