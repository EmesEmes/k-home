// src/services/messages/messagesServices.ts

export class MessagesServices {
  private baseUrl = "http://localhost:8080";

  constructor() {}

  /**
   * 1) Obtener todos los comentarios de un flat en particular.
   *    GET http://localhost:8080/comments/flat/:flatId
   */
  async getMessagesByFlatId(flatId: string): Promise<{ success: boolean; comments?: any[]; error?: string }> {
    try {
      const res = await fetch(`${this.baseUrl}/messages/${flatId}`);
      if (!res.ok) {
        const errPayload = await res.json().catch(() => ({}));
        return { success: false, error: errPayload.message || "Error fetching comments" };
      }
      const result = await res.json();
      if (result.success) {
        return { success: true, comments: result.data };
      } else {
        return { success: false, error: result.message || "No comments found" };
      }
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  /**
   * 2) Crear un comentario nuevo para un flat.
   *    POST http://localhost:8080/comments
   *    Body: { flatId, authorId, comment, username }
   */
  async createComment({
    flatId,
    userId,
    comment,
    username,
  }: {
    flatId: string;
    userId: string;
    username: string;
    comment: string;
  }): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const res = await fetch(`${this.baseUrl}/messages/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          flatId,
          senderId: userId,
          content: comment,
          username,
        }),
      });

      if (!res.ok) {
        const errPayload = await res.json().catch(() => ({}));
        return { success: false, error: errPayload.message || "Error creating comment" };
      }
      const result = await res.json();
      console.log(result)
      if (result.success) {
        return { success: true, data: result.data };
      } else {
        return { success: false, error: result.message || "Could not create comment" };
      }
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  /**
   * 3) Actualizar (responder) un comentario existente.
   *    PATCH http://localhost:8080/comments/:commentId/response
   *    Body: { response: string }
   */
  async updateResponse({
    commentId,
    response,
    token
  }: {
    commentId: string;
    response: string;
    token: string
  }): Promise<{ success: boolean; comment?: any; error?: string }> {
    try {
      const res = await fetch(`${this.baseUrl}/messages/${commentId}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ response,
          responseDate: Date.now()
         }),
      });

      if (!res.ok) {
        const errPayload = await res.json().catch(() => ({}));
        return { success: false, error: errPayload.message || "Error updating response" };
      }
      const result = await res.json();
      if (result.success) {
        return { success: true, comment: result.data };
      } else {
        return { success: false, error: result.message || "Could not update response" };
      }
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }
}

