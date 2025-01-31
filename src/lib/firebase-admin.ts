import { initializeApp, getApps, getApp } from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database";
import { getAuth } from "firebase-admin/auth";

let admin = getApps().length
  ? getApp()
  : initializeApp({
      databaseURL: "https://genkit-by-example-default-rtdb.firebaseio.com/",
    });

export const adminRtdb = getDatabase(admin);
export const adminAuth = getAuth(admin);
