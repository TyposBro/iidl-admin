import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";

// Define interface for upload item
interface UploadItem {
  label: string;
  file: File;
}

// Define type for state setter function
type SetStateFunction<T> = React.Dispatch<React.SetStateAction<T>>;

// Define interface for state object
interface StateObject {
  [key: string]: string;
}

/**
 * Uploads multiple files to Firebase Storage
 * @param items Array of items to upload
 * @param setState State setter function to update URLs
 * @param setReady State setter function to update ready status
 */
const upload = (
  items: UploadItem[],
  setState: SetStateFunction<StateObject>,
  setReady: SetStateFunction<boolean>
): void => {
  setReady(false);

  items.forEach((item: UploadItem) => {
    const storageRef = ref(storage, `${item.label}/${item.file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, item.file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        console.log("Upload is " + progress + "% done");
        setReady(progress === 100);
      },
      (error: Error) => {
        console.error(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url: string) => {
          setState((prev: StateObject) => {
            return { ...prev, [item.label]: url };
          });
        });
      }
    );
  });
};

export default upload;
