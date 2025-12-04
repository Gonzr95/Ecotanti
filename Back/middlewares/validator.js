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

    // 3. reemplazo datos validados por si vienen campos extra que no son deseados
    req.body = result.data;

    next();
};

