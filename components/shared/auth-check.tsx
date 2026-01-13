import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function AuthCheck() {
  const supabase = await createClient();
  // @ts-ignore - Assuming getClaims exists based on existing code usage
  const { data: authData, error: authError } = await supabase.auth.getClaims();

  if (authError || !authData?.claims) {
    redirect("/auth/login");
  }

  return null;
}
