export const validate = (schema) => (req, res, next) => {
    try {
        const { body, query, params } = req;
        schema.parse({ body, query, params });
        next();
    } catch (error) {
        return res.status(400).json({
            message: "Validation Error",
            errors: error.errors,
        });
    }
};
