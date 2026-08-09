import os
from PIL import Image
from pyzbar.pyzbar import decode

try:
    # Try to decode the QR code from the user's image
    input_path = r'D:\Sahara_restaurant\photos\revolut_qr.jpg'
    img = Image.open(input_path)
    
    print(f"Decoding QR code from: {input_path}")
    print(f"Image size: {img.size}")
    
    # Decode the QR code
    decoded_objects = decode(img)
    
    if decoded_objects:
        for obj in decoded_objects:
            print(f"\nQR Code Type: {obj.type}")
            print(f"QR Code Data: {obj.data.decode('utf-8')}")
            
            # Save the decoded data to a file
            output_file = r'D:\Sahara_restaurant\revolut_qr_data.txt'
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write(obj.data.decode('utf-8'))
            print(f"\nData saved to: {output_file}")
    else:
        print("No QR code could be decoded from the image.")
        print("The image might be too small or low quality.")
        print("Please try with a higher resolution image.")
        
except ImportError:
    print("pyzbar library not installed.")
    print("Installing now...")
    import subprocess
    subprocess.run(['pip', 'install', 'pyzbar'], check=True)
    print("\nPlease run the script again after installation completes.")
    
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
