// Hàm định dạng tiền tệ
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

// Hàm hiển thị sản phẩm trong giỏ hàng
function displayCart() {
    const cartTableBody = document.querySelector('.table tbody');
    const cartTotal = document.querySelector('.cart-total');
    if (!cartTableBody) return;

    // Lấy giỏ hàng từ localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Xóa nội dung cũ
    cartTableBody.innerHTML = '';
    
    // Tổng tiền
    let total = 0;
    
    // Hiển thị từng sản phẩm
    cart.forEach((item, index) => {
        const row = document.createElement('tr');
        const subtotal = item.price * item.quantity;
        total += subtotal;
        
        row.innerHTML = `
            <td>
                <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover;">
            </td>
            <td>${item.name}</td>
            <td>${formatCurrency(item.price)}</td>
            <td>
                <div class="input-group quantity" style="width: 100px;">
                    <button class="btn btn-sm btn-primary btn-minus" data-index="${index}">-</button>
                    <input type="text" class="form-control form-control-sm text-center" value="${item.quantity}" readonly>
                    <button class="btn btn-sm btn-primary btn-plus" data-index="${index}">+</button>
                </div>
            </td>
            <td>${formatCurrency(subtotal)}</td>
            <td>
                <button class="btn btn-sm btn-danger btn-remove" data-index="${index}">
                    <i class="fa fa-times"></i>
                </button>
            </td>
        `;
        
        cartTableBody.appendChild(row);
    });
    
    // Cập nhật tổng tiền
    if (cartTotal) {
        cartTotal.textContent = formatCurrency(total);
    }
    
    // Thêm sự kiện cho các nút
    addCartButtonEvents();
}

// Hàm thêm sự kiện cho các nút trong giỏ hàng
function addCartButtonEvents() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Sự kiện nút tăng số lượng
    document.querySelectorAll('.btn-plus').forEach(button => {
        button.addEventListener('click', function() {
            const index = this.dataset.index;
            cart[index].quantity++;
            updateCart(cart);
        });
    });
    
    // Sự kiện nút giảm số lượng
    document.querySelectorAll('.btn-minus').forEach(button => {
        button.addEventListener('click', function() {
            const index = this.dataset.index;
            if (cart[index].quantity > 1) {
                cart[index].quantity--;
                updateCart(cart);
            }
        });
    });
    
    // Sự kiện nút xóa
    document.querySelectorAll('.btn-remove').forEach(button => {
        button.addEventListener('click', function() {
            const index = this.dataset.index;
            cart.splice(index, 1);
            updateCart(cart);
        });
    });
}

// Hàm cập nhật giỏ hàng
function updateCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
    updateCartCount();
}

// Khởi tạo khi trang tải xong
document.addEventListener('DOMContentLoaded', function() {
    displayCart();
});