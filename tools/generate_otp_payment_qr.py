#!/usr/bin/env python3
"""
Generate OTP Bank payment QR codes - Multiple format testing
Tests 3 different QR formats to find which one opens the OTP Bank app
"""

import qrcode
from PIL import Image
import os
import shutil

# OTP Bank account details
account_holder = "SLWANS GIRGIS KARMY AMIN"
account_number = "11710008-24108333"  # Hungarian format
# IBAN format - needs verification with OTP Bank
# Format: HU + 2 check digits + 7 bank code + 16 account number + 1 check
iban = "HU11710008000000002410833300"  # This needs to be verified!

print("=" * 70)
print("🏦 OTP BANK QR CODE GENERATOR - TESTING MULTIPLE FORMATS")
print("=" * 70)
print("\nGenerating 3 different QR code formats...")
print("Test EACH one with your OTP Bank mobile app to see which works!")
print()

# Output directory
output_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'site', 'public', 'media')

def generate_qr(data, filename, description):
    """Generate a QR code and save it"""
    qr = qrcode.QRCode(
        version=None,
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=10,
        border=4,
    )
    qr.add_data(data)
    qr.make(fit=True)
    
    img = qr.make_image(fill_color="black", back_color="white")
    
    output_path = os.path.join(output_dir, filename)
    img.save(output_path)
    print(f"✓ {description}")
    print(f"  Saved: {filename}")
    return output_path


# ============================================================================
# FORMAT 1: Hungarian Instant Payment (HCT) - For Hungarian banking apps
# ============================================================================
print("\n1️⃣  Hungarian Instant Payment Format (HCT):")
print("   This format is used by Hungarian banks for instant payments")

hct_data = f"""HCT
001
1
HU

{account_holder}
{iban}
HUF

Sahara Restaurant payment"""

generate_qr(hct_data, "otp-payment-qr-hct.png", "HCT format (Hungarian)")

# ============================================================================
# FORMAT 2: European EPC Format - Standard SEPA payments
# ============================================================================
print("\n2️⃣  European Payment Format (EPC/BCD):")
print("   Standard format used by European banking apps")

epc_data = f"""BCD
002
1
SCT

{account_holder}
{iban}
EUR

Sahara Restaurant payment"""

generate_qr(epc_data, "otp-payment-qr-epc.png", "EPC format (European)")

# ============================================================================
# FORMAT 3: Simple text with account details - Universal fallback
# ============================================================================
print("\n3️⃣  Simple Text Format:")
print("   Plain text that can be copied into any banking app")

simple_data = f"""OTP Bank Payment
Beneficiary: {account_holder}
Account: {account_number}
IBAN: {iban}
Purpose: Sahara Restaurant payment"""

generate_qr(simple_data, "otp-payment-qr-simple.png", "Simple text format")

# ============================================================================
# Copy the HCT version as the main one (most likely to work)
# ============================================================================
print("\n📋 Setting HCT format as default (otp-payment-qr.png)...")
shutil.copy(
    os.path.join(output_dir, "otp-payment-qr-hct.png"),
    os.path.join(output_dir, "otp-payment-qr.png")
)
print("✓ Default QR code updated")

print("\n" + "=" * 70)
print("✅ TESTING INSTRUCTIONS")
print("=" * 70)
print("\n📱 Test on your mobile phone:")
print("\n1. Open OTP Bank mobile app")
print("2. Find the 'Scan QR' or 'Payment by QR' option")
print("3. Scan each QR code (test all 3):")
print("   - otp-payment-qr-hct.png (Try this FIRST)")
print("   - otp-payment-qr-epc.png (Try second)")
print("   - otp-payment-qr-simple.png (Fallback)")
print("\n4. See which one opens the payment screen with details pre-filled")
print("\n5. Tell me which format worked!")

print("\n" + "=" * 70)
print("⚠️  IMPORTANT - VERIFY IBAN")
print("=" * 70)
print(f"\nCurrent IBAN: {iban}")
print(f"Account Number: {account_number}")
print("\n❗ This IBAN might be INCORRECT!")
print("\nTo get correct IBAN:")
print("1. Open OTP Bank mobile app")
print("2. Go to your account details")
print("3. Look for 'IBAN' (should start with 'HU')")
print("4. Update line 14 in this script with correct IBAN")
print("5. Re-run: python tools/generate_otp_payment_qr.py")

print("\n" + "=" * 70)
print("💡 ALTERNATIVE SOLUTIONS")
print("=" * 70)
print("\nIf QR codes don't work with OTP Bank app:")
print("\n✅ Option 1: Use Revolut (already working)")
print("   - More universal")
print("   - Works in 200+ countries")
print("   - Better QR support")
print("\n✅ Option 2: Contact OTP Bank support")
print("   - Ask about 'QR payment format'")
print("   - Request technical documentation")
print("   - They might have their own generator")
print("\n✅ Option 3: Use bank transfer details instead")
print("   - Display account number on screen")
print("   - Customer enters manually")
print("   - No QR needed")

print("\n" + "=" * 70)
print("🎯 NEXT STEPS")
print("=" * 70)
print("\n1. Test all 3 QR codes with OTP Bank app")
print("2. Verify IBAN is correct")
print("3. Rebuild website: npm run build")
print("4. Check which format works best")
print("\n")
