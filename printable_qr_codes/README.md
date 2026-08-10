# 🖨️ Printable QR Codes for Sahara Restaurant

This folder contains **3 high-quality QR codes** ready for printing and display in your restaurant.

---

## 📁 Files

### 1️⃣ **1_location_qr.png** - Restaurant Location
- **Purpose:** Direct customers to your restaurant on Google Maps
- **Scans to:** https://maps.app.goo.gl/VRmwLYF9LRN6BQnQ8
- **Use for:** 
  - Table tent cards
  - Menu inserts
  - Entrance display
  - Social media posts

### 2️⃣ **2_revolut_payment_qr.png** - Revolut Payment
- **Purpose:** Accept payments via Revolut
- **Account:** @girgis86
- **Use for:**
  - Payment counter
  - Table payment options
  - Delivery/takeout receipts

### 3️⃣ **3_otp_bank_payment_qr.png** - OTP Bank Payment
- **Purpose:** Accept bank transfers via OTP Bank (Hungary)
- **Account:** SLWANS GIRGIS KARMY AMIN
- **Account Number:** 11710008-24108333
- **IBAN:** HU1171000824108333
- **Format:** EPC (works with banking apps)
- **Use for:**
  - Local Hungarian customers
  - Bank transfer payments
  - Invoice payments

---

## 🖨️ Printing Instructions

### Recommended Settings:
- **Paper:** A4 (210mm × 297mm) white paper
- **Quality:** 300 DPI (high quality/best)
- **Color:** Full color
- **Scale:** Fit to page OR 100%
- **Orientation:** Portrait

### Steps:
1. Open each PNG file
2. Right-click → Print
3. Select **high quality** or **best** setting
4. Choose **fit to page** for largest size
5. Print test page first to check size

### Size Options:

#### Full Page (A4)
- 1 QR code per page
- Best for counter display
- Easy to scan from 1-2 meters

#### Half Page (A5)
- 2 QR codes per page
- Print and cut in half
- Good for table tents

#### Quarter Page (A6)
- 4 QR codes per page
- Print and cut into quarters
- Perfect for menu inserts

---

## 💡 Display Tips

### Where to Place QR Codes:

✅ **At Counter:**
- All 3 payment QR codes side by side
- Acrylic stand or laminated card
- Sign: "Scan to Pay"

✅ **On Tables:**
- Location QR + 1 payment QR
- Table tent with menu items
- Laminated for durability

✅ **At Entrance:**
- Location QR code
- "Find us on Google Maps"
- Easy for takeout customers

✅ **In Menu:**
- Small payment QRs in footer
- "Multiple payment options"

✅ **On Receipts:**
- Payment QR codes
- "Pay next time"

---

## 🛡️ Durability

### Protect Your QR Codes:

1. **Laminate** (best option)
   - Use thermal or cold lamination
   - Prevents water damage
   - Lasts years

2. **Acrylic Frame**
   - Professional look
   - Easy to clean
   - Swappable

3. **Plastic Sleeve**
   - Budget option
   - Quick replacement
   - Wipeable

---

## ✅ Before Displaying

### Test Each QR Code:

- [ ] Scan with iPhone camera
- [ ] Scan with Android camera
- [ ] Test from 30cm distance
- [ ] Test from 1m distance
- [ ] Check under restaurant lighting
- [ ] Verify correct URL/payment opens
- [ ] Test with different phones

### Quality Check:

- [ ] No smudges or stains
- [ ] Colors print clearly
- [ ] Text is readable
- [ ] QR code not cut off
- [ ] White margins preserved

---

## 🔄 Regenerating QR Codes

If you need to recreate these files:

```bash
cd D:\Sahara_restaurant
python tools/generate_printable_qr_codes.py
```

This will regenerate all 3 QR codes in this folder.

---

## 📊 Technical Details

- **Resolution:** 800×800 pixels (QR code only)
- **Canvas Size:** 900×1100 pixels (with text)
- **DPI:** 300 (high quality)
- **Format:** PNG with transparency support
- **Color Space:** RGB
- **Error Correction:** High (30% damage tolerance)

---

## 🎨 Customization

To modify QR codes (colors, text, size):
1. Edit `tools/generate_printable_qr_codes.py`
2. Change variables at top of file
3. Run: `python tools/generate_printable_qr_codes.py`

---

## ❓ Troubleshooting

### QR Code Won't Scan:
- ✅ Check lighting (not too dark/bright)
- ✅ Clean QR code surface
- ✅ Hold phone steady for 2 seconds
- ✅ Try different distance (20cm-100cm)
- ✅ Make sure QR code isn't damaged

### Print Quality Issues:
- ✅ Use high-quality/best print setting
- ✅ Check printer ink levels
- ✅ Use white paper (not colored)
- ✅ Print test page first
- ✅ Increase size if too small

### Colors Look Wrong:
- ✅ Enable color printing
- ✅ Check printer color settings
- ✅ Use good quality paper
- ✅ Black & white works too (still scannable)

---

**Created:** 2026-08-10  
**Format:** PNG (high quality)  
**Total Files:** 3 QR codes  
**Ready to Print:** ✅ Yes
