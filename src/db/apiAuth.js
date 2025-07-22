import supabase, {supabaseUrl} from "./supabase";

export async function login({email, password}) {
  const {data, error} = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error(error.message);

  return data;
}

export async function signup(params) {
  // Handle the object passed from useFetch
  const {name, email, password, profilepic} = params;
  let fileName = null; // Declare fileName outside try block
  
  try {
    // Step 1: Upload profile picture
    fileName = `dp-${name.split(" ").join("-")}-${Math.random()}`;

    const {error: storageError} = await supabase.storage
      .from("profilepicture")
      .upload(fileName, profilepic);

    if (storageError) throw new Error(storageError.message);

    // Step 2: Create auth user
    const {data: authData, error: authError} = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          profile_pic: `${supabaseUrl}/storage/v1/object/public/profilepicture/${fileName}`,
        },
      },
    });

    if (authError) throw new Error(authError.message);

    // Step 3: Wait for session to be established (important for RLS)
    const {data: {session}, error: sessionError} = await supabase.auth.getSession();
    
    if (sessionError) throw new Error(sessionError.message);

    // Step 4: Insert user data into profiles table (not urls table)
    const {error: profileError} = await supabase
      .from('profiles')
      .insert([
        {
          user_id: authData.user.id,
          name: name,
          email: email,
          profile_pic: `${supabaseUrl}/storage/v1/object/public/profilepicture/${fileName}`,
        }
      ]);

    if (profileError) throw new Error(profileError.message);

    return authData;
  } catch (error) {
    // Clean up uploaded file if signup fails
    if (fileName) {
      await supabase.storage
        .from("profilepicture")
        .remove([fileName]);
    }
    throw error;
  }
}

export async function getCurrentUser() {
  const {data: session, error} = await supabase.auth.getSession();
  
  if (error) throw new Error(error.message);
  if (!session.session) return null;

  return session.session?.user;
}

export async function logout() {
  const {error} = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}


