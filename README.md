# Advanced Client Management System

A comprehensive, feature-rich client management dashboard built with Next.js 14, TypeScript, Prisma, and SQLite.

## Features

### Core Features
- **Multi-Category Client Tracking** - Digital Marketing, Travel, Consulting, E-commerce, SaaS, and more
- **Pipeline Management** - Track clients from Lead to Active to Completed
- **Task Management** - Create, assign, and track tasks for each client with priorities and due dates
- **Activity Timeline** - Log calls, emails, meetings, and notes with automatic tracking
- **Health Scoring** - Automatic client health scoring based on engagement and payments
- **Financial Tracking** - Contract values, payments, and revenue analytics
- **Daily Logging** - Track daily activities and metrics
- **Advanced Search & Filtering** - Find clients quickly by status, category, or search terms
- **Real-time Analytics** - Dashboard with charts and insights

### Advanced Features
- **Automated Status Updates** - Health scores update automatically based on interactions
- **Priority Management** - Urgent, High, Medium, Low priority levels
- **Custom Fields** - Extensible JSON fields for custom data
- **Activity Logging** - Automatic tracking of all client interactions
- **Revenue Analytics** - Track contract value vs paid amount
- **Overdue Task Tracking** - Never miss a deadline
- **Contact Management** - Multiple contacts per client
- **Project Management** - Organize work into projects with budgets and timelines

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS with custom components
- **Database**: SQLite with Prisma ORM
- **State Management**: React Hooks
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Initialize the database:
```bash
npm run db:push
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
/app
  /api           - API routes for clients, tasks, activities, analytics
  /clients       - Client detail pages
  /daily-log     - Daily logging interface
  page.tsx       - Main dashboard
/components
  /ui            - Reusable UI components
/lib
  prisma.ts      - Prisma client
  utils.ts       - Utility functions
/prisma
  schema.prisma  - Database schema
```

## Database Schema

### Main Models:
- **Client** - Core client information with financial and engagement data
- **Task** - Tasks associated with clients
- **Project** - Projects for organizing client work
- **Activity** - Activity timeline entries
- **Contact** - Additional contacts for each client
- **File** - File attachments
- **DailyLog** - Daily activity logs
- **Automation** - Automation rules (future feature)

## Usage

### Adding a Client
1. Click "New Client" on the dashboard
2. Fill in client details (name, email, category, status)
3. Set contract value and other financial information
4. Save to create the client

### Managing Tasks
1. Open a client detail page
2. Use "Quick Add Task" to create new tasks
3. Click the checkmark to complete tasks
4. Tasks automatically update the activity timeline

### Daily Logging
1. Click "Daily Log" in the header
2. Enter your daily notes and metrics
3. Track calls, emails, meetings, tasks, and revenue
4. Save to create a historical record

### Viewing Analytics
- The dashboard shows key metrics automatically
- Filter clients by status and category
- Search across all client fields
- Export data for external analysis

## Customization

### Adding Custom Fields
Edit the client model in `prisma/schema.prisma` and add to the customFields JSON field.

### Adding New Categories
Update the `ClientCategory` enum in the Prisma schema.

### Modifying Health Score Logic
Edit `calculateHealthScore()` in `lib/utils.ts`.

## API Endpoints

- `GET /api/clients` - List all clients with filtering
- `POST /api/clients` - Create a new client
- `GET /api/clients/[id]` - Get client details
- `PATCH /api/clients/[id]` - Update client
- `DELETE /api/clients/[id]` - Delete client
- `GET /api/tasks` - List tasks
- `POST /api/tasks` - Create task
- `PATCH /api/tasks/[id]` - Update task
- `POST /api/activities` - Log activity
- `GET /api/analytics` - Get dashboard analytics
- `GET /api/daily-logs` - Get daily logs
- `POST /api/daily-logs` - Create daily log

## Future Enhancements

- Email integration (send emails directly from the system)
- Calendar integration for meetings
- File upload and storage
- Automation rules engine
- Team collaboration features
- Mobile responsive improvements
- Export to Excel/PDF
- Email notifications
- Recurring tasks
- Custom reports
- API webhooks

## License

MIT

## Support

For issues and feature requests, please use the GitHub issues page.
