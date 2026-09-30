// Upload an image file to ImgBB and return its public URL
export async function uploadImage(file) {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(
    `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
    { method: "POST", body: formData }
  );
  const result = await res.json().catch(() => null);

  if (!result?.success) {
    throw new Error("Image upload failed. Please try again.");
  }
  return result.data.url;
}
