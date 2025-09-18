import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.16.0/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'https://www.gstatic.com/firebasejs/10.16.0/firebase-auth.js';
import { getFirestore, doc, setDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.16.0/firebase-firestore.js';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export async function finalizeRegistrationAndCreateUser(regData, planCode){
  if (!regData || !regData.email) throw new Error('Invalid registration data');
  const { fullname, email, password } = regData;
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  await updateProfile(user, { displayName: fullname });

  const userDoc = {
    uid: user.uid,
    name: fullname,
    displayName: fullname,
    email: email,
    plan: planCode,
    role: 'user',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    avatarUrl: null,
    phone: null,
    about: null,
    dob: null,
    position: null,
    bloodGroup: null
  };
  if(planCode!=='bronze' && planCode!=='free'){userDoc.payment={gateway:'dummy',status:'success',paidAt:serverTimestamp()};}
  await setDoc(doc(db, 'users', user.uid), userDoc);

  sessionStorage.removeItem('wae_registration_data');
  sessionStorage.removeItem('wae_selected_plan');
  sessionStorage.removeItem('wae_selected_plan_label');
  window.location.href = '/profile.html';
}