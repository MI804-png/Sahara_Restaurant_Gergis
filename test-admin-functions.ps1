# Admin Functions Test Script
# Tests all admin API endpoints for Sahara Restaurant

Write-Host "[TEST] Testing Admin Functions for Sahara Restaurant" -ForegroundColor Cyan
Write-Host "=" * 70
Write-Host ""

# Configuration
$baseUrl = "http://localhost:4173"
$adminUsername = "gorgtap"
$adminKey = "Sahara 612&0611"
$headers = @{
    "x-admin-username" = $adminUsername
    "x-admin-key" = $adminKey
    "Content-Type" = "application/json"
}

# Test Results
$testsRun = 0
$testsPassed = 0
$testsFailed = 0

function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Method,
        [string]$Url,
        [hashtable]$Headers = @{},
        [string]$Body = $null,
        [int]$ExpectedStatus = 200,
        [string]$ExpectedContent = $null
    )
    
    $script:testsRun++
    Write-Host "`n[$script:testsRun] Testing: $Name" -ForegroundColor Yellow
    Write-Host "    Method: $Method $Url"
    
    try {
        $params = @{
            Uri = $Url
            Method = $Method
            Headers = $Headers
            UseBasicParsing = $true
        }
        
        if ($Body) {
            $params.Body = $Body
        }
        
        try {
            $response = Invoke-WebRequest @params
            $actualStatus = $response.StatusCode
        } catch {
            # Handle HTTP error responses (401, 404, etc.)
            if ($_.Exception.Response) {
                $actualStatus = [int]$_.Exception.Response.StatusCode
            } else {
                throw
            }
        }
        
        if ($actualStatus -eq $ExpectedStatus) {
            Write-Host "    [OK] Status: $actualStatus (Expected: $ExpectedStatus)" -ForegroundColor Green
            
            if ($ExpectedContent -and $response) {
                if ($response.Content -like "*$ExpectedContent*") {
                    Write-Host "    [OK] Content contains: $ExpectedContent" -ForegroundColor Green
                    $script:testsPassed++
                    return $true
                } else {
                    Write-Host "    [FAIL] Content does NOT contain: $ExpectedContent" -ForegroundColor Red
                    Write-Host "    Actual: $($response.Content.Substring(0, [Math]::Min(100, $response.Content.Length)))" -ForegroundColor Gray
                    $script:testsFailed++
                    return $false
                }
            } else {
                $script:testsPassed++
                return $true
            }
        } else {
            Write-Host "    [FAIL] Status: $actualStatus (Expected: $ExpectedStatus)" -ForegroundColor Red
            $script:testsFailed++
            return $false
        }
    } catch {
        Write-Host "    [ERROR] Error: $($_.Exception.Message)" -ForegroundColor Red
        $script:testsFailed++
        return $false
    }
}

# ============================================================================
# TEST SUITE
# ============================================================================

Write-Host "`n[BACKEND] BACKEND SERVER TESTS" -ForegroundColor Cyan
Write-Host "-" * 70

# Test 1: Backend is running
Test-Endpoint -Name "Backend is running" `
    -Method "GET" `
    -Url "$baseUrl" `
    -ExpectedStatus 200

# Test 2: Get site data (public endpoint)
Test-Endpoint -Name "Get site data (public)" `
    -Method "GET" `
    -Url "$baseUrl/api/site-data" `
    -ExpectedStatus 200 `
    -ExpectedContent '"ok":true'

Write-Host "`n[AUTH] ADMIN AUTHENTICATION TESTS" -ForegroundColor Cyan
Write-Host "-" * 70

# Test 3: Admin login with correct credentials
Test-Endpoint -Name "Admin login (correct credentials)" `
    -Method "POST" `
    -Url "$baseUrl/api/admin/verify" `
    -Headers $headers `
    -ExpectedStatus 200 `
    -ExpectedContent '"ok":true'

# Test 4: Admin login with wrong credentials
Test-Endpoint -Name "Admin login (wrong credentials)" `
    -Method "POST" `
    -Url "$baseUrl/api/admin/verify" `
    -Headers @{"x-admin-username"="wrong"; "x-admin-key"="wrong"} `
    -ExpectedStatus 401

Write-Host "`n[DATA] DATA MANAGEMENT TESTS" -ForegroundColor Cyan
Write-Host "-" * 70

# Test 5: Get site data with admin auth
Test-Endpoint -Name "Get site data (admin)" `
    -Method "GET" `
    -Url "$baseUrl/api/site-data" `
    -Headers $headers `
    -ExpectedStatus 200 `
    -ExpectedContent 'siteData'

# Test 6: Save site data (requires admin auth)
$testData = @{
    siteData = @{
        hours = @{
            monday = @{ open = "08:00"; close = "16:00"; closed = $false }
            tuesday = @{ open = "08:00"; close = "16:00"; closed = $false }
            wednesday = @{ open = "08:00"; close = "16:00"; closed = $false }
            thursday = @{ open = "08:00"; close = "16:00"; closed = $false }
            friday = @{ open = "08:00"; close = "16:00"; closed = $false }
            saturday = @{ open = "10:00"; close = "18:00"; closed = $false }
            sunday = @{ open = "10:00"; close = "18:00"; closed = $false }
        }
        announcement = @{
            text = "Test announcement from admin test script"
            enabled = $true
        }
    }
} | ConvertTo-Json -Depth 10

Test-Endpoint -Name "Save site data (with admin auth)" `
    -Method "POST" `
    -Url "$baseUrl/api/admin/site-data" `
    -Headers $headers `
    -Body $testData `
    -ExpectedStatus 200 `
    -ExpectedContent 'ok'

# Test 7: Try to save without admin auth (should fail)
Test-Endpoint -Name "Save site data (without admin auth - should fail)" `
    -Method "POST" `
    -Url "$baseUrl/api/admin/site-data" `
    -Headers @{"Content-Type"="application/json"} `
    -Body $testData `
    -ExpectedStatus 401

Write-Host "`n[EVENT] EVENT REGISTRATION TESTS" -ForegroundColor Cyan
Write-Host "-" * 70

# Test 8: Register for event (public)
$eventRegistration = @{
    name = "Test User"
    age = "25"
    gender = "male"
    interests = "Testing, Coding"
    personality = "analytical"
    lookingFor = "Someone fun"
    rating = 4
} | ConvertTo-Json

Test-Endpoint -Name "Register for event (public)" `
    -Method "POST" `
    -Url "$baseUrl/api/register-event" `
    -Headers @{"Content-Type"="application/json"} `
    -Body $eventRegistration `
    -ExpectedStatus 200 `
    -ExpectedContent '"ok":true'

# Test 9: Get event registrations (requires admin)
Test-Endpoint -Name "Get event registrations (admin)" `
    -Method "GET" `
    -Url "$baseUrl/api/admin/event-registrations" `
    -Headers $headers `
    -ExpectedStatus 200 `
    -ExpectedContent 'registrations'

# Test 10: Try to get registrations without auth (should fail)
Test-Endpoint -Name "Get event registrations (no auth - should fail)" `
    -Method "GET" `
    -Url "$baseUrl/api/admin/event-registrations" `
    -ExpectedStatus 401

Write-Host "`n[FRONTEND] FRONTEND TESTS" -ForegroundColor Cyan
Write-Host "-" * 70

# Test 11: Frontend is serving
Test-Endpoint -Name "Frontend homepage" `
    -Method "GET" `
    -Url "http://localhost:5173/" `
    -ExpectedStatus 200 `
    -ExpectedContent '<div'

# Test 12: Admin panel accessible
Test-Endpoint -Name "Admin panel page" `
    -Method "GET" `
    -Url "http://localhost:5173/admin" `
    -ExpectedStatus 200 `
    -ExpectedContent '<div'

Write-Host "`n" + "=" * 70
Write-Host "[RESULTS] TEST RESULTS SUMMARY" -ForegroundColor Cyan
Write-Host "=" * 70
Write-Host ""
Write-Host "Total Tests: $testsRun" -ForegroundColor White
Write-Host "Passed:      $testsPassed" -ForegroundColor Green
Write-Host "Failed:      $testsFailed" -ForegroundColor $(if($testsFailed -gt 0){"Red"}else{"Green"})
Write-Host ""

$passRate = [math]::Round(($testsPassed / $testsRun) * 100, 1)
Write-Host "Pass Rate:   $passRate%" -ForegroundColor $(if($passRate -eq 100){"Green"}elseif($passRate -ge 80){"Yellow"}else{"Red"})
Write-Host ""

if ($testsFailed -eq 0) {
    Write-Host "[PASS] All tests passed! Admin functions are working correctly." -ForegroundColor Green
} else {
    Write-Host "[WARNING] Some tests failed. Please review the errors above." -ForegroundColor Yellow
}

Write-Host "`n[*] ADMIN ACCESS INFO" -ForegroundColor Cyan
Write-Host "-" * 70
Write-Host "Admin Panel URL:  http://localhost:5173/admin"
Write-Host "Admin Username:   $adminUsername"
Write-Host "Admin Password:   $adminKey"
Write-Host "Backend API:      $baseUrl"
Write-Host ""
Write-Host "[KEY] To access admin panel:"
Write-Host "   1. Open: http://localhost:5173/admin"
Write-Host "   2. Enter username: $adminUsername"
Write-Host "   3. Enter password: $adminKey"
Write-Host ""
