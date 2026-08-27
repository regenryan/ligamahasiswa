"use server";

import { getSession } from "@/lib/session";

export type ZineState = { error?: string } | undefined;

export async function submitZine(
  _prev: ZineState,
  _formData: FormData,
): Promise<ZineState> {
  const session = await getSession();
  if (!session?.userId) {
    return { error: "You must be logged in to submit a zine." };
  }
  return { error: "Zines feature coming soon." };
}
