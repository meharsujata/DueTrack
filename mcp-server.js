import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

const server = new McpServer({
  name: 'duetrack',
  version: '1.0.0'
});

// Tool 1: View all deadlines
server.tool(
  'list_deadlines',
  'View all commitments tracked in DueTrack',
  {},
  async () => {
    const { data, error } = await supabase
      .from('deadlines')
      .select('*')
      .order('due_date', { ascending: true });

    if (error) throw new Error(error.message);

    return {
      content: [{ type: 'text', text: JSON.stringify(data, null, 2) }]
    };
  }
);

// Tool 2: Create a deadline
server.tool(
  'create_deadline',
  'Create a new commitment in DueTrack',
  {
    title: z.string().min(1),
    owner: z.string().optional(),
    category: z.string().optional(),
    due_date: z.string().describe('Due date and time in ISO 8601 format'),
    description: z.string().optional()
  },
  async ({ title, owner, category, due_date, description }) => {
    const { data, error } = await supabase
      .from('deadlines')
      .insert([{
        title,
        owner,
        category: category || 'Task',
        due_date,
        description,
        status: 'Pending'
      }])
      .select()
      .single();

    if (error) throw new Error(error.message);

    return {
      content: [{ type: 'text', text: JSON.stringify(data, null, 2) }]
    };
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
