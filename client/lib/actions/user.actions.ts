import httpClient from "../httpClient"
import { parseStringify } from "../utils"

export const signIn = async ({ email, password }: signInProps) => {
  try {
    const response = await httpClient.post("http://localhost:5000/signin", {
      email,
      password,
    })

    if (response.status === 200) {
      const user = response.data
      return parseStringify(user)
    }
  } catch (error) {
    console.error("Error", error)
  }
}

export const signUp = async ({ ...userData }: SignUpParams) => {
  const {
    email,
    password,
    firstName,
    lastName,
    address1,
    city,
    state,
    postalCode,
    dateOfBirth,
  } = userData
  try {
    const response = await httpClient.post("http://localhost:5000/signup", {
      email,
      password,
      firstName,
      lastName,
      address1,
      city,
      state,
      postalCode,
      dateOfBirth,
    })

    if (response.status === 200) {
      const newUser = response.data
      return parseStringify(newUser)
    }
  } catch (error) {
    console.error("Error", error)
  }
}

export async function getLoggedInUser() {
  try {
    const response = await httpClient.get("http://localhost:5000/@user")

    if (response.status === 200) {
      const user = response.data
      return parseStringify(user)
    }
  } catch (error) {
    console.log(error)
    return null
  }
}

export const signOut = async () => {
  try {
    await httpClient.post("http://localhost:5000/signout")
    return "200"
  } catch (error) {
    console.log(error)
    return null
  }
}
