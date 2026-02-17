const { ZodError } = require('zod');

/**
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 * @typedef {import('express').NextFunction} NextFunction
 * @typedef {import('zod').ZodSchema} ZodSchema
 */

/**
 * @param {ZodSchema} schema
 * @returns {(req: Request, res: Response, next: NextFunction) => Promise<void>}
 */
const validate = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(error);
      } else {
        next(error);
      }
    }
  };
};

module.exports = { validate };
