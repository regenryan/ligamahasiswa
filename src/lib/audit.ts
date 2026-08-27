import { db } from "./db";
import { auditLog } from "./schema";
import { nanoid } from "./nanoid";

interface AuditEntry {
  userId?: string | null;
  action: string;
  targetType?: string;
  targetId?: string;
  details?: Record<string, unknown>;
  ip?: string;
}

export async function logAction(entry: AuditEntry): Promise<void> {
  try {
    await db.insert(auditLog).values({
      logId: nanoid(),
      userId: entry.userId ?? null,
      action: entry.action,
      targetType: entry.targetType ?? null,
      targetId: entry.targetId ?? null,
      details: entry.details ? JSON.stringify(entry.details) : null,
      ip: entry.ip ?? null,
    });
  } catch (error) {
    console.error("[audit] failed to log:", error);
  }
}
