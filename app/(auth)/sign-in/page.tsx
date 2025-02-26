import React from 'react'
import AuthForm from '../../../components/Auth/AuthForm'
const SignIn = () => {
  return (
    <section className='flex-center size-full max-sm:px-6 h-screen'>
      <div className=' max-w-lg w-full'>
        <AuthForm type="sign-in" />
      </div>
    </section>
  )
}

export default SignIn