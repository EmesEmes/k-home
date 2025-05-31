import { supabase } from "@/utils/supabaseClient";

export class UserService {
  constructor() {}

  async login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.log(error);
      return { success: false, error: error.message };
    }

    console.log(data.user);
    return { success: true, data };
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
    } catch (error) {
      console.error(error);
    }
  }

  async getUserById(id: string) {
    const { data, error } = await supabase
      .from("profiles")
      .select()
      .eq("id", id);

    if (error) {
      return { success: false, error: error.message };
    } else {
      return { success: true, user: data[0] };
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
