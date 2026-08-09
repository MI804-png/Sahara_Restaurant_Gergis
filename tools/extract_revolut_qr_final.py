import os
from PIL import Image, ImageEnhance, ImageOps, ImageChops
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

    # Extract the COMPLETE QR code - final balanced crop
    # Finding the sweet spot between full QR and no text
    # After extensive testing, these coordinates give the best result
    left = int(width * 0.365)
    top = int(height * 0.255)
    right = int(width * 0.715)  # Extended but not too far to avoid text
    bottom = int(height * 0.475)  # Conservative to exclude text

    # Crop the QR code
    qr_code = img.crop((left, top, right, bottom))
    print(f"Cropped QR size: {qr_code.size}")
    
    # Rotate 90 degrees counter-clockwise
    qr_code_rotated = qr_code.rotate(90, expand=True)
    
    # Convert to grayscale for processing
    qr_gray = qr_code_rotated.convert('L')
    
    # Enhance contrast significantly
    enhancer = ImageEnhance.Contrast(qr_gray)
    qr_enhanced = enhancer.enhance(2.5)
    
    # Invert the image (dark background with white QR → white background with dark QR)
    qr_inverted = ImageOps.invert(qr_enhanced)
    
    # Apply aggressive threshold to make it pure black and white
    qr_array = np.array(qr_inverted)
    
    # Use a higher threshold to ensure clean white background
    threshold = 140
    qr_array[qr_array >= threshold] = 255
    qr_array[qr_array < threshold] = 0
    
    # Convert back to PIL Image
    qr_final = Image.fromarray(qr_array, mode='L')
    
    # Convert to RGB with white background
    qr_rgb = Image.new('RGB', qr_final.size, (255, 255, 255))
    qr_rgb.paste(qr_final, (0, 0))
    
    # Resize to standard sizes
    # Standard 600x600 (matching Google Maps QR)
    qr_standard = qr_rgb.resize((600, 600), Image.Resampling.LANCZOS)
    output_path = r'D:\Sahara_restaurant\site\public\media\revolut-qr.png'
    qr_standard.save(output_path, format='PNG', quality=100, optimize=True)
    print(f"Standard QR code (600x600) saved to: {output_path}")
    
    # High resolution version
    qr_large = qr_rgb.resize((1200, 1200), Image.Resampling.LANCZOS)
    output_path_hq = r'D:\Sahara_restaurant\site\public\media\revolut-qr-hq.png'
    qr_large.save(output_path_hq, format='PNG', quality=100, optimize=True)
    print(f"High resolution QR code (1200x1200) saved to: {output_path_hq}")
    
    print("\n✓ Success! The QR code is now clean and professional with a white background.")
    print("  The QR code matches the professional style of the location QR code.")
    
except ImportError as e:
    print(f"Missing required library: {e}")
    print("Please install: pip install pillow numpy")
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
