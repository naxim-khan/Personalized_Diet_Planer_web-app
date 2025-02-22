import React from 'react'
import Image from 'next/image'
import logo from '@/public/icons/logout.svg'
import { logoutAccount } from '@/lib/actions/users.action'
import { useRouter } from 'next/navigation'

const Footer = ({ user, type = 'desktop', isExpanded }: FooterProps) => {
    const router = useRouter()
    const handleLogOut = async () => {
        const logOut = await logoutAccount();
        if (logOut) router.push('/sign-in')
    }

    return (
        <div className="footer-2">
            {(isExpanded && (type === 'mobile' || type === 'desktop')) && (
                <div className={type === 'mobile' ? 'footer_name-mobile' : 'footer_name'}>
                    <p className="text-xl font-bold text-gray-700">
                        {user?.name[0]}
                    </p>
                </div>
            )}


            <div className={type === 'mobile' ? 'footer_email-mobile' : 'footer_email'}>
                {(type === 'mobile' || (type === 'desktop' && isExpanded)) && (
                    <>
                        <h1 className="text-14 truncate text-gray-700 font-semibold">
                            {user?.name}
                        </h1>
                        <p className="text-14 truncate font-normal text-gray-600">
                            {user?.email}
                        </p>
                    </>
                )}

            </div>

            <div className="relative size-7  w-full flex items-center justify-center"  onClick={handleLogOut} title='logout'>
                <Image src="/icons/logout.svg" fill alt="jsm" />
            </div>
        </div>
    )
}

export default Footer
