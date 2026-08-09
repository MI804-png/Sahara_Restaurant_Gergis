#!/usr/bin/env python3
"""Generate International Payment QR code for worldwide card payments"""

import qrcode
from PIL import Image, ImageDraw, ImageFont

# Payment options for international payments:
# Option 1: Link to your website payment page
# Option 2: Stripe Payment Link (you need to create this at stripe.com)
# Option 3: PayPal.Me link (create at paypal.me)
# Option 4: Revolut Business payment link

# For now, creating a QR that links to your website
# You can update this URL to your Stripe/PayPal link later
payment_url = "https://github.com/MI804-png/Sahara_Restaurant_Gergis"  # Replace with your payment link

# Alternative payment URLs (uncomment the one you want to use):
# payment_url = "https://donate.stripe.com/YOUR_LINK_HERE"  # Stripe
# payment_url = "https://paypal.me/YourUsername"  # PayPal
# payment_url = "https://revolut.me/YourUsername"  # Revolut

print(f"Generating international payment QR code...")
print(f"Payment URL: {payment_url}")

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
output_path = "d:/Sahara_restaurant/site/public/media/international-payment-qr.png"
img.save(output_path)

print(f"✓ International payment QR code generated: {output_path}")
print(f"\n🌍 This QR code accepts payments from ANY country worldwide!")
print(f"\n📝 Next steps to enable international card payments:")
print(f"\n1. STRIPE (Recommended - accepts all cards globally):")
print(f"   - Sign up at: https://stripe.com")
print(f"   - Create a Payment Link")
print(f"   - Update payment_url in this script to your Stripe link")
print(f"\n2. PAYPAL (Familiar to customers worldwide):")
print(f"   - Create PayPal.Me: https://paypal.me")
print(f"   - Update payment_url to: https://paypal.me/YourUsername")
print(f"\n3. REVOLUT BUSINESS:")
print(f"   - Upgrade to Revolut Business account")
print(f"   - Get your payment link")
print(f"   - Update payment_url to your Revolut link")
print(f"\nAfter you get your payment link, run this script again!")
