# 🧪 SUBMISSION TESTING GUIDE

**Complete step-by-step testing checklist for Commit Message Therapist**

---

## ⚡ SETUP (Do This First)

### Step 1: Start the App
```bash
cd C:\Users\hridy\Desktop\win
npm install  # (if not already done)
cp .env.example .env.local
# ADD YOUR ANTHROPIC_API_KEY to .env.local
npm run dev
```

**Expected:** App runs on `http://localhost:3000` without errors

---

## 🧪 TEST 1: Dark Mode + Light Mode Switching

### ✅ What to Test
The sun/moon toggle button in top-right corner switches between dark and light mode

### 📋 Steps

1. **Start at light mode**
   - [ ] Open http://localhost:3000
   - [ ] Check: Background is light purple/pink gradient
   - [ ] Check: Text is dark purple
   - [ ] Check: Toggle button shows moon icon (🌙)

2. **Click toggle to dark mode**
   - [ ] Click the moon icon button (top-right)
   - [ ] Check: Background changes to dark purple gradient
   - [ ] Check: Text becomes light/white
   - [ ] Check: Toggle button now shows sun icon (☀️)

3. **Click toggle back to light mode**
   - [ ] Click the sun icon
   - [ ] Check: Reverts to light mode
   - [ ] Check: Text is dark again

4. **Test persistence**
   - [ ] Switch to dark mode
   - [ ] Refresh the page (F5 or Cmd+R)
   - [ ] Check: Dark mode persists (remembered!)
   - [ ] Switch to light mode
   - [ ] Refresh again
   - [ ] Check: Light mode persists

### ✅ Success Criteria
- Toggle works smoothly
- Dark mode is readable
- Light mode is readable
- Preference persists after refresh

---

## 🧪 TEST 2: Compare Repos Feature

### ✅ What to Test
Side-by-side analysis of two different repositories

### 📋 Steps

1. **Navigate to Compare mode**
   - [ ] Find the "Analyze" and "Compare repos" buttons below the header
   - [ ] Click "Compare repos"
   - [ ] Check: UI changes to show two input fields side-by-side

2. **Test with valid repos**
   - [ ] In "Repository A" field, paste: `https://github.com/facebook/react`
   - [ ] In "Repository B" field, paste: `https://github.com/vercel/next.js`
   - [ ] Click "Compare"
   - [ ] Check: Loading spinner appears
   - [ ] Wait ~60 seconds for results

3. **Verify comparison results**
   - [ ] Check: Two results appear side-by-side
   - [ ] Check: React metrics on left, Next.js on right
   - [ ] Check: Both show burnout scores (1-10)
   - [ ] Check: Both show severity badges (colored indicators)
   - [ ] Check: Both show diagnosis text

4. **Test error handling**
   - [ ] Leave "Repository B" empty
   - [ ] Click "Compare"
   - [ ] Check: Error message appears: "Enter both repository URLs"
   - [ ] Fill both fields with the SAME repo URL
   - [ ] Click "Compare"
   - [ ] Check: Error appears: "Pick two different repositories"

5. **Switch back to Analyze mode**
   - [ ] Click "Analyze" button
   - [ ] Check: UI reverts to single input field
   - [ ] Check: Previous compare fields are cleared

### ✅ Success Criteria
- Both input fields work
- Can compare two different repos
- Results display side-by-side
- Error messages for empty/same repos
- Can switch back to Analyze mode

---

## 🧪 TEST 3: Featured Diagnoses Buttons

### ✅ What to Test
Example diagnoses on landing page with one-click "Analyze this repo" buttons

### 📋 Steps

1. **Verify Featured section appears**
   - [ ] Go to http://localhost:3000
   - [ ] Click "Analyze" tab
   - [ ] Don't enter a repo URL yet
   - [ ] Scroll down
   - [ ] Check: "Featured diagnoses" section appears with 3 example cards

2. **Check featured examples content**
   - [ ] First card: Shows "🧘" emoji, "React", "34% late-night commits"
   - [ ] Second card: Shows "👑" emoji, "Linux", "Single-author dominance"
   - [ ] Third card: Shows "💀" emoji, "Todo App", "14 months inactive"
   - [ ] Each card shows a severity badge (green/amber/orange/red)
   - [ ] Each card shows burnout score (/10)

3. **Test "Analyze this repo" buttons**
   - [ ] Click "Analyze this repo" on the React card
   - [ ] Check: URL auto-fills in input field
   - [ ] Check: Analysis starts automatically (loading spinner)
   - [ ] Wait for results
   - [ ] Check: Diagnosis appears for React

4. **Test with another featured repo**
   - [ ] Scroll back to featured section
   - [ ] Click "Analyze this repo" on Linux card
   - [ ] Check: Previous React result disappears
   - [ ] Check: URL changes to Linux
   - [ ] Check: Linux diagnosis loads

5. **Test disappearance on result**
   - [ ] Once a diagnosis is displayed
   - [ ] Check: Featured diagnoses section is HIDDEN
   - [ ] (It should only show when no result yet)

### ✅ Success Criteria
- Featured section appears on landing
- Three example cards display correctly
- One-click buttons populate URL and start analysis
- Section disappears when showing a result

---

## 🧪 TEST 4: Newsletter Signup

### ✅ What to Test
Email capture form for newsletter subscription

### 📋 Steps

1. **Locate newsletter section**
   - [ ] On landing page (Analyze tab, no result showing)
   - [ ] Scroll down past featured diagnoses
   - [ ] Check: "Newsletter — repo wellness tips" section appears

2. **Test email input**
   - [ ] Click email input field
   - [ ] Type: `test@example.com`
   - [ ] Check: Input accepts email

3. **Test valid submission**
   - [ ] Click "Subscribe" button
   - [ ] Check: Button changes to "Joining..."
   - [ ] Wait 1-2 seconds
   - [ ] Check: Success message appears: "You're on the list..."
   - [ ] Check: Button changes to "Subscribed" (disabled)
   - [ ] Check: Input field is disabled

4. **Test error handling**
   - [ ] Refresh page (clear state)
   - [ ] Leave email field empty
   - [ ] Click "Subscribe"
   - [ ] Check: Nothing happens (field required)
   - [ ] Type invalid email: `notanemail`
   - [ ] Check: Browser validation prevents submission

5. **Test reset after success**
   - [ ] Submit valid email again
   - [ ] Check: Success message shows
   - [ ] Refresh page
   - [ ] Check: Form resets to initial state

### ✅ Success Criteria
- Email input works
- Submit shows loading state
- Success message displays
- Button disables after submission
- Error handling works

---

## 🧪 TEST 5: Share Via Link Feature

### ✅ What to Test
Shareable permalink for individual diagnoses (`/r/{id}`)

### 📋 Steps

1. **Get a diagnosis first**
   - [ ] Click on "React" featured diagnosis (or analyze any repo)
   - [ ] Wait for results to load
   - [ ] Check: ResultsDashboard appears with diagnosis

2. **Look for share link (if implemented)**
   - [ ] Check if there's a "Share via link" or copy button
   - [ ] Check if diagnosis shows an ID or share URL
   - [ ] **Note:** If button not visible, this feature might be in progress

3. **Copy and test link (if available)**
   - [ ] Look for copy/share button in results
   - [ ] If found: Click to copy link
   - [ ] If found: Paste URL in new tab
   - [ ] Check: Same diagnosis displays without re-analyzing

### ✅ Success Criteria
- Share button visible on results (or not, if not implemented yet)
- Copying link works
- Link opens to same diagnosis

---

## 🧪 TEST 6: Mobile Responsiveness

### ✅ What to Test
App looks good and works on phone/tablet sizes

### 📋 Steps

1. **Open DevTools**
   - [ ] Press F12 (or Cmd+Option+I on Mac)
   - [ ] Look for device icons/responsive toggle
   - [ ] Click to open device emulator

2. **Test iPhone (375px width)**
   - [ ] Select "iPhone SE" or similar (375px)
   - [ ] Check: Header text is readable (not overflowing)
   - [ ] Check: Input field is full width
   - [ ] Check: Button is full width
   - [ ] Analyze a repo
   - [ ] Check: Results stack vertically
   - [ ] Check: Metrics cards are readable
   - [ ] Check: Diagnosis text wraps properly

3. **Test iPad (768px width)**
   - [ ] Select "iPad" or similar (768px)
   - [ ] Check: Featured diagnoses show 2 columns (not 1)
   - [ ] Check: Compare view shows two columns
   - [ ] Analyze a repo
   - [ ] Check: Layout looks balanced

4. **Test toggle button on mobile**
   - [ ] iPhone view
   - [ ] Check: Theme toggle (sun/moon) is visible and clickable
   - [ ] Click it (should work on small screen)

5. **Test keyboard on mobile**
   - [ ] Check: Input field has proper mobile keyboard
   - [ ] Email field should show @ key

### ✅ Success Criteria
- Mobile (375px): Everything readable, no overflow
- Tablet (768px): Good layout
- Touch targets are large enough (buttons)
- Text is readable
- Theme toggle works on mobile

---

## 🧪 TEST 7: Full Analysis Flow (Core Feature)

### ✅ What to Test
Complete analysis of a GitHub repository

### 📋 Steps

1. **Analyze React repository**
   - [ ] Enter: `https://github.com/facebook/react`
   - [ ] Click "Start therapy"
   - [ ] Check: Loading spinner appears with text "Analyzing..."
   - [ ] Wait ~30-60 seconds

2. **Verify results display**
   - [ ] Loading disappears
   - [ ] Check: Repository name shows: "facebook/react"
   - [ ] Check: Metrics dashboard shows:
     - Total commits (number)
     - Late-night % (e.g., "34%")
     - Weekend commits (number)
     - Merge conflicts (number)
     - Burnout score (1-10)

3. **Check diagnosis quality**
   - [ ] Title appears (e.g., "Collective Burnout...")
   - [ ] Emoji shows (🧘)
   - [ ] Severity badge appears (colored)
   - [ ] Diagnosis text is 2-4 paragraphs
   - [ ] Text is funny AND insightful
   - [ ] References real metrics (numbers from the analysis)

4. **Test X (Twitter) share button**
   - [ ] Look for "Share on X" button
   - [ ] Click it
   - [ ] Check: Twitter window opens
   - [ ] Check: Tweet is pre-filled
   - [ ] Check: Tweet includes repo name + diagnosis snippet
   - [ ] Don't post (close the window)

5. **Test copy to clipboard**
   - [ ] Look for "Copy diagnosis" or similar button
   - [ ] Click it
   - [ ] Check: Button changes to "Copied!" or similar
   - [ ] Open text editor
   - [ ] Paste (Ctrl+V or Cmd+V)
   - [ ] Check: Diagnosis text pastes correctly

6. **Test with different repo**
   - [ ] Click "Analyze" tab
   - [ ] Clear input field
   - [ ] Enter: `https://github.com/torvalds/linux`
   - [ ] Press Ctrl+Enter (or Cmd+Enter on Mac) to submit
   - [ ] Check: Linux diagnosis loads (different from React)

### ✅ Success Criteria
- Analysis completes in <60 seconds
- All metrics display
- Diagnosis is present and witty
- Severity badge shows correct color
- Twitter share works
- Copy to clipboard works
- Multiple repos show different diagnoses

---

## 🧪 TEST 8: Error Handling

### ✅ What to Test
App handles errors gracefully

### 📋 Steps

1. **Test invalid URL**
   - [ ] Enter: `not-a-valid-url`
   - [ ] Click "Start therapy"
   - [ ] Check: Error message appears: "That doesn't look like a public GitHub repo URL"

2. **Test private repository**
   - [ ] Enter: `https://github.com/your-private-repo` (if you have one)
   - [ ] Click "Start therapy"
   - [ ] Check: Error message appears: "This repo appears to be private"

3. **Test non-existent repo**
   - [ ] Enter: `https://github.com/definitely/fake-repo-12345`
   - [ ] Click "Start therapy"
   - [ ] Check: Error message appears: "Repository not found"

4. **Test empty input**
   - [ ] Leave input empty
   - [ ] Click "Start therapy"
   - [ ] Check: Error message appears: "Please paste a GitHub repository URL"

5. **Check error UI**
   - [ ] Error message has red background
   - [ ] Error message is readable
   - [ ] Can clear error by entering valid URL

### ✅ Success Criteria
- Invalid URLs show helpful error message
- Private repos rejected with clear message
- 404 repos handled gracefully
- Empty input validation works
- Error UI is professional

---

## 🧪 TEST 9: Keyboard Shortcuts

### ✅ What to Test
Cmd/Ctrl+Enter submits the form

### 📋 Steps

1. **Test Cmd+Enter (Mac) or Ctrl+Enter (Windows)**
   - [ ] Click in the URL input field
   - [ ] Paste: `https://github.com/facebook/react`
   - [ ] Press Cmd+Enter (Mac) or Ctrl+Enter (Windows)
   - [ ] Check: Analysis starts (no need to click button)

2. **Verify button still works**
   - [ ] Enter different URL: `https://github.com/vercel/next.js`
   - [ ] Click "Start therapy" button normally
   - [ ] Check: Analysis works

### ✅ Success Criteria
- Keyboard shortcut works
- Regular button still works
- Consistent behavior

---

## 🚀 DEPLOYMENT TEST

### Step 1: Deploy to Vercel

```bash
# 1. Push to GitHub (if not done)
cd C:\Users\hridy\Desktop\win
git add .
git commit -m "Add polish layer: dark mode, compare, featured diagnoses"
git push origin main

# 2. Go to vercel.com and import your repo
# 3. Add environment variable in Vercel settings:
#    ANTHROPIC_API_KEY = [your key from console.anthropic.com]
# 4. Click Deploy
```

### Step 2: Test Live Deploy

- [ ] Wait for Vercel build to complete
- [ ] Click the deployment link
- [ ] Check: App loads
- [ ] Check: Dark/light mode works on live
- [ ] Test one analysis (takes ~60s on Vercel)
- [ ] Copy live URL for submission

---

## 📹 TEST 10: Recording Demo Video

### Step 1: Open Screen Recorder
- Windows: Win+G (Windows Game Bar) or use OBS
- Mac: Cmd+Shift+5 (QuickTime)

### Step 2: Record These Sections (2-3 minutes total)

**Section 1: Landing Page (0:00-0:20)**
- [ ] Show featured diagnoses
- [ ] Show what we analyze section
- [ ] Show theme toggle in corner

**Section 2: Theme Toggle (0:20-0:35)**
- [ ] Click dark mode toggle
- [ ] Show dark theme
- [ ] Click light mode toggle
- [ ] Show light theme

**Section 3: Basic Analysis (0:35-1:15)**
- [ ] Enter React URL
- [ ] Click "Start therapy"
- [ ] Show loading spinner
- [ ] Show results:
  - Metrics dashboard
  - Burnout score
  - Severity badge (colored)
  - Diagnosis text

**Section 4: Featured Diagnoses (1:15-1:45)**
- [ ] Scroll to featured section
- [ ] Click "Analyze this repo" on Linux card
- [ ] Show auto-fill + auto-analysis
- [ ] Show different diagnosis for Linux

**Section 5: Twitter Share (1:45-2:00)**
- [ ] Click "Share on X" button
- [ ] Show pre-filled tweet window
- [ ] Close (don't post)

**Section 6: Compare Mode (2:00-2:30)**
- [ ] Click "Compare repos"
- [ ] Enter two different repos
- [ ] Click "Compare"
- [ ] Show side-by-side results

### Upload to YouTube
1. Go to youtube.com
2. Click Upload (camera icon)
3. Upload your video
4. Title: "Commit Message Therapist - AI Git Therapy"
5. Description: "AI analyzes Git history and generates witty mental health diagnoses"
6. Make it **Unlisted** (not private, but not public)
7. Copy the YouTube link

---

## 📝 UPDATE README

### Edit `C:\Users\hridy\Desktop\win\README.md`

1. **Line 3:** Replace `YOUR_USERNAME` with your actual GitHub username
   ```
   [![GitHub stars](https://img.shields.io/github/stars/YOUR_USERNAME/commit-message-therapist?style=social)](https://github.com/YOUR_USERNAME/commit-message-therapist)
   ```
   Should become:
   ```
   [![GitHub stars](https://img.shields.io/github/stars/your-actual-username/commit-message-therapist?style=social)](https://github.com/your-actual-username/commit-message-therapist)
   ```

2. Check all links work
3. Verify example repos are correct
4. Save file

---

## ✅ FINAL CHECKLIST

Before submitting, verify:

- [ ] Dark mode toggle works
- [ ] Light mode toggle works
- [ ] Dark mode preference persists
- [ ] Light mode preference persists
- [ ] Compare repos analyzes two repos
- [ ] Featured diagnoses load
- [ ] Featured buttons start analysis
- [ ] Newsletter signup works
- [ ] Share via link works (if implemented)
- [ ] Mobile looks good (iPhone view)
- [ ] Mobile looks good (iPad view)
- [ ] Theme toggle works on mobile
- [ ] React analysis works and shows real metrics
- [ ] Linux analysis works and shows different diagnosis
- [ ] Error handling for invalid URLs
- [ ] Error handling for private repos
- [ ] Keyboard shortcut (Cmd/Ctrl+Enter) works
- [ ] Twitter share button works
- [ ] Copy to clipboard works
- [ ] Live Vercel deployment works
- [ ] Demo video recorded and uploaded (unlisted)
- [ ] README updated with correct GitHub username
- [ ] All links in README work

---

## 🎉 READY FOR SUBMISSION

Once all tests pass:

1. **Submit via Typeform**
   - https://xsxo494365r.typeform.com/to/uT6R8vhf
   - Project Name: Commit Message Therapist
   - GitHub URL: `https://github.com/YOUR_USERNAME/commit-message-therapist`
   - Demo URL: `https://your-vercel-domain.vercel.app`
   - Description: "AI therapist analyzes your Git history and generates witty mental health diagnoses."
   - Demo Video: `https://www.youtube.com/watch?v=YOUR_VIDEO_ID`

2. **Post on X/Twitter**
   - Include GitHub link
   - Include demo link
   - Tag @injective, @NinjaLabsHQ, @NinjaLabsCN

3. **SUBMIT BEFORE 11:59pm May 31st**

---

**Good luck! 🚀**
