
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
        
        const response = await fetch('http://localhost:3001/products/categories');
        if (!response.ok) throw new Error('Error al conectar con el servidor');
        const categories = await response.json();
        
        // B. Limpiar el mensaje de "Cargando..."
        menuContainer.innerHTML = '';


        for(i= 0; i < categories.length; i++)
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
        const response = await fetch(`http://localhost:3001/products?category=${encodeURIComponent(category)}`);
        
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

    // Imagen (Asumiendo que tu backend devuelve una propiedad 'imageUrl' o similar)
    // Si usas Cloudflare, aquí vendría la URL optimizada.
    const img = document.createElement('img');
    img.src = product.imageUrl || 'https://via.placeholder.com/300'; // Fallback si no hay imagen
    img.alt = `Imagen de ${product.name}`;
    img.loading = "lazy"; // Performance: carga diferida de imágenes

    // Título
    const title = document.createElement('h3');
    title.textContent = product.name;

    // Precio
    const price = document.createElement('p');
    price.classList.add('price');
    // Buena práctica: Usar Intl.NumberFormat para monedas
    price.textContent = formatCurrency(product.price);

    // Botón de acción (opcional)
    const button = document.createElement('button');
    button.textContent = 'Ver detalle';
    button.classList.add('btn-detail');
    button.onclick = () => console.log(`Ver producto ID: ${product.id}`);

    // Ensamblaje
    card.append(img, title, price, button);
    
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