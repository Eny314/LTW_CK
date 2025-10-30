import User from '../Models/User.js';

class LoginController {
    constructor() {
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            const loginForm = document.getElementById('loginForm');
            if (loginForm) {
                loginForm.addEventListener('submit', (e) => this.handleLogin(e));
            }
        });
    }

    async handleLogin(event) {
        event.preventDefault();
        
        // Lấy các trường input
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const errorMessage = document.getElementById('errorMessage');
        const successMessage = document.getElementById('successMessage');

        try {
            // Ẩn message cũ
            errorMessage.style.display = 'none';
            successMessage.style.display = 'none';

            // Gọi hàm login từ Model
            const result = await User.login(email, password);
            
            if (result.success) {
                // Lưu thông tin user vào localStorage
                localStorage.setItem('user', JSON.stringify(result.user));
                
                // Hiển thị thông báo thành công
                successMessage.textContent = 'Đăng nhập thành công!';
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
const loginController = new LoginController();
export default loginController;