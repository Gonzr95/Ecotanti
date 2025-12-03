export const validateSchema = (schema) => (req, res, next) => {
    const result = schema.safeParse(req. body);

    if (!result.success) {

        // --- DEBUGGING ---
        /*
        console.log("Validation Failed!");
        console.log("Result object:", result); 
        console.log("Error object:", result.error); 
        */
        // -----------------
        // result.error contiene el ZodError con los detalles y stack trace 
    
        const formattedErrors = result.error.issues.map(issue => ({
            field: issue.path.join("."),
            message: issue.message
        }));

        return res.status(400).json({
            message: "Error de validación",
            errors: formattedErrors
        });





        /* funciona pero no formato lindo
        return res.status(400).json({
            message: "Error de validación",
            errors: result.error.format()

        });
*/
    }

    // 3. Opcional pero recomendado:
    // Reemplazamos req.body con los datos ya "limpios" y tipeados que devuelve Zod.
    // Esto elimina cualquier campo extra que el usuario haya enviado y no esté en el esquema.
    req.body = result.data;

    next();
};

