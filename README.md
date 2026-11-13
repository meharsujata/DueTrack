# DueTrack – Deadline & Commitment Tracker

A simple web application designed to help individuals and teams manage deadlines, track commitments, and improve task visibility.

## Project Overview

Important tasks and commitments are often scattered across emails, spreadsheets, and messages. This can make it difficult to track ownership, monitor progress, and meet deadlines.

**DueTrack** provides a centralized dashboard to create deadlines, assign owners, monitor task status, and receive browser-based reminders.

## Key Features

- **Deadline Management:** Create and manage tasks with titles, descriptions, owners, categories, and due dates.
- **Status Tracking:** Track tasks as Pending, In Progress, or Completed.
- **Dashboard:** View task summaries, including pending, completed, in-progress, and overdue tasks.
- **Browser Notifications:** Receive reminders before deadlines.
- **Custom Reminders:** Choose reminder intervals of 15 minutes, 30 minutes, 1 hour, or 1 day.
- **MCP Integration:** Connect DueTrack with Claude Desktop to list and create deadlines through MCP tools.

## Technology Stack

| Technology | Purpose |
|---|---|
| React | Frontend development |
| JavaScript | Application logic |
| Vite | Development and build tool |
| Supabase | Database and backend services |
| PostgreSQL | Data storage |
| Model Context Protocol (MCP) | Integration with Claude Desktop |
| Vercel | Application deployment |
| GitHub | Source code management |

## MCP Integration

DueTrack includes a local MCP server that connects Claude Desktop with the Supabase database.

Available MCP tools:

- `list_deadlines` – Retrieve existing deadlines.
- `create_deadline` – Create a new deadline.

The MCP server currently uses the local STDIO transport.

## Live Demo

**Application:** https://project-y6o64.vercel.app/

**GitHub Repository:** https://github.com/meharsujata/DueTrack

## Project Learning

Through this project, I gained practical experience in:

- Building a web application using React.
- Connecting a frontend application to Supabase.
- Designing and working with a PostgreSQL database.
- Implementing task management and reminder functionality.
- Integrating an application with MCP tools.
- Deploying a web application using Vercel.

## Current Limitations

- Browser reminders require the application to remain open.
- MCP integration currently supports listing and creating deadlines.
- The current database access policies are configured for a demonstration and require stronger authentication and access controls before production use.

## Future Improvements

- User authentication and role-based access.
- Team-based task assignment.
- Email and background reminders.
- Advanced reporting and analytics.
- Additional MCP operations.

---

**Project:** DueTrack – Deadline & Commitment Tracker  
**Developer:** Sujata Mehar
