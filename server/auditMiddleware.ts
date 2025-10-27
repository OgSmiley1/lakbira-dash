import { createAuditLog } from './db';

export interface AuditContext {
  userId: string;
  userName?: string;
  ipAddress?: string;
  userAgent?: string;
}

export async function logAdminAction(
  context: AuditContext,
  action: string,
  entityType: string,
  entityId?: string,
  oldValues?: Record<string, any>,
  newValues?: Record<string, any>,
  metadata?: Record<string, any>
): Promise<void> {
  const changes: Record<string, any> = {};

  if (oldValues && newValues) {
    Object.keys(newValues).forEach(key => {
      if (oldValues[key] !== newValues[key]) {
        changes[key] = {
          from: oldValues[key],
          to: newValues[key],
        };
      }
    });
  }

  await createAuditLog({
    userId: context.userId,
    userName: context.userName,
    action,
    entityType,
    entityId,
    changes: Object.keys(changes).length > 0 ? changes : undefined,
    oldValues,
    newValues,
    ipAddress: context.ipAddress,
    userAgent: context.userAgent,
    status: 'success',
    metadata,
  });
}

export async function logAdminError(
  context: AuditContext,
  action: string,
  entityType: string,
  error: Error,
  entityId?: string,
  metadata?: Record<string, any>
): Promise<void> {
  await createAuditLog({
    userId: context.userId,
    userName: context.userName,
    action,
    entityType,
    entityId,
    ipAddress: context.ipAddress,
    userAgent: context.userAgent,
    status: 'error',
    errorMessage: error.message,
    metadata: {
      ...metadata,
      errorStack: error.stack,
    },
  });
}

export function extractAuditContext(req: any, user: any): AuditContext {
  return {
    userId: user?.id || 'unknown',
    userName: user?.name || 'Unknown User',
    ipAddress: req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown',
    userAgent: req.headers['user-agent'] || 'unknown',
  };
}

