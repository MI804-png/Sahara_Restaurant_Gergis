#!/usr/bin/env python3
"""Generate OTP Bank payment QR code"""

import qrcode
from PIL import Image

# OTP Bank account details
account_holder = "SLWANS GIRGIS KARMY AMIN"
account_number = "11710008-24108333"
bank_name = "OTP Bank"

# Create payment data string (Hungarian Credit Transfer format)
# Format: HCT1|{version}|{account}|{name}|{amount}|{currency}|{message}
payment_data = f"""OTP Bank Payment
Account Holder: {account_holder}
Account Number: {account_number}
Bank: {bank_name}

Scan to get payment details for Sahara Restaurant"""

# Generate QR code
qr = qrcode.QRCode(
    version=1,
    error_correction=qrcode.constants.ERROR_CORRECT_H,
    box_size=10,
    border=4,
)

qr.add_data(payment_data)
qr.make(fit=True)

# Create image with white background
img = qr.make_image(fill_color="black", back_color="white")

# Save the QR code
output_path = "d:/Sahara_restaurant/site/public/media/otp-payment-qr.png"
img.save(output_path)
print(f"✓ OTP payment QR code generated: {output_path}")
print(f"✓ QR code contains account details for {account_holder}")
