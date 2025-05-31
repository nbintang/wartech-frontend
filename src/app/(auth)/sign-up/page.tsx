import SignUp from '@/features/auth/signup'
import { GalleryVerticalEnd } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

export default function SignUpPage() {
  return (
  <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Acme Inc.
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <SignUp />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
     <div className='absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale bg-black'/>
      </div>
    </div>
  )
}
