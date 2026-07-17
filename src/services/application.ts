import { supabase } from "@/lib/supabase";

export async function saveApplication(data: any) {
  const { error } = await supabase
    .from("applications")
    .insert([data]);

  if (error) {
    throw error;
  }

  return true;
}