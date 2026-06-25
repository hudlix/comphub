import type { Request } from 'express';

/**
 * Stub auth. Resolves a user id from the `x-user-id` header, defaulting to a demo user.
 * This is the seam where SSO/RBAC slots in later as an enterprise concern — kept out of
 * this public repo. No real identity provider here.
 */
export function currentUserId(req: Request): string {
  const header = req.header('x-user-id');
  return header && header.trim() ? header.trim() : 'demo-user';
}
