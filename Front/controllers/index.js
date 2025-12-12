// ************ CLIENTE ************ //
const btnLogin = document.getElementById("login-btn");
btnLogin.addEventListener("click", () => {

    const fieldsToValidate = [
        { inputId: 'name-input', errorId: 'name-input-error', errorMessage: 'Ingrese su nombre' },
        { inputId: 'lastName-input', errorId: 'lastName-input-error', errorMessage: 'Ingrese su apellido' }
    ];

    if( checkMultipleInputs(fieldsToValidate) ){
        saveCustomerData();
        window.location.href = './inventory.html'
    }   
    
});

/**
 * Verifica múltiples campos de entrada según una configuración provista.
 * * @param {Array<Object>} fieldsToValidate - Un array de objetos, donde cada objeto 
 * debe tener { inputId, errorId, errorMessage }.
 * @returns {boolean} Retorna true si TODOS los campos están completos, false si hay errores.
 */
function checkMultipleInputs(fieldsToValidate) {

    let allInputsValid = true;

    fieldsToValidate.forEach(field => {
        const inputElement = document.getElementById(field.inputId);
        const errorElement = document.getElementById(field.errorId);

        // Si no se encuentra el elemento, pasamos al siguiente (guardrail)
        if (!inputElement || !errorElement) {
            console.error(`Error: No se encontró el elemento con ID: ${field.inputId} o ${field.errorId}`);
            return; 
        }

        if (inputElement.value.trim().length === 0) {
            errorElement.textContent = field.errorMessage;
            allInputsValid = false; 
        } else {
            errorElement.textContent = ''; 
        }
    });

    return allInputsValid;
}

/**
 * Guarda los valores de nombre y apellido del cliente en el Local Storage.
 */
function saveCustomerData() {
    const nameInput = document.getElementById('name-input');
    const lastNameInput = document.getElementById('lastName-input');

    const name = nameInput.value.trim();
    const lastName = lastNameInput.value.trim();
    
    if (!name || !lastName) {
        console.warn('Advertencia: No se guardaron los datos porque uno o ambos campos están vacíos.');
        return; 
    }

    const customerData = {
        name: name,
        lastName: lastName,
        savedAt: new Date().toISOString()
    };

    // localStorage solo guarda strings, por lo que debemos convertir el objeto a JSON string
    localStorage.setItem('customerData', JSON.stringify(customerData));

    console.log('Datos del cliente guardados en Local Storage:', customerData);
}


// ************ ADMINISTRADOR ************ //
