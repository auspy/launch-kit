// Export all auth handlers
export { createLoginHandler, POST as loginPOST } from './login';
export { createLogoutHandler, POST as logoutPOST } from './logout';
export { createFirebaseLoginHandler, POST as firebaseLoginPOST } from './firebase-login';