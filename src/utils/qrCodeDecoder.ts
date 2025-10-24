// File: client/stagpower-gym-client/src/utils/qrCodeDecoder.ts

import jsQR from 'jsqr';

export const decodeQRCodeFromBase64 = async (base64DataUrl: string): Promise<string | null> => {
  try {
    // Create image element
    const img = new Image();
    img.src = base64DataUrl;
    
    // Wait for image to load
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
    });
    
    // Create canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Could not get canvas context');
    }
    
    // Set canvas size to image size
    canvas.width = img.width;
    canvas.height = img.height;
    
    // Draw image on canvas
    ctx.drawImage(img, 0, 0);
    
    // Get image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    // Decode QR code
    const code = jsQR(imageData.data, imageData.width, imageData.height);
    
    if (code) {
      return code.data; // JWT token
    }
    
    return null;
  } catch (error) {
    console.error('Failed to decode QR code:', error);
    return null;
  }
};

