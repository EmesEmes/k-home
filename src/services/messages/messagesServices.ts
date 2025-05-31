import { supabase } from "@/utils/supabaseClient";

export class MessagesServices {
  constructor() {}

  async getMessagesByFlatId(flatId: string) {
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .eq("flatid", flatId)
      .order("created_at", { ascending: true });
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, comments: data };
  }

  async createComment({ flatId, userId, comment, username }: { flatId: string; userId: string; username:string; comment: string }) {
    const { data, error } = await supabase
    .from("comments")
    .insert([
      {
        flatid: flatId,
        authorid: userId,
        comment: comment,
        username: username,
      },
    ])
    .select();
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, data: data };
  }

  async updateResponse({ commentId, response }: { commentId: string; response: string }) {
    const { data, error } = await supabase
      .from("comments")
      .update({ response: response, responsetime: new Date()})
      .eq("id", commentId);
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, comment: data };
  }
}

