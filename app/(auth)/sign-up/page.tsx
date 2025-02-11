import React from 'react'
import AuthForm from '@/components/Auth/AuthForm'

const SignUp = () => {
  return (
    <section className='flex-center size-full max-sm:px-6 h-screen'>
      <AuthForm type="sign-up" />
    </section>
  )
}

export default SignUp