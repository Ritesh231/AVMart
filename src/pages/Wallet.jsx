import React from 'react'
import WalletCard from "../components/Wallet/WalletCard"
import { Outlet } from 'react-router-dom'

const Wallet = () => {
    return (
         <div className="p-4 sm:p-6 bg-[#F8FAFC] min-h-screen w-full">
             <h1 className="text-xl font-semibold mb-3">Wallet & Cashback</h1>
             <h3 className="text-[#9F9F9F] mb-6">Manage wallet balances and cashback programs</h3>
             <WalletCard/>
             <Outlet/>
           </div>
    )
}

export default Wallet