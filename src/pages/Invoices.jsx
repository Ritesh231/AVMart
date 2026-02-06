import { Download, ReceiptText, Search, Upload } from 'lucide-react'
import React from 'react'
import StatCard from '../components/StatCard'

const Invoices = () => {

    const invoiceTypeStat = [
        {
            title: "GST Invoice",
            number: "200",
            statement: "+ 12 % from last Month",
            icon: <ReceiptText size={24} />,
            special: true
        },
        {
            title: "Non-GST ",
            number: "20",
            statement: "+ 12 % from last Month",
            icon: <ReceiptText size={24} />,
        },
    ]

    return (
        <div className='p-6'>
            <section className="heading-and-btn-sec flex justify-between items-center">
                <div>
                    <h2>Invoice Management</h2>
                    <p className='text-[#9F9F9F] text-[0.92rem]'>Manage Invoices & Inventory</p>
                </div>
                <div>
                    <button className='bg-brand-navy px-4 py-2.5 rounded-xl flex justify-center gap-1 items-center text-white'><Upload /> Upload Invoice</button>
                </div>
            </section>

            <section className="stat-card-sec bg-white border-2 border-brand-soft rounded-[2.5rem] p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {invoiceTypeStat.map((stat, index) => (
                        <StatCard
                            key={index}
                            title={stat.title}
                            number={stat.number}
                            statement={stat.statement}
                            icon={stat.icon}
                            variant={stat.special ? 'special' : 'normal'}
                        />
                    ))}
                </div>
            </section>

            <section className="invoices-sec bg-white border-2 border-brand-soft rounded-[2.5rem] p-6">


                <div className="invoices-table">
                    <div className='flex items-center justify-between'>
                        <div className="gst-filter-btns text-brand-gray lg:w-[40%] md:w-[50%] w-full" >
                            <div className='flex items-center justify-start gap-2 bg-white border-2 border-brand-soft rounded-xl p-3 shadow-sm focus-within:border-brand-teal transition-all'>
                                <Search className="text-brand-gray" size={20} />
                                <input
                                    className='w-full bg-transparent border-none focus:ring-0 focus:outline-none text-brand-navy placeholder:text-brand-gray'
                                    type="text"
                                    placeholder='Search By Invoice Number or GST Number'
                                />
                            </div>
                        </div>

                        <div>
                            <button className='bg-brand-navy px-4 py-2.5 rounded-xl flex justify-center gap-1 items-center text-white'>
                                <Download /> Export
                            </button>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    )
}

export default Invoices