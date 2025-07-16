import Link from 'next/link'
import React from 'react'

const FooterNews = () => {
  return (
      <footer className=" border-t  mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h3 className="text-2xl font-serif font-bold  mb-4">
              The <span className="font-normal">NEWS</span>
            </h3>
            <p className="text-sm  mb-4">
              Copyright © 2024 - The News - All rights reserved
            </p>
            <div className="flex justify-center space-x-6 text-sm ">
              <Link href="#">Privacy Policy</Link>
              <Link href="#">Terms of Service</Link>
              <Link href="#">Contact Us</Link>
              <Link href="#">About</Link>
              <Link href="#">Careers</Link>
            </div>
          </div>
        </div>
      </footer>
  )
}

export default FooterNews