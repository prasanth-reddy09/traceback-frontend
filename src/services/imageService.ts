import { apiClient } from "@/lib/apiClient";
import axios from "axios";

export const imageService = {
  uploadToCloudinary: async (file: File): Promise<string> => {
    // 1. Ask Spring Boot for the secure signature
    const sigResponse = await apiClient.get("/images/generate-signature");
    const { signature, timestamp, api_key, cloud_name, folder, public_id } = sigResponse.data;

    // 2. Package the file and the signature exactly how Cloudinary wants it
    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", api_key);
    formData.append("timestamp", timestamp.toString());
    formData.append("signature", signature);
    formData.append("folder", folder);
    formData.append("public_id", public_id);

    // 3. POST directly to Cloudinary (Notice we use standard 'axios' here, NOT 'apiClient', 
    // because we don't want to send our JWT token to Cloudinary!)
    const uploadRes = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
      formData
    );

    // 4. Return the permanent public URL!
    return uploadRes.data.secure_url;
  },
};