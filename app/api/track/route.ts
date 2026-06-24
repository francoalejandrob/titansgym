import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { pagina, referrer } = await req.json();
    const supabase = await createClient();
    await supabase.from("visitas").insert({
      pagina: String(pagina || "/"),
      referrer: referrer || null,
    });
  } catch {
    // Silently ignore tracking errors
  }
  return NextResponse.json({ ok: true });
}
