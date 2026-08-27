import { eq, desc } from "drizzle-orm";
import { db } from "./db";
import * as s from "./schema";

// ── Application types (what components expect) ───────────────────────────────

export interface CampaignData {
  id: string;
  chapterSlug: string;
  chapterId: string | null;
  slug: string;
  name: string;
  summary: string;
  description: string;
  demands: string[];
  memorandum: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventData {
  id: string;
  chapterSlug: string;
  chapterId: string | null;
  slug: string;
  name: string;
  description: string;
  location: string;
  date: string;
  time: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

export interface MediaData {
  id: string;
  slug: string;
  name: string;
  link: string;
  image: string;
  description: string;
  chapterId: string | null;
  author: string;
  date: string;
  type: string;
  createdAt: string;
}

export interface ProductData {
  id: string;
  chapterSlug: string;
  chapterId: string | null;
  slug: string;
  name: string;
  price: string;
  image: string;
  images: string[];
  quantity: number;
  type: string;
  availability: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderData {
  id: string;
  userId: string | null;
  email: string;
  phone: string;
  address: string;
  total: string;
  currency: string;
  method: string;
  status: string;
  trackingUrl: string | null;
  trackingCode: string | null;
  createdAt: string;
  updatedAt: string;
}

// ── DB query helpers ─────────────────────────────────────────────────────────

export async function dbGetCampaigns(): Promise<CampaignData[]> {
  const rows = await db.select().from(s.campaign).orderBy(desc(s.campaign.createdAt));
  return rows.map((r) => ({
    id: r.campaignId,
    chapterSlug: "",
    chapterId: r.chapterId,
    slug: r.slug,
    name: r.name,
    summary: r.summary ?? "",
    description: r.description ?? "",
    demands: r.demands ? JSON.parse(r.demands) : [],
    memorandum: r.memorandum ?? "",
    createdAt: r.createdAt ? String(r.createdAt) : "",
    updatedAt: r.updatedAt ? String(r.updatedAt) : "",
  }));
}

export async function dbGetCampaignBySlug(slug: string): Promise<CampaignData | null> {
  const rows = await db.select().from(s.campaign).where(eq(s.campaign.slug, slug));
  const r = rows[0];
  if (!r) return null;
  return {
    id: r.campaignId,
    chapterSlug: "",
    chapterId: r.chapterId,
    slug: r.slug,
    name: r.name,
    summary: r.summary ?? "",
    description: r.description ?? "",
    demands: r.demands ? JSON.parse(r.demands) : [],
    memorandum: r.memorandum ?? "",
    createdAt: r.createdAt ? String(r.createdAt) : "",
    updatedAt: r.updatedAt ? String(r.updatedAt) : "",
  };
}

export async function dbGetCampaignsByChapter(chapterId: string): Promise<CampaignData[]> {
  const rows = await db.select().from(s.campaign).where(eq(s.campaign.chapterId, chapterId)).orderBy(desc(s.campaign.createdAt));
  return rows.map((r) => ({
    id: r.campaignId,
    chapterSlug: "",
    chapterId: r.chapterId,
    slug: r.slug,
    name: r.name,
    summary: r.summary ?? "",
    description: r.description ?? "",
    demands: r.demands ? JSON.parse(r.demands) : [],
    memorandum: r.memorandum ?? "",
    createdAt: r.createdAt ? String(r.createdAt) : "",
    updatedAt: r.updatedAt ? String(r.updatedAt) : "",
  }));
}

export async function dbGetEvents(): Promise<EventData[]> {
  const rows = await db.select().from(s.event).orderBy(desc(s.event.createdAt));
  return rows.map((r) => ({
    id: r.eventId,
    chapterSlug: "",
    chapterId: r.chapterId,
    slug: r.slug,
    name: r.name,
    description: r.description ?? "",
    location: r.location ?? "",
    date: r.date ?? "",
    time: r.time ?? "",
    type: r.type ?? "",
    createdAt: r.createdAt ? String(r.createdAt) : "",
    updatedAt: r.updatedAt ? String(r.updatedAt) : "",
  }));
}

export async function dbGetEventBySlug(slug: string): Promise<EventData | null> {
  const rows = await db.select().from(s.event).where(eq(s.event.slug, slug));
  const r = rows[0];
  if (!r) return null;
  return {
    id: r.eventId,
    chapterSlug: "",
    chapterId: r.chapterId,
    slug: r.slug,
    name: r.name,
    description: r.description ?? "",
    location: r.location ?? "",
    date: r.date ?? "",
    time: r.time ?? "",
    type: r.type ?? "",
    createdAt: r.createdAt ? String(r.createdAt) : "",
    updatedAt: r.updatedAt ? String(r.updatedAt) : "",
  };
}

export async function dbGetEventsByChapter(chapterId: string): Promise<EventData[]> {
  const rows = await db.select().from(s.event).where(eq(s.event.chapterId, chapterId)).orderBy(desc(s.event.createdAt));
  return rows.map((r) => ({
    id: r.eventId,
    chapterSlug: "",
    chapterId: r.chapterId,
    slug: r.slug,
    name: r.name,
    description: r.description ?? "",
    location: r.location ?? "",
    date: r.date ?? "",
    time: r.time ?? "",
    type: r.type ?? "",
    createdAt: r.createdAt ? String(r.createdAt) : "",
    updatedAt: r.updatedAt ? String(r.updatedAt) : "",
  }));
}

export async function dbGetMedia(): Promise<MediaData[]> {
  const rows = await db.select().from(s.media).orderBy(desc(s.media.createdAt));
  return rows.map((r) => ({
    id: r.mediaId,
    slug: r.slug,
    name: r.name ?? "",
    link: r.link,
    image: r.image ?? "",
    description: r.description ?? "",
    chapterId: r.chapterId,
    author: r.author ?? "",
    date: r.date ?? "",
    type: r.type ?? "",
    createdAt: r.createdAt ? String(r.createdAt) : "",
  }));
}

export async function dbGetProducts(): Promise<ProductData[]> {
  const rows = await db.select().from(s.product).orderBy(desc(s.product.createdAt));
  return rows.map((r) => ({
    id: r.productId,
    chapterSlug: "",
    chapterId: r.chapterId,
    slug: r.slug,
    name: r.name,
    price: r.price ?? "",
    image: "",
    images: [],
    quantity: r.quantity ?? 0,
    type: r.type ?? "",
    availability: r.availability ?? "available",
    createdAt: r.createdAt ? String(r.createdAt) : "",
    updatedAt: r.updatedAt ? String(r.updatedAt) : "",
  }));
}

export async function dbGetProductBySlug(slug: string): Promise<ProductData | null> {
  const rows = await db.select().from(s.product).where(eq(s.product.slug, slug));
  const r = rows[0];
  if (!r) return null;

  const images = await db.select().from(s.productImage).where(eq(s.productImage.productId, r.productId));
  return {
    id: r.productId,
    chapterSlug: "",
    chapterId: r.chapterId,
    slug: r.slug,
    name: r.name,
    price: r.price ?? "",
    image: images[0]?.url ?? "",
    images: images.map((i) => i.url),
    quantity: r.quantity ?? 0,
    type: r.type ?? "",
    availability: r.availability ?? "available",
    createdAt: r.createdAt ? String(r.createdAt) : "",
    updatedAt: r.updatedAt ? String(r.updatedAt) : "",
  };
}

export async function dbGetUserById(userId: string) {
  const rows = await db.select().from(s.user).where(eq(s.user.userId, userId));
  return rows[0] ?? null;
}

export async function dbGetOrdersByEmail(email: string): Promise<OrderData[]> {
  const rows = await db.select().from(s.order).where(eq(s.order.email, email)).orderBy(desc(s.order.createdAt));
  return rows.map((r) => ({
    id: r.orderId,
    userId: r.userId,
    email: r.email ?? "",
    phone: r.phone ?? "",
    address: r.address ?? "",
    total: r.total ?? "",
    currency: r.currency ?? "MYR",
    method: r.method ?? "",
    status: r.status ?? "pending",
    trackingUrl: r.trackingUrl,
    trackingCode: r.trackingCode,
    createdAt: r.createdAt ? String(r.createdAt) : "",
    updatedAt: r.updatedAt ? String(r.updatedAt) : "",
  }));
}

export async function dbGetAllOrders(): Promise<OrderData[]> {
  const rows = await db.select().from(s.order).orderBy(desc(s.order.createdAt));
  return rows.map((r) => ({
    id: r.orderId,
    userId: r.userId,
    email: r.email ?? "",
    phone: r.phone ?? "",
    address: r.address ?? "",
    total: r.total ?? "",
    currency: r.currency ?? "MYR",
    method: r.method ?? "",
    status: r.status ?? "pending",
    trackingUrl: r.trackingUrl,
    trackingCode: r.trackingCode,
    createdAt: r.createdAt ? String(r.createdAt) : "",
    updatedAt: r.updatedAt ? String(r.updatedAt) : "",
  }));
}

export async function dbGetUserCount(): Promise<number> {
  const rows = await db.select().from(s.user);
  return rows.length;
}

export async function dbGetNominationCount(): Promise<number> {
  const rows = await db.select().from(s.nomination);
  return rows.length;
}

export async function dbGetOrderCount(): Promise<number> {
  const rows = await db.select().from(s.order);
  return rows.length;
}

export async function dbGetNominationByChapter(chapterId: string) {
  return db.select().from(s.nomination).where(eq(s.nomination.chapterId, chapterId)).orderBy(desc(s.nomination.createdAt));
}

export async function dbGetConfigValues() {
  return db.select().from(s.config);
}
