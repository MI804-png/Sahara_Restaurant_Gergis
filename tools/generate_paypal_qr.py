#!/usr/bin/env python3
"""Generate PayPal payment QR code with direct payment link"""

import qrcode
from PIL import Image

# PayPal payment details
# IMPORTANT: Update these with your actual PayPal information

# Option 1: PayPal.Me with fixed amount (goes directly to payment)
# Format: https://paypal.me/username/amount
# Example: https://paypal.me/SaharaRestaurant/10.00
paypal_username = "YourPayPalUsername"  # Change this!
fixed_amount = ""  # Leave empty for customer to choose, or set like "10.00"

if fixed_amount:
    # Direct payment with pre-filled amount
    payment_url = f"https://paypal.me/{paypal_username}/{fixed_amount}"
else:
    # Customer enters amount (but still faster than login)
    payment_url = f"https://paypal.me/{paypal_username}"

# Option 2: PayPal standard payment link (most direct - no account needed)
# Uncomment and update with your PayPal email for guest checkout:
# paypal_email = "your.email@example.com"
# payment_url = f"https://www.paypal.com/paypalme/{paypal_username}?locale.x=en_US"

# Option 3: PayPal checkout link (direct payment, no login required)
# This is the best option for "pay as guest" without PayPal account
# Uncomment to use:
# business_email = "your.paypal.email@example.com"
# payment_url = f"https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business={business_email}&currency_code=USD&amount=&item_name=Sahara%20Restaurant"

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
print(f"✓ Payment URL: {payment_url}")
print(f"\n📝 Setup Instructions for DIRECT PAYMENT (no login required):")
print(f"\n1. Create PayPal.Me account:")
print(f"   - Go to: https://paypal.me")
print(f"   - Sign in with your PayPal account")
print(f"   - Create your custom link (e.g., paypal.me/SaharaRestaurant)")
print(f"\n2. Update this script for DIRECT payment:")
print(f"   - Edit line 10: paypal_username = 'YourActualUsername'")
print(f"   - For fixed amount: fixed_amount = '10.00' (or leave empty)")
print(f"   - Run: python tools/generate_paypal_qr.py")
print(f"\n3. BEST OPTIONS for direct payment without login:")
print(f"   Option A: paypal.me/username/10.00 (with amount - goes straight to payment)")
print(f"   Option B: paypal.me/username (customer enters amount)")
print(f"   Option C: Enable 'Guest Checkout' in PayPal settings")
print(f"\n4. Enable Guest Checkout in PayPal:")
print(f"   - Log into PayPal Business account")
print(f"   - Go to Account Settings > Payment Preferences")
print(f"   - Turn ON 'PayPal Account Optional' (allows card payment without login)")
print(f"   - This lets customers pay with card directly!")
print(f"\n5. Benefits of PayPal:")
print(f"   ✓ Accepts Visa, Mastercard, Amex, Discover")
print(f"   ✓ Works in 200+ countries")
print(f"   ✓ Guest checkout = NO account needed")
print(f"   ✓ Mobile-friendly checkout")
print(f"   ✓ Buyer/seller protection")
