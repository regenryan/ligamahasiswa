const ENCODER = new TextEncoder();

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function genSalt(): string {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  return toHex(salt.buffer);
}

export async function hashPassword(password: string): Promise<string> {
  const salt = genSalt();
  const data = ENCODER.encode(`${salt}:${password}`);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return `${salt}:${toHex(hashBuffer)}`;
}

export async function verifyPassword(
  password: string,
  stored: string,
): Promise<boolean> {
  if (stored.includes(":")) {
    const [salt, hash] = stored.split(":");
    const data = ENCODER.encode(`${salt}:${password}`);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    return toHex(hashBuffer) === hash;
  }
  const data = ENCODER.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return toHex(hashBuffer) === stored;
}
