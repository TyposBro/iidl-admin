import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";

/**
 * Uploads multiple files to Firebase Storage
 * @param items Array of items to upload
 * @param setState State setter function to update URLs
 * @param setReady State setter function to update ready status
 */
const upload = (items, setState, setReady) => {
  setReady(false);

  items.forEach((item) => {
    const storageRef = ref(storage, `${item.label}/${item.file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, item.file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        console.log("Upload is " + progress + "% done");
        setReady(progress === 100);
      },
      (error) => {
        console.error(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          setState((prev) => {
            return { ...prev, [item.label]: url };
          });
        });
      }
    );
  });
};

export default upload;
