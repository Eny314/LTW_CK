import Product from '../Models/Product.js';

class ProductController {
    constructor() {
        this.products = [];
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Add event listeners for product-related actions
        document.addEventListener('DOMContentLoaded', () => this.loadProducts());
    }

    async loadProducts() {
        try {
            this.products = await Product.getAll();
            this.displayProducts();
        } catch (error) {
            console.error('Error loading products:', error);
        }
    }

    displayProducts() {
        const productContainer = document.querySelector('.product-container');
        if (!productContainer) return;

        productContainer.innerHTML = this.products.map(product => `
            <div class="col-lg-4 col-md-6 col-sm-12">
                <div class="product-item">
                    <img src="${product.image}" alt="${product.name}">
                    <div class="product-info">
                        <h5>${product.name}</h5>
                        <p class="price">$${product.price.toFixed(2)}</p>
                        <button class="btn btn-primary add-to-cart" data-product-id="${product.id}">
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    getProductById(id) {
        return Product.getById(id);
    }
}

export default ProductController;