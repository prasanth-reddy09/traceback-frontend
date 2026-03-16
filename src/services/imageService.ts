import { apiClient } from "@/lib/apiClient";
import axios from "axios";

export const imageService = {
  uploadToCloudinary: async (file: File): Promise<string> => {

    const sigResponse = await apiClient.get("/images/generate-signature");
    const { signature, timestamp, api_key, cloud_name, folder, public_id } = sigResponse.data;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", api_key);
    formData.append("timestamp", timestamp.toString());
    formData.append("signature", signature);
    formData.append("folder", folder);
    formData.append("public_id", public_id);

   
    const uploadRes = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
      formData
    );

    return uploadRes.data.secure_url;
  },
};