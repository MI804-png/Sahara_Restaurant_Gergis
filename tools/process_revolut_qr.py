import os
from PIL import Image, ImageEnhance, ImageOps
import numpy as np

try:
    # The user has provided a clean QR code screenshot
    # We need to determine which file to use - looking for the most recent image
    # For now, let's assume it's saved as a temp file or we'll process the provided one
    
    # Path to save the processed QR
    media_dir = r'D:\Sahara_restaurant\site\public\media'
    os.makedirs(media_dir, exist_ok=True)
    
    print("Please save the provided QR code image to:")
    print(r"D:\Sahara_restaurant\photos\revolut-qr-complete.png")
    print("\nThen this script will process it professionally.")
    
    # Check if file exists
    input_path = r'D:\Sahara_restaurant\photos\revolut-qr-complete.png'
    if not os.path.exists(input_path):
        print(f"\nFile not found. Please save the complete QR code image to the path above.")
        exit(1)
    
    # Open the QR code image
    img = Image.open(input_path)
    
    # Convert to RGB if needed
    if img.mode != 'RGB':
        if img.mode == 'RGBA':
            # Create white background for transparent images
            background = Image.new('RGB', img.size, (255, 255, 255))
            background.paste(img, mask=img.split()[3] if len(img.split()) == 4 else None)
            img = background
        else:
            img = img.convert('RGB')
    
    print(f"Original QR code size: {img.size}")
    
    # Convert to grayscale
    img_gray = img.convert('L')
    
    # Enhance contrast
    enhancer = ImageEnhance.Contrast(img_gray)
    img_enhanced = enhancer.enhance(1.5)
    
    # Apply threshold for clean black and white
    img_array = np.array(img_enhanced)
    threshold = 128
    img_array[img_array >= threshold] = 255
    img_array[img_array < threshold] = 0
    
    img_bw = Image.fromarray(img_array, mode='L')
    
    # Convert to RGB with pure white background
    img_final = Image.new('RGB', img_bw.size, (255, 255, 255))
    img_final.paste(img_bw, (0, 0))
    
    # Check if rotation is needed (QR codes should be square and properly oriented)
    width, height = img_final.size
    if width != height:
        # Make it square by cropping to the smaller dimension
        min_dim = min(width, height)
        left = (width - min_dim) // 2
        top = (height - min_dim) // 2
        img_final = img_final.crop((left, top, left + min_dim, top + min_dim))
        print(f"Cropped to square: {img_final.size}")
    
    # Resize to standard size (600x600) to match location QR
    img_standard = img_final.resize((600, 600), Image.Resampling.LANCZOS)
    output_path = os.path.join(media_dir, 'revolut-qr.png')
    img_standard.save(output_path, format='PNG', quality=100, optimize=True)
    print(f"✓ Standard QR (600x600) saved to: {output_path}")
    
    # Create high-resolution version (1200x1200)
    img_hq = img_final.resize((1200, 1200), Image.Resampling.LANCZOS)
    output_path_hq = os.path.join(media_dir, 'revolut-qr-hq.png')
    img_hq.save(output_path_hq, format='PNG', quality=100, optimize=True)
    print(f"✓ High-res QR (1200x1200) saved to: {output_path_hq}")
    
    print("\n✓ Success! Professional Revolut QR code is ready!")
    print("  - Clean white background")
    print("  - High contrast black and white")
    print("  - Matches the professional style of your location QR code")
    
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
