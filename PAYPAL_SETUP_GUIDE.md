# PayPal Direct Payment Setup Guide

## 🎯 Goal: Allow customers to pay with card WITHOUT PayPal login

This guide shows you how to set up PayPal so customers can pay directly with their credit/debit card without creating a PayPal account or logging in.

---

## ✅ Step 1: Create PayPal Business Account

1. Go to: https://www.paypal.com/bizsignup/
2. Sign up for a **Business Account** (NOT personal)
3. Complete verification process
4. Add your bank account

---

## ✅ Step 2: Enable Guest Checkout (CRITICAL!)

This is the most important step to allow card payments without login:

1. **Log into PayPal Business account**
2. **Go to:** Account Settings (gear icon)
3. **Navigate to:** Payment Preferences
4. **Find:** "PayPal Account Optional" setting
5. **Turn ON:** This option
6. **Save changes**

✅ **Result:** Customers can now pay with Visa/Mastercard/Amex without PayPal account!

---

## ✅ Step 3: Create PayPal.Me Link

1. **Go to:** https://paypal.me
2. **Create your link:** Choose username (e.g., `SaharaRestaurant`)
3. **Your link will be:** `paypal.me/YourUsername`

### Payment Link Options:

**Option A: Customer enters amount (flexible)**
```
https://paypal.me/SaharaRestaurant
```
- Customer scans QR → Opens PayPal page → Enters amount → Pays with card

**Option B: Fixed amount (direct payment)**
```
https://paypal.me/SaharaRestaurant/10.00
```
- Goes straight to checkout with $10.00 pre-filled
- Customer just clicks "Pay with Card"

**Recommended:** Use Option A for restaurants (let customers choose amount)

---

## ✅ Step 4: Update QR Code Generator

1. **Open file:** `tools/generate_paypal_qr.py`

2. **Update line 10:**
```python
paypal_username = "SaharaRestaurant"  # Your actual username
```

3. **For flexible amount (recommended):**
```python
fixed_amount = ""  # Leave empty
```

4. **For fixed amount:**
```python
fixed_amount = "10.00"  # Set specific amount
```

5. **Regenerate QR code:**
```bash
cd d:\Sahara_restaurant
python tools/generate_paypal_qr.py
```

---

## ✅ Step 5: Test Payment Flow

### Test on Mobile:

1. **Scan the PayPal QR code**
2. **You should see:**
   - PayPal payment page (in browser)
   - Option to enter amount (if flexible)
   - **"Pay with Debit or Credit Card"** button
3. **Click "Pay with Card"**
4. **Enter card details** (no login required!)
5. **Complete payment**

### What customers will see:

```
┌─────────────────────────────┐
│      PayPal Payment         │
├─────────────────────────────┤
│  To: Sahara Restaurant      │
│  Amount: Enter or $10.00    │
├─────────────────────────────┤
│  [Pay with PayPal]          │
│                             │
│  [Pay with Card]  ← NO LOGIN│
└─────────────────────────────┘
```

---

## 🚨 Troubleshooting

### Problem: Customers are asked to log in or create account

**Solution:**
1. Check "PayPal Account Optional" is enabled
2. Make sure you have **Business Account** (not personal)
3. Verify your account is fully verified
4. Check your country supports guest checkout
5. Clear browser cache and test again

### Problem: Guest checkout option not showing

**Cause:** Personal accounts don't support guest checkout

**Solution:** 
1. Upgrade to Business Account at: https://www.paypal.com/bizsignup/
2. OR create new Business Account

### Problem: QR code doesn't work

**Check:**
1. PayPal.Me username is correct
2. URL format is valid
3. QR code regenerated after changes
4. Website rebuilt: `npm run build`

---

## 💡 Best Practices

### For Restaurants:

1. ✅ **Use flexible amount** (no fixed_amount) - let customers tip!
2. ✅ **Enable guest checkout** - critical for international customers
3. ✅ **Accept multiple currencies** in PayPal settings
4. ✅ **Display QR prominently** in footer
5. ✅ **Test on mobile** regularly

### For Clear Communication:

Update your website to say:
- ✅ "Pay with card - no account needed"
- ✅ "No login required"
- ✅ "Guest checkout available"
- ❌ Don't say "PayPal only" (confuses customers)

---

## 📊 Payment Methods Comparison

| Method | Login Required? | International? | Setup |
|--------|----------------|----------------|-------|
| **PayPal (Guest)** | ❌ No | ✅ Yes | Business account + Guest enabled |
| **Revolut** | ⚠️ App needed | ✅ Yes | Personal account |
| **OTP Bank** | ⚠️ Banking app | 🇭🇺 Hungary only | Bank account |
| **Location QR** | ❌ No | ✅ Yes | Google Maps |

---

## ✅ Verification Checklist

Before going live, verify:

- [ ] PayPal Business Account created
- [ ] "PayPal Account Optional" is ON
- [ ] PayPal.Me link created and working
- [ ] Username updated in generate_paypal_qr.py
- [ ] QR code regenerated
- [ ] Website rebuilt (npm run build)
- [ ] Tested on mobile device
- [ ] Guest checkout works (no login prompted)
- [ ] Card payment option visible
- [ ] Amount can be entered (if flexible)
- [ ] Payment completes successfully

---

## 🎉 Success!

When properly configured, your PayPal QR code will:

✅ Work for customers worldwide
✅ Accept all major cards (Visa, Mastercard, Amex, Discover)
✅ NO login or account creation required
✅ Mobile-optimized checkout
✅ Secure payment processing
✅ Instant payment notification

---

## 📞 Support

If you need help:
1. PayPal Help: https://www.paypal.com/merchanthelp/
2. PayPal Phone: Varies by country (check website)
3. Re-run generator: `python tools/generate_paypal_qr.py`

---

**Last updated:** 2026-08-10
