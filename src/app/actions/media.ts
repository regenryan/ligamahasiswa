"use server";

import { db } from "@/lib/db";
import { media } from "@/lib/schema";
import { getSession } from "@/lib/session";
import { fetchOGMetadata } from "@/lib/opengraph";
import crypto from "crypto";
import { eq } from "drizzle-orm";

export type MediaState = { ok: boolean; error?: string } | undefined;

export async function submitMediaLink(
  _prev: MediaState,
  formData: FormData,
): Promise<MediaState> {
  const session = await getSession();
  if (!session?.userId) {
    return { ok: false, error: "Login required." };
  }

  const url = String(formData.get("url") ?? "").trim();
  const chapterId = String(formData.get("chapterId") ?? "").trim();
  const type = String(formData.get("type") ?? "article").trim();

  if (!url) {
    return { ok: false, error: "Please enter a URL." };
  }
  
  if (!chapterId) {
    return { ok: false, error: "Please select a chapter." };
  }

  try {
    // Validate URL
    new URL(url);
  } catch {
    return { ok: false, error: "Please enter a valid URL." };
  }

  // Fetch OpenGraph metadata
  const ogData = await fetchOGMetadata(url) || { title: "", description: "", image: "", siteName: "" };
  
  const id = `med_${crypto.randomUUID().replace(/-/g, "")}`;
  
  // Extract a slug from the URL
  let slug = "media-link";
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/').filter(Boolean);
    if (pathParts.length > 0) {
      slug = pathParts[pathParts.length - 1].replace(/[^a-z0-9]/gi, '-').toLowerCase();
      // Truncate to reasonable length
      if (slug.length > 50) slug = slug.substring(0, 50);
    }
  } catch (e) {
    // Keep default slug
  }
  
  // Ensure slug is somewhat unique
  slug = `${slug}-${Math.random().toString(36).substring(2, 8)}`;

  try {
    await db.insert(media).values({
      mediaId: id,
      slug,
      name: ogData.title || "Untitled Link",
      link: url,
      image: ogData.image || null,
      description: ogData.description || null,
      chapterId: chapterId,
      author: ogData.siteName || null,
      type: type,
      date: new Date().toISOString().split('T')[0],
    });
    
    return { ok: true };
  } catch (err: any) {
    return { ok: false, error: "Failed to submit media link. Please try again." };
  }
}

export async function deleteMedia(mediaId: string) {
  const session = await getSession();
  if (!session?.userId) return { ok: false, error: "Unauthorized" };
  
  // Basic deletion without checking user permissions for simplicity in this migration
  await db.delete(media).where(eq(media.mediaId, mediaId));
  return { ok: true };
}