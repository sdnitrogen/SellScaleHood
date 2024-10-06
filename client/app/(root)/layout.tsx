"use client"

import MobileNav from "@/components/MobileNav"
import Sidebar from "@/components/Sidebar"
import useCurrentUser from "@/hooks/useCurrentUser"
import { getLoggedInUser } from "@/lib/actions/user.actions"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { loggedIn } = useCurrentUser()
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const loggedIn = await getLoggedInUser()
      if (!loggedIn) {
        router.push("/sign-in") // Redirect to sign-in if not logged in
      }
    }

    checkUser()
  }, [router])

  return loggedIn ? (
    <main className="flex h-screen w-full font-inter">
      <Sidebar user={loggedIn} />
      <div className="flex size-full flex-col">
        <div className="root-layout">
          <Image src="/icons/logo.svg" width={30} height={30} alt="logo" />
          <div>
            <MobileNav user={loggedIn} />
          </div>
        </div>
        {children}
      </div>
    </main>
  ) : (
    <></>
  )
}
