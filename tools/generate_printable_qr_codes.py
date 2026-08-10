"""
Generate printable QR codes for Sahara Restaurant
Creates high-resolution QR codes with labels for printing
Output: 3 QR codes (Location, Revolut, OTP Bank) - NO PayPal
"""

import qrcode
from PIL import Image, ImageDraw, ImageFont
import os

# Create output directory
output_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'printable_qr_codes')
os.makedirs(output_dir, exist_ok=True)

# QR code settings for printing (high quality)
QR_SIZE = 800  # Large size for clear printing
QR_BORDER = 2
ERROR_CORRECTION = qrcode.constants.ERROR_CORRECT_H  # Highest error correction

def create_printable_qr(data, title, subtitle, filename, color='#000000'):
    """Create a printable QR code with title and instructions"""
    
    # Generate QR code
    qr = qrcode.QRCode(
        version=None,
        error_correction=ERROR_CORRECTION,
        box_size=20,
        border=QR_BORDER,
    )
    qr.add_data(data)
    qr.make(fit=True)
    
    # Create QR code image
    qr_img = qr.make_image(fill_color=color, back_color='white')
    qr_img = qr_img.resize((QR_SIZE, QR_SIZE), Image.Resampling.LANCZOS)
    
    # Create canvas with space for title and info
    canvas_width = QR_SIZE + 100  # 50px margin on each side
    canvas_height = QR_SIZE + 300  # Space for title and subtitle
    canvas = Image.new('RGB', (canvas_width, canvas_height), 'white')
    
    # Paste QR code in center
    qr_x = (canvas_width - QR_SIZE) // 2
    qr_y = 150  # Leave space for title
    canvas.paste(qr_img, (qr_x, qr_y))
    
    # Draw text
    draw = ImageDraw.Draw(canvas)
    
    try:
        # Try to use a nice font
        title_font = ImageFont.truetype("arial.ttf", 60)
        subtitle_font = ImageFont.truetype("arial.ttf", 30)
        footer_font = ImageFont.truetype("arial.ttf", 24)
    except:
        # Fallback to default font
        title_font = ImageFont.load_default()
        subtitle_font = ImageFont.load_default()
        footer_font = ImageFont.load_default()
    
    # Draw title
    title_bbox = draw.textbbox((0, 0), title, font=title_font)
    title_width = title_bbox[2] - title_bbox[0]
    title_x = (canvas_width - title_width) // 2
    draw.text((title_x, 40), title, fill='black', font=title_font)
    
    # Draw subtitle
    subtitle_bbox = draw.textbbox((0, 0), subtitle, font=subtitle_font)
    subtitle_width = subtitle_bbox[2] - subtitle_bbox[0]
    subtitle_x = (canvas_width - subtitle_width) // 2
    draw.text((subtitle_x, 100), subtitle, fill='#666666', font=subtitle_font)
    
    # Draw footer
    footer_text = "Scan with your phone camera"
    footer_bbox = draw.textbbox((0, 0), footer_text, font=footer_font)
    footer_width = footer_bbox[2] - footer_bbox[0]
    footer_x = (canvas_width - footer_width) // 2
    draw.text((footer_x, qr_y + QR_SIZE + 30), footer_text, fill='#888888', font=footer_font)
    
    # Save
    output_path = os.path.join(output_dir, filename)
    canvas.save(output_path, 'PNG', dpi=(300, 300), quality=95)
    print(f"✓ Created: {filename}")
    return output_path


print("🎨 Generating printable QR codes for Sahara Restaurant...")
print("=" * 60)

# 1. Location QR Code (Google Maps)
location_url = "https://maps.app.goo.gl/VRmwLYF9LRN6BQnQ8"
create_printable_qr(
    data=location_url,
    title="📍 Visit Us",
    subtitle="Sahara Restaurant - Budapest",
    filename="1_location_qr.png",
    color='#1a73e8'  # Google Maps blue
)

# 2. Revolut Payment QR Code
revolut_url = "https://revolut.me/girgis86"
create_printable_qr(
    data=revolut_url,
    title="💳 Revolut Payment",
    subtitle="Pay with Revolut - @girgis86",
    filename="2_revolut_payment_qr.png",
    color='#FF6B00'  # Revolut orange
)

# 3. OTP Bank Payment QR Code (EPC format)
epc_data = """BCD
002
1
SCT

HU1171000824108333
EUR

SLWANS GIRGIS KARMY AMIN
Sahara Restaurant payment"""

create_printable_qr(
    data=epc_data,
    title="🏦 OTP Bank Payment",
    subtitle="SLWANS GIRGIS KARMY AMIN",
    filename="3_otp_bank_payment_qr.png",
    color='#00A758'  # OTP Bank green
)

print("=" * 60)
print(f"✅ All QR codes saved to: {output_dir}")
print("\n📋 Files created:")
print("   1_location_qr.png      - Google Maps location")
print("   2_revolut_payment_qr.png - Revolut payment")
print("   3_otp_bank_payment_qr.png - OTP Bank payment")
print("\n🖨️  Print Settings:")
print("   - Paper: A4 (210mm x 297mm)")
print("   - Quality: 300 DPI (high quality)")
print("   - Scale: Fit to page or 100%")
print("   - Each QR code is optimized for scanning")
print("\n💡 Tips:")
print("   - Print on white paper for best contrast")
print("   - Laminate for durability")
print("   - Test scan before displaying")
print("   - Keep at least 1cm margin around QR code")
