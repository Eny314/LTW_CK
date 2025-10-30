import User from '../Models/User.js';

class SigninController {
    constructor() {
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            const signinForm = document.getElementById('signinForm');
            if (signinForm) {
                signinForm.addEventListener('submit', (e) => this.handleSignin(e));
            }

            // Thêm validate realtime cho password
            const passwordInput = document.getElementById('password');
            const confirmPasswordInput = document.getElementById('confirmPassword');
            if (passwordInput && confirmPasswordInput) {
                confirmPasswordInput.addEventListener('input', () => {
                    this.validatePasswords(passwordInput, confirmPasswordInput);
                });
            }
        });
    }

    validatePasswords(passwordInput, confirmPasswordInput) {
        const passwordMatch = passwordInput.value === confirmPasswordInput.value;
        confirmPasswordInput.setCustomValidity(passwordMatch ? '' : 'Mật khẩu không khớp');
    }

    async handleSignin(event) {
        event.preventDefault();
        
        // Lấy các trường input
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const fullName = document.getElementById('fullName').value;
        const errorMessage = document.getElementById('errorMessage');
        const successMessage = document.getElementById('successMessage');

        try {
            // Ẩn message cũ
            errorMessage.style.display = 'none';
            successMessage.style.display = 'none';

            // Kiểm tra mật khẩu khớp nhau
            if (password !== confirmPassword) {
                throw new Error('Mật khẩu xác nhận không khớp');
            }

            // Gọi hàm register từ Model
            const result = await User.register(email, password, fullName);
            
            if (result.success) {
                // Lưu thông tin user vào localStorage
                localStorage.setItem('user', JSON.stringify(result.user));
                
                // Hiển thị thông báo thành công
                successMessage.textContent = 'Đăng ký thành công!';
                successMessage.style.display = 'block';
                
                // Chuyển hướng sau 1 giây
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
            }
        } catch (error) {
            // Hiển thị lỗi
            errorMessage.textContent = error.message;
            errorMessage.style.display = 'block';
        }
    }
}

// Khởi tạo controller
const signinController = new SigninController();
export default signinController;