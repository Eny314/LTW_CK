import Cart from '../Views/js/Cart.js';

class CartController {
    constructor() {
        this.cart = new Cart();
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Add event listeners for cart-related actions
        document.addEventListener('click', (e) => {
            if (e.target.matches('.add-to-cart')) {
                const productId = e.target.dataset.productId;
                this.addToCart(productId);
            }
        });
    }

    addToCart(productId, quantity = 1) {
        const product = this.getProduct(productId);
        if (product) {
            this.cart.addItem(product, quantity);
            this.updateCartDisplay();
        }
    }

    removeFromCart(productId) {
        this.cart.removeItem(productId);
        this.updateCartDisplay();
    }

    updateQuantity(productId, quantity) {
        this.cart.updateQuantity(productId, quantity);
        this.updateCartDisplay();
    }

    updateCartDisplay() {
        const cartContainer = document.querySelector('.cart-items');
        if (!cartContainer) return;

        cartContainer.innerHTML = this.cart.items.map(item => `
            <div class="cart-item" data-product-id="${item.product.id}">
                <img src="${item.product.image}" alt="${item.product.name}">
                <div class="item-details">
                    <h6>${item.product.name}</h6>
                    <p>$${item.product.price.toFixed(2)} x ${item.quantity}</p>
                </div>
                <button class="remove-item">&times;</button>
            </div>
        `).join('');

        const totalElement = document.querySelector('.cart-total');
        if (totalElement) {
            totalElement.textContent = `$${this.cart.getTotal().toFixed(2)}`;
        }
    }

    getProduct(productId) {
        // This should be implemented to get product details from your ProductController
        // For now, it returns null
        return null;
    }
}

export default CartController;