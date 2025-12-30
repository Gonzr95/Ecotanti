document.addEventListener('DOMContentLoaded', () => {
    loadCart();
});

function loadCart(){
    const cart = localStorage.getItem('cart');
    if(cart){
        try{
            const products = JSON.parse(cart);
            products.forEach(product => {
                createProductCard(product);
            });
        }catch(error){
            console.error("Error al cargar el carrito:", error);
        }
    }
}

function createProductCard(product){
    const checkoutGrid = document.getElementById('checkout-grid');

    const productCard = document.createElement('div');
    productCard.classList.add('product-card');

    const imgContainer = document.createElement('div');
    imgContainer.classList.add('img-container');

    const img = document.createElement('img');
    img.src = product.product.image || 'https://via.placeholder.com/300'; // Fallback si no hay imagen
    img.alt = `Imagen de ${product.product.brand} ${product.product.lineUp}`;
    img.loading = "lazy"; // Performance: carga diferida de imágenes
    imgContainer.appendChild(img);

    const productDetails = document.createElement('div');
    productDetails.classList.add('product-details');
    
    const title = document.createElement('h3');
    title.textContent = product.product.brand + ' - ' + product.product.lineUp;

    const price = document.createElement('p');
    price.classList.add('price');
    price.textContent = formatCurrency(product.product.price);


    const quantityContainer = document.createElement('div');
    quantityContainer.classList.add('quantity-controls');

    // Botón Menos (-)
    const minusBtn = document.createElement('button');
    minusBtn.textContent = '-';
    minusBtn.classList.add('qty-btn', 'minus');

    // Input de Cantidad
    const qtyInput = document.createElement('input');
    qtyInput.type = 'number';
    qtyInput.value = product.quantity; 
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
        if (currentValue < product.product.stock) {
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
    quantityContainer.append(
        minusBtn,
        qtyInput,
        plusBtn
    );




    productDetails.append(
        title,
        quantityContainer,
        price
    );
    productCard.append(
        imgContainer, 
        productDetails
    );
    checkoutGrid.appendChild(productCard);

}


function formatCurrency(value) {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 0
    }).format(value);
}