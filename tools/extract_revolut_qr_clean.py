import os
from PIL import Image, ImageEnhance, ImageOps
import numpy as np

try:
    # Open the original image
    img = Image.open(r'D:\Sahara_restaurant\photos\WhatsApp Image 2026-07-30 at 3.56.04 PM.jpeg')
    
    # Convert to RGB if needed
    if img.mode != 'RGB':
        img = img.convert('RGB')

    # Get image dimensions
    width, height = img.size
    print(f"Original image size: {width}x{height}")

    # Create media directory if it doesn't exist
    media_dir = r'D:\Sahara_restaurant\site\public\media'
    os.makedirs(media_dir, exist_ok=True)
    print(f"Media directory ensured: {media_dir}")

    # Crop more precisely to just the QR code (excluding @girgis86 text)
    # The QR code is roughly in the center of the phone screen
    # First let's get a tighter crop around just the QR code
    left = int(width * 0.35)
    top = int(height * 0.30)
    right = int(width * 0.65)
    bottom = int(height * 0.52)  # Stop well before the text

    # Crop the QR code
    qr_code = img.crop((left, top, right, bottom))
    
    # Rotate 90 degrees counter-clockwise
    qr_code_rotated = qr_code.rotate(90, expand=True)
    
    # Convert to grayscale for processing
    qr_gray = qr_code_rotated.convert('L')
    
    # Enhance contrast
    enhancer = ImageEnhance.Contrast(qr_gray)
    qr_enhanced = enhancer.enhance(2.0)
    
    # Invert the image (dark background with white QR → white background with dark QR)
    qr_inverted = ImageOps.invert(qr_enhanced)
    
    # Apply threshold to make it pure black and white
    # Convert to numpy array for thresholding
    qr_array = np.array(qr_inverted)
    
    # Apply threshold: values above 128 become white (255), below become black (0)
    threshold = 128
    qr_array[qr_array >= threshold] = 255
    qr_array[qr_array < threshold] = 0
    
    # Convert back to PIL Image
    qr_final = Image.fromarray(qr_array, mode='L')
    
    # Convert to RGB with white background
    qr_rgb = Image.new('RGB', qr_final.size, (255, 255, 255))
    qr_rgb.paste(qr_final, (0, 0))
    
    # Save the cleaned QR code
    output_path_png = r'D:\Sahara_restaurant\site\public\media\revolut-qr-clean.png'
    qr_rgb.save(output_path_png, format='PNG', quality=100)
    print(f"Clean professional QR code saved to: {output_path_png}")
    
    # Create a high resolution version (upscaled)
    qr_large = qr_rgb.resize((1200, 1200), Image.Resampling.LANCZOS)
    output_path_hq = r'D:\Sahara_restaurant\site\public\media\revolut-qr.png'
    qr_large.save(output_path_hq, format='PNG', quality=100)
    print(f"High resolution QR code saved to: {output_path_hq}")
    
    print("\nSuccess! The QR code is now clean and professional with a white background.")
    
except ImportError as e:
    print(f"Missing required library: {e}")
    print("Please install required packages: pip install pillow numpy")
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
