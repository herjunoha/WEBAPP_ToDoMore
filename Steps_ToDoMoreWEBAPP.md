# **To Do: More \- Hackathon Web App Plan**

This plan is based on your Web App blueprint and is streamlined for maximum speed. It uses **React (Vite)**, **Supabase (for PostgreSQL)**, **Redux Toolkit**, and **shadcn/ui**.

## **Phase 1: Project & Backend Setup (Est. 1 Hour)**

**Goal:** Get a live backend and a running React app.

* **Step 1.1: Set up Supabase (Your Postgres DB)**  
  * Go to [Supabase](https://supabase.com/), create a new project.  
  * Go to the "SQL Editor" and run SQL scripts to create your tables:  
    * users (Supabase handles this via its auth.users table)  
    * goals (Include all SMART fields, user\_id, status, progress, etc.)  
    * tasks (Include title, description, status, goal\_id, user\_id, etc.)  
    * streaks (Include user\_id, current\_streak, last\_completed\_date)  
  * Save your Project **URL** and **anon key** (from Project Settings \> API).  
* **Step 1.2: Initialize React Project (Vite)**  
  * Run npm create vite@latest my-todo-app \-- \--template react-ts  
  * cd my-todo-app  
* **Step 1.3: Install Dependencies**  
  * npm install @supabase/supabase-js @reduxjs/toolkit react-redux react-router-dom  
  * npm install \-D tailwindcss postcss autoprefixer  
* **Step 1.4: Configure UI & Utilities**  
  * Run npx tailwindcss init \-p and configure tailwind.config.js.  
  * Run npx shadcn-ui@latest init (this will set up your base styles and utils.ts).  
  * Add Button, Input, Dialog, ProgressBar, and Toast from shadcn/ui.  
  * Create a file src/lib/supabase.ts and initialize your Supabase client using the keys from Step 1.1.

## **Phase 2: Auth & Core Navigation (Est. 1 Hour)**

**Goal:** Users can sign up, log in, and see the main app layout.

* **Step 2.1: Create Auth Slice (Redux)**  
  * Create src/store/authSlice.ts. This will store the user's session.  
* **Step 2.2: Build Auth Screens**  
  * Create LoginPage.tsx and SignUpPage.tsx.  
  * Use the supabase.auth.signUp() and supabase.auth.signInWithPassword() methods.  
  * **Note:** Use the "password" field for the user's password.
  * On success, save the user session to the Redux store.  
* **Step 2.3: Set up Routing (React Router)**  
  * In App.tsx, set up routes.  
  * Create a \<ProtectedRoute\> component that checks the Redux store for a user.  
  * Create an \<AppLayout\> component that includes your **Persistent Sidebar** (as requested in the blueprint) with links to /dashboard, /tasks, and /goals.  
  * Your main routes (/dashboard, etc.) should be wrapped in \<ProtectedRoute\> and use the \<AppLayout\>.

## **Phase 3: Goals CRUD (Est. 2 Hours)**

**Goal:** Users can create, read, update, and delete their SMART goals.

* **Step 3.1: Create Goals Slice (Redux)**  
  * Create src/store/goalsSlice.ts.  
  * Create **async thunks** to interact with Supabase:  
    * fetchGoals: supabase.from('goals').select('\*')  
    * createGoal: supabase.from('goals').insert({ ...goalData })  
    * updateGoal: supabase.from('goals').update({ ... }).match({ id: goalId })  
    * deleteGoal: supabase.from('goals').delete().match({ id: goalId })  
* **Step 3.2: Build Goals Page**  
  * Create src/pages/GoalsPage.tsx.  
  * useEffect to dispatch fetchGoals() on load.  
  * Use a useSelector to get goals from the Redux store.  
  * Render the list of goals.  
* **Step 3.3: Build Goal Form**  
  * Use a shadcn/ui **Dialog** component for the "Create/Edit Goal" form.  
  * The form must include all **SMART** fields (Specific, Measurable, etc.).  
  * On submit, dispatch createGoal or updateGoal and then fetchGoals to refresh.  
  * Show a shadcn/ui **Toast** on success.

## **Phase 4: Tasks CRUD & Goal Linking (Est. 2 Hours)**

**Goal:** Users can manage tasks and link them to goals.

* **Step 4.1: Create Tasks Slice (Redux)**  
  * Create src/store/tasksSlice.ts.  
  * Create async thunks for fetchTasks, createTask, updateTask, deleteTask.  
* **Step 4.2: Build Tasks Page**  
  * Create src/pages/TasksPage.tsx.  
  * Fetch and render tasks, similar to the goals page.  
* **Step 4.3: Build Task Form (with Goal Linking)**  
  * Use another **Dialog** for the "Create/Edit Task" form.  
  * **Crucial Step:** Inside the form, add a shadcn/ui **Select** component.  
  * Populate this Select by reading from the *goals slice* (useSelector((state) \=\> state.goals.items)).  
  * The value of the select will be the goal\_id, which you'll save with the task.

## **Phase 5: Dashboard & Deployment (Est. 2 Hours)**

**Goal:** Build the dashboard, implement the streak, and deploy.

* **Step 5.1: Build Dashboard Page**  
  * Create src/pages/DashboardPage.tsx.  
  * **Goal Progress:** Get goals and tasks from Redux. For each goal, calculate progress (completedTasks.length / allLinkedTasks.length). Display this with a shadcn/ui **ProgressBar**.  
  * **Streak Display:** Create a simple component to show the streak (e.g., "🔥 7 day streak").  
* **Step 5.2: Implement Streak Logic (Simple)**  
  * In your tasksSlice, when a task is marked complete (updateTask thunk):  
  * Fetch the streaks table for the user.  
  * Check last\_completed\_date.  
  * If yesterday, increment streak.  
  * If today, do nothing.  
  * If before yesterday, reset streak to 1\.  
  * Update the streaks table.  
  * *(This is the "hackathon" way. A better way uses a database function, but this is faster to write).*  
* **Step 5.3: Deploy to Netlify**  
  * Push your code to a new GitHub repository.  
  * Go to [Netlify](https://www.netlify.com/), link your GitHub repo.  
  * Set your environment variables (from Supabase):  
    * VITE\_SUPABASE\_URL  
    * VITE\_SUPABASE\_ANON\_KEY  
  * Set the build command to npm run build and publish directory to dist.  
  * Deploy\!