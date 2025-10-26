# **To Do: More \- Web App MVP Blueprint**

## **App Name**

To Do: More

## **Platform**

**Web Application** (focus on desktop browser, ignore mobile compability)

## **Core Purpose**

A personal productivity web app combining traditional task management with structured goal setting using the SMART framework, linking tasks to goals for progress tracking.

## **MVP Feature List**

### **1\. User Authentication**

* **Local Authentication:** Just username and pin, simple.  
* **Session Management:** Persistent login sessions (e.g., using secure cookies or tokens) so users remain logged in.

### **2\. Core Data Models (CRUD \- Create, Read, Update, Delete)**

All data will be stored in a cloud database (PostgresSQL, help me setup that also) and associated with the authenticated user's ID.

* **Tasks:**  
  * **Fields:** Title (string), Description (text), Due Date (timestamp, optional), Priority (string, optional \- e.g., 'Low', 'Medium', 'High'), Status (string \- e.g., 'Pending', 'In Progress', 'Completed'), Parent Task ID (string, for subtasks), Associated Goal ID (string, optional).  
  * **CRUD Operations:** Create, View List/Detail, Edit, Delete tasks and subtasks (nested structure).  
* **Goals (using SMART framework):**  
  * **Fields:**  
    * **Specific** (Text): Clear definition of the goal.  
    * **Measurable** (Text): How progress will be measured.  
    * **Achievable** (Text): Confirmation or notes on achievability.  
    * **Relevant** (Text): Why this goal is important.  
    * **Time-bound** (Date): Deadline for the goal.  
    * **Title** (String): User-defined title for the goal.  
    * **Description** (Text, optional).  
    * **Status** (String \- e.g., 'Not Started', 'In Progress', 'Achieved').  
    * **Progress** (Number): Calculated based on linked tasks (e.g., 3/5 tasks completed).  
    * **Parent Goal ID** (String, for sub-goals).  
  * **CRUD Operations:** Create, View List/Detail (showing all SMART elements), Edit, Delete goals and sub-goals.  
* **Task-Goal Relationship:**  
  * **Mechanism:** Allow users to link one or more tasks to a specific goal/sub-goal from the task creation/edit view.  
  * **CRUD Operations:** Assign a task to a goal, remove the assignment.

### **3\. Dashboard View**

The main landing page after login.

* **Goal Progress Tracking:**  
  * Visual indicators (e.g., progress bars, percentages) for each active goal.  
  * A list or card view of active goals with quick status (e.g., "Goal A: 3/5 tasks completed").  
* **Task Streak Feature (Duolingo-like):**  
  * Track consecutive days the user has completed at least one task.  
  * Display the current streak count prominently (e.g., "🔥 7 day streak").  
  * Visual feedback when the streak is maintained.

### **4\. Basic Navigation**

* **Persistent Sidebar Navigation (Desktop):** A sidebar with links to: Dashboard, Tasks, Goals, and Settings.  
* **Routing:** Clear and distinct URLs for each view (e.g., /dashboard, /tasks, /goals/:goalId).  
* **Contextual Navigation:** Clear navigation between list views (e.g., All Tasks) and detail/edit views (e.g., viewing/editing a single task).

### **5\. Basic UI/UX**

* **Clean, Simple, and Intuitive Interface:** Focus on core functionality and ease of use.  
* **Responsive Design:** The UI must adapt seamlessly from a large desktop monitor down to a mobile phone screen.  
* **Clear Affordances:** Obvious buttons/links for adding, editing, and deleting items.  
* **Feedback:** Use non-intrusive "toast" notifications for success/error messages (e.g., "Task created\!").

## **Technical Considerations for Web MVP**

* **Development Language/Framework:** **React.js** (using TypeScript) to build the single-page application.  
* **Architecture:**  
  * **Component-based:** Following standard React practices.  
  * **State Management:** **Redux Toolkit** for managing global state (like the logged-in user, tasks, and goals).  
* **UI Framework / Styling:**  
  * **Styling:** **Tailwind CSS** for utility-first styling and building a responsive layout quickly.  
  * **UI Components:** **shadcn/ui** for a pre-built, accessible, and themeable set of components (buttons, modals, inputs, etc.) to accelerate development.  
* **Routing:** **React Router** to handle all client-side navigation and URL management.  
* **Hosting:** **Netlify** for continuous deployment (CI/CD) and high-performance global hosting of the static React application.