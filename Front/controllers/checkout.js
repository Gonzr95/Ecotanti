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
        calculateTotal();
    }
    else{
        console.error("No se pudo cargar el carrito.");
    }
}

function createProductCard(product){

    const productCard = document.createElement('div');
    productCard.classList.add('product-card');
    //--------- Imagen del producto---------
    const imgContainer = createProductImage(product);


    //--------- Resumen del producto---------
    const productDetails = document.createElement('div');
    productDetails.classList.add('product-details');
    const title = createProductTitle(product);


    //--------- Cantidad del producto---------
    const quantityContainer = document.createElement('div');
    quantityContainer.classList.add('quantity-controls');
    const qtyInput = createQtyInput(product);
    const subtotal = createSubtotalElement(product, qtyInput);
    const minusBtn = createSubtractButton(product, qtyInput, subtotal);
    const plusBtn = createAddButton(product, qtyInput, subtotal);
    const price = createPriceElement(product);


    // Validación manual (si el usuario escribe en el input)
    // debe quedar por fuera de createElement porque necesita acceso a subtotal
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
    const deleteBtn = createDeleteButton(product, productCard);


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


function createProductImage(product){
    const imgContainer = document.createElement('div');
    imgContainer.classList.add('img-container');

    const img = document.createElement('img');
    img.src = product.product.image || 'https://via.placeholder.com/300'; // Fallback si no hay imagen
    img.alt = `Imagen de ${product.product.brand} ${product.product.lineUp}`;
    img.loading = "lazy"; // Performance: carga diferida de imágenes
    imgContainer.appendChild(img);

    return imgContainer;
}

function createProductTitle(product){
    const title = document.createElement('h3');
    title.textContent = product.product.brand + ' - ' + product.product.lineUp;

    return title;
}

function createQuantityControls(product) {
    const quantityContainer = document.createElement('div');
    quantityContainer.classList.add('quantity-controls');

    // Botón Menos (-)
    const minusBtn = document.createElement('button');
    minusBtn.textContent = '-';
    minusBtn.classList.add('qty-btn', 'minus');

    // Botón Más (+)
    const plusBtn = document.createElement('button');
    plusBtn.textContent = '+';
    plusBtn.classList.add('qty-btn', 'plus');

    // Input de Cantidad
    const qtyInput = document.createElement('input');
    qtyInput.type = 'number';
    qtyInput.value = product.quantity; 
    qtyInput.min = 1;
    qtyInput.max = product.product.stock;
    qtyInput.classList.add('qty-input');



}

function createAddButton(product, qtyInput, subtotal) {
    
    // Botón Más (+)
    const plusBtn = document.createElement('button');
    plusBtn.textContent = '+';
    plusBtn.classList.add('qty-btn', 'plus');

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

    return plusBtn;
}

function createSubtractButton(product, qtyInput, subtotal) {
    const minusBtn = document.createElement('button');
    minusBtn.textContent = '-';
    minusBtn.classList.add('qty-btn', 'minus');

    // Lógica del botón (-)
    minusBtn.addEventListener('click', () => {
        let currentValue = parseInt(qtyInput.value) || 1;
        if (currentValue > 1) {
            qtyInput.value = currentValue - 1;
        }
        subtotal.textContent = `Subtotal: ${formatCurrency(product.product.price * qtyInput.value)}`;
    });

    return minusBtn;
}

function createSubtotalElement(product, qtyInput) {
    const subtotal = document.createElement('p');
    subtotal.classList.add('subtotal');
    subtotal.textContent = `Subtotal: ${formatCurrency(product.product.price * qtyInput.value)}`;

    return subtotal;
}

function createPriceElement(product) {
    const price = document.createElement('p');
    price.classList.add('price');
    price.textContent = formatCurrency(product.product.price);

    return price;

}

function createQtyInput(product) {
    const qtyInput = document.createElement('input');
    qtyInput.type = 'number';
    qtyInput.value = product.quantity; 
    qtyInput.min = 1;
    qtyInput.max = product.product.stock;
    qtyInput.classList.add('qty-input');

    return qtyInput;
}

function createDeleteButton(product, productCard) {
    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-btn');
    deleteBtn.innerHTML = '&times;'; // Símbolo de "X"

    deleteBtn.addEventListener('click', () => {
        orderSummary.removeChild(productCard);
        MyCart.removeProduct(product.id);
        alert(`Producto ${product.product.brand} - ${product.product.lineUp} eliminado del carrito.`);

    });

    return deleteBtn;
}

function calculateTotal() {
    let total = 0;

    MyCart.products.forEach(product => {
        total += product.product.price * product.quantity;
    });
    
    
    const paymentSummary = document.getElementById('payment-summary');
    const producstQty = document.createElement('p');
    producstQty.textContent = `Cantidad de productos: ( ${MyCart.products.length} )`;

    const totalPayment = document.createElement('p');
    totalPayment.textContent = `Total a pagar: ${formatCurrency(total)}`;

    paymentSummary.append(
        producstQty,
        totalPayment
    );
}

