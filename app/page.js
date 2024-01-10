// "use client"

import Image from 'next/image'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Link from 'next/link';

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
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>hello {user.email}</h1>
    </main>
  )
}