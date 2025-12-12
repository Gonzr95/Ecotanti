
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
        
        console.log(categories);
        // B. Limpiar el mensaje de "Cargando..."
        menuContainer.innerHTML = '';


        for(i= 0; i < categories.length; i++)
        {
            const button = document.createElement('button');

            button.textContent = categories[i]
            button.classList.add('category-btn');
            button.addEventListener('click', () => {
                const categoryName = categories[i];
    
                // 1. Cambiar la URL visualmente sin recargar
                // Esto pondrá en tu navegador: http://tusitio.com/?category=Farol
                const newUrl = new URL(window.location);
                newUrl.searchParams.set('category', categoryName);
                window.history.pushState({}, '', newUrl);

                // 2. Llamar a la función que carga los productos con el filtro
                loadProducts(categoryName);
            });
            menuContainer.appendChild(button);
        }


    } catch (error) {
        console.error(error);
        menuContainer.innerHTML = '<p class="error">Lo sentimos, no se pudieron cargar las categorías.</p>';
    }
}