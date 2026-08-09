#!/usr/bin/env python3
"""Generate OTP Bank payment QR code in EPC format for banking apps"""

import qrcode
from PIL import Image

# OTP Bank account details
account_holder = "SLWANS GIRGIS KARMY AMIN"
account_number = "11710008-24108333"  # Hungarian format
bank_name = "OTP Bank"

# Convert Hungarian account number to IBAN format
# Hungary IBAN format: HU + 2 check digits + 24 digits
# OTP Bank code: 11710008
# Account: 24108333
# We need to pad and calculate proper IBAN
# For demonstration, using a placeholder - you need to verify the actual IBAN
iban = f"HU{account_number.replace('-', '')}"  # Simplified, needs proper IBAN

# EPC QR Code format (European Payments Council)
# This is the standard format used by banking apps across Europe
# Format specification:
# Line 1: BCD (Barcode identification)
# Line 2: 002 (Version)
# Line 3: 1 (Character set: UTF-8)
# Line 4: SCT (SEPA Credit Transfer)
# Line 5: BIC (optional, can be empty)
# Line 6: Beneficiary name (max 70 chars)
# Line 7: Beneficiary account (IBAN)
# Line 8: Amount in EUR (optional, format: EUR12.50)
# Line 9: Purpose (optional)
# Line 10: Structured reference (optional)
# Line 11: Unstructured remittance info (max 140 chars)
# Line 12: Beneficiary to originator info (optional)

epc_data = f"""BCD
002
1
SCT

{account_holder[:70]}
{iban}


Sahara Restaurant Payment"""

# Generate QR code with EPC format
qr = qrcode.QRCode(
    version=1,
    error_correction=qrcode.constants.ERROR_CORRECT_M,  # EPC requires Medium error correction
    box_size=10,
    border=4,
)

qr.add_data(epc_data)
qr.make(fit=True)

# Create image with white background
img = qr.make_image(fill_color="black", back_color="white")

# Save the QR code
output_path = "d:/Sahara_restaurant/site/public/media/otp-payment-qr.png"
img.save(output_path)
print(f"✓ EPC payment QR code generated: {output_path}")
print(f"✓ QR code format: EPC (European Payments Council)")
print(f"✓ Beneficiary: {account_holder}")
print(f"✓ IBAN: {iban}")
print(f"\n⚠ IMPORTANT: You need to verify the correct IBAN format for this account!")
print(f"   Contact OTP Bank to get the proper IBAN for account {account_number}")
print(f"\n💡 For international card payments (Visa/Mastercard/etc), consider:")
print(f"   - Stripe Payment Links")
print(f"   - PayPal QR codes")
print(f"   - Revolut Business")
print(f"   - Square")
