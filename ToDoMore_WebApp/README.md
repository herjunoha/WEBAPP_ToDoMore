# To Do: More - Web Application

A personal productivity web app combining traditional task management with structured goal setting using the SMART framework.

## Features

- 🔐 **User Authentication** - Secure login with username and PIN
- ✅ **Task Management** - Create, update, and track tasks with priorities and due dates
- 🎯 **SMART Goals** - Set and track goals using the SMART framework
- 🔥 **Streak Tracking** - Maintain daily task completion streaks
- 📊 **Dashboard** - Visual progress tracking and statistics
- 🔗 **Task-Goal Linking** - Connect tasks to goals for better tracking

## Tech Stack

- **Frontend Framework:** React 19 with TypeScript
- **State Management:** Redux Toolkit
- **Routing:** React Router v7
- **UI Components:** shadcn/ui + Radix UI
- **Styling:** Tailwind CSS v4
- **Database:** PostgreSQL via Supabase
- **Build Tool:** Vite
- **Package Manager:** npm

## Prerequisites

- Node.js 18+ and npm
- A Supabase account and project ([supabase.com](https://supabase.com))

## Setup Instructions

### 1. Clone the Repository

```bash
cd ToDoMore_WebApp
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase Database

1. Create a new project at [supabase.com](https://supabase.com/dashboard)
2. Go to the SQL Editor in your Supabase dashboard
3. Run the SQL from `database_schema.sql` to create tables and policies

### 4. Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Get your Supabase credentials:
   - Go to Project Settings → API
   - Copy your Project URL and anon/public key

3. Update `.env` with your credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### 5. Disable Email Confirmation (Optional)

For development with username/PIN login:

1. Go to Authentication → Providers → Email in Supabase
2. Disable "Confirm email"
3. This allows the fake email pattern to work

### 6. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Project Structure

```
ToDoMore_WebApp/
├── src/
│   ├── components/       # React components
│   │   ├── ui/          # shadcn/ui components
│   │   ├── AppLayout.tsx
│   │   ├── GoalForm.tsx
│   │   ├── TaskForm.tsx
│   │   └── ProtectedRoute.tsx
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility libraries
│   │   ├── supabase.ts  # Supabase client
│   │   └── utils.ts
│   ├── pages/           # Page components
│   │   ├── DashboardPage.tsx
│   │   ├── GoalsPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── SignUpPage.tsx
│   │   ├── TasksPage.tsx
│   │   └── SettingsPage.tsx
│   ├── store/           # Redux state management
│   │   ├── authSlice.ts
│   │   ├── goalsSlice.ts
│   │   ├── tasksSlice.ts
│   │   ├── streaksSlice.ts
│   │   └── store.ts
│   ├── types/           # TypeScript type definitions
│   │   ├── goal.ts
│   │   ├── task.ts
│   │   └── streak.ts
│   ├── App.tsx          # Main app component
│   ├── main.tsx         # App entry point
│   └── style.css        # Global styles
├── database_schema.sql  # Database setup script
├── .env.example         # Environment variables template
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## Usage Guide

### Creating an Account

1. Click "Sign up" on the login page
2. Enter a username and PIN (minimum 4 characters)
3. You'll be automatically logged in

### Managing Tasks

1. Navigate to "Tasks" page
2. Click "Create Task" to add a new task
3. Fill in details:
   - Title (required)
   - Description
   - Priority (Low/Medium/High)
   - Status (Pending/In Progress/Completed)
   - Due Date
   - Link to Goal (optional)
4. Update or delete tasks as needed

### Setting SMART Goals

1. Navigate to "Goals" page
2. Click "Create Goal"
3. Complete the SMART framework:
   - **Specific:** What exactly do you want to achieve?
   - **Measurable:** How will you measure progress?
   - **Achievable:** Is this goal realistic?
   - **Relevant:** Why is this goal important?
   - **Time-bound:** When will you achieve this?
4. Track progress automatically through linked tasks

### Maintaining Streaks

- Complete at least one task per day to maintain your streak
- View your current and longest streak on the Dashboard
- Streaks reset if you miss a day

## Database Schema

The app uses three main tables:

- **tasks** - Stores task information
- **goals** - Stores goals with SMART framework
- **streaks** - Tracks daily completion streaks

All tables have Row Level Security (RLS) policies ensuring users can only access their own data.

## Important Notes

### Authentication Pattern

The app uses a simplified authentication pattern:
- Username is converted to `username@todomore.local` format
- PIN is used as the password
- Email confirmation is disabled
- This is suitable for personal use but not for production with real emails

### Data Naming Convention

- **Database:** Uses snake_case (e.g., `user_id`, `created_at`)
- **Frontend:** Uses camelCase (e.g., `userId`, `createdAt`)
- Automatic transformation happens in the Redux store

## Troubleshooting

### App won't start

- Ensure `.env` file exists with valid Supabase credentials
- Check that all dependencies are installed: `npm install`

### Authentication issues

- Verify Supabase email confirmation is disabled
- Check that RLS policies are properly set up
- Ensure credentials in `.env` are correct

### Data not loading

- Check browser console for errors
- Verify database tables exist in Supabase
- Confirm RLS policies allow access

## Security Considerations

⚠️ **Important Security Notes:**

1. Never commit `.env` file to version control
2. Use strong, unique PINs for production
3. Enable email confirmation for real deployments
4. Row Level Security (RLS) is enabled to protect user data
5. Consider implementing rate limiting for production use

## Future Enhancements

- [ ] Subtasks and sub-goals functionality
- [ ] Advanced filtering and search
- [ ] Data export/import
- [ ] Mobile responsive improvements
- [ ] Dark mode toggle
- [ ] Email notifications
- [ ] Goal progress auto-calculation
- [ ] Cascade delete for related data

## License

This project is for educational/personal use.

## Support

For issues or questions, please refer to the bug list in `BUGS_LIST.md` for known issues.
