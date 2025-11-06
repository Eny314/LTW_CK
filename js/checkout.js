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
            <td>${item.name}</td>
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

    // Cập nhật QR khi tổng tiền đổi
    try { updateBankTransferQR(subtotal + shipping); } catch (_e) {}
}

document.addEventListener('DOMContentLoaded', function() {
    // Hiển thị danh sách sản phẩm
    displayCheckoutItems();

    // Thiết lập chọn Tỉnh/Thành phố và Quận/Huyện (chỉ yêu cầu Quận khi chọn TP.HCM)
    const citySelect = document.getElementById('city-select');
    const districtSelect = document.getElementById('district-select');
    const wardSelect = document.getElementById('ward-select');

    const HCMC_DISTRICTS = [
        'Quận 1','Quận 3','Quận 4','Quận 5','Quận 6','Quận 7','Quận 8','Quận 10','Quận 11','Quận 12',
        'Gò Vấp','Bình Thạnh','Tân Bình','Tân Phú','Phú Nhuận','Bình Tân','Bình Chánh','Nhà Bè','Hóc Môn','Củ Chi','Cần Giờ','Thủ Đức'
    ];

    function resetWard() {
        if (!wardSelect) return;
        wardSelect.innerHTML = '<option value="">Chọn phường/xã</option>';
        wardSelect.disabled = true;
        wardSelect.required = false;
    }

    function populateDistricts(cityCode) {
        if (!districtSelect) return;
        // Reset
        districtSelect.innerHTML = '<option value="">Chọn quận/huyện</option>';
        const isHCM = cityCode === 'HCM';
        districtSelect.disabled = !isHCM;
        districtSelect.required = isHCM; // Bắt buộc nếu là TP.HCM
        // Khi đổi thành phố, reset phường/xã
        resetWard();
        if (isHCM) {
            HCMC_DISTRICTS.forEach(d => {
                const opt = document.createElement('option');
                opt.value = d;
                opt.textContent = d;
                districtSelect.appendChild(opt);
            });
        }
    }

    function populateWards(districtName) {
        if (!wardSelect) return;
        // Reset mặc định
        wardSelect.innerHTML = '<option value="">Chọn phường/xã</option>';
        const hasDistrict = !!districtName;
        wardSelect.disabled = !hasDistrict;
        wardSelect.required = hasDistrict; // Bắt buộc khi đã chọn quận/huyện
        if (!hasDistrict) return;

        // Xác định danh sách phường/xã theo loại quận/huyện (đơn giản hoá)
        const suburban = ['Bình Chánh','Nhà Bè','Hóc Môn','Củ Chi','Cần Giờ'];
        let wards = [];

        if (suburban.includes(districtName)) {
            // Huyện: sinh tên xã 1..10
            wards = Array.from({ length: 10 }, (_, i) => `Xã ${i + 1}`);
        } else {
            // Quận/Thành phố Thủ Đức: sinh phường 1..20
            wards = Array.from({ length: 20 }, (_, i) => `Phường ${i + 1}`);
        }

        wards.forEach(w => {
            const opt = document.createElement('option');
            opt.value = w;
            opt.textContent = w;
            wardSelect.appendChild(opt);
        });
    }

    citySelect && citySelect.addEventListener('change', (e) => {
        populateDistricts(e.target.value);
        // Xóa trạng thái lỗi khi người dùng thay đổi
        citySelect.classList.remove('is-invalid');
        districtSelect && districtSelect.classList.remove('is-invalid');
        wardSelect && wardSelect.classList.remove('is-invalid');
    });

    // Khởi tạo theo giá trị hiện tại (nếu có)
    if (citySelect) populateDistricts(citySelect.value || '');

    // Khi đổi quận/huyện → nạp phường/xã
    districtSelect && districtSelect.addEventListener('change', (e) => {
        populateWards(e.target.value);
        districtSelect.classList.remove('is-invalid');
        wardSelect && wardSelect.classList.remove('is-invalid');
    });

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
    const cityField = document.getElementById('city-select');
    const districtField = document.getElementById('district-select');
    const wardField = document.getElementById('ward-select');
        const textareas = document.querySelectorAll('textarea');

        const order = {
            items: items,
            customerInfo: {
                name: nameField ? nameField.value : '',
                email: emailField ? emailField.value : '',
                phone: phoneField ? phoneField.value : '',
                city: cityField ? cityField.value : '',
                district: districtField && !districtField.disabled ? (districtField.value || '') : '',
                ward: wardField && !wardField.disabled ? (wardField.value || '') : '',
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

    // Hiển thị/ẩn box chuyển khoản và cập nhật QR khi chọn phương thức
    const bankRadio = document.getElementById('bank');
    const codRadio = document.getElementById('cod');
    const momoRadio = document.getElementById('momo');
    const bankBox = document.getElementById('bank-transfer-box');

    function onPaymentChange() {
        const isBank = bankRadio && bankRadio.checked;
        if (bankBox) bankBox.classList.toggle('d-none', !isBank);
        if (isBank) {
            // Lấy tổng hiện tại từ DOM
            const totalText = document.getElementById('total')?.textContent || '0';
            const amount = parseInt(String(totalText).replace(/[^\d]/g, '')) || 0;
            updateBankTransferQR(amount);
        }
    }
    [bankRadio, codRadio, momoRadio].forEach(r => r && r.addEventListener('change', onPaymentChange));
    onPaymentChange();

    // Nút copy nội dung chuyển khoản
    const btnCopyMemo = document.getElementById('btn-copy-memo');
    btnCopyMemo?.addEventListener('click', () => {
        const memo = document.getElementById('qr-memo')?.textContent || '';
        navigator.clipboard?.writeText(memo).then(() => {
            alert('Đã sao chép nội dung chuyển khoản');
        });
    });
});

// Cấu hình tài khoản ngân hàng (bạn có thể thay theo thông tin thật)
const BANK_INFO = {
    bankCode: 'VCB',                 // Mã ngân hàng Vietcombank
    bankName: 'Vietcombank (VCB)',   // Tên hiển thị
    account: '0123456789',           // Số tài khoản
    accountName: 'NGUYEN VAN A'      // Tên chủ tài khoản (IN HOA không dấu cho chuẩn VietQR)
};

// Tạo và hiển thị VietQR theo số tiền và nội dung
function updateBankTransferQR(amount) {
    const amountInt = parseInt(amount) || 0;
    const orderId = 'ORDER-' + Date.now();

    // Cập nhật thông tin hiển thị
    const amountLabel = document.getElementById('qr-amount');
    const memoLabel = document.getElementById('qr-memo');
    const bankNameLabel = document.getElementById('qr-bank-name');
    const accLabel = document.getElementById('qr-account');
    const accNameLabel = document.getElementById('qr-account-name');

    bankNameLabel && (bankNameLabel.textContent = BANK_INFO.bankName);
    accLabel && (accLabel.textContent = BANK_INFO.account);
    accNameLabel && (accNameLabel.textContent = BANK_INFO.accountName);
    amountLabel && (amountLabel.textContent = formatCurrency(amountInt).replace(' ', ' '));
    memoLabel && (memoLabel.textContent = orderId);

    // Tạo mã QR ảo (offline) bằng qrcodejs, không gọi ra ngoài
    const img = document.getElementById('vietqr-img');
    if (img) img.style.display = 'none';

    const fb = document.getElementById('qr-fallback');
    if (fb) {
        fb.innerHTML = '';
        try {
            // Nội dung QR ảo (đủ thông tin để đối chiếu, không ràng buộc ngân hàng)
            const payload = {
                merchant: 'FRUITABLES',
                payMethod: 'BANK_TRANSFER',
                bank: BANK_INFO.bankCode,
                account: BANK_INFO.account,
                name: BANK_INFO.accountName,
                amount: amountInt,
                memo: orderId,
                ts: Date.now()
            };
            // eslint-disable-next-line no-undef
            new QRCode(fb, { text: JSON.stringify(payload), width: 220, height: 220 });
            fb.classList.remove('d-none');
            fb.classList.add('d-inline-block');

            // Cập nhật nút tải ảnh QR (dataURL)
            setTimeout(() => {
                const canvas = fb.querySelector('canvas');
                const imgEl = fb.querySelector('img');
                const dataUrl = canvas ? canvas.toDataURL('image/png') : (imgEl ? imgEl.src : '');
                const dl = document.getElementById('btn-download-qr');
                if (dl && dataUrl) dl.setAttribute('href', dataUrl);
            }, 100);
        } catch (_e) {
            fb.classList.add('d-none');
        }
    }
}