"use client"

import Image from "next/image"
import Link from "next/link"
import React, { useState } from "react"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import CustomInput from "./CustomInput"
import { authFormSchema } from "@/lib/utils"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { signIn, signUp } from "@/lib/actions/user.actions"
import BankCard from "./BankCard"
import { MOCK_BANK_ACCOUNTS } from "@/constants"
import { addBankAccounts } from "@/lib/actions/bank.actions"

const AuthForm = ({ type }: { type: string }) => {
  const banks = MOCK_BANK_ACCOUNTS

  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const formSchema = authFormSchema(type)

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  // 2. Define a submit handler.
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true)

    try {
      if (type === "sign-up") {
        const userData = {
          firstName: data.firstName!,
          lastName: data.lastName!,
          address1: data.address1!,
          city: data.city!,
          state: data.state!,
          postalCode: data.postalCode!,
          dateOfBirth: data.dateOfBirth!,
          email: data.email,
          password: data.password,
        }

        const newUser = await signUp(userData)
        setUser(newUser)
      }

      if (type === "sign-in") {
        const response = await signIn({
          email: data.email,
          password: data.password,
        })
        if (response) router.push("/")
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBankAddition = async () => {
    try {
      const response = await addBankAccounts({
        userId: user!.id,
        bankAccounts: banks.map((bank) => {
          return {
            name: bank.account.name,
            mask: bank.account.mask,
            currentBalance: bank.account.currentBalance,
          }
        }),
      })
      if (response) router.push("/")
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <section className="auth-form">
      <header className="flex flex-col gap-5 md:gap-8">
        <Link href="/" className="cursor-pointer flex items-center gap-1">
          <Image
            src="/icons/logo.svg"
            width={34}
            height={34}
            alt="SellScaleHood logo"
          />
          <h1 className="text-26 font-ibm-plex-serif font-bold text-black-1">
            SellScaleHood
          </h1>
        </Link>

        <div className="flex flex-col gap-1 md:gap-3">
          <h1 className="text-16 lg:text-24 font-semibold text-gray-900">
            {user
              ? "Link Bank Account"
              : type === "sign-in"
              ? "Sign In"
              : "Sign Up"}
            <p className="text-16 font-normal text-gray-600">
              {user
                ? "Link your bank account to get started"
                : "Please enter your details"}
            </p>
          </h1>
        </div>
      </header>
      {user ? (
        <div className="flex flex-col gap-4">
          <div className="relative flex flex-1 flex-col items-center justify-center gap-5">
            <div className="relative z-10 w-[70%] -left-16">
              <BankCard
                key={banks[0].$id}
                account={banks[0].account}
                userName={`${user.firstName} ${user.lastName}`}
                showBalance={false}
              />
            </div>
            <div className="absolute right-20 top-8 z-0 w-[70%]">
              <BankCard
                key={banks[1].$id}
                account={banks[1].account}
                userName={`${user.firstName} ${user.lastName}`}
                showBalance={false}
              />
            </div>
          </div>
          <Button
            variant="link"
            className="mt-8 justify-start text-md font-semibold w-fit text-bankGradient"
            onClick={handleBankAddition}>
            Get Started
          </Button>
        </div>
      ) : (
        <>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {type === "sign-up" && (
                <>
                  <div className="flex gap-4">
                    <CustomInput
                      control={form.control}
                      name="firstName"
                      label="First Name"
                      placeholder="Enter your first name"
                    />
                    <CustomInput
                      control={form.control}
                      name="lastName"
                      label="Last Name"
                      placeholder="Enter your last name"
                    />
                  </div>
                  <CustomInput
                    control={form.control}
                    name="address1"
                    label="Address"
                    placeholder="Enter your specific address"
                  />
                  <CustomInput
                    control={form.control}
                    name="city"
                    label="City"
                    placeholder="Enter your city"
                  />
                  <div className="flex gap-4">
                    <CustomInput
                      control={form.control}
                      name="state"
                      label="State"
                      placeholder="Example: NY"
                    />
                    <CustomInput
                      control={form.control}
                      name="postalCode"
                      label="Postal Code"
                      placeholder="Example: 11101"
                    />
                  </div>
                  <div className="flex gap-4">
                    <CustomInput
                      control={form.control}
                      name="dateOfBirth"
                      label="Date of Birth"
                      placeholder="MM/DD/YYYY"
                    />
                  </div>
                </>
              )}

              <CustomInput
                control={form.control}
                name="email"
                label="Email"
                placeholder="Enter your email"
              />

              <CustomInput
                control={form.control}
                name="password"
                label="Password"
                placeholder="Enter your password"
              />

              <div className="flex flex-col gap-4">
                <Button type="submit" disabled={isLoading} className="form-btn">
                  {isLoading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" /> &nbsp;
                      Loading...
                    </>
                  ) : type === "sign-in" ? (
                    "Sign In"
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              </div>
            </form>
          </Form>

          <footer className="flex justify-center gap-1">
            <p className="text-14 font-normal text-gray-600">
              {type === "sign-in"
                ? "Don't have an account?"
                : "Already have an account?"}
            </p>
            <Link
              href={type === "sign-in" ? "/sign-up" : "/sign-in"}
              className="form-link">
              {type === "sign-in" ? "Sign up" : "Sign in"}
            </Link>
          </footer>
        </>
      )}
    </section>
  )
}

export default AuthForm
