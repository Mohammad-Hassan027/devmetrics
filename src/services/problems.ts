import { supabase } from "./supabase";
import { ProblemEntry } from "../types";

export const problemsService = {
  /**
   * Fetch all problems for a specific user
   */
  async getProblems(userId: string): Promise<ProblemEntry[]> {
    const { data, error } = await supabase
      .from("problems")
      .select("*")
      .eq("user_id", userId)
      .order("solved_at", { ascending: false });

    if (error) {
      console.error("Error fetching problems:", error);
      throw new Error(error.message);
    }
    return data as ProblemEntry[];
  },

  /**
   * Add a new problem entry
   */
  async addProblem(problem: Omit<ProblemEntry, "id" | "created_at" | "updated_at">): Promise<ProblemEntry> {
    const { data, error } = await supabase
      .from("problems")
      .insert([problem])
      .select()
      .single();

    if (error) {
      console.error("Error adding problem:", error);
      throw new Error(error.message);
    }
    return data as ProblemEntry;
  },

  /**
   * Update an existing problem entry
   */
  async updateProblem(id: string, updates: Partial<Omit<ProblemEntry, "id" | "user_id" | "created_at" | "updated_at">>): Promise<ProblemEntry> {
    const { data, error } = await supabase
      .from("problems")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating problem:", error);
      throw new Error(error.message);
    }
    return data as ProblemEntry;
  },

  /**
   * Delete a problem entry
   */
  async deleteProblem(id: string): Promise<void> {
    const { error } = await supabase
      .from("problems")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting problem:", error);
      throw new Error(error.message);
    }
  }
};
