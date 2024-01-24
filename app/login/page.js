'use client';

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter,Link } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginPage(){
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const router = useRouter()
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
  const [isSignUp,setIsSignUp]=useState(true)

    const supabase = createClientComponentClient();

    useEffect(() => {
        async function getUser(){
            const {data: {user}} = await supabase.auth.getUser()
            setUser(user)
            setLoading(false)
        }

        getUser();
    }, [])


    const handleSignUp = async () => {
     
        const res = await supabase.auth.signUp({
          email,
          password,
          options: {
              emailRedirectTo: `${location.origin}/auth/callback`
          }
      })
        console.log(res.error)
        if (res.error){
          console.log('first')
           alert(res.error)
          return 
        }
        // console.log("res", res.error)
        setUser(res.data.user);
        setEmail('');
        setPassword('');
        // Refresh the router, clear email, and clear password only if sign-in is successful
        router.refresh();
        
      
    }

    const handleSignIn = async () => {
      try {
        const res = await supabase.auth.signInWithPassword({
          email,
          password
        });
        console.log(res.error)
        if (res.error){
          console.log('first')
           alert(res.error)
          return 
        }
        // console.log("res", res.error)
        setUser(res.data.user);
        setEmail('');
        setPassword('');
        // Refresh the router, clear email, and clear password only if sign-in is successful
        router.refresh();
        
      } catch (e) {
        console.log(e.message)
        alert(e.message);
      }
    };
    
    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.refresh();
        setUser(null)
    }

    // -------

    //-------

    console.log({loading, user})

    if (loading){
        return <h1>loading..</h1>
    }

    // if (user){
    //     return (
    //         <div className="h-screen flex flex-col justify-center items-center bg-gray-100">
    //         <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-md w-96 text-center">
    //             <h1 className="mb-4 text-xl font-bold text-gray-700 dark:text-gray-300">
    //                 You're already logged in
    //             </h1>
    //             <button 
    //                 onClick={handleLogout}
    //                 className="w-full p-3 rounded-md bg-red-500 text-white hover:bg-red-600 focus:outline-none"
    //             >
    //                 Logout
    //             </button>
    //         </div>
    //     </div>
    //     )
    // }

    return (
        <main  className="flex flex-col justify-center items-center h-screen">
       {/* <div className="bg-gray-900 p-8 rounded-lg shadow-md w-96">
        <input 
            type="email" 
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="mb-4 w-full p-3 rounded-md border border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
        />
        <input 
            type="password" 
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="mb-4 w-full p-3 rounded-md border border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
        />
        <button 
            onClick={handleSignUp}
            className="w-full mb-2 p-3 rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none"
        >
            Sign Up
        </button>
        <button 
            onClick={handleSignIn}
            className="w-full p-3 rounded-md bg-gray-700 text-white hover:bg-gray-600 focus:outline-none"
        >
            Sign In
        </button>
        </div>  */}

          {/* added */}
        {/* <div className="flex flex-col justify-center items-center h-screen"> */}
      <div>
        {/* <Link to="/"> */}
          {/* <img className="mx-auto" src={logo} alt="makerkit logo" /> */}
         <h1 className="text-center text-3xl text-darkPink font-semibold">Temp Mail</h1>
        {/* </Link> */}
        <div className="border border-accent1 shadow-pinkBoxShadow2 p-6 rounded-xl mt-10">
          <h5 className="scroll-m-20 font-heading text-lg font-medium text-white text-center">
            {isSignUp ? "Create account" : "Sign in to your account"}
          </h5>
          <button
           
            className="button-transparent mt-6 w-full flex justify-between rounded-md p-4"
          >
            {/* <img className="h-6" src={googlelogo} alt="google logo image" /> */}
            {/* <span className="text-center w-full  text-white">
              Sign {isSignUp ? "up" : "in"} with Google
            </span> */}
          </button>
          <span className="text-[.8rem] mt-4 font-medium flex items-center justify-center text-gray-400">
            or continue with email
          </span>
          <div >
          {/* onSubmit={handleSubmit(onSubmit)} */}
            <div className="mt-6">
              <label className="text-lightGrey text-sm font-semibold " htmlFor="email">
                Email Address
              </label>
              <input
                className="input block w-[400px] "
                id="email"
                placeholder="your@email"
                onChange={(e) => setEmail(e.target.value)}
                name="email"
                type="email"
                // {...register("email", { required: "Email is required" })}
              />
              {/* {errors.email && (
                <p className="text-red-600 text-sm font-semibold">
                  {errors.email.message}
                </p>
              )} */}
            </div>
            <div className="mt-4">
              <label className="text-lightGrey text-sm font-semibold " htmlFor="password">
                Password
              </label>
              <input
                className="input block w-[400px]"
                id="password"
                name="password"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                // {...register("password", { required: "Password is required" })}
              />
              {/* {errors.password && (
                <p className="text-red-600 text-sm font-semibold">
                  {errors.password.message}
                </p>
              )} */}
              {/* {!isSignUp && (
                <span className="text-[.79rem] cursor-pointer inline-block mt-4 hover:underline font-medium  text-gray-400">
                  Password forgotten?
                </span>
              )} */}
            </div>
       
            {isSignUp && (
              <button onClick={handleSignUp} className="button-pink text-white w-full mt-6 rounded-md">
                Sign up
              </button>
            )}

            {isSignUp && (
              <button onClick={handleSignIn} className="button-pink text-white w-full mt-6 rounded-md">
                Sign in
              </button>
            )}
          </div>
       
        </div>
      </div>
    {/* </div> */}
        {/* added */}
        </main>
    )

}