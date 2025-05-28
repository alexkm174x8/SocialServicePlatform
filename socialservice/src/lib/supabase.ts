import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

// Regular client for client-side operations
export const supabase = createClientComponentClient()