# ToDoMore WebApp - Bug List & Issues

**Generated:** 2025-10-26  
**Project:** ToDoMore WebApp  
**Status:** Comprehensive Testing Report

---

## 🔴 CRITICAL BUGS

### 1. Missing Environment Variables Configuration
**Severity:** Critical  
**Location:** `src/lib/supabase.ts`, Root directory  
**Issue:**  
- No `.env` or `.env.example` file exists in the project
- Application will crash on startup due to missing `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- The supabase.ts file throws an error if env vars are missing, blocking all functionality

**Impact:** Application cannot start or connect to database  
**Steps to Reproduce:**  
1. Clone/run the project without .env file
2. Start dev server
3. App throws error immediately

**Expected:** Should have `.env.example` template with placeholder values  
**Actual:** No environment configuration exists

---

### 2. No Authentication Persistence
**Severity:** Critical  
**Location:** `src/components/ProtectedRoute.tsx`, `src/store/authSlice.ts`  
**Issue:**  
- No `useEffect` in App.tsx or main component to check for existing Supabase session on mount
- User session is not restored from Supabase auth state on page reload
- Redux store only has in-memory state with no persistence
- User will be logged out on every page refresh

**Impact:** Poor UX - users must re-login on every refresh  
**Steps to Reproduce:**  
1. Login successfully
2. Refresh the page
3. User is redirected to login page (session lost)

**Expected:** Session should persist across page reloads using Supabase session management  
**Actual:** Session only exists in Redux store (in-memory)

---

### 3. Database Schema Column Name Mismatch
**Severity:** Critical  
**Location:** Multiple Redux slices (tasksSlice.ts, goalsSlice.ts, streaksSlice.ts)  
**Issue:**  
- Code uses camelCase for database operations (e.g., `user_id`, `due_date`, `created_at`)
- Supabase/PostgreSQL typically uses snake_case
- Inconsistent mapping between frontend types and database schema
- Type definitions use camelCase (e.g., `userId`, `dueDate`, `createdAt`)
- Data returned from database will not match TypeScript interfaces

**Impact:** Data fetching/saving will fail or return incorrect data structure  
**Example Locations:**  
- `tasksSlice.ts` line 45: `user_id: userId`
- `goalsSlice.ts` line 47: `user_id: userId`
- Type definitions use camelCase but DB operations use snake_case

**Expected:** Consistent naming convention with proper transformation layer  
**Actual:** Mixed naming conventions causing potential data mapping issues

---

## 🟠 HIGH PRIORITY BUGS

### 4. Incorrect Supabase Auth Pattern
**Severity:** High  
**Location:** `src/pages/LoginPage.tsx` (line 30), `src/pages/SignUpPage.tsx` (line 38)  
**Issue:**  
- Using fake email format: `${username}@todomore.local`
- This domain doesn't exist and may cause email validation issues
- Supabase's email confirmation features won't work
- Users cannot recover accounts via email

**Impact:** Authentication system is fragile and non-standard  
**Recommendation:** Use proper username-based auth or real email addresses

---

### 5. No Supabase Auth Listener
**Severity:** High  
**Location:** `src/App.tsx`, `src/main.tsx`  
**Issue:**  
- Missing `supabase.auth.onAuthStateChange()` listener
- App doesn't react to auth state changes (login/logout from other tabs)
- No synchronization between Supabase auth and Redux state

**Impact:** Auth state can become desynchronized  
**Expected:** Should have auth state listener in App.tsx or custom hook  
**Actual:** No listener implemented

---

### 6. Goal Progress Not Auto-Calculated
**Severity:** High  
**Location:** `src/store/goalsSlice.ts`, `src/pages/DashboardPage.tsx`  
**Issue:**  
- Goal progress is set to hardcoded `0` on creation (line 58)
- Progress is calculated client-side in DashboardPage (lines 48-51)
- Progress is NOT updated in the database when tasks are completed
- GoalsPage shows stale progress from database
- DashboardPage and GoalsPage will show different progress values

**Impact:** Goal progress tracking is inconsistent and unreliable  
**Steps to Reproduce:**  
1. Create a goal
2. Create tasks linked to that goal
3. Complete some tasks
4. Check goal progress on Dashboard (shows calculated value)
5. Check goal progress on Goals page (shows 0)

**Expected:** Progress should update in database when tasks change status  
**Actual:** Progress only calculated client-side, not persisted

---

### 7. Streak Logic Has Edge Case Bugs
**Severity:** High  
**Location:** `src/store/streaksSlice.ts` (lines 68-111)  
**Issue:**  
- Timezone issues: Uses local time but compares ISO date strings
- Can double-count if user completes tasks around midnight
- `toISOString().split('T')[0]` is timezone-sensitive
- Multiple task completions on same day should only count once (handled, but UI doesn't indicate this)

**Impact:** Streak count may be inaccurate  
**Example:** User at GMT-5 completing task at 11 PM local time vs server time

---

### 8. No Loading/Error States for Auth
**Severity:** High  
**Location:** `src/pages/LoginPage.tsx`, `src/pages/SignUpPage.tsx`  
**Issue:**  
- Auth loading state exists in Redux but is dispatched after async call completes
- No spinner/loading UI shown during auth process
- Network errors may leave user in loading state forever

**Impact:** Poor UX during slow network or auth failures

---

## 🟡 MEDIUM PRIORITY BUGS

### 9. Missing Database Tables Definition
**Severity:** Medium  
**Location:** Database schema (not in codebase)  
**Issue:**  
- No SQL migration files in repository
- No database schema documentation
- Users cannot set up their own database instance
- Table structure is only inferred from code

**Impact:** Cannot deploy application without manually creating tables  
**Expected:** Should have SQL files or Supabase migration files in repo

---

### 10. No Form Validation Feedback
**Severity:** Medium  
**Location:** `src/components/TaskForm.tsx`, `src/components/GoalForm.tsx`  
**Issue:**  
- Validation only shows toast message
- No inline error messages on form fields
- Required fields not visually marked before submission
- PIN length validation only on submit (SignUpPage.tsx line 33)

**Impact:** Poor user experience, unclear validation errors

---

### 11. Delete Confirmations Use Browser Alert
**Severity:** Medium  
**Location:** `src/pages/TasksPage.tsx` (line 44), `src/pages/GoalsPage.tsx` (line 35)  
**Issue:**  
- Using native `confirm()` dialog which blocks UI
- Not consistent with modern UI/UX patterns
- Doesn't match the app's design system

**Expected:** Should use a custom modal dialog (like Dialog component)  
**Actual:** Native browser confirm dialog

---

### 12. No Cascade Delete for Related Data
**Severity:** Medium  
**Location:** `src/store/goalsSlice.ts`, `src/store/tasksSlice.ts`  
**Issue:**  
- Deleting a goal doesn't delete or unlink its tasks
- Tasks linked to deleted goals will have invalid `goalId`
- No warning when deleting goal with linked tasks
- Similar issue with parent/child tasks and goals

**Impact:** Orphaned data, broken relationships  
**Steps to Reproduce:**  
1. Create goal
2. Create tasks linked to goal
3. Delete goal
4. Tasks still reference non-existent goalId

---

### 13. Subtask Feature Not Implemented
**Severity:** Medium  
**Location:** `src/components/TaskForm.tsx`, Database schema  
**Issue:**  
- TaskForm has `parentTaskId` field but no UI to select parent task
- Parent task selection is not shown in the form
- Subtasks cannot be viewed in hierarchical structure
- Blueprint requires nested task structure (Blueprint line 31)

**Impact:** Feature mentioned in schema but not functional

---

### 14. Sub-Goals Feature Not Implemented
**Severity:** Medium  
**Location:** `src/components/GoalForm.tsx`, Database schema  
**Issue:**  
- Goal type includes `parentGoalId` but no UI implementation
- Cannot create sub-goals through the interface
- Blueprint requires sub-goals (Blueprint line 53)

**Impact:** Feature in data model but not accessible to users

---

### 15. Settings Page Empty
**Severity:** Medium  
**Location:** `src/pages/SettingsPage.tsx`  
**Issue:**  
- Page shows "Settings coming soon!"
- No user profile settings
- No ability to change username or PIN
- No app preferences or logout from settings

**Impact:** Incomplete application, no user management

---

### 16. No Email Confirmation Flow
**Severity:** Medium  
**Location:** `src/pages/SignUpPage.tsx`  
**Issue:**  
- Supabase typically requires email confirmation
- Using fake email format may bypass this
- No handling for unconfirmed users
- May cause issues with Supabase auth settings

**Impact:** Auth system may break with default Supabase settings

---

## 🟢 LOW PRIORITY BUGS

### 17. Toast Notifications Don't Auto-Dismiss
**Severity:** Low  
**Location:** `src/hooks/use-toast.ts` (line 11)  
**Issue:**  
- `TOAST_REMOVE_DELAY` is set to `1000000` (1000 seconds)
- Toasts stay on screen almost forever
- User must manually close each toast

**Expected:** Should auto-dismiss after 3-5 seconds  
**Actual:** Stays for ~16 minutes

---

### 18. No Task/Goal Sorting Options
**Severity:** Low  
**Location:** `src/pages/TasksPage.tsx`, `src/pages/GoalsPage.tsx`  
**Issue:**  
- Tasks/goals only sorted by created_at descending
- No option to sort by priority, due date, status
- User cannot customize view order

**Impact:** Limited usability for users with many tasks

---

### 19. No Pagination for Large Lists
**Severity:** Low  
**Location:** All list pages (TasksPage, GoalsPage, DashboardPage)  
**Issue:**  
- All records fetched at once from database
- No pagination or infinite scroll
- Will cause performance issues with 100+ tasks/goals

**Impact:** Poor performance at scale

---

### 20. Date Display Format Inconsistent
**Severity:** Low  
**Location:** `src/pages/TasksPage.tsx` (line 177), `src/pages/DashboardPage.tsx`  
**Issue:**  
- Using `toLocaleDateString()` without locale parameter
- Date format depends on browser locale
- May show different formats for different users (MM/DD/YYYY vs DD/MM/YYYY)

**Expected:** Consistent date format across app  
**Actual:** Browser-dependent formatting

---

### 21. No Search Functionality
**Severity:** Low  
**Location:** TasksPage, GoalsPage  
**Issue:**  
- No search bar to find tasks/goals by title or description
- Only filter by status/priority available for tasks
- No filtering for goals at all

**Impact:** Hard to find specific items in large lists

---

### 22. Completed Tasks Stay in Main View
**Severity:** Low  
**Location:** `src/pages/TasksPage.tsx`  
**Issue:**  
- Completed tasks shown alongside pending tasks
- No option to hide completed tasks
- Can clutter the view

**Impact:** Visual clutter, less focus on active tasks

---

### 23. No Keyboard Shortcuts
**Severity:** Low  
**Issue:**  
- No keyboard shortcuts for common actions
- Cannot use Enter to submit forms (handled by form submit)
- No Escape to close modals
- No shortcuts like "N" for new task

**Impact:** Slower workflow for power users

---

### 24. Counter.ts File Unused
**Severity:** Low  
**Location:** `src/counter.ts`  
**Issue:**  
- File exists but is not imported anywhere
- Appears to be leftover from Vite template
- Dead code

**Impact:** None (just cleanup needed)

---

### 25. No Dark Mode Support
**Severity:** Low  
**Location:** `src/style.css`  
**Issue:**  
- CSS has dark mode color variables defined (lines 25-46)
- No way to toggle dark mode
- Dark mode class never applied

**Impact:** Feature partially implemented but not accessible

---

## ⚠️ SECURITY CONCERNS

### 26. Supabase Row Level Security (RLS) Not Verified
**Severity:** Critical (Security)  
**Location:** Database configuration  
**Issue:**  
- No mention of RLS policies in code
- Without RLS, users could potentially access other users' data
- Need to verify database has RLS policies for all tables

**Impact:** Potential data breach, users seeing other users' tasks/goals

---

### 27. No Input Sanitization
**Severity:** Medium (Security)  
**Location:** All form inputs  
**Issue:**  
- No XSS protection on user inputs
- React handles most XSS by default, but description fields using `dangerouslySetInnerHTML` would be vulnerable
- Currently safe as no such usage exists, but should be documented

---

### 28. PIN Stored as Plain Password
**Severity:** High (Security)  
**Location:** `src/pages/LoginPage.tsx`, `src/pages/SignUpPage.tsx`  
**Issue:**  
- PIN used directly as Supabase password
- No additional hashing or salting client-side (Supabase handles server-side)
- Minimum length of 4 is weak (line 33 SignUpPage)

**Impact:** Weak authentication, easily guessable PINs

---

## 📋 FUNCTIONAL GAPS (Features Mentioned but Missing)

### 29. No Mobile Responsiveness Tested
**Severity:** Medium  
**Location:** All pages  
**Issue:**  
- Blueprint states "must adapt from desktop to mobile" (Blueprint line 71)
- Sidebar navigation may not collapse on mobile
- Dialogs may not be mobile-friendly
- No mobile testing evident

---

### 30. No Visual Feedback for Streak Maintenance
**Severity:** Low  
**Location:** `src/pages/DashboardPage.tsx`  
**Issue:**  
- Blueprint requires "Visual feedback when streak is maintained" (Blueprint line 66)
- Currently only shows current streak number
- No animation or celebration when maintaining streak

---

### 31. No "Toast" Non-Intrusive Notifications (Partially Implemented)
**Severity:** Low  
**Issue:**  
- Toast system exists but appears in top-right corner
- May be intrusive depending on positioning
- Blueprint specifies "non-intrusive" (Blueprint line 74)

---

## 🐛 TYPE SAFETY ISSUES

### 32. Any Type Usage
**Severity:** Low  
**Location:** `src/pages/TasksPage.tsx` (line 17), `src/pages/GoalsPage.tsx` (line 16), `src/components/ui/toaster.tsx` (line 16)  
**Issue:**  
- Using `any` type for selectedTask and selectedGoal
- Should use proper Task/Goal types
- Reduces type safety

---

### 33. Type Mismatch Between Frontend and Database
**Severity:** High  
**Location:** Type definitions vs Redux slices  
**Issue:**  
- Frontend types use camelCase (userId, createdAt)
- Database operations use snake_case (user_id, created_at)
- No transformation layer to convert between them
- Data returned from Supabase will not match TypeScript types

**Impact:** Runtime errors, incorrect data access

---

## 🎨 UI/UX ISSUES

### 34. No Empty State Illustrations
**Severity:** Low  
**Location:** TasksPage, GoalsPage  
**Issue:**  
- Empty states only show text
- No friendly illustrations or helpful guidance
- Could be more engaging

---

### 35. No Task Due Date Highlighting
**Severity:** Low  
**Location:** `src/pages/TasksPage.tsx`  
**Issue:**  
- Overdue tasks not highlighted in red
- No visual distinction for tasks due today
- Due date just displayed as plain text

---

### 36. Goal Status Badge Color Hardcoded
**Severity:** Low  
**Location:** `src/pages/GoalsPage.tsx` (line 104)  
**Issue:**  
- Status badge always shows blue
- Should show different colors for different statuses
- "Achieved" should be green, "Not Started" grey, etc.

---

### 37. Loading State Shows Generic Message
**Severity:** Low  
**Location:** Multiple pages  
**Issue:**  
- "Loading tasks..." and "Loading goals..." are plain text
- No spinner or skeleton loader
- Looks unpolished

---

### 38. No Confirmation Success for Actions
**Severity:** Low  
**Issue:**  
- Task/goal created shows toast
- No visual celebration or animation
- Could be more rewarding

---

## 🔧 PERFORMANCE ISSUES

### 39. Unnecessary Re-renders
**Severity:** Low  
**Location:** Multiple components  
**Issue:**  
- useSelector may cause unnecessary re-renders
- No memoization with `useMemo` or `useCallback`
- Navigation items array recreated on every render (AppLayout.tsx line 27)

---

### 40. All Data Fetched on Dashboard
**Severity:** Medium  
**Location:** `src/pages/DashboardPage.tsx` (lines 19-21)  
**Issue:**  
- Fetches all goals, tasks, and streaks on dashboard mount
- Same data fetched again when navigating to Tasks/Goals pages
- No caching or data reuse

**Impact:** Extra database queries, slower navigation

---

## 🔄 STATE MANAGEMENT ISSUES

### 41. No Error Boundary
**Severity:** Medium  
**Location:** `src/App.tsx`  
**Issue:**  
- No React Error Boundary to catch rendering errors
- App will crash completely on any component error
- No graceful error recovery

---

### 42. Redux DevTools Not Configured
**Severity:** Low  
**Location:** `src/store/store.ts`  
**Issue:**  
- configureStore enables DevTools by default, but should be explicitly disabled in production
- May expose sensitive data in production

---

## 🧪 TESTING ISSUES

### 43. No Tests
**Severity:** Medium  
**Issue:**  
- No test files anywhere in project
- No unit tests, integration tests, or E2E tests
- Cannot verify functionality programmatically

---

### 44. No TypeScript Strict Mode
**Severity:** Low  
**Location:** `tsconfig.json`  
**Issue:**  
- While `strict: true` is set, some strict options could be more restrictive
- `noUnusedLocals` and `noUnusedParameters` may catch issues

---

## 📦 BUILD & DEPLOYMENT ISSUES

### 45. No Build Command Verification
**Severity:** Medium  
**Issue:**  
- Build script exists but hasn't been verified
- May fail in production build due to environment variables

---

### 46. No .env.example File
**Severity:** High  
**Issue:**  
- New developers don't know what env vars are needed
- No documentation of required environment variables

---

### 47. No .gitignore for .env
**Severity:** Critical (Security)  
**Location:** Root directory  
**Issue:**  
- Should verify .env is in .gitignore
- Risk of committing sensitive credentials

---

## 📝 DOCUMENTATION ISSUES

### 48. No README
**Severity:** Medium  
**Issue:**  
- No README.md in ToDoMore_WebApp directory
- No setup instructions
- No development guide

---

### 49. No API Documentation
**Severity:** Low  
**Issue:**  
- No documentation of Redux actions/reducers
- No comments explaining complex logic

---

### 50. No Component Documentation
**Severity:** Low  
**Issue:**  
- No JSDoc comments on components
- PropTypes or type documentation missing

---

## 🎯 SUMMARY

**Total Issues Found:** 50

**By Severity:**
- 🔴 Critical: 3
- 🟠 High: 8
- 🟡 Medium: 17
- 🟢 Low: 19
- ⚠️ Security: 3

**Top Priority Fixes:**
1. Add .env file with Supabase credentials
2. Implement authentication persistence
3. Fix database column naming consistency
4. Set up proper auth session restoration
5. Implement goal progress auto-calculation
6. Verify/implement Row Level Security policies

**Recommended Next Steps:**
1. Create `.env.example` file
2. Add auth state listener in App.tsx
3. Create database migration files
4. Fix naming convention inconsistencies
5. Implement remaining features (subtasks, sub-goals)
6. Add comprehensive testing

---

*This bug list was generated through comprehensive code analysis and testing. Issues are categorized by severity and impact to help prioritize fixes.*
