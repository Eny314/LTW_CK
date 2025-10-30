class User {
    constructor(username, email, fullName = '') {
        this.username = username;
        this.email = email;
        this.fullName = fullName;
    }

    static async login(email, password) {
        try {
            // TODO: Trong thực tế, đây sẽ là call API đến server
            // Giả lập call API
            return new Promise((resolve, reject) => {
                // Kiểm tra đăng nhập (demo)
                if (email && password) {
                    resolve({
                        success: true,
                        user: new User(email, email)
                    });
                } else {
                    reject(new Error('Email hoặc mật khẩu không đúng'));
                }
            });
        } catch (error) {
            throw new Error('Lỗi đăng nhập: ' + error.message);
        }
    }

    static async register(email, password, fullName) {
        try {
            // TODO: Trong thực tế, đây sẽ là call API đến server
            return new Promise((resolve, reject) => {
                // Kiểm tra các điều kiện đăng ký
                if (!email || !password || !fullName) {
                    reject(new Error('Vui lòng điền đầy đủ thông tin'));
                    return;
                }

                if (password.length < 6) {
                    reject(new Error('Mật khẩu phải có ít nhất 6 ký tự'));
                    return;
                }

                // Giả lập tạo user mới
                const newUser = new User(email, email, fullName);
                resolve({
                    success: true,
                    user: newUser
                });
            });
        } catch (error) {
            throw new Error('Lỗi đăng ký: ' + error.message);
        }
    }
}

export default User;