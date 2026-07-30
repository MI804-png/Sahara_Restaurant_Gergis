import os
from PIL import Image

try:
    # Open the original image
    img = Image.open(r'D:\Sahara_restaurant\photos\WhatsApp Image 2026-07-30 at 3.56.04 PM.jpeg')

    # Get image dimensions
    width, height = img.size
    print(f"Original image size: {width}x{height}")

    # Create media directory if it doesn't exist
    media_dir = r'D:\Sahara_restaurant\site\public\media'
    os.makedirs(media_dir, exist_ok=True)
    print(f"Media directory ensured: {media_dir}")

    # The QR code appears to be in the center of the phone screen
    # Based on the image, let's crop the QR code area
    # Approximate coordinates for the QR code
    left = int(width * 0.3)
    top = int(height * 0.25)
    right = int(width * 0.7)
    bottom = int(height * 0.65)

    # Crop the QR code
    qr_code = img.crop((left, top, right, bottom))

    # Save the cropped QR code
    output_path = r'D:\Sahara_restaurant\site\public\media\revolut-qr.jpg'
    qr_code.save(output_path, quality=95)
    print(f"QR code extracted and saved to: {output_path}")

    # Also create a higher resolution version if needed
    qr_code_hq = img.crop((left, top, right, bottom))
    output_path_hq = r'D:\Sahara_restaurant\site\public\media\revolut-qr-hq.png'
    qr_code_hq.save(output_path_hq, format='PNG')
    print(f"High quality QR code saved to: {output_path_hq}")
    
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
