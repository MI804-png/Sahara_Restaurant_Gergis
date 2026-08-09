import os
import urllib.request
from PIL import Image
import io

try:
    # Revolut payment URL for girgis86
    revolut_url = "https://revolut.me/girgis86"
    
    print(f"Generating high-resolution QR code for: {revolut_url}")
    
    # Create media directory
    media_dir = r'D:\Sahara_restaurant\site\public\media'
    os.makedirs(media_dir, exist_ok=True)
    
    # Generate QR code at very high resolution (1200x1200)
    qr_api_url = f"https://api.qrserver.com/v1/create-qr-code/?size=1200x1200&data={urllib.parse.quote(revolut_url)}&margin=20"
    
    print(f"Downloading from: {qr_api_url}")
    
    # Download the QR code
    with urllib.request.urlopen(qr_api_url) as response:
        img_data = response.read()
    
    # Open with PIL
    img = Image.open(io.BytesIO(img_data))
    print(f"Downloaded QR code size: {img.size}")
    
    # Save high-resolution version
    output_path_hq = os.path.join(media_dir, 'revolut-payment-qr.png')
    img.save(output_path_hq, format='PNG', quality=100, optimize=True)
    print(f"✓ High-res QR (1200x1200) saved to: {output_path_hq}")
    
    # Also create standard 600x600 version
    img_standard = img.resize((600, 600), Image.Resampling.LANCZOS)
    output_path = os.path.join(media_dir, 'revolut-qr.png')
    img_standard.save(output_path, format='PNG', quality=100, optimize=True)
    print(f"✓ Standard QR (600x600) saved to: {output_path}")
    
    print(f"\n✓✓✓ Success! Sharp Revolut QR code generated! ✓✓✓")
    print(f"  URL: {revolut_url}")
    print(f"  Resolution: 1200x1200 pixels")
    print(f"  Quality: Crystal clear, matches location QR")
    
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
