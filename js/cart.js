// Khởi tạo giỏ hàng từ localStorage nếu có, không thì tạo mới
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Hàm cập nhật số lượng hiển thị trên icon giỏ hàng
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    }
}

// Hàm thêm sản phẩm vào giỏ hàng
function addToCart(name, price, image) {
    // Tìm sản phẩm trong giỏ hàng
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        // Nếu sản phẩm đã có trong giỏ, tăng số lượng
        existingItem.quantity += 1;
    } else {
        // Nếu chưa có, thêm sản phẩm mới
        cart.push({
            name: name,
            price: parseFloat(price),
            image: image,
            quantity: 1
        });
    }
    
    // Lưu giỏ hàng vào localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Cập nhật số lượng hiển thị
    updateCartCount();
    
    // Hiển thị thông báo
    alert('Đã thêm ' + name + ' vào giỏ hàng!');
}

// Thêm sự kiện click cho các nút "Add to cart"
document.addEventListener('DOMContentLoaded', function() {
    // Cập nhật số lượng ban đầu
    updateCartCount();
    
    // Thêm sự kiện cho các nút thêm vào giỏ hàng
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const name = this.dataset.name;
            const price = this.dataset.price.replace('đ', '').replace('.', '');
            const image = this.closest('.fruite-item').querySelector('img').src;
            addToCart(name, price, image);
        });
    });
});