import { Context, Next } from "hono";

/**
 * Request logging middleware
 */
export async function logger(c: Context, next: Next) {
  const start = Date.now();
  const method = c.req.method;
  const path = c.req.path;

  await next();

  const end = Date.now();
  const duration = end - start;
  const status = c.res.status;

  console.log(`${method} ${path} ${status} ${duration}ms`);
}
