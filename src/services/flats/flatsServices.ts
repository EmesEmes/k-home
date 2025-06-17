import { supabase } from "@/utils/supabaseClient";

export class FlatsServices {
  constructor() {}

  async createFlat(
    formData: FormData,
    token: string | null
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const res = await fetch(`http://localhost:8080/flats`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // NOTA: No incluimos 'Content-Type' para multipart/form-data
        },
        body: formData,
      });

      const result = await res.json();

      if (res.ok && result.success) {
        return { success: true, data: result.data };
      } else {
        // Podrías devolver result.message si viene de tu backend
        return {
          success: false,
          error: result.message || "Error creating flat",
        };
      }
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async getFlats() {
    try {
      const response = await fetch("http://localhost:8080/flats/");

      if (!response.ok) {
        throw new Error("Error en la petición");
      }

      const result = await response.json();

      return {
        success: result.success,
        flats: result.data,
        pagination: result.pagination,
      };
    } catch (error) {
      console.error("Error al obtener los flats:", error);
      return { success: false, flats: [] };
    }
  }

  async toggleFavorite(
    userId: string,
    flatId: string,
    token: string | null
  ): Promise<{ success: boolean; message: string }> {
    try {
      const res = await fetch(`http://localhost:8080/favorites/toggle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ user: userId, flatId }),
      });

      const result = await res.json();
      console.log(result);
      if (res.ok && result.success) {
        return { success: true, message: result.message };
      } else {
        return {
          success: false,
          message: result.message || "Error toggling favorite",
        };
      }
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  }

  async getFavorites(
    userId: string,
    token: string | null
  ): Promise<{
    success: boolean;
    data?: any[];
    pagination?: {
      total: number;
      page: number;
      totalPages: number;
      hasMore: boolean;
    };
    message?: string;
  }> {
    try {
      const res = await fetch(`http://localhost:8080/favorites/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await res.json();
      if (res.ok && result.success) {
        return {
          success: true,
          data: result.data,
          pagination: result.pagination,
        };
      } else {
        return {
          success: false,
          message: result.message || "Error fetching favorites",
        };
      }
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  }

  async getUserFavorites(
    userId: string,
    token: string | null
  ): Promise<{ success: boolean; flats?: any[]; error?: string }> {
    try {
      const res = await fetch(`http://localhost:8080/favorites/${userId}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!res.ok) {
        const errPayload = await res.json().catch(() => ({}));
        return {
          success: false,
          error: errPayload.message || "Error fetching favorites",
        };
      }

      const result = await res.json();
      if (result.success) {
        // result.data contiene el arreglo de flats
        return { success: true, flats: result.data };
      } else {
        return {
          success: false,
          error: result.message || "Could not get favorites",
        };
      }
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  async getFlatById(
    flatId: string
  ): Promise<{ success: boolean; flat?: any; error?: string }> {
    try {
      const res = await fetch(`http://localhost:8080/flats/${flatId}`);
      if (!res.ok) {
        const errorPayload = await res.json().catch(() => ({}));
        return {
          success: false,
          error: errorPayload.message || "Error fetching flat",
        };
      }
      const result = await res.json();
      if (result.success) {
        return { success: true, flat: result.data };
      } else {
        return { success: false, error: result.message || "Flat not found" };
      }
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  async getFlatsByUserId(
    userId: string,
    token: string | null
  ): Promise<{ success: boolean; flats?: any[]; error?: string }> {
    try {
      const res = await fetch(
        `http://localhost:8080/flats/my-flats/${userId}`,
        {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      if (!res.ok) {
        // Si status <> 2xx
        const errPayload = await res.json().catch(() => ({}));
        return {
          success: false,
          error: errPayload.message || "Error fetching user flats",
        };
      }

      // Parseamos el JSON de la respuesta
      const result = await res.json();
      if (result.success) {
        // Aquí asumimos que tu backend envía { success: true, data: [ ...flats ] }
        return { success: true, flats: result.data };
      } else {
        return {
          success: false,
          error: result.message || "Could not get user flats",
        };
      }
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  async updateFlat(flatId: string, updatedFlat: any, token: string) {
  try {
    const response = await fetch(`http://localhost:8080/flats/${flatId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, 
      },
      body: JSON.stringify(updatedFlat),
    });

    const result = await response.json();
console.log(response)
    if (!response.ok || !result.success) {
      return { success: false, error: result.message || "Error al actualizar" };
    }

    return { success: true, data: result.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}


  async filterCity(city: string) {
    const { data: flats, error } = await supabase
      .from("flats")
      .select("*")
      .ilike("city", `%${city}%`);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, flats };
  }

  async filterPrice() {
    const { data: flats, error } = await supabase
      .from("flats")
      .select("*")
      .order("rentprice", { ascending: false });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, flats };
  }

  async filterByPrice(min: number, max: number) {
    const { data: flats, error } = await supabase
      .from("flats")
      .select("*")
      .gte("rentprice", min)
      .lte("rentprice", max);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, flats };
  }
}
