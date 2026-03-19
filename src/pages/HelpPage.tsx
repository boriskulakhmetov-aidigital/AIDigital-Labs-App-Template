import { useEffect } from 'react';
import { HelpPage, applyTheme, resolveTheme } from '@boriskulakhmetov-aidigital/design-system';
import '@boriskulakhmetov-aidigital/design-system/style.css';

const GUIDE = `# [App Name] — User Guide

**Tool:** [App Name](https://your-app.apps.aidigitallabs.com)

Brief description of what this tool does.

---

## Getting Started

### 1. Sign In

Open the app and sign in with your AIDigital Labs account.

### 2. [First Step]

Describe the first step the user takes.

### 3. [Second Step]

Describe the second step.

### 4. Review Results

Describe what the user sees when results are ready.

### 5. Download or Share

Export the report as Markdown, PDF, or share it via link.

---

## What to Expect

| Step | Time |
|------|------|
| Enter details | 1 minute |
| AI analysis | 3-5 minutes |
| **Total** | **4-6 minutes** |

---

## Tips

- **Use dark mode** for a more comfortable viewing experience. Toggle it in the top-right corner.
- Previous sessions are saved automatically in the sidebar.
`;

export default function AppHelpPage() {
  useEffect(() => { applyTheme(resolveTheme()); }, []);
  return <HelpPage markdown={GUIDE} />;
}
