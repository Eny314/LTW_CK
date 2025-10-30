class CartItem {
    constructor(product, quantity) {
        this.product = product;
        this.quantity = quantity;
    }
}

class Cart {
    constructor() {
        this.items = [];
    }

    addItem(product, quantity) {
        const existingItem = this.items.find(item => item.product.id === product.id);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push(new CartItem(product, quantity));
        }
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.product.id !== productId);
    }

    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.product.id === productId);
        if (item) {
            item.quantity = quantity;
        }
    }

    getTotal() {
        return this.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    }
}

export default Cart;