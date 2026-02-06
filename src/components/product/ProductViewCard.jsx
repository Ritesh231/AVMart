import React from 'react'

// IMP: THIS CARD IS USED IN DASHBOARD PAGE
const ProductViewCard = ({ product }) => {


    return (
        <div className="relative bg-white border border-brand-teal/20 rounded-3xl p-4 flex flex-col items-start transition-shadow hover:shadow-md">
            {/* Discount Badge */}
            <div className="absolute top-4 left-4 z-10 bg-[#EAB308] text-white text-[10px] font-bold h-10 w-10 flex items-center justify-center rounded-full shadow-lg border-2 border-white/20">
                {product.discount}%
            </div>

            {/* Product Image Container */}
            <div className="w-full aspect-square flex items-center justify-center mb-4 bg-slate-50 rounded-2xl overflow-hidden">
                <img
                    src={product.image || 'https://via.placeholder.com/150'}
                    alt={product.title}
                    className="max-h-[80%] object-contain"
                />
            </div>

            {/* Product Details */}
            <h3 className="text-brand-navy font-semibold text-sm mb-2 px-1">
                {product.title}
            </h3>

            <div className="flex items-baseline gap-2 px-1">
                <span className="text-brand-navy font-bold text-lg">
                    ₹{product.disPrice}
                </span>
                <span className="text-brand-gray line-through text-xs font-medium">
                    ₹{product.ogPrice}
                </span>
            </div>
        </div>
    );
}

export default ProductViewCard
