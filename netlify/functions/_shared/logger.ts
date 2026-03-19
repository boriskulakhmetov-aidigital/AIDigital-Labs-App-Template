import { createLogger } from '@boriskulakhmetov-aidigital/design-system/logger';
import { supabase } from './supabase.js';

// TODO: Change 'your-app-name' to your app's identifier
export const log = createLogger(supabase as any, 'your-app-name');
