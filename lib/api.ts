// api.ts
import axios from "axios";

const API_URL = "/api/v1/"; // Replace with your API base URL

// Create an axios instance with a base URL
const apiInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Generic GET request
export const get = async (url: string) => {
  try {
    const response = await apiInstance.get(url);
    console.log("res", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in GET request:", error);
    throw error;
  }
};

export const post = async (url: string, formData: FormData) => {
  try {
    // Manually set Content-Type to 'multipart/form-data' for file uploads
    const response = await apiInstance.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Indicate multipart data
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error in Multipart POST request:", error);
    throw error;
  }
};

export const patch = async (url: string, data: any) => {
  try {
    const response = await apiInstance.patch(url, data, {
      headers: {
        "Content-Type": "multipart/form-data", // Indicate multipart data
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error in PATCH request:", error);
    throw error;
  }
};

// Generic DELETE request
export const deleteRequest = async (url: string) => {
  try {
    const response = await apiInstance.delete(url);
    return response.data;
  } catch (error) {
    console.error("Error in DELETE request:", error);
    throw error;
  }
};
