
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: 'frontend/.env' });
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
async function run() {
    const {data, error} = await supabase.from('study_materials').select('*, users(full_name, email)').limit(1);
    console.log(JSON.stringify(data, null, 2));
    console.log('Error:', error);
}
run();
