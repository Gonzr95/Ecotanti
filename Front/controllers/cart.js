export class Cart {
    products = [];

    constructor() {
        this.loadFromStorage();
    }

    loadFromStorage() {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {//si hay algo
            try {
                this.products = JSON.parse(storedCart);
            } catch (error) {
                // this.products = []; redundante
                this.saveToStorage();
            }
        } else { //si ta vacio
            // this.products = []; redundante
            this.saveToStorage();
        }
    }

    saveToStorage() {
        localStorage.setItem('cart', JSON.stringify(this.products));
    }

/**
     * Agrega un producto o actualiza su cantidad si ya existe
     * @param {string|number} productId - El ID del producto
     * @param {number} quantity - La cantidad a agregar
     */
    addProduct(productId, quantity, productData) {
        // 1. Buscamos si el producto ya existe en el carrito
        const existingProductIndex = this.products.findIndex(item => item.id === productId);

        if (existingProductIndex !== -1) { // si existe actualizamos cantidad 
            this.products[existingProductIndex].quantity += quantity;
            console.log(`Producto ${productId} actualizado. Nueva cantidad: ${this.products[existingProductIndex].quantity}`);
        } else {
            // NO EXISTE: Lo agregamos como objeto nuevo
            this.products.push({ 
                id: productId, 
                quantity: quantity, 
                product: productData });
            console.log(`Producto ${productId} agregado al carrito.`);
        }

        this.saveToStorage();
        
        // Opcional: Actualizar contador del header si tienes uno
        // updateCartCounter(); 
    }

    removeProduct(productId) {
        //reemplazamos el array actual x uno que no contenga el producto a eliminar
        this.products = this.products.filter(item => item.id !== productId);
        this.saveToStorage();
    }
}



