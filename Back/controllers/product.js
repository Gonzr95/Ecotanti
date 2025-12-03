


export async function register(req, res) {
    try {
        const { productType, brand, lineUp, description, stock, price, isActive } = req.body;

        const newProduct = await Product.create({
            productType,
            brand,
            lineUp,
            description,
            stock,
            price,
            isActive
        });
    }