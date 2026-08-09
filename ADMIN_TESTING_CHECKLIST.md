# Admin Panel Testing & Common Issues Checklist

## 🔍 COMMON ISSUES TO CHECK

### 1. ❌ Authentication Issues
- [ ] **Issue:** Admin credentials not working
  - **Check:** Backend API endpoint `/api/admin/verify` is running
  - **Check:** Correct username and password in headers
  - **Fix:** Verify backend server is running and credentials match

- [ ] **Issue:** Admin access bypassed (security risk!)
  - **Check:** All admin routes require authentication
  - **Check:** API endpoints validate `x-admin-username` and `x-admin-key` headers
  - **Fix:** Add authentication middleware to all admin endpoints

### 2. ❌ Save/Load Issues
- [ ] **Issue:** Changes not saving
  - **Check:** Network tab shows POST to `/api/admin/site-data`
  - **Check:** Response is 200 OK
  - **Check:** Console for errors
  - **Fix:** Check backend write permissions, file paths

- [ ] **Issue:** Data not persisting after refresh
  - **Check:** `savedSiteData` state is updated after save
  - **Check:** Backend file is actually written
  - **Fix:** Verify backend save function completes successfully

- [ ] **Issue:** "Last saved" timestamp not updating
  - **Check:** `savedAt` field in response
  - **Check:** State update in `handleSaveSiteData` function
  - **Fix:** Backend must return timestamp, frontend must update state

### 3. ❌ Image Upload Issues
- [ ] **Issue:** Images not uploading
  - **Check:** File size limits (max 10MB typical)
  - **Check:** Allowed file types (.jpg, .png, .webp, .gif)
  - **Check:** Network tab shows POST to `/api/admin/upload-image`
  - **Fix:** Check backend upload configuration, file permissions

- [ ] **Issue:** Uploaded images not displaying
  - **Check:** Image URL in response is correct
  - **Check:** Public folder path is accessible
  - **Check:** CORS settings if different domain
  - **Fix:** Verify file is saved in correct public directory

- [ ] **Issue:** Delete image not working
  - **Check:** DELETE request to `/api/admin/delete-image`
  - **Check:** Admin credentials in headers
  - **Fix:** Backend must verify auth and delete file

### 4. ❌ Menu/Offers Management Issues
- [ ] **Issue:** Can't add new items
  - **Check:** `addMenuItem` function generates unique IDs
  - **Check:** State updates properly
  - **Fix:** Ensure ID generation uses proper method (Date.now() or UUID)

- [ ] **Issue:** Can't delete items
  - **Check:** Item ID is correctly passed
  - **Check:** State filter removes correct item
  - **Fix:** Debug item.id matching in filter function

- [ ] **Issue:** Offers not appearing on main site
  - **Check:** Offer dates are valid (not expired)
  - **Check:** Client limits not reached
  - **Check:** Daily time windows configured correctly
  - **Fix:** Check offer filtering logic in main page render

### 5. ❌ State Management Issues
- [ ] **Issue:** Undo/Restore not working
  - **Check:** `restorableSiteData` is set before deletions
  - **Check:** Button enabled/disabled states
  - **Fix:** Verify state cloning before modifications

- [ ] **Issue:** Draft vs Saved confusion
  - **Check:** `isDirty` flag correctly calculated
  - **Check:** Visual indicators clear (save button state, status message)
  - **Fix:** Compare `siteData` with `savedSiteData` properly

### 6. ❌ UI/UX Issues
- [ ] **Issue:** Password field not showing/hiding
  - **Check:** `isAdminPasswordVisible` state toggle
  - **Check:** Button click handler
  - **Fix:** Verify input type switches between 'password' and 'text'

- [ ] **Issue:** Buttons not disabled when appropriate
  - **Check:** `isSaving` state during save operation
  - **Check:** `isLoadingSiteData` during initial load
  - **Fix:** Add disabled attributes based on state

- [ ] **Issue:** Error messages not clearing
  - **Check:** `setSaveError(null)` called before new operations
  - **Check:** `setAdminAccessError(null)` on retry
  - **Fix:** Clear errors at start of new actions

### 7. ❌ Validation Issues
- [ ] **Issue:** Invalid data accepted
  - **Check:** Price validation (must be numbers)
  - **Check:** Required fields validation
  - **Check:** Date/time validation for offers
  - **Fix:** Add validation before state updates

- [ ] **Issue:** Duplicate items allowed
  - **Check:** ID uniqueness validation
  - **Check:** Name uniqueness check (if required)
  - **Fix:** Add duplicate detection logic

### 8. ❌ Performance Issues
- [ ] **Issue:** Slow save operations
  - **Check:** Data size (large images?)
  - **Check:** Network speed
  - **Check:** Backend processing time
  - **Fix:** Implement image compression, optimize data structure

- [ ] **Issue:** Memory leaks
  - **Check:** useEffect cleanup functions
  - **Check:** Event listeners removed
  - **Fix:** Add proper cleanup in useEffect return

### 9. ❌ Mobile/Responsive Issues
- [ ] **Issue:** Admin panel not usable on mobile
  - **Check:** CSS media queries for admin section
  - **Check:** Touch targets size (min 44x44px)
  - **Fix:** Add mobile-specific styles

### 10. ❌ Payment QR Code Issues
- [ ] **Issue:** QR codes not scanning
  - **Check:** QR code image quality (not blurry)
  - **Check:** Correct data format (URL, EPC, etc.)
  - **Check:** Error correction level sufficient
  - **Fix:** Regenerate QR with higher quality settings

- [ ] **Issue:** Payment links broken
  - **Check:** URLs are valid and accessible
  - **Check:** PayPal.Me username is correct
  - **Check:** IBAN format valid for OTP Bank
  - **Fix:** Update payment URLs in generator scripts

- [ ] **Issue:** QR codes not displaying on mobile
  - **Check:** Image file exists in /media/ folder
  - **Check:** Responsive CSS grid layout
  - **Check:** Image loading lazy attribute
  - **Fix:** Verify responsive breakpoints (680px, 960px, 1200px)

---

## 🧪 TESTING PROCEDURE

### Step 1: Access Admin Panel
```
URL: http://localhost:5173/admin
Expected: Login screen appears
```

### Step 2: Test Authentication
```
1. Leave fields empty → Should show validation error
2. Enter wrong credentials → Should show auth error
3. Enter correct credentials → Should show admin dashboard
```

### Step 3: Test Menu Management
```
1. Add new menu item
2. Edit existing item
3. Delete item
4. Restore deleted item
5. Verify changes in preview
```

### Step 4: Test Save Functionality
```
1. Make changes
2. Click Save
3. Check "Last saved" timestamp updates
4. Refresh page
5. Verify changes persisted
```

### Step 5: Test Image Upload
```
1. Click upload button
2. Select image file (try different formats)
3. Verify image appears
4. Try deleting uploaded image
```

### Step 6: Test Offers
```
1. Create new offer
2. Set dates (past, present, future)
3. Set client limits
4. Set daily time windows
5. Verify offer appears on main site correctly
```

### Step 7: Test Payment QR Codes
```
1. Open website on mobile
2. Scroll to footer
3. Verify all 5 QR codes visible
4. Scan each QR code:
   - Location QR → Opens Google Maps
   - Revolut QR → Opens Revolut payment
   - OTP Bank QR → Banking app recognizes EPC format
   - International QR → Opens payment link
   - PayPal QR → Opens PayPal.Me page
```

### Step 8: Test Error Recovery
```
1. Disconnect network
2. Try to save → Should show error
3. Reconnect
4. Retry save → Should succeed
```

---

## 🚨 CRITICAL SECURITY CHECKS

### Must Verify:
- [ ] Admin routes require authentication
- [ ] API endpoints validate credentials
- [ ] No sensitive data in localStorage (only consent flags)
- [ ] No admin passwords in client-side code
- [ ] HTTPS in production (not HTTP)
- [ ] CORS properly configured
- [ ] File upload validates file types
- [ ] File upload has size limits
- [ ] No SQL injection vulnerabilities
- [ ] XSS protection enabled

---

## 📝 TEST RESULTS LOG

### Test Date: _________________
### Tester: ___________________

| Feature | Status | Notes |
|---------|--------|-------|
| Admin Login | ⬜ Pass / ⬜ Fail | |
| Save Data | ⬜ Pass / ⬜ Fail | |
| Load Data | ⬜ Pass / ⬜ Fail | |
| Add Menu Item | ⬜ Pass / ⬜ Fail | |
| Edit Menu Item | ⬜ Pass / ⬜ Fail | |
| Delete Menu Item | ⬜ Pass / ⬜ Fail | |
| Upload Image | ⬜ Pass / ⬜ Fail | |
| Delete Image | ⬜ Pass / ⬜ Fail | |
| Create Offer | ⬜ Pass / ⬜ Fail | |
| Edit Offer | ⬜ Pass / ⬜ Fail | |
| Delete Offer | ⬜ Pass / ⬜ Fail | |
| Restore Delete | ⬜ Pass / ⬜ Fail | |
| Reset Draft | ⬜ Pass / ⬜ Fail | |
| Restore Defaults | ⬜ Pass / ⬜ Fail | |
| Location QR Scan | ⬜ Pass / ⬜ Fail | |
| Revolut QR Scan | ⬜ Pass / ⬜ Fail | |
| OTP Bank QR Scan | ⬜ Pass / ⬜ Fail | |
| International QR Scan | ⬜ Pass / ⬜ Fail | |
| PayPal QR Scan | ⬜ Pass / ⬜ Fail | |
| Mobile Responsive | ⬜ Pass / ⬜ Fail | |

---

## 🔧 QUICK FIXES

### Fix 1: Admin Login Fails
```javascript
// Check backend API is running:
// POST /api/admin/verify with headers:
{
  'x-admin-username': 'your_username',
  'x-admin-key': 'your_password'
}
```

### Fix 2: Changes Not Saving
```javascript
// Check handleSaveSiteData function
// Verify backend responds with:
{
  success: true,
  savedAt: "2026-08-10T02:42:00Z"
}
```

### Fix 3: QR Codes Not Scanning
```bash
# Regenerate all QR codes:
cd d:\Sahara_restaurant
python tools/generate_paypal_qr.py
python tools/generate_otp_payment_qr.py
python tools/generate_international_payment_qr.py
```

### Fix 4: Images Not Uploading
```javascript
// Check file upload configuration
// Max size: 10MB
// Allowed types: .jpg, .jpeg, .png, .webp, .gif
// Backend must save to: site/public/media/
```

---

## ✅ WHEN ALL TESTS PASS

1. ✅ Document any configuration needed
2. ✅ Create admin user guide
3. ✅ Deploy to production
4. ✅ Test again in production environment
5. ✅ Set up monitoring/logging

---

## 📞 SUPPORT

If issues persist:
1. Check browser console for errors (F12)
2. Check network tab for failed requests
3. Check backend logs
4. Verify all dependencies installed (npm install)
5. Try clearing browser cache
6. Test in incognito/private mode
