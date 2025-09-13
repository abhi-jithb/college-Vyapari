# Firebase Setup Guide for College വ്യാപാരി

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: `college-vyapari` (or your preferred name)
4. Enable Google Analytics (optional)
5. Click "Create project"

## 2. Enable Authentication

1. In your Firebase project, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" authentication
5. Click "Save"

## 3. Create Firestore Database

1. In your Firebase project, go to "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location close to your users
5. Click "Done"

## 4. Get Firebase Configuration

1. In your Firebase project, go to "Project settings" (gear icon)
2. Scroll down to "Your apps" section
3. Click "Web" icon (`</>`)
4. Register your app with a nickname: `college-vyapari-web`
5. Copy the Firebase configuration object

## 5. Update Firebase Configuration

Replace the placeholder values in `src/config/firebase.ts` with your actual Firebase configuration:

```typescript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-actual-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-actual-sender-id",
  appId: "your-actual-app-id"
};
```

## 6. Set Up Firestore Security Rules

In the Firestore Database section, go to "Rules" tab and replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read and write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Anyone can read hustles, but only authenticated users can write
    match /hustles/{hustleId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 7. Test the Integration

1. Run your development server: `npm run dev`
2. Try creating a new account
3. Try logging in
4. Post a hustle
5. Check if data appears in Firestore Database

## 8. Production Considerations

### Security Rules for Production
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

### Environment Variables
For production, consider using environment variables:

1. Create `.env.local` file:
```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

2. Update `src/config/firebase.ts`:
```typescript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};
```

## 9. Features Enabled

✅ **Authentication**
- Email/Password signup and login
- Persistent authentication state
- Automatic logout on token expiry

✅ **Real-time Data**
- Live updates for hustles
- Real-time collaboration
- Offline support

✅ **Data Persistence**
- User profiles stored in Firestore
- Hustles stored in Firestore
- Cross-device synchronization

✅ **Security**
- Firebase Authentication
- Firestore security rules
- Data validation

## 10. Troubleshooting

### Common Issues:

1. **"Firebase: Error (auth/invalid-api-key)"**
   - Check your Firebase configuration
   - Ensure API key is correct

2. **"Missing or insufficient permissions"**
   - Check Firestore security rules
   - Ensure user is authenticated

3. **"No document to update"**
   - Check if the document exists
   - Verify document ID

4. **Real-time updates not working**
   - Check Firestore security rules
   - Ensure user has read permissions

### Debug Mode:
Add this to your Firebase config for debugging:
```typescript
import { connectAuthEmulator } from 'firebase/auth';
import { connectFirestoreEmulator } from 'firebase/firestore';

if (import.meta.env.DEV) {
  connectAuthEmulator(auth, "http://localhost:9099");
  connectFirestoreEmulator(db, 'localhost', 8080);
}
```
