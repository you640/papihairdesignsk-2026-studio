
import { getStorage, ref, uploadBytesResumable, getDownloadURL, type FirebaseStorage } from "firebase/storage";

/**
 * Uploads a file to Firebase Storage and returns the download URL.
 *
 * @param storage The Firebase Storage instance.
 * @param path The path where the file will be stored in the bucket (e.g., 'images/profile.jpg').
 * @param file The file to upload.
 * @param onProgress Optional callback to track upload progress (0-100).
 * @returns A promise that resolves with the public download URL of the file.
 */
export const uploadFile = (
  storage: FirebaseStorage,
  path: string,
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress?.(progress);
      },
      (error) => {
        // Handle unsuccessful uploads
        console.error("Upload failed:", error);
        reject(error);
      },
      () => {
        // Handle successful uploads on complete
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          resolve(downloadURL);
        });
      }
    );
  });
};
