import { sqliteTable, text, integer, primaryKey } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// ── Guest (anti-spam IP tracking) ────────────────────────────────────────────
export const guest = sqliteTable("guest", {
  ip: text("ip").primaryKey(),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s','now'))`),
});

// ── University ───────────────────────────────────────────────────────────────
export const university = sqliteTable("university", {
  universityId: text("university_id").primaryKey(),
  slug: text("slug").unique().notNull(),
  name: text("name").notNull(),
  status: text("status").default("pending"), // pending | active | rejected
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s','now'))`),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
});

// ── Chapter ──────────────────────────────────────────────────────────────────
export const chapter = sqliteTable("chapter", {
  chapterId: text("chapter_id").primaryKey(),
  universityId: text("university_id").references(() => university.universityId),
  slug: text("slug").unique().notNull(),
  name: text("name").notNull(),
  slogan: text("slogan"),
  social: text("social"), // JSON: {"instagram": "https://..."}
  type: text("type").notNull(), // university | alumni | majlis | national
  createdBy: text("created_by").references(() => user.userId),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s','now'))`),
});

// ── User ─────────────────────────────────────────────────────────────────────
export const user = sqliteTable("user", {
  userId: text("user_id").primaryKey(),
  username: text("username").unique().notNull(),
  name: text("name"),
  email: text("email").unique().notNull(),
  phone: text("phone"),
  password: text("password").notNull(),
  avatar: text("avatar"), // Vercel Blob URL
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s','now'))`),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
});

// ── Member ───────────────────────────────────────────────────────────────────
export const member = sqliteTable("member", {
  memberId: text("member_id").primaryKey(),
  userId: text("user_id").unique().references(() => user.userId),
  amountPaid: integer("amount_paid").notNull(),
  paidAt: integer("paid_at", { mode: "timestamp" }).notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s','now'))`),
});

// ── Role ─────────────────────────────────────────────────────────────────────
export const role = sqliteTable("role", {
  roleId: text("role_id").primaryKey(),
  chapterId: text("chapter_id").references(() => chapter.chapterId),
  name: text("name").notNull(),
  description: text("description"),
  createdBy: text("created_by").references(() => user.userId),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s','now'))`),
});

// ── Permission ───────────────────────────────────────────────────────────────
export const permission = sqliteTable("permission", {
  permissionId: text("permission_id").primaryKey(),
  name: text("name").unique().notNull(),
  description: text("description"),
});

// ── Role-Permission junction ─────────────────────────────────────────────────
export const rolePermission = sqliteTable("rolepermission", {
  roleId: text("role_id").references(() => role.roleId),
  permissionId: text("permission_id").references(() => permission.permissionId),
}, (t) => ({
  pk: primaryKey({ columns: [t.roleId, t.permissionId] }),
}));

// ── Role Record (user-role assignment) ───────────────────────────────────────
export const roleRecord = sqliteTable("rolerecord", {
  recordId: text("record_id").primaryKey(),
  userId: text("user_id").references(() => user.userId),
  roleId: text("role_id").references(() => role.roleId),
  startDate: integer("start_date", { mode: "timestamp" }).notNull(),
  endDate: integer("end_date", { mode: "timestamp" }),
  approvedBy: text("approved_by").references(() => user.userId),
  approvedAt: integer("approved_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s','now'))`),
});

// ── Campaign ─────────────────────────────────────────────────────────────────
export const campaign = sqliteTable("campaign", {
  campaignId: text("campaign_id").primaryKey(),
  chapterId: text("chapter_id").references(() => chapter.chapterId),
  slug: text("slug").notNull(),
  name: text("name").notNull(),
  summary: text("summary"),
  description: text("description"), // Tiptap JSON
  demands: text("demands"), // JSON array of strings
  memorandum: text("memorandum"), // URL to Google Docs/PDF
  createdBy: text("created_by").references(() => user.userId),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s','now'))`),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
});

// ── Event ────────────────────────────────────────────────────────────────────
export const event = sqliteTable("event", {
  eventId: text("event_id").primaryKey(),
  chapterId: text("chapter_id").references(() => chapter.chapterId),
  slug: text("slug").notNull(),
  name: text("name").notNull(),
  description: text("description"), // Tiptap JSON
  location: text("location"),
  date: text("date"),
  time: text("time"),
  type: text("type"),
  createdBy: text("created_by").references(() => user.userId),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s','now'))`),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
});

// ── Media ────────────────────────────────────────────────────────────────────
export const media = sqliteTable("media", {
  mediaId: text("media_id").primaryKey(),
  slug: text("slug").notNull(),
  name: text("name"), // extracted from OpenGraph
  link: text("link").notNull(),
  image: text("image"), // extracted og:image
  description: text("description"), // extracted og:description
  chapterId: text("chapter_id").references(() => chapter.chapterId),
  author: text("author"), // extracted og:site_name
  date: text("date"),
  type: text("type"), // social | article | video | audio
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s','now'))`),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
});

// ── Product ──────────────────────────────────────────────────────────────────
export const product = sqliteTable("product", {
  productId: text("product_id").primaryKey(),
  chapterId: text("chapter_id").references(() => chapter.chapterId),
  slug: text("slug").notNull(),
  name: text("name").notNull(),
  price: text("price"),
  quantity: integer("quantity").default(0),
  type: text("type"),
  availability: text("availability"), // available | limited | out_of_stock
  createdBy: text("created_by").references(() => user.userId),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s','now'))`),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
});

// ── Product Image (multiple images per product) ─────────────────────────────
export const productImage = sqliteTable("productimage", {
  imageId: text("image_id").primaryKey(),
  productId: text("product_id").references(() => product.productId),
  url: text("url").notNull(),
  alt: text("alt"),
  sortOrder: integer("sort_order").default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s','now'))`),
});

// ── Order ────────────────────────────────────────────────────────────────────
export const order = sqliteTable("order", {
  orderId: text("order_id").primaryKey(),
  userId: text("user_id").references(() => user.userId),
  email: text("email"),
  phone: text("phone"),
  address: text("address"),
  total: text("total"),
  currency: text("currency").default("MYR"),
  method: text("method"), // toyyibpay
  status: text("status").default("pending"), // pending | paid | shipped | completed | cancelled | refunded
  trackingUrl: text("tracking_url"),
  trackingCode: text("tracking_code"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s','now'))`),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
});

// ── Order Item ───────────────────────────────────────────────────────────────
export const orderItem = sqliteTable("orderitem", {
  orderItemId: text("orderitem_id").primaryKey(),
  orderId: text("order_id").references(() => order.orderId),
  productId: text("product_id").references(() => product.productId),
  quantity: integer("quantity").default(1),
  unitPrice: text("unit_price"),
});

// ── Nomination (PRK) ────────────────────────────────────────────────────────
export const nomination = sqliteTable("nomination", {
  nominationId: text("nomination_id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone"),
  email: text("email"),
  chapterId: text("chapter_id").references(() => chapter.chapterId),
  justification: text("justification"),
  status: text("status").default("pending"), // pending | reviewing | confirmed | declined | withdrawn
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s','now'))`),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
});

// ── Nomination Note ──────────────────────────────────────────────────────────
export const nominationNote = sqliteTable("nominationnote", {
  noteId: text("note_id").primaryKey(),
  nominationId: text("nomination_id").references(() => nomination.nominationId),
  userId: text("user_id").references(() => user.userId),
  contactStatus: text("contact_status"), // not_contacted | contacted | confirmed | declined
  verdict: text("verdict"),
  comment: text("comment"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s','now'))`),
});

// ── Contact ──────────────────────────────────────────────────────────────────
export const contact = sqliteTable("contact", {
  contactId: text("contact_id").primaryKey(),
  name: text("name"),
  email: text("email"),
  phone: text("phone"),
  subject: text("subject"),
  message: text("message"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s','now'))`),
});

// ── Config ───────────────────────────────────────────────────────────────────
export const config = sqliteTable("config", {
  key: text("key").primaryKey(),
  value: text("value"),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
});

// ── Audit Log ────────────────────────────────────────────────────────────────
export const auditLog = sqliteTable("auditlog", {
  logId: text("log_id").primaryKey(),
  userId: text("user_id").references(() => user.userId),
  action: text("action").notNull(),
  targetType: text("target_type"),
  targetId: text("target_id"),
  details: text("details"), // JSON
  ip: text("ip"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s','now'))`),
});

// ── Reset Token (password reset + email verification) ────────────────────────
export const resetToken = sqliteTable("resettoken", {
  tokenId: text("token_id").primaryKey(),
  userId: text("user_id").references(() => user.userId),
  token: text("token").unique().notNull(),
  type: text("type").default("password_reset"), // password_reset | email_verification
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  used: integer("used", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s','now'))`),
});
