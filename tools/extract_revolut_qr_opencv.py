import os
import cv2
import numpy as np
from PIL import Image

try:
    # Read the image with OpenCV
    img_path = r'D:\Sahara_restaurant\photos\WhatsApp Image 2026-07-30 at 3.56.04 PM.jpeg'
    img = cv2.imread(img_path)
    
    if img is None:
        raise Exception("Could not load image")
    
    height, width = img.shape[:2]
    print(f"Original image size: {width}x{height}")
    
    # Create media directory
    media_dir = r'D:\Sahara_restaurant\site\public\media'
    os.makedirs(media_dir, exist_ok=True)
    
    # Initialize the QR code detector
    qr_detector = cv2.QRCodeDetector()
    
    # Detect and decode the QR code
    data, bbox, straight_qrcode = qr_detector.detectAndDecode(img)
    
    if bbox is not None and straight_qrcode is not None:
        print(f"QR Code detected successfully!")
        print(f"QR Code data: {data[:50]}..." if len(data) > 50 else f"QR Code data: {data}")
        
        # The straight_qrcode is the rectified QR code image
        # It's already properly oriented and cropped
        
        # Convert to PIL Image for further processing
        qr_pil = Image.fromarray(cv2.cvtColor(straight_qrcode, cv2.COLOR_BGR2RGB))
        
        # Convert to grayscale
        qr_gray = qr_pil.convert('L')
        
        # Apply threshold to make it clean black and white
        qr_array = np.array(qr_gray)
        threshold = 128
        qr_array[qr_array >= threshold] = 255
        qr_array[qr_array < threshold] = 0
        
        qr_clean = Image.fromarray(qr_array, mode='L')
        
        # Convert to RGB with white background
        qr_rgb = Image.new('RGB', qr_clean.size, (255, 255, 255))
        qr_rgb.paste(qr_clean, (0, 0))
        
        # Resize to a standard size (600x600 to match the location QR)
        qr_resized = qr_rgb.resize((600, 600), Image.Resampling.LANCZOS)
        
        # Save the clean QR code
        output_path = r'D:\Sahara_restaurant\site\public\media\revolut-qr.png'
        qr_resized.save(output_path, format='PNG', quality=100)
        print(f"Clean QR code saved to: {output_path}")
        
        # Also create a higher resolution version
        qr_large = qr_rgb.resize((1200, 1200), Image.Resampling.LANCZOS)
        output_path_hq = r'D:\Sahara_restaurant\site\public\media\revolut-qr-hq.png'
        qr_large.save(output_path_hq, format='PNG', quality=100)
        print(f"High resolution QR code saved to: {output_path_hq}")
        
        print("\nSuccess! The QR code is now clean and professional with a white background.")
    else:
        print("QR Code could not be detected. Falling back to manual crop...")
        # Manual fallback method
        left = int(width * 0.38)
        top = int(height * 0.32)
        right = int(width * 0.62)
        bottom = int(height * 0.50)
        
        cropped = img[top:bottom, left:right]
        cropped_rgb = cv2.cvtColor(cropped, cv2.COLOR_BGR2RGB)
        qr_pil = Image.fromarray(cropped_rgb)
        
        # Rotate and process
        qr_rotated = qr_pil.rotate(90, expand=True)
        qr_gray = qr_rotated.convert('L')
        
        from PIL import ImageOps, ImageEnhance
        enhancer = ImageEnhance.Contrast(qr_gray)
        qr_enhanced = enhancer.enhance(2.0)
        qr_inverted = ImageOps.invert(qr_enhanced)
        
        qr_array = np.array(qr_inverted)
        qr_array[qr_array >= 128] = 255
        qr_array[qr_array < 128] = 0
        
        qr_final = Image.fromarray(qr_array, mode='L')
        qr_rgb = Image.new('RGB', qr_final.size, (255, 255, 255))
        qr_rgb.paste(qr_final, (0, 0))
        
        qr_resized = qr_rgb.resize((600, 600), Image.Resampling.LANCZOS)
        output_path = r'D:\Sahara_restaurant\site\public\media\revolut-qr.png'
        qr_resized.save(output_path, format='PNG', quality=100)
        print(f"Manual extraction saved to: {output_path}")
        
except ImportError as e:
    print(f"Missing required library: {e}")
    print("Please install: pip install opencv-python pillow numpy")
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
