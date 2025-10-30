class Product {
    constructor(id, name, price, category, description, image) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.category = category;
        this.description = description;
        this.image = image;
    }

    static getAll() {
        // TODO: In thực tế, đây sẽ là call API hoặc database
        return [];
    }

    static getById(id) {
        // TODO: In thực tế, đây sẽ là call API hoặc database
        return null;
    }
}

export default Product;