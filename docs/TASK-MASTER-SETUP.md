# Task Master AI - Setup Guide

## Overview

Task Master AI is already configured for this project! We have:
- ✅ Task Master configuration in `.taskmaster/config.json`
- ✅ Comprehensive PRD in `.taskmaster/docs/prd.txt`
- ✅ MCP server configured in `~/.claude.json`

## Next Steps to Start Using Task Master

### Option 1: Using MCP Tools (Recommended in Claude Code)

In your current Claude Code session, you can use these MCP tools:

```
# Initialize the project (first time only)
initialize_project

# Parse the PRD to generate tasks
parse_prd with path: ".taskmaster/docs/prd.txt"

# View all tasks
get_tasks

# Get next task to work on
next_task

# View specific task details
get_task with id: "1.1"

# Mark task as complete
set_task_status with id: "1.1" and status: "done"
```

### Option 2: Using CLI (Alternative)

If you prefer command line:

```bash
# Navigate to project
cd /home/jodfie/storage-labels

# Initialize (creates tasks.json)
npx -y task-master-ai init

# Parse PRD to generate tasks
npx -y task-master-ai parse-prd .taskmaster/docs/prd.txt

# View tasks
npx -y task-master-ai list

# Get next task
npx -y task-master-ai next
```

## What Tasks Will Be Generated?

The PRD will generate approximately 30+ tasks organized into 3 phases:

### Phase 1: MVP - Core Functionality (15 tasks)
- Backend foundation and API
- Container management
- Item management with photo upload
- Search functionality
- Frontend React app
- Container and item UI

### Phase 2: Enhanced Features (12 tasks)
- PWA configuration
- Offline mode
- QR code scanning
- Print labels
- Location management
- Advanced search and filters

### Phase 3: Deployment & Integration (8 tasks)
- Docker production build
- Cloudflare Tunnel setup
- Database backup
- Export functionality
- Mobile optimizations

## Using Task Master in Your Workflow

### Daily Development Flow

1. **Start your session**: Use `next_task` to get the next available task
2. **Review task**: Use `get_task` to see full details
3. **Implement**: Write the code for the task
4. **Update progress**: Use `update_subtask` to log implementation notes
5. **Complete**: Use `set_task_status` to mark as done
6. **Repeat**: Get next task

### Expanding Tasks

Some tasks may need to be broken into subtasks:

```
# Expand a specific task
expand_task with id: "1.2" and research: true

# Analyze complexity to determine which tasks need expansion
analyze_project_complexity with research: true
```

## API Keys (Optional for Research Features)

For enhanced AI features (task expansion, complexity analysis), configure API keys:

Add to `~/.claude.json` in the `task-master-ai` section:

```json
"env": {
  "ANTHROPIC_API_KEY": "your-key-here",
  "PERPLEXITY_API_KEY": "your-key-here"
}
```

**Note**: You can use task-master without API keys for basic operations (list, show, update, set status).

## Current Configuration

```json
{
  "projectName": "storage-labels",
  "permissionMode": "acceptEdits",
  "enableCodebaseAnalysis": true,
  "models": {
    "main": "sonnet[1m]",
    "research": "claude-opus-4-5",
    "fallback": "sonnet[1m]"
  }
}
```

## Files Created

- `.taskmaster/config.json` - Task Master configuration
- `.taskmaster/docs/prd.txt` - Product Requirements Document (3-phase roadmap)
- `.taskmaster/CLAUDE.md` - Auto-loaded context for Claude Code
- `.taskmaster/tasks/` - Will contain generated tasks after parsing PRD

## Quick Reference

**Most Common Commands**:
- `next_task` - What should I work on next?
- `get_tasks` - Show all tasks
- `get_task` - Show specific task details
- `set_task_status` - Mark task complete
- `expand_task` - Break task into subtasks

**Want to start?** Just say:
- "Initialize task-master and parse the PRD"
- "Show me the next task to work on"
- "List all tasks"

## Integration with Claude Code

Task Master is fully integrated! The `.taskmaster/CLAUDE.md` file is automatically loaded into your Claude Code context, giving access to all task-master documentation and best practices.

You can also use the slash commands in `.claude/commands/tm/` directory for quick task management workflows.
