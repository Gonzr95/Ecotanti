import { Cart } from "./cart.js";
const MyCart = new Cart();
const orderSummary =  document.getElementById('order-summary');
import { devBackendURL, devBackendPort } from "../configs/config.js";

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
        totalPayment,
    );

    if(MyCart.products.length !== 0){
        const finishPurchaseBtn = createFinishPurchaseButton();
        paymentSummary.append(
            finishPurchaseBtn
        );
    }


}

function createFinishPurchaseButton() {
    const finishPurchaseBtn = document.createElement('button');
    finishPurchaseBtn.textContent = 'Generar orden de compra';
    finishPurchaseBtn.classList.add('finish-purchase-btn');

    // Hacemos el callback del listener 'async' para poder esperar a que termine la compra
    finishPurchaseBtn.addEventListener('click', async (e) => {
        // Opcional: Deshabilitar botón para evitar doble click
        finishPurchaseBtn.disabled = true; 
        finishPurchaseBtn.textContent = "Procesando...";

        // LLAMAMOS A LA FUNCIÓN Y ESPERAMOS
        await finishPurchase();

        // Reactivamos el botón por si hubo error
        finishPurchaseBtn.disabled = false;
        finishPurchaseBtn.textContent = 'Generar orden de compra';
    });
    
    return finishPurchaseBtn;
}

async function finishPurchase() {
    // 1. LEER DATOS (Antes de borrar nada)
    const cartRaw = localStorage.getItem('cart');
    const customerRaw = localStorage.getItem('customerData');

    if (!cartRaw || !customerRaw) {
        alert("Faltan datos para procesar la compra");
        return;
    }

    const orderData = {
        customerData: JSON.parse(customerRaw),
        cart: JSON.parse(cartRaw),
    };

    console.log("Datos de la orden a enviar al backend:", orderData);


    try {
        // 2. HACER EL FETCH
        const response = await fetch(`${devBackendURL}${devBackendPort}/tickets`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });

        const result = await response.json();

        if (!response.ok) {
            // Si el backend devuelve error (ej: 400 o 500), lanzamos error para caer en el catch
            throw new Error(result.message || 'Error en el servidor');
        }

        // 3. SOLO SI TODO SALIÓ BIEN: Limpiar y Redirigir
        console.log('Orden generada:', result);
        const { ticketId } = result;
        await downloadTicketPDF(ticketId);

        
        // 4. CONFIRMACIÓN DE ÉXITO (SweetAlert)
        // Cerramos el loader anterior y mostramos el éxito
        await Swal.fire({
            icon: 'success',
            title: '¡Compra Exitosa!',
            text: 'Su pedido ha sido procesado, descargue el comprobante y envielo a su vendedor',
            confirmButtonText: 'Volver al inicio',
            confirmButtonColor: '#3085d6', // Puedes cambiar el color del botón aquí
            allowOutsideClick: false // Obliga al usuario a dar click en el botón
        }).then((result) => {
            /* IMPORTANTE: 
               Todo lo que sucede después del click del usuario va AQUÍ.
            */
            if (result.isConfirmed) {
                // Limpieza
                localStorage.removeItem('cart');
                localStorage.removeItem('customerData'); 
                
                // Redirección
                window.location.href = 'index.html'; 
            }
        });
        
        localStorage.removeItem('cart');
        localStorage.removeItem('customerData'); // Opcional, quizás quieras mantener al usuario logueado
        
        // Y finalmente nos vamos
        window.location.href = 'index.html'; 

    } catch (error) {
        console.error('Error:', error);
        alert(`Hubo un error: ${error.message}. Por favor intente nuevamente.`);
        // NO borramos el carrito ni redirigimos, para que el usuario pueda intentar de nuevo
    }
}

async function downloadTicketPDF(ticketId) {
    try {
        // Hacemos el fetch al endpoint del PDF
        const response = await fetch(`${devBackendURL}${devBackendPort}/tickets/${ticketId}/pdf`);
        
        if (!response.ok) throw new Error("No se pudo generar el PDF");

        // Convertimos la respuesta en un BLOB (Binary Large Object)
        const blob = await response.blob();

        // Creamos una URL temporal para ese blob
        const url = window.URL.createObjectURL(blob);

        // Creamos un link invisible en el DOM
        const a = document.createElement('a');
        a.href = url;
        a.download = `comprobante-${ticketId}.pdf`; // Nombre del archivo que bajará el usuario
        document.body.appendChild(a);
        
        // Simulamos el click
        a.click();

        // Limpiamos
        a.remove();
        window.URL.revokeObjectURL(url);

    } catch (error) {
        console.error("Error descargando PDF:", error);
        alert("La compra fue exitosa, pero hubo un error descargando el comprobante.");
    }
}