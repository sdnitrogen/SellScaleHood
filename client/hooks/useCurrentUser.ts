import { getLoggedInUser } from "@/lib/actions/user.actions"
import { useEffect, useState } from "react"

const useCurrentUser = () => {
  const [loggedIn, setLoggedIn] = useState<User | null>(null)

  useEffect(() => {
    const checkUser = async () => {
      const loggedInUser = await getLoggedInUser()
      setLoggedIn(loggedInUser)
    }

    checkUser()
  }, [])

  return { loggedIn }
}

export default useCurrentUser
