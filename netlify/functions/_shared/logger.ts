// HELIX-MIGRATION (2026-05-12): `@AiDigital-com/design-system-sdk/server` is the
// new home for server utilities (createLogger, requireAuth, checkAccess,
// createDispatchHandler, createTaskWorker, mergeSession, createLLMProvider,
// handleApiStatus, etc.). The subpath hasn't shipped in the published SDK
// alpha yet — Netlify Functions in this template will fail to resolve these
// imports until the SDK ships its `/server` entry. Either pin the legacy
// `@AiDigital-com/design-system@7.x` for these functions in the meantime, or
// wait for the next SDK alpha. See: handoff/HELIX_MIGRATION_PLAYBOOK.md.
import { createLogger } from '@AiDigital-com/design-system-sdk/server';
import { supabase } from './supabase.js';

// TODO: Change 'your-app-name' to your app's tool ID
export const log = createLogger(supabase as any, 'your-app-name');
