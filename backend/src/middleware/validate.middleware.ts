import { AnyZodObject } from "zod";
import { NextFunction, Request, Response } from "express";

export function validate(schema: AnyZodObject) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params
    });

    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        issues: result.error.flatten()
      });
    }

    return next();
  };
}

