# Firestore Security Rules Debug

## Current Issue
You're getting "user already exists" error even with new emails. This suggests either:
1. Firestore security rules are blocking document creation
2. Google authentication is working but user document creation is failing
3. There's a caching issue with the authentication state

## Quick Fix - Test Rules

### 1. Temporarily Use Open Rules (FOR TESTING ONLY)
In Firebase Console → Firestore Database → Rules, replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

**⚠️ WARNING: These rules are completely open. Only use for testing!**

### 2. Test Authentication
1. Open your app in browser
2. Open Developer Tools (F12)
3. Go to Console tab
4. Try Google sign-in
5. Check console logs for detailed error messages

### 3. Check Firestore Database
1. Go to Firebase Console → Firestore Database
2. Check if any user documents are being created
3. Look for error messages in the console

## Proper Production Rules

After testing, use these secure rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /hustles/{hustleId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && 
        request.auth.uid == resource.data.postedBy;
      allow update: if request.auth != null && 
        (request.auth.uid == resource.data.postedBy || 
         request.auth.uid == resource.data.acceptedBy);
    }
  }
}
```

## Debug Steps

### Step 1: Check Console Logs
Look for these specific log messages:
- "Starting Google sign-in..."
- "Google sign-in successful: [uid] [email]"
- "Checking user document in Firestore..."
- "User document exists: true/false"
- "Creating new user document..."
- "User document created successfully"

### Step 2: Check Firebase Console
1. Authentication → Users (check if Google user is created)
2. Firestore Database → Data (check if user document exists)
3. Firestore Database → Rules (check current rules)

### Step 3: Check Network Tab
1. Open Developer Tools → Network tab
2. Try Google sign-in
3. Look for failed requests to Firestore
4. Check error responses

## Common Issues & Solutions

### Issue 1: "Missing or insufficient permissions"
**Solution:** Update Firestore rules (use test rules above first)

### Issue 2: "User document not found"
**Solution:** Check if user document creation is failing

### Issue 3: "Google sign-in successful but no user document"
**Solution:** Check Firestore rules and network requests

### Issue 4: "User already exists" for new emails
**Solution:** This might be a caching issue - try incognito mode

## Test with Different Scenarios

### Test 1: New Google Account
1. Use incognito mode
2. Try Google sign-in with a completely new Google account
3. Check console logs

### Test 2: Existing Google Account
1. Use incognito mode
2. Try Google sign-in with an existing Google account
3. Check if it goes directly to dashboard

### Test 3: Clear Browser Data
1. Clear all browser data for your site
2. Try Google sign-in again
3. Check console logs

## Next Steps

1. **First**: Try the open Firestore rules (temporarily)
2. **Second**: Test Google sign-in and check console logs
3. **Third**: Check Firebase Console for user creation
4. **Fourth**: Report back what you see in the logs

Let me know what you see in the console logs and I'll help you fix the specific issue!
