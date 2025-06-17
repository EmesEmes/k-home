import { supabase } from "@/utils/supabaseClient";

export class UserService {
  constructor() {}

  async login(email: string, password: string) {
    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!data.success) {
        return { success: false, error: data.message };
      }

      // extrae el token y el usuario
      return {
        success: true,
        data: {
          token: data.token,
          user: data.user,
        },
      };
    } catch (error) {
      return { success: false, error: "Login failed" };
    }
  }

  async register(newUser: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    birthdate: string;
    file?: File;
  }) {
    try {
      const formData = new FormData();

      formData.append("firstName", newUser.firstName);
      formData.append("lastName", newUser.lastName);
      formData.append("email", newUser.email);
      formData.append("password", newUser.password);
      formData.append("phone", newUser.phone);
      formData.append("birthdate", newUser.birthdate);

      if (newUser.file) {
        formData.append("image", newUser.file);
      }

      const response = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("Respuesta del backend:", data);
      return data
    } catch (error) {
      console.error(error);
    }
  }

  async getUserById(id: string): Promise<{ success: boolean; user?: any; error?: string }> {
  try {
    const res = await fetch(`http://localhost:8080/users/${id}`);
    if (!res.ok) {
      const errorPayload = await res.json().catch(() => ({}));
      return { success: false, error: errorPayload.message || "Error fetching user" };
    }
    const result = await res.json();
    if (result.success) {
      return { success: true, user: result.data };
    } else {
      return { success: false, error: result.message || "User not found" };
    }
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

  async deleteUser(userId: string) {
    const { error } = await supabase.from("profiles").delete().eq("id", userId);
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  }

  async getAllUsers() {
    const { data, error } = await supabase.from("profiles").select();

    if (error) {
      return { success: false, error: error.message };
    } else {
      return { success: true, users: data };
    }
  }

  async updateUser(
    id: string,
    firstname: string,
    lastname: string,
    phone: string,
    birthdate: string,
    isadmin?: boolean
  ) {
    const { data, error } = await supabase
      .from("profiles")
      .update({
        firstname,
        lastname,
        phone,
        birthdate,
        isadmin,
      })
      .eq("id", id);

    if (error) {
      return { success: false, error: error.message };
    } else {
      return { success: true, data: data };
    }
  }
}
