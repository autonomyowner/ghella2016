// Simple Firebase configuration verification
// Run this with: node verify-firebase.js

const firebaseConfig = {
  apiKey: "AIzaSyCFcIIgkwozEjDgE0Pi1gMGRIq9UtJtxQE",
  authDomain: "gheella.firebaseapp.com",
  projectId: "gheella",
  storageBucket: "gheella.appspot.com",
  messagingSenderId: "361810342750",
  appId: "1:361810342750:web:a2e889a97ec51ff58195cf",
  measurementId: "G-VWE8FSW324"
};

console.log('🔍 Firebase Configuration Check:');
console.log('================================');

// Check if all required fields are present
const requiredFields = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
const missingFields = requiredFields.filter(field => !firebaseConfig[field]);

if (missingFields.length > 0) {
  console.log('❌ Missing required fields:', missingFields);
} else {
  console.log('✅ All required fields are present');
}

// Check field values
console.log('\n📋 Configuration Details:');
console.log('API Key:', firebaseConfig.apiKey ? '✅ Present' : '❌ Missing');
console.log('Auth Domain:', firebaseConfig.authDomain);
console.log('Project ID:', firebaseConfig.projectId);
console.log('Storage Bucket:', firebaseConfig.storageBucket);
console.log('Messaging Sender ID:', firebaseConfig.messagingSenderId);
console.log('App ID:', firebaseConfig.appId);

console.log('\n🔗 Next Steps:');
console.log('1. Go to https://console.firebase.google.com/');
console.log('2. Check if project "gheella" exists');
console.log('3. If not, create it with the same name');
console.log('4. Or create a new project and update .env.local');
console.log('5. Enable Authentication (Email/Password)');
console.log('6. Create Firestore database');

console.log('\n🧪 Test your setup at: http://localhost:3000/test-firebase'); 