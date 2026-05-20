import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://nipueyycafzvxzqwfaxr.supabase.co/rest/v1/' 
const supabaseKey = 'sb_publishable_YjEfTrIJ147i0349sarQ7Q_NEfRW5T1' 

export const supabase = createClient(supabaseUrl, supabaseKey)