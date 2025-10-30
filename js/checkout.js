// Format tiền tệ
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

// Hiển thị sản phẩm trong trang checkout
function displayCheckoutItems() {
    const checkoutItems = document.getElementById('checkout-items');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    let subtotal = 0;
    
    checkoutItems.innerHTML = '';
    
    cart.forEach(item => {
        const total = item.price * item.quantity;
        subtotal += total;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div class="d-flex align-items-center">
                    <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover;">
                    <span class="ms-2">${item.name}</span>
                </div>
            </td>
            <td>${item.quantity}</td>
            <td>${formatCurrency(item.price)}</td>
            <td>${formatCurrency(total)}</td>
        `;
        checkoutItems.appendChild(row);
    });
    
    // Cập nhật tổng tiền
    document.getElementById('subtotal').textContent = formatCurrency(subtotal);
    const shipping = 30000; // Phí vận chuyển cố định
    document.getElementById('total').textContent = formatCurrency(subtotal + shipping);
}

document.addEventListener('DOMContentLoaded', function() {
    // Hiển thị danh sách sản phẩm
    displayCheckoutItems();

    // Đăng ký sự kiện cho nút Đặt hàng (an toàn: kiểm tra tồn tại)
    const placeOrderBtn = document.getElementById('place-order');
    if (!placeOrderBtn) return;

    placeOrderBtn.addEventListener('click', function(e) {
        e.preventDefault();

        // Kiểm tra form
        const requiredFields = document.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value) {
                isValid = false;
                field.classList.add('is-invalid');
            } else {
                field.classList.remove('is-invalid');
            }
        });

        if (!isValid) {
            alert('Vui lòng điền đầy đủ thông tin bắt buộc');
            return;
        }

        // Lấy thông tin đơn hàng (an toàn: lấy từng phần nếu tồn tại)
        const items = JSON.parse(localStorage.getItem('cart')) || [];
        const nameField = document.querySelector('input[type="text"]');
        const emailField = document.querySelector('input[type="email"]');
        const phoneField = document.querySelector('input[type="tel"]');
        const cityField = document.querySelector('select');
        const textareas = document.querySelectorAll('textarea');

        const order = {
            items: items,
            customerInfo: {
                name: nameField ? nameField.value : '',
                email: emailField ? emailField.value : '',
                phone: phoneField ? phoneField.value : '',
                city: cityField ? cityField.value : '',
                address: textareas && textareas[0] ? textareas[0].value : '',
                note: textareas && textareas[1] ? textareas[1].value : ''
            },
            payment: (document.querySelector('input[name="payment"]:checked') || {}).id || 'cod',
            orderDate: new Date().toISOString(),
            status: 'pending'
        };

        // Lưu đơn hàng vào localStorage (trong thực tế sẽ gửi lên server)
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));

        // Xóa giỏ hàng
        localStorage.removeItem('cart');

        // Chuyển đến trang xác nhận đơn hàng
        window.location.href = 'order-confirmation.html';
    });
});