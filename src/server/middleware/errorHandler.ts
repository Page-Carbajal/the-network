import { Context } from "hono";
import { HTTPException } from "hono/http-exception";

/**
 * Error handler middleware for Hono
 */
export function errorHandler(error: Error, c: Context) {
  console.error("Error:", error);

  if (error instanceof HTTPException) {
    return c.json(
      {
        error: error.message,
        status: error.status,
      },
      error.status
    );
  }

  // Handle validation errors
  if (error.name === "ZodError") {
    return c.json(
      {
        error: "Validation error",
        details: (error as any).issues,
      },
      400
    );
  }

  // Default error response
  return c.json(
    {
      error: "Internal server error",
      message: error.message,
    },
    500
  );
}
