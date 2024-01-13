// "use client"

import Image from 'next/image'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Link from 'next/link';
import { Email } from './componenet/GetEmail';

export default async function Home() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({cookies: () => cookieStore});

  const {data: {user}} = await supabase.auth.getUser()

  if (!user){
    return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <Link href={'/login'}>
          You are not logged in. Click here to go login.
        </Link>
      </main>
    )
  }
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
    // setUser(null)
}


  return (
    <main className="  text-[#fff]  ">

      <div className='border border-accent1 border-dashed shadow-pinkBoxShadow2 p-6 rounded-xl mt-10'>
      <h2 className='text-2xl text-center mb-10 mt-4'>Your Temporary Email Address</h2>
      <div className="rounded-full p-4 px-6 bg-darkPink my-4">
        <p>bghanbi50@gmail.com</p>
      </div>
      
      </div>
      <div className=" p-4 px-6 my-4 flex justify-between shadow-pinkBoxShadow2 p-6 rounded-xl mt-10">
        <div className='bg-darkPink py-2 rounded-full px-5 text-sm'>
          <p>refresh</p>
        </div>
        <div className='bg-darkPink py-2 rounded-full px-5 text-sm'>
          <p>delete</p>
        </div>
        <div className='bg-darkPink py-2 rounded-full px-5 text-sm'>
          <p>change</p>
        </div>
        {/* <div>
          <p>refresh</p>
        </div> */}
      </div>
    
      {/* <div className='border border-accent1 shadow-pinkBoxShadow2 p-6 rounded-xl mt-10'>
        <h1>hello {user.email}</h1>
        <Email/>
      </div> */}
    </main>
  )
}