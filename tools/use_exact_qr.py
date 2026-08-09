import os
from PIL import Image

try:
    # Use the exact QR code image provided by the user
    input_path = r'D:\Sahara_restaurant\photos\revolut_qr.jpg'
    img = Image.open(input_path)
    
    print(f"Original QR code size: {img.size}")
    
    # Create media directory
    media_dir = r'D:\Sahara_restaurant\site\public\media'
    os.makedirs(media_dir, exist_ok=True)
    
    # Convert to RGB if needed
    if img.mode != 'RGB':
        img = img.convert('RGB')
    
    # Make it square
    width, height = img.size
    if width != height:
        min_dim = min(width, height)
        left = (width - min_dim) // 2
        top = (height - min_dim) // 2
        img = img.crop((left, top, left + min_dim, top + min_dim))
        print(f"Cropped to square: {img.size}")
    
    # Resize to standard size (600x600)
    img_standard = img.resize((600, 600), Image.Resampling.LANCZOS)
    output_path = os.path.join(media_dir, 'revolut-qr.png')
    img_standard.save(output_path, format='PNG', quality=100)
    print(f"✓ Standard QR (600x600) saved to: {output_path}")
    
    # Create high-resolution version (1200x1200)
    img_hq = img.resize((1200, 1200), Image.Resampling.LANCZOS)
    output_path_hq = os.path.join(media_dir, 'revolut-qr-hq.png')
    img_hq.save(output_path_hq, format='PNG', quality=100)
    print(f"✓ High-res QR (1200x1200) saved to: {output_path_hq}")
    
    print("\n✓ Success! Your exact QR code image is now on the website!")
    
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
