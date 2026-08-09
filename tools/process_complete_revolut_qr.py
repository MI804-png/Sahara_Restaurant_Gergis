import os
from PIL import Image, ImageEnhance
import numpy as np

try:
    # Open the complete QR code image
    input_path = r'D:\Sahara_restaurant\photos\revolut_qr.jpg'
    img = Image.open(input_path)
    
    print(f"Original QR code size: {img.size}")
    print(f"Mode: {img.mode}")
    
    # Create media directory
    media_dir = r'D:\Sahara_restaurant\site\public\media'
    os.makedirs(media_dir, exist_ok=True)
    
    # Convert to RGB if needed
    if img.mode != 'RGB':
        if img.mode == 'RGBA':
            # Create white background for transparent images
            background = Image.new('RGB', img.size, (255, 255, 255))
            background.paste(img, mask=img.split()[3] if len(img.split()) == 4 else None)
            img = background
        else:
            img = img.convert('RGB')
    
    # Convert to grayscale
    img_gray = img.convert('L')
    
    # The source QR has BLACK background and WHITE pattern
    # We need to INVERT to get WHITE background and BLACK pattern
    from PIL import ImageOps
    img_inverted = ImageOps.invert(img_gray)
    
    # Enhance contrast after inversion
    enhancer = ImageEnhance.Contrast(img_inverted)
    img_enhanced = enhancer.enhance(2.0)
    
    # Apply threshold for clean black and white
    img_array = np.array(img_enhanced)
    threshold = 128
    img_array[img_array >= threshold] = 255  # White pixels stay white
    img_array[img_array < threshold] = 0     # Dark pixels become black
    
    img_bw = Image.fromarray(img_array, mode='L')
    
    # Convert to RGB with pure white background
    img_final = Image.new('RGB', img_bw.size, (255, 255, 255))
    img_final.paste(img_bw, (0, 0))
    
    # Make it square if needed
    width, height = img_final.size
    if width != height:
        min_dim = min(width, height)
        left = (width - min_dim) // 2
        top = (height - min_dim) // 2
        img_final = img_final.crop((left, top, left + min_dim, top + min_dim))
        print(f"Cropped to square: {img_final.size}")
    
    # Add a small white border (QR codes typically have quiet zones)
    border_size = int(img_final.size[0] * 0.05)  # 5% border
    img_with_border = Image.new('RGB', 
                                (img_final.size[0] + border_size * 2, 
                                 img_final.size[1] + border_size * 2), 
                                (255, 255, 255))
    img_with_border.paste(img_final, (border_size, border_size))
    
    # Resize to standard size (600x600) to match location QR
    img_standard = img_with_border.resize((600, 600), Image.Resampling.LANCZOS)
    output_path = os.path.join(media_dir, 'revolut-qr.png')
    img_standard.save(output_path, format='PNG', quality=100, optimize=True)
    print(f"✓ Standard QR (600x600) saved to: {output_path}")
    
    # Create high-resolution version (1200x1200)
    img_hq = img_with_border.resize((1200, 1200), Image.Resampling.LANCZOS)
    output_path_hq = os.path.join(media_dir, 'revolut-qr-hq.png')
    img_hq.save(output_path_hq, format='PNG', quality=100, optimize=True)
    print(f"✓ High-res QR (1200x1200) saved to: {output_path_hq}")
    
    print("\n✓✓✓ Success! Professional Revolut QR code is ready! ✓✓✓")
    print("  - Clean white background")
    print("  - High contrast black and white")
    print("  - Proper quiet zone (white border)")
    print("  - Matches the professional style of your location QR code")
    print("  - Ready to use on your website")
    
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
