"use server";

import { SERVER_URL } from "@/lib/config";

export async function getAuthUrl(provider: string) {
  return `${SERVER_URL}/auth/${provider}/login`;
}
