const uploadImage = async (file) => {
  const cloudName = "ddd0glbvc"; 
  const uploadPreset = "zhpmgt8s";   

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  try {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!res.ok) throw new Error("Upload failed");
    
    const data = await res.json();
    return data.secure_url; 
  } catch (err) {
    console.error("Cloudinary Error:", err);
    return null;
  }
};

export default uploadImage;