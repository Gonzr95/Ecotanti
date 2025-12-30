import { Cart } from "./cart.js";
const MyCart = new Cart();
const orderSummary =  document.getElementById('order-summary');

document.addEventListener('DOMContentLoaded', () => {
    loadCart();
});

function loadCart(){
    if(MyCart){
        MyCart.products.forEach(product => {
            createProductCard(product);
        });
    }
    else{
        console.error("No se pudo cargar el carrito.");
    }
}

function createProductCard(product){

    const productCard = document.createElement('div');
    productCard.classList.add('product-card');

    //--------- Imagen---------
    const imgContainer = document.createElement('div');
    imgContainer.classList.add('img-container');

    const img = document.createElement('img');
    img.src = product.product.image || 'https://via.placeholder.com/300'; // Fallback si no hay imagen
    img.alt = `Imagen de ${product.product.brand} ${product.product.lineUp}`;
    img.loading = "lazy"; // Performance: carga diferida de imágenes
    imgContainer.appendChild(img);


    //--------- Resumen del producto---------
    const productDetails = document.createElement('div');
    productDetails.classList.add('product-details');
    
    const title = document.createElement('h3');
    title.textContent = product.product.brand + ' - ' + product.product.lineUp;


    //--------- cantidad del producto---------
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
    qtyInput.max = product.product.stock;
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
        subtotal.textContent = `Subtotal: ${formatCurrency(product.product.price * qtyInput.value)}`;
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
                subtotal.textContent = `Subtotal: ${formatCurrency(product.product.price * qtyInput.value)}`;
    });

        const price = document.createElement('p');
    price.classList.add('price');
    price.textContent = formatCurrency(product.product.price);

    const subtotal = document.createElement('p');
    subtotal.classList.add('subtotal');
    subtotal.textContent = `Subtotal: ${formatCurrency(product.product.price * qtyInput.value)}`;
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
        // Actualizar subtotal al cambiar cantidad
        subtotal.textContent = `Subtotal: ${formatCurrency(product.product.price * qtyInput.value)}`;

    });
    quantityContainer.append(
        minusBtn,
        qtyInput,
        plusBtn
    );



    //-------------- delete button -----------------
    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-btn');
    deleteBtn.innerHTML = '&times;'; // Símbolo de "X"

    deleteBtn.addEventListener('click', () => {
        orderSummary.removeChild(productCard);
        MyCart.removeProduct(product.id);
        alert(`Producto ${product.product.brand} - ${product.product.lineUp} eliminado del carrito.`);

    });


    productDetails.append(
        title,
        quantityContainer,
        price,
        subtotal,
        deleteBtn
    );
    productCard.append(
        imgContainer, 
        productDetails
    );
    orderSummary.appendChild(productCard);
    
}


function formatCurrency(value) {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 0
    }).format(value);
}