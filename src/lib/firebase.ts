import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  Firestore,
} from 'firebase/firestore';
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
  User,
  Auth,
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { InquiryFormData } from '../types';

// Initialize Firebase App instance
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore targeting the provisioned database ID
export const db: Firestore = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Initialize Firebase Authentication
export const auth: Auth = getAuth(app);

/**
 * Ensures the client has an active authenticated session (anonymous auth if not signed in)
 * to comply with secure Firestore database rules.
 */
export async function ensureAuth(): Promise<User> {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        unsubscribe();
        resolve(user);
      } else {
        try {
          const credential = await signInAnonymously(auth);
          unsubscribe();
          resolve(credential.user);
        } catch (error) {
          unsubscribe();
          reject(error);
        }
      }
    });
  });
}

export interface StoredInquiryPayload extends InquiryFormData {
  submittedAt: string;
  createdAt: any;
  status: 'pending' | 'reviewed' | 'contacted';
  userAgent?: string;
  authUid?: string;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map((provider) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

/**
 * Stores a new project inquiry submission in Firebase Firestore
 */
export async function submitProjectInquiry(formData: InquiryFormData): Promise<{
  id: string;
  referenceNumber: string;
}> {
  // Ensure authentication state (anonymous auth session)
  let currentUser: User | null = null;
  try {
    currentUser = await ensureAuth();
  } catch (authErr) {
    console.warn('Anonymous authentication not available, continuing with public write if allowed:', authErr);
  }

  // Generate a human-readable tracking reference (e.g. DCP-2026-8942)
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const referenceNumber = `DCP-${new Date().getFullYear()}-${randomSuffix}`;

  const path = 'inquiries';
  try {
    const inquiryCollection = collection(db, path);
    const docRef = await addDoc(inquiryCollection, {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      company: formData.company ? formData.company.trim() : '',
      projectType: formData.projectType,
      budgetRange: formData.budgetRange || 'Flexible',
      timeline: formData.timeline,
      description: formData.description ? formData.description.trim() : '',
      selectedTech: formData.selectedTech || [],
      referenceNumber,
      status: 'pending',
      authUid: currentUser ? currentUser.uid : 'guest',
      submittedAt: new Date().toISOString(),
      createdAt: serverTimestamp(),
    });

    return {
      id: docRef.id,
      referenceNumber,
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export interface NewsletterSubscriptionResult {
  id: string;
  email: string;
}

/**
 * Subscribes a user email address to the company updates newsletter in Firebase Firestore
 */
export async function subscribeToNewsletter(
  email: string,
  source = 'newsletter_component'
): Promise<NewsletterSubscriptionResult> {
  const normalizedEmail = email.trim().toLowerCase();

  // Defensive validation against volumetric & structural boundary
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!normalizedEmail || !emailRegex.test(normalizedEmail) || normalizedEmail.length > 150) {
    throw new Error('Please enter a valid email address (up to 150 characters).');
  }

  // Ensure active session
  try {
    await ensureAuth();
  } catch {
    // Continue even if auth setup fallback occurs
  }

  const path = 'newsletter_subscribers';
  try {
    const subscribersCollection = collection(db, path);
    const docRef = await addDoc(subscribersCollection, {
      email: normalizedEmail,
      source: source.slice(0, 50),
      status: 'active',
      subscribedAt: new Date().toISOString(),
      createdAt: serverTimestamp(),
    });

    return {
      id: docRef.id,
      email: normalizedEmail,
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}
