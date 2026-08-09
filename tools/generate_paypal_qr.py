#!/usr/bin/env python3
"""Generate PayPal payment QR code"""

import qrcode
from PIL import Image

# PayPal payment details
# Option 1: PayPal.Me link (easiest - create at paypal.me)
paypal_username = "YourPayPalUsername"  # Change this to your actual PayPal.Me username
paypal_me_url = f"https://paypal.me/{paypal_username}"

# Option 2: PayPal email for direct payments
# paypal_email = "your.email@example.com"
# paypal_url = f"https://www.paypal.com/paypalme/{paypal_username}"

# For now, using the restaurant's contact info as placeholder
# UPDATE THIS with your actual PayPal.Me username or email
payment_url = paypal_me_url

print(f"Generating PayPal payment QR code...")
print(f"Payment URL: {payment_url}")
print(f"\n⚠️  IMPORTANT: Update 'paypal_username' variable with your actual PayPal.Me username!")

# Generate QR code
qr = qrcode.QRCode(
    version=1,
    error_correction=qrcode.constants.ERROR_CORRECT_H,
    box_size=10,
    border=4,
)

qr.add_data(payment_url)
qr.make(fit=True)

# Create image with white background
img = qr.make_image(fill_color="black", back_color="white")

# Save the QR code
output_path = "d:/Sahara_restaurant/site/public/media/paypal-payment-qr.png"
img.save(output_path)

print(f"✓ PayPal payment QR code generated: {output_path}")
print(f"\n📝 Setup Instructions:")
print(f"\n1. Create PayPal.Me account:")
print(f"   - Go to: https://paypal.me")
print(f"   - Sign in with your PayPal account")
print(f"   - Create your custom link (e.g., paypal.me/SaharaRestaurant)")
print(f"\n2. Update this script:")
print(f"   - Edit line 8: paypal_username = 'YourActualUsername'")
print(f"   - Run: python tools/generate_paypal_qr.py")
print(f"\n3. Benefits of PayPal:")
print(f"   ✓ Accepts Visa, Mastercard, Amex, Discover")
print(f"   ✓ Works in 200+ countries")
print(f"   ✓ Customers don't need PayPal account")
print(f"   ✓ Mobile-friendly checkout")
print(f"   ✓ Buyer/seller protection")
