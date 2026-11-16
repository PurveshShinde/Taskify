# Taskify AI Agents and Automation Guidelines

This document defines the architecture, prompt structures, behavioral guidelines, and safety boundaries for AI assistants and autonomous coding agents interacting with the Taskify codebase.

---

## 1. In-App AI Project Assistant

Taskify includes an integrated workspace companion designed to assist users with project planning, task prioritization, and workflow optimization.

### 1.1 Assistant Architecture

- **Primary Component**: `client/src/components/ProjectAssistant.tsx`
- **UI Presentation**: A floating, collapsible workspace overlay rendered with `framer-motion` animations and `lucide-react` iconography.
- **State Model**: Maintains an ephemeral conversational message queue (`Message[]`) containing unique IDs, message text, and sender tags (`user` | `bot`).

### 1.2 Intent Classification and Response Engine

The assistant evaluates input through a deterministic intent-matching heuristic that interprets user queries and generates actionable workspace advice:

| Intent Category | Trigger Keywords | Operational Response |
| :--- | :--- | :--- |
| Project Planning | `project`, `craftboard`, `milestone` | Analyzes active project status, identifies in-progress bottlenecks, and projects sprint completion velocity. |
| Task Capture | `task`, `todo`, `dictate`, `voice` | Instructs the user on utilizing the Web Speech API voice capture capabilities and provides sample voice dictation patterns. |
| Greetings & Onboarding | `hello`, `hi`, `help` | Welcomes the user and suggests prompt structures for goal decomposition. |
| General Productivity | Any other query | Acknowledges the input, evaluates task distribution metrics, and confirms productivity index updates. |

### 1.3 Voice Command Integration

The assistant works in conjunction with the `useSpeechToText` hook (`client/src/hooks/useSpeechToText.ts`), allowing users to speak naturally into the application.

- **Engine**: Browser Web Speech API (`webkitSpeechRecognition` / `SpeechRecognition`).
- **Dictation Patterns**:
  - Task with priority: `"Create new feature branch for authentication and set priority high"`
  - Scheduling: `"Schedule quarterly sprint review for next Monday"`
  - Bug logging: `"Fix navigation sidebar overflow on mobile viewport"`

---

## 2. In-App Agent Prompt Guidelines

When designing prompts for future extensions or connecting external large language models (such as Gemini, Anthropic, or OpenAI APIs) to the Taskify assistant, adhere to the following system prompt standard:

### 2.1 System Prompt Specification

```text
You are the Taskify AI Workspace Assistant, an intelligent productivity companion embedded in the Taskify platform.

Your objectives:
1. Help users organize, decompose, and prioritize projects and tasks.
2. Structure recommendations into clear, actionable steps.
3. Recommend appropriate task priorities (Low, Medium, High) based on deadlines and dependencies.
4. Guide users on using voice dictation, team collaboration spaces, and visual analytics within Taskify.

Formatting guidelines:
- Maintain an encouraging, professional, and concise tone.
- Do not use emojis in your responses.
- Present lists with clean Markdown bullet points.
- Never reveal internal system keys, environment variables, or private user credentials.
```

### 2.2 Structured Task Decomposition Prompt

For automated task generation workflows, request JSON output conforming to Taskify's schema:

```text
Given the following project goal: "{PROJECT_GOAL}"

Decompose this initiative into 3 to 6 discrete tasks. Output ONLY a valid JSON array matching this format:

[
  {
    "title": "Short imperative task summary",
    "description": "Clear explanation of definition of done",
    "priority": "Low | Medium | High",
    "dueDate": "YYYY-MM-DD"
  }
]
```

---

## 3. Autonomous Developer Agents (Antigravity, Cursor, Copilot)

This section provides operational instructions for autonomous coding agents modifying or maintaining the Taskify repository.

### 3.1 Repository Navigation Rules

- **Frontend Code**: Resides strictly in `client/src/`. Do not introduce non-React libraries or bypass Tailwind CSS utilities.
- **Backend Code**: Resides strictly in `server/`. Follow the controller-service pattern (`server/controllers/`, `server/services/`, `server/routes/`).
- **Shared Contracts**: When updating data models, synchronize `server/models/` schemas with `client/src/types.ts`.
- **Environment Templates**: Update `client/.env.example` or `server/.env.example` whenever introducing new environment variables. Never commit `.env` files.

### 3.2 Coding Constraints for Agents

- **Type Safety**: Avoid using `any` in TypeScript files. Create proper type aliases or interfaces.
- **No Emojis in Documentation**: Under no circumstances should emojis be inserted into any Markdown files (`.md`) across the repository.
- **Documentation Preservation**: Preserve existing comments and docstrings that are unrelated to code modifications.
- **Process Isolation**: When adding new background tasks, ensure they are encapsulated in `server/services/` and register them in `server/server.ts`.

### 3.3 Verification Checklist for Agents

Prior to finishing code updates, agents must verify:
1. `npm run build` succeeds from the root directory without TypeScript or Vite compilation errors.
2. `cd client && npm run lint` passes with 0 errors.
3. Documentation links use valid relative paths (e.g., `[SETUP.md](./SETUP.md)`).
4. All Markdown files maintain a professional tone without emoji characters.

