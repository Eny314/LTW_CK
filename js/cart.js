// Khởi tạo giỏ hàng từ localStorage nếu có, không thì tạo mới
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Hàm cập nhật số lượng hiển thị trên icon giỏ hàng
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    }
}

// Hiển thị thông báo nhẹ (không chặn) khi thêm vào giỏ
function showCartNotice(message) {
    try {
        // Nếu đã có thông báo đang hiển thị thì xóa trước để tránh chồng chất
        const old = document.getElementById('cart-notice');
        if (old) old.remove();

        const el = document.createElement('div');
        el.id = 'cart-notice';
        el.textContent = message;
        el.style.position = 'fixed';
        el.style.right = '16px';
        el.style.top = '16px';
        el.style.zIndex = '2000';
        el.style.background = 'rgba(25, 135, 84, 0.95)'; // xanh bootstrap
        el.style.color = '#fff';
        el.style.padding = '10px 14px';
        el.style.borderRadius = '8px';
        el.style.boxShadow = '0 6px 16px rgba(0,0,0,0.15)';
        el.style.fontSize = '14px';
        el.style.transition = 'opacity 0.4s ease';
        document.body.appendChild(el);

        // Tự ẩn sau 1.5s
        setTimeout(() => {
            el.style.opacity = '0';
            setTimeout(() => el.remove(), 400);
        }, 1500);
    } catch (e) {
        // Nếu có lỗi khi render toast, im lặng bỏ qua
        console.warn('Cart notice error:', e);
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

    // Thông báo không chặn
    showCartNotice('Đã thêm "' + name + '" vào giỏ hàng');
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