import { Download, Eye, ReceiptText, Search, SquareCheck, Trash2, Upload } from 'lucide-react'
import React, { useState } from 'react'
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

    const [activeTab, setActiveTab] = useState('GST'); // 'GST' or 'NON-GST'
    const [searchQuery, setSearchQuery] = useState('');

    // While rendering the Invoice table there is only one column difference in both GST & Non-GST table i.e of GSTno. and Contactno columns, so we will dynamicly add this column in the table
    const isGst = activeTab === 'GST';
    const dynamicKey = isGst ? 'gstNo' : 'contactNo';
    const dynamicLabel = isGst ? 'GST Number' : 'Contact No';

    const invoices = [
        // ================= GST INVOICES (20) =================
        { id: 1, invoiceNo: "INV1001", contactNo: "+91 9876543210", date: "20/05/2026", gstNo: "27ABCDE1234F1Z5", name: "John Doe", value: 4000, taxable: 4000, place: "Sambhajinagar", type: "GST" },
        { id: 2, invoiceNo: "INV1002", contactNo: "+91 9123456780", date: "21/05/2026", gstNo: "27PQRSX5678L1Z2", name: "Amit Sharma", value: 8500, taxable: 8500, place: "Pune", type: "GST" },
        { id: 3, invoiceNo: "INV1003", contactNo: "+91 9988776655", date: "22/05/2026", gstNo: "27LMNOP4321K1Z8", name: "Riya Patel", value: 12000, taxable: 12000, place: "Mumbai", type: "GST" },
        { id: 4, invoiceNo: "INV1004", contactNo: "+91 9090909090", date: "23/05/2026", gstNo: "27QWERT9876R1Z3", name: "Rahul Verma", value: 5600, taxable: 5600, place: "Nagpur", type: "GST" },
        { id: 5, invoiceNo: "INV1005", contactNo: "+91 9012345678", date: "24/05/2026", gstNo: "27ZXCVB3456M1Z7", name: "Neha Kulkarni", value: 23000, taxable: 23000, place: "Nashik", type: "GST" },

        { id: 6, invoiceNo: "INV1006", contactNo: "+91 9345678123", date: "25/05/2026", gstNo: "27ABCDE6789P1Z9", name: "Suresh Patil", value: 7800, taxable: 7800, place: "Kolhapur", type: "GST" },
        { id: 7, invoiceNo: "INV1007", contactNo: "+91 9876123450", date: "26/05/2026", gstNo: "27HJKLO9876B1Z1", name: "Karan Mehta", value: 4500, taxable: 4500, place: "Satara", type: "GST" },
        { id: 8, invoiceNo: "INV1008", contactNo: "+91 9988001122", date: "27/05/2026", gstNo: "27TYUIO5643C1Z4", name: "Anjali Deshmukh", value: 15000, taxable: 15000, place: "Aurangabad", type: "GST" },
        { id: 9, invoiceNo: "INV1009", contactNo: "+91 9665544332", date: "28/05/2026", gstNo: "27BNMLK9087T1Z6", name: "Vikram Singh", value: 9200, taxable: 9200, place: "Jalgaon", type: "GST" },
        { id: 10, invoiceNo: "INV1010", contactNo: "+91 9556677889", date: "29/05/2026", gstNo: "27ASDFG4567H1Z0", name: "Pooja Nair", value: 11000, taxable: 11000, place: "Thane", type: "GST" },

        { id: 11, invoiceNo: "INV1011", contactNo: "+91 9887766554", date: "30/05/2026", gstNo: "27PLMKO7654E1Z8", name: "Rohit Jain", value: 6700, taxable: 6700, place: "Latur", type: "GST" },
        { id: 12, invoiceNo: "INV1012", contactNo: "+91 9098765432", date: "31/05/2026", gstNo: "27WERTO9876N1Z5", name: "Sneha Iyer", value: 14500, taxable: 14500, place: "Solapur", type: "GST" },
        { id: 13, invoiceNo: "INV1013", contactNo: "+91 9191919191", date: "01/06/2026", gstNo: "27QAZWS1234D1Z2", name: "Arjun Rao", value: 5000, taxable: 5000, place: "Akola", type: "GST" },
        { id: 14, invoiceNo: "INV1014", contactNo: "+91 9022334455", date: "02/06/2026", gstNo: "27EDCRF5678S1Z6", name: "Manish Gupta", value: 8800, taxable: 8800, place: "Wardha", type: "GST" },
        { id: 15, invoiceNo: "INV1015", contactNo: "+91 9345612789", date: "03/06/2026", gstNo: "27RFVTG3456J1Z4", name: "Kavita Shah", value: 13400, taxable: 13400, place: "Beed", type: "GST" },

        { id: 16, invoiceNo: "INV1016", contactNo: "+91 9876540099", date: "04/06/2026", gstNo: "27MNBVC9876A1Z9", name: "Nitin Pawar", value: 6000, taxable: 6000, place: "Parbhani", type: "GST" },
        { id: 17, invoiceNo: "INV1017", contactNo: "+91 9988771122", date: "05/06/2026", gstNo: "27LKJHG7654Q1Z7", name: "Swati Joshi", value: 17000, taxable: 17000, place: "Osmanabad", type: "GST" },
        { id: 18, invoiceNo: "INV1018", contactNo: "+91 9112233445", date: "06/06/2026", gstNo: "27HGFDS4321U1Z8", name: "Deepak More", value: 9400, taxable: 9400, place: "Buldhana", type: "GST" },
        { id: 19, invoiceNo: "INV1019", contactNo: "+91 9445566778", date: "07/06/2026", gstNo: "27POIUY0987L1Z1", name: "Priya Malhotra", value: 15800, taxable: 15800, place: "Amravati", type: "GST" },
        { id: 20, invoiceNo: "INV1020", contactNo: "+91 9000012345", date: "08/06/2026", gstNo: "27CXZQA3456F1Z3", name: "Harsh Vardhan", value: 7200, taxable: 7200, place: "Yavatmal", type: "GST" },

        // ================= NON-GST INVOICES (20) =================
        { id: 21, invoiceNo: "INV2001", contactNo: "+91 9800000001", date: "20/05/2026", gstNo: "N/A", name: "Jane Smith", value: 3000, taxable: 3000, place: "Pune", type: "NON-GST" },
        { id: 22, invoiceNo: "INV2002", contactNo: "+91 9800000002", date: "21/05/2026", gstNo: "N/A", name: "Ramesh Kale", value: 4500, taxable: 4500, place: "Nashik", type: "NON-GST" },
        { id: 23, invoiceNo: "INV2003", contactNo: "+91 9800000003", date: "22/05/2026", gstNo: "N/A", name: "Sunita Patil", value: 5200, taxable: 5200, place: "Mumbai", type: "NON-GST" },
        { id: 24, invoiceNo: "INV2004", contactNo: "+91 9800000004", date: "23/05/2026", gstNo: "N/A", name: "Anand Kulkarni", value: 6100, taxable: 6100, place: "Aurangabad", type: "NON-GST" },
        { id: 25, invoiceNo: "INV2005", contactNo: "+91 9800000005", date: "24/05/2026", gstNo: "N/A", name: "Meera Joshi", value: 2800, taxable: 2800, place: "Nagpur", type: "NON-GST" },

        { id: 26, invoiceNo: "INV2006", contactNo: "+91 9800000006", date: "25/05/2026", gstNo: "N/A", name: "Ajay Patankar", value: 3900, taxable: 3900, place: "Satara", type: "NON-GST" },
        { id: 27, invoiceNo: "INV2007", contactNo: "+91 9800000007", date: "26/05/2026", gstNo: "N/A", name: "Kiran Desai", value: 4700, taxable: 4700, place: "Kolhapur", type: "NON-GST" },
        { id: 28, invoiceNo: "INV2008", contactNo: "+91 9800000008", date: "27/05/2026", gstNo: "N/A", name: "Nisha Bansal", value: 3500, taxable: 3500, place: "Thane", type: "NON-GST" },
        { id: 29, invoiceNo: "INV2009", contactNo: "+91 9800000009", date: "28/05/2026", gstNo: "N/A", name: "Sanjay More", value: 6200, taxable: 6200, place: "Latur", type: "NON-GST" },
        { id: 30, invoiceNo: "INV2010", contactNo: "+91 9811111110", date: "29/05/2026", gstNo: "N/A", name: "Pankaj Yadav", value: 4100, taxable: 4100, place: "Beed", type: "NON-GST" },

        { id: 31, invoiceNo: "INV2011", contactNo: "+91 9811111111", date: "30/05/2026", gstNo: "N/A", name: "Ayesha Khan", value: 5300, taxable: 5300, place: "Parbhani", type: "NON-GST" },
        { id: 32, invoiceNo: "INV2012", contactNo: "+91 9811111112", date: "31/05/2026", gstNo: "N/A", name: "Imran Shaikh", value: 4800, taxable: 4800, place: "Jalna", type: "NON-GST" },
        { id: 33, invoiceNo: "INV2013", contactNo: "+91 9811111113", date: "01/06/2026", gstNo: "N/A", name: "Farhan Ali", value: 3600, taxable: 3600, place: "Akola", type: "NON-GST" },
        { id: 34, invoiceNo: "INV2014", contactNo: "+91 9811111114", date: "02/06/2026", gstNo: "N/A", name: "Komal Raut", value: 5900, taxable: 5900, place: "Wardha", type: "NON-GST" },
        { id: 35, invoiceNo: "INV2015", contactNo: "+91 9811111115", date: "03/06/2026", gstNo: "N/A", name: "Vishal Patil", value: 4400, taxable: 4400, place: "Osmanabad", type: "NON-GST" },

        { id: 36, invoiceNo: "INV2016", contactNo: "+91 9811111116", date: "04/06/2026", gstNo: "N/A", name: "Ritu Agarwal", value: 5100, taxable: 5100, place: "Solapur", type: "NON-GST" },
        { id: 37, invoiceNo: "INV2017", contactNo: "+91 9811111117", date: "05/06/2026", gstNo: "N/A", name: "Alok Mishra", value: 3700, taxable: 3700, place: "Buldhana", type: "NON-GST" },
        { id: 38, invoiceNo: "INV2018", contactNo: "+91 9811111118", date: "06/06/2026", gstNo: "N/A", name: "Neelam Joshi", value: 4600, taxable: 4600, place: "Yavatmal", type: "NON-GST" },
        { id: 39, invoiceNo: "INV2019", contactNo: "+91 9811111119", date: "07/06/2026", gstNo: "N/A", name: "Siddharth Roy", value: 6800, taxable: 6800, place: "Amravati", type: "NON-GST" },
        { id: 40, invoiceNo: "INV2020", contactNo: "+91 9822222220", date: "08/06/2026", gstNo: "N/A", name: "Tanvi Deshpande", value: 4200, taxable: 4200, place: "Washim", type: "NON-GST" }
    ];

    // Logic to filter invoices based on Tab AND Search
    const filteredInvoices = invoices.filter(inv => {
        const matchesTab = inv.type === activeTab;
        const matchesSearch = inv.invoiceNo.includes(searchQuery) ||
            inv.gstNo.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });

    return (
        <div className='p-6'>
            <section className="heading-and-btn-sec my-6 flex justify-between items-center ">
                <div>
                    <h2>Invoice Management</h2>
                    <p className='text-[#9F9F9F] text-[0.92rem]'>Manage Invoices & Inventory</p>
                </div>
                <div>
                    <button className='bg-brand-navy px-4 py-2.5 rounded-xl flex justify-center gap-1 items-center text-white'><Upload /> Upload Invoice</button>
                </div>
            </section>

            {/* Cards Section */}
            <section className="stat-card-sec mb-6 bg-white border-2 border-brand-soft rounded-[2.5rem] p-6">
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

            {/* TOGGLE BUTTONS SECTION */}
            <section className="flex items-center bg-brand-navy p-1.5 rounded-2xl w-fit mb-6 shadow-lg">
                {/* GST Button */}
                <button
                    className={`px-6 py-2.5 rounded-xl flex justify-center gap-2 items-center font-bold transition-all duration-300
            ${activeTab === 'GST'
                            ? 'bg-brand-cyan text-white'
                            : 'bg-white text-brand-navy hover:opacity-90'}`}
                    onClick={() => setActiveTab('GST')}
                >
                    <ReceiptText size={18} /> GST Invoices
                </button>

                {/* NON-GST Button */}
                <button
                    className={`px-6 py-2.5 rounded-xl flex justify-center gap-2 items-center font-bold transition-all duration-300 ml-2
            ${activeTab === 'NON-GST'
                            ? 'bg-brand-cyan text-white'
                            : 'bg-white text-brand-navy hover:opacity-90 '}`}
                    onClick={() => setActiveTab('NON-GST')}
                >
                    <ReceiptText size={18} /> Non-GST Invoices
                </button>
            </section>

            {/* TABLE CONTAINER */}
            <section className="bg-white border-2 border-brand-soft rounded-[2.5rem] p-6 shadow-sm overflow-hidden">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
                    {/* Search Bar */}
                    <div className="w-full lg:w-[40%] md:w-[50%]">
                        <div className='flex items-center gap-2 bg-white border-2 border-brand-soft rounded-2xl p-3 focus-within:border-brand-teal transition-all'>
                            <Search className="text-brand-gray" size={20} />
                            <input
                                className='w-full bg-transparent border-none focus:ring-0 focus:outline-none text-brand-navy placeholder:text-brand-gray'
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder='Search By Invoice Number or GST Number'
                            />
                        </div>
                    </div>

                    {/* Export Button */}
                    <button className='bg-brand-navy px-6 py-3 rounded-2xl flex justify-center gap-2 items-center text-white font-bold hover:bg-opacity-90 transition-all'>
                        <Download size={20} /> Export
                    </button>
                </div>

                {/* TABLE SECTION */}
                <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-left border-separate border-spacing-y-2">
                        <thead>
                            <tr className="bg-brand-soft text-brand-navy">
                                <th className="p-4 rounded-l-2xl font-bold"><SquareCheck /></th>
                                <th className="p-4  font-bold">Invoice No</th>
                                <th className="p-4 font-bold">Invoice Date</th>
                                <th className="p-4 font-bold">{dynamicLabel}</th> {/* Use the pre-calculated label because this column changes for GST and Non-GST */}
                                <th className="p-4 font-bold">Customer Name</th>
                                <th className="p-4 font-bold">Invoice Value</th>
                                <th className="p-4 font-bold">Taxable Amount</th>
                                <th className="p-4 font-bold">Place Of Supply</th>
                                <th className="p-4 rounded-r-2xl font-bold text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm font-medium text-brand-navy/80">
                            {filteredInvoices.map((invoice) => (
                                <tr key={invoice.id} className="hover:bg-slate-50 transition-colors border-b border-brand-soft">
                                    <td className="p-4"><input type="checkbox" id={`checked-${invoice.invoiceNo}`} /></td>
                                    <td className="p-4">{invoice.invoiceNo}</td>
                                    <td className="p-4">{invoice.date}</td>
                                    <td className="p-4">{invoice[dynamicKey]}</td> {/* Direct property access using the pre-calculated key */}
                                    <td className="p-4">{invoice.name}</td>
                                    <td className="p-4 font-bold">₹{invoice.value}</td>
                                    <td className="p-4">₹{invoice.taxable}</td>
                                    <td className="p-4">{invoice.place}</td>
                                    <td className="p-4 text-center">
                                        <div className="flex justify-center gap-3">
                                            <button className="text-brand-navy hover:text-brand-teal transition-colors"><Eye size={20} /></button>
                                            <button className="text-red-500 hover:text-red-700 transition-colors"><Trash2 size={20} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredInvoices.length === 0 && (
                        <div className="text-center py-20 text-brand-gray">
                            No {activeTab} invoices found.
                        </div>
                    )}
                </div>
            </section>

        </div>
    )
}

export default Invoices