/**
 * Converts any image URL (blob URL, data URL, or HTTP URL) into a Base64 object with mimeType.
 */
export async function urlToBase64(url: string): Promise<{ data: string; mimeType: string }> {
  // If already a base64 data URI, parse directly without fetching
  if (url.startsWith('data:')) {
    const matches = url.match(/^data:(.+);base64,(.+)$/);
    if (matches) {
      return { mimeType: matches[1], data: matches[2] };
    }
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        const matches = result.match(/^data:(.+);base64,(.+)$/);
        if (matches) {
          resolve({ mimeType: matches[1], data: matches[2] });
        } else {
          const mimeType = blob.type || 'image/jpeg';
          const parts = result.split(',');
          const base64 = parts.length > 1 ? parts[1] : parts[0];
          resolve({ mimeType, data: base64 });
        }
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    throw new Error(`Failed to process reference image: ${error instanceof Error ? error.message : String(error)}`);
  }
}
