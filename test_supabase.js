// Test Supabase Connection
// Run this in browser console after app loads

async function testSupabase() {
  const { supabase } = await import('./supabase.js');
  
  console.log('=== TESTING SUPABASE CONNECTION ===');
  
  // Test 1: Fetch all tasks
  console.log('\n1. Fetching all tasks...');
  const { data: allTasks, error: fetchError } = await supabase
    .from('tasks')
    .select('*');
  
  if (fetchError) {
    console.error('❌ Fetch error:', fetchError.message);
  } else {
    console.log('✅ Fetch successful:', allTasks);
  }
  
  // Test 2: Insert a test task
  console.log('\n2. Inserting test task...');
  const testTask = {
    id: crypto.randomUUID(),
    name: 'Test Task',
    date: new Date().toISOString().split('T')[0],
    total_time: 120, // 2 minutes in seconds
    cycles: [
      {
        startTime: Date.now() - 120000,
        endTime: Date.now(),
        duration: 120
      }
    ]
  };
  
  const { data: insertData, error: insertError } = await supabase
    .from('tasks')
    .insert(testTask)
    .select();
  
  if (insertError) {
    console.error('❌ Insert error:', insertError.message);
  } else {
    console.log('✅ Insert successful:', insertData);
  }
  
  // Test 3: Update the test task
  console.log('\n3. Updating test task...');
  const { data: updateData, error: updateError } = await supabase
    .from('tasks')
    .update({ total_time: 180 })
    .eq('id', testTask.id)
    .select();
  
  if (updateError) {
    console.error('❌ Update error:', updateError.message);
  } else {
    console.log('✅ Update successful:', updateData);
  }
  
  // Test 4: Delete the test task
  console.log('\n4. Deleting test task...');
  const { error: deleteError } = await supabase
    .from('tasks')
    .delete()
    .eq('id', testTask.id);
  
  if (deleteError) {
    console.error('❌ Delete error:', deleteError.message);
  } else {
    console.log('✅ Delete successful');
  }
  
  console.log('\n=== TEST COMPLETE ===');
}

// Run the test
testSupabase();
