import { SettingsClient } from "./client";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  
  return <SettingsClient />;
}