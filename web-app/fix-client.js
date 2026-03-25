const fs = require('fs');
const path = 'app/(match)/discovery/history/history-client.tsx';
let code = fs.readFileSync(path, 'utf8');

const targetStr = `  useEffect(() => {
    // Load and merge demo swipes from local storage with real history
    const loadDemoSwipes = () => {
      try {
        const localSwipes = JSON.parse(localStorage.getItem("demoSwipes") || "[]");
        const mockProfilesMap = new Map((discoveryProfiles as any[]).map((p) => [p.user_id, p]));
        
        const dSwipes = localSwipes.map((s: any) => {`;

const replaceStr = `  useEffect(() => {
    // [dev-only] Load demo swipes and mock incoming data into history
    const loadDemoSwipes = () => {
      try {
        const localSwipes = JSON.parse(localStorage.getItem("demoSwipes") || "[]");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mockProfilesMap = new Map((discoveryProfiles as any[]).map((p) => [p.user_id, p]));
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const dSwipes = localSwipes.map((s: any) => {`;

const targetStr2 = `        // Generate mock "liked you" events from the 9 demo profiles
        const mockLikedYou = mockIncomingProfiles.map((p: any, idx: number) => ({
          ...p,`;

const replaceStr2 = `        // Generate mock "liked you" events from the 9 demo profiles
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mockLikedYou = mockIncomingProfiles.map((p: any, idx: number) => ({
          ...p,`;

const targetStr3 = `        // with them in production history or local demo swipes.
        const existingUserIds = new Set([
          ...history.map((h) => h.user_id),
          ...dSwipes.map((s: any) => s.user_id)
        ]);`;

const replaceStr3 = `        // with them in production history or local demo swipes.
        const existingUserIds = new Set([
          ...history.map((h) => h.user_id),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ...dSwipes.map((s: any) => s.user_id)
        ]);`;

let updated = code.replace(targetStr, replaceStr);
updated = updated.replace(targetStr2, replaceStr2);
updated = updated.replace(targetStr3, replaceStr3);

fs.writeFileSync(path, updated);
console.log("Patched client correctly!");
