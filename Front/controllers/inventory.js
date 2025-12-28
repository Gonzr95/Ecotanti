import { devBackendURL, devBackendPort } from '../configs/config.js';

document.addEventListener('DOMContentLoaded', () => {
    greetUser();
    loadCategories();
});

function greetUser() {
    const dataString = localStorage.getItem('customerData');
    if (dataString) {
        const customer = JSON.parse(dataString);
        const greetingElement = document.getElementById('greeting-h1');
        greetingElement.textContent = `Bienvenido, ${customer.name} ${customer.lastName}!`;
    }

};


// --- 2. Lógica de Fetch y Renderizado ---

async function loadCategories() {
    const menuContainer = document.getElementById('categories-container');
    
    try {
        
        const response = await fetch(`${devBackendURL}${devBackendPort}/products/categories`);
        if (!response.ok) throw new Error('Error al conectar con el servidor');
        const categories = await response.json();
        
        // B. Limpiar el mensaje de "Cargando..."
        menuContainer.innerHTML = '';


        for(let i = 0; i < categories.length; i++)
        {
            const button = document.createElement('button');

            button.textContent = categories[i]
            button.classList.add('category-btn');
            button.addEventListener('click', () => {
                const categoryName = button.textContent;
    
                // 1. Cambiar la URL visualmente sin recargar
                // Esto pondrá en tu navegador: http://tusitio.com/?category=Farol
                const newUrl = new URL(window.location);
                newUrl.searchParams.set('category', categoryName);
                window.history.pushState({}, '', newUrl);

                loadProducts(categoryName);
            });
            menuContainer.appendChild(button);
        }


    } catch (error) {
        console.error(error);
        menuContainer.innerHTML = '<p class="error">Lo sentimos, no se pudieron cargar las categorías.</p>';
    }
}

async function loadProducts(category) {
    const productsContainer = document.getElementById('products-container');

    // 1. UX: Feedback inmediato. Mostrar estado de carga antes de la petición.
    productsContainer.innerHTML = '<div class="loader">Cargando productos...</div>';

    try {
        // 2. Seguridad: encodeURIComponent ya lo tenías, ¡bien hecho! Evita errores con espacios o caracteres especiales.
        const response = await fetch(`${devBackendURL}${devBackendPort}/products?category=${encodeURIComponent(category)}`);
        
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        
        const products = await response.json();

        // 3. Limpiar el loader
        productsContainer.innerHTML = '';

        // 4. UX: Manejo de "Estado Vacío" (Empty State)
        if (products.length === 0) {
            productsContainer.innerHTML = `
                <div class="empty-state">
                    <p>No se encontraron productos en la categoría <strong>${category}</strong>.</p>
                </div>`;
            return;
        }

        // 5. Renderizado eficiente usando un DocumentFragment (mejora performance en listas largas)
        const fragment = document.createDocumentFragment();

        products.forEach(product => {
            const productCard = createProductCard(product);
            fragment.appendChild(productCard);
        });

        productsContainer.appendChild(fragment);

    } catch (error) {
        console.error('Error cargando productos:', error);
        // 6. UX: Mensaje de error amigable al usuario (no solo en consola)
        productsContainer.innerHTML = `
            <div class="error-message">
                <p>Ocurrió un error al cargar los productos. Por favor, intenta nuevamente.</p>
            </div>`;
    }
}

/**
 * Función auxiliar para crear el HTML de un producto individual.
 * Separa la lógica de presentación de la lógica de datos.
 */
function createProductCard(product) {
    const card = document.createElement('article');
    card.classList.add('product-card');


    const img = document.createElement('img');
    img.src = `${devBackendURL}${devBackendPort}/${product.images[0]}`|| 'https://via.placeholder.com/300'; // Fallback si no hay imagen
    img.alt = `Imagen de ${product.name}`;
    img.loading = "lazy"; // Performance: carga diferida de imágenes

    // Título
    const title = document.createElement('h3');
    title.textContent = product.brand + ' ' + product.lineUp;

    // Descripcion
    const description = document.createElement('p');
    description.classList.add('description');
    description.textContent = product.description;

    // Precio
    const price = document.createElement('p');
    price.classList.add('price');


    price.textContent = formatCurrency(product.price);

    
    // ==========================================
    // NUEVA LÓGICA: Selector de Cantidad
    // ==========================================
    
    const quantityContainer = document.createElement('div');
    quantityContainer.classList.add('quantity-controls');

    // Botón Menos (-)
    const minusBtn = document.createElement('button');
    minusBtn.textContent = '-';
    minusBtn.classList.add('qty-btn', 'minus');

    // Input de Cantidad
    const qtyInput = document.createElement('input');
    qtyInput.type = 'number';
    qtyInput.value = 1; 
    qtyInput.min = 1;
    qtyInput.max = product.stock; // Límite basado en el stock real
    qtyInput.classList.add('qty-input');

    // Botón Más (+)
    const plusBtn = document.createElement('button');
    plusBtn.textContent = '+';
    plusBtn.classList.add('qty-btn', 'plus');

    // Lógica del botón (-)
    minusBtn.addEventListener('click', () => {
        let currentValue = parseInt(qtyInput.value) || 1;
        if (currentValue > 1) {
            qtyInput.value = currentValue - 1;
        }
    });

    // Lógica del botón (+) con validación de Stock
    plusBtn.addEventListener('click', () => {
        let currentValue = parseInt(qtyInput.value) || 1;
        if (currentValue < product.stock) {
            qtyInput.value = currentValue + 1;
        } else {
            // Opcional: Feedback visual si intenta superar el stock
            qtyInput.classList.add('error-shake'); 
            setTimeout(() => qtyInput.classList.remove('error-shake'), 500);
        }
    });

    // Validación manual (si el usuario escribe en el input)
    qtyInput.addEventListener('change', () => {
        let currentValue = parseInt(qtyInput.value);
        
        // Si es menor a 1 o no es un número, volver a 1
        if (isNaN(currentValue) || currentValue < 1) {
            qtyInput.value = 1;
        } 
        // Si supera el stock, setear al máximo disponible
        else if (currentValue > product.stock) {
            qtyInput.value = product.stock;
            alert(`Solo quedan ${product.stock} unidades disponibles.`);
        }
    });

    // Agregar elementos al contenedor de cantidad
    quantityContainer.append(minusBtn, qtyInput, plusBtn);

    // ==========================================
    // FIN NUEVA LÓGICA
    // ==========================================

    const addToCartBtn = document.createElement('button');
    addToCartBtn.textContent = 'Agregar al carrito';
    addToCartBtn.classList.add('add-to-cart-btn');

    // Modificamos el evento para capturar la cantidad seleccionada actual
    addToCartBtn.addEventListener('click', () => {
        const quantityToAdd = parseInt(qtyInput.value);
        console.log(`Agregando ${quantityToAdd} unidad(es) de ${product.name} al carrito.`);
        
        // Aquí llamarías a tu función real, ej:
        // addToCart(product.id, quantityToAdd);
    });


    // Ensamblaje
    card.append(img, title, description, price, quantityContainer, addToCartBtn);    
    return card;
}

// Utilidad para formatear dinero (Argentina en este caso)
function formatCurrency(value) {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 0
    }).format(value);
}