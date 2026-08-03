import os
import qrcode
from PIL import Image

try:
    # Revolut payment URL for girgis86
    revolut_url = "https://revolut.me/girgis86"
    
    print(f"Generating ultra-sharp QR code for: {revolut_url}")
    
    # Create media directory
    media_dir = r'D:\Sahara_restaurant\site\public\media'
    os.makedirs(media_dir, exist_ok=True)
    
    # Generate QR code with qrcode library for maximum quality
    qr = qrcode.QRCode(
        version=None,  # Auto-size
        error_correction=qrcode.constants.ERROR_CORRECT_H,  # High error correction
        box_size=20,  # Each box is 20 pixels
        border=4,  # Border size (4 boxes = quiet zone)
    )
    
    qr.add_data(revolut_url)
    qr.make(fit=True)
    
    # Create the image with white background and black boxes
    img = qr.make_image(fill_color="black", back_color="white")
    
    print(f"Generated QR code size: {img.size}")
    
    # Convert to RGB
    img_rgb = img.convert('RGB')
    
    # Save high-resolution version
    output_path_hq = os.path.join(media_dir, 'revolut-payment-qr.png')
    img_rgb.save(output_path_hq, format='PNG', quality=100, optimize=True)
    print(f"✓ High-res QR saved to: {output_path_hq}")
    print(f"  Size: {img_rgb.size}")
    
    # Create 600x600 version for standard display
    img_standard = img_rgb.resize((600, 600), Image.Resampling.LANCZOS)
    output_path = os.path.join(media_dir, 'revolut-qr.png')
    img_standard.save(output_path, format='PNG', quality=100, optimize=True)
    print(f"✓ Standard QR (600x600) saved to: {output_path}")
    
    print(f"\n✓✓✓ Success! Crystal-clear Revolut QR code generated! ✓✓✓")
    print(f"  URL: {revolut_url}")
    print(f"  Quality: Pixel-perfect, same as location QR")
    print(f"  Format: High error correction for reliable scanning")
    
except ImportError:
    print("qrcode library not installed.")
    print("Please run: pip install qrcode[pil]")
    
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
