# ⚡ QUICK TEST CHECKLIST

**Use this while testing — check off as you go**

---

## 🚀 START HERE

```bash
cd C:\Users\hridy\Desktop\win
npm install
cp .env.example .env.local
# Add your ANTHROPIC_API_KEY to .env.local
npm run dev
```

Open: http://localhost:3000

---

## ✅ QUICK TESTS (5 minutes each)

### 1️⃣ Dark Mode (2 min)
- [ ] Click moon icon (top-right)
- [ ] Check dark theme loads
- [ ] Click sun icon
- [ ] Check light theme loads
- [ ] Refresh page
- [ ] Check preference remembered

**Expected:** Theme switches smoothly and persists

---

### 2️⃣ Featured Diagnoses (2 min)
- [ ] Scroll down on landing page
- [ ] See 3 example cards (React, Linux, Todo)
- [ ] Click "Analyze this repo" on React
- [ ] Check URL auto-fills + analysis starts
- [ ] Wait for results

**Expected:** Featured examples are clickable and start analysis

---

### 3️⃣ Compare Repos (3 min)
- [ ] Click "Compare repos" button
- [ ] Paste: `https://github.com/facebook/react` in field A
- [ ] Paste: `https://github.com/vercel/next.js` in field B
- [ ] Click "Compare"
- [ ] Wait ~60 seconds

**Expected:** Two diagnoses show side-by-side

---

### 4️⃣ Newsletter (1 min)
- [ ] Scroll to "Newsletter" section
- [ ] Type: `test@example.com`
- [ ] Click "Subscribe"
- [ ] Check success message

**Expected:** Email accepted, success message shows

---

### 5️⃣ Core Analysis (3 min)
- [ ] Click "Analyze" tab
- [ ] Paste: `https://github.com/torvalds/linux`
- [ ] Click "Start therapy"
- [ ] Wait for results

**Expected:** Diagnosis loads with metrics, severity badge, text

---

### 6️⃣ Mobile Test (2 min)
- [ ] Press F12 (DevTools)
- [ ] Click responsive/device icon
- [ ] Select iPhone (375px)
- [ ] Check: No text overflow
- [ ] Check: Button fits width
- [ ] Click theme toggle (should work)

**Expected:** App is readable on mobile

---

### 7️⃣ Error Handling (1 min)
- [ ] Enter invalid URL: `not-a-url`
- [ ] Click submit
- [ ] Check error message shows

**Expected:** Clear error message appears

---

### 8️⃣ Keyboard Shortcut (1 min)
- [ ] Paste URL in input
- [ ] Press Ctrl+Enter (Windows) or Cmd+Enter (Mac)
- [ ] Check analysis starts

**Expected:** Keyboard shortcut works as expected

---

### 9️⃣ Twitter Share (1 min)
- [ ] Get a diagnosis result
- [ ] Look for "Share on X" button
- [ ] Click it
- [ ] Check tweet pre-fills with repo name

**Expected:** Twitter window opens with pre-filled tweet

---

### 🔟 Live Deployment (5 min)
- [ ] Push to GitHub
- [ ] Deploy to Vercel
- [ ] Visit live URL
- [ ] Analyze one repo
- [ ] Check it works on live

**Expected:** Live version works without errors

---

## 📝 PRE-SUBMISSION

- [ ] README updated with your GitHub username
- [ ] Demo video recorded (2-3 min) and uploaded to YouTube (unlisted)
- [ ] Vercel deployment URL working
- [ ] GitHub repo is public
- [ ] win.pdf (roadmap) saved in repo

---

## 🎯 SUBMISSION

When all tests pass:

1. **Typeform** (https://xsxo494365r.typeform.com/to/uT6R8vhf)
   - [ ] Project Name: Commit Message Therapist
   - [ ] GitHub URL: [your repo]
   - [ ] Demo URL: [Vercel URL]
   - [ ] Description: Copy from README
   - [ ] Video: [YouTube link]

2. **X/Twitter**
   - [ ] Post about project
   - [ ] Include demo link + GitHub link
   - [ ] Tag @injective @NinjaLabsHQ

3. **Check Time**
   - [ ] Submit BEFORE 11:59pm May 31st

---

## 🏁 DONE!

If all ✅ checks pass, you're ready to submit and **WIN!** 🏆

---

**Issues?**
- Check TESTING_GUIDE.md for detailed steps
- Check README.md for environment setup
- Check console (F12) for any errors
