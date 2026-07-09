import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Tag,
    Layers,
    Boxes,
    Percent,
    ShieldCheck,
    Calendar,
    IndianRupee,
    CheckCircle2,
    FileText,
} from "lucide-react";
import { FaEdit } from "react-icons/fa";
import { useProductdetailsQuery } from "../../Redux/apis/productsApi";
import { toast } from "react-toastify";

// Splits the "\r\nItem\r\nItem" style strings coming from the backend
// into a clean array of individual points.
function splitLines(value) {
    if (!value) return [];
    const raw = Array.isArray(value) ? value.join("\n") : value;
    return raw
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);
}

function formatDate(iso) {
    if (!iso) return "-";
    return new Date(iso).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

export default function ProductDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data, isLoading, isError, refetch } = useProductdetailsQuery(id);

    const product = data?.data;
    const [activeVariantIndex, setActiveVariantIndex] = useState(0);
    const [activeImage, setActiveImage] = useState(null);

    if (isLoading) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-slate-400">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-[#FF7A1A]" />
                <p className="text-sm">Loading product…</p>
            </div>
        );
    }

    if (isError || !product) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-slate-400">
                <p className="text-sm">Couldn't load this product.</p>
                <button
                    onClick={refetch}
                    className="rounded-lg bg-brand-navy px-4 py-2 text-sm font-medium text-white hover:opacity-90"
                >
                    Try again
                </button>
            </div>
        );
    }

    const activeVariant = product.variants?.[activeVariantIndex];
    const gallery = [
        ...(product.primaryImages || []),
        ...(activeVariant?.images || []),
    ].filter(Boolean);
    const currentImage = activeImage || gallery[0];

    const keyFeatures = splitLines(product.keyFeatures);
    const wholesaleAdvantage = splitLines(product.wholesaleAdvantage);

    const discountPercent =
        activeVariant?.MrpPrice && activeVariant?.OutRate
            ? Math.round(
                ((activeVariant.MrpPrice - activeVariant.OutRate) /
                    activeVariant.MrpPrice) *
                100
            )
            : 0;

    return (
        <div className="min-h-screen bg-[#F5F6FA] p-4 md:p-6">
            {/* Top bar */}
            <div className="mb-4 flex items-center justify-between">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-brand-navy shadow-sm border border-slate-100 hover:bg-slate-50"
                >
                    <ArrowLeft size={16} />
                    Back to Products
                </button>

                {/* <button
                    onClick={() => navigate(`/AddProduct`, { state: { productId: product._id } })}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#FD610D] to-[#FF8800] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90"
                >
                    <FaEdit size={14} />
                    Edit Product
                </button> */}
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
                {/* Left: Gallery */}
                <div className="lg:col-span-2">
                    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-center rounded-xl bg-brand-blue/30 p-6">
                            <img
                                src={currentImage}
                                alt={product.productName}
                                className="h-64 w-full object-contain"
                            />
                        </div>

                        {gallery.length > 1 && (
                            <div className="mt-4 flex gap-2 overflow-x-auto">
                                {gallery.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImage(img)}
                                        className={`h-16 w-16 shrink-0 rounded-lg border-2 p-1 transition ${currentImage === img
                                            ? "border-[#FF7A1A]"
                                            : "border-slate-100 hover:border-slate-300"
                                            }`}
                                    >
                                        <img
                                            src={img}
                                            alt=""
                                            className="h-full w-full object-contain"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Brand card */}
                    {product.brand && (
                        <div className="mt-5 flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                            {product.brand.logo && (
                                <img
                                    src={product.brand.logo}
                                    alt={product.brand.name}
                                    className="h-10 w-10 rounded-lg object-contain bg-slate-50 p-1"
                                />
                            )}
                            <div>
                                <p className="text-xs text-slate-400">Brand</p>
                                <p className="text-sm font-semibold text-brand-navy">
                                    {product.brand.name}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right: Details */}
                <div className="lg:col-span-3 space-y-5 h-[90vh] overflow-y-scroll">
                    {/* Header card */}
                    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                                <h1 className="text-xl font-bold text-brand-navy">
                                    {product.productName}
                                </h1>
                                <p className="text-sm text-slate-500 mt-0.5">
                                    {product.subtext}
                                </p>
                            </div>
                            <span
                                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${product.status === "active"
                                    ? "bg-emerald-50 text-emerald-600"
                                    : "bg-slate-100 text-slate-500"
                                    }`}
                            >
                                <span
                                    className={`h-1.5 w-1.5 rounded-full ${product.status === "active"
                                        ? "bg-emerald-500"
                                        : "bg-slate-400"
                                        }`}
                                />
                                {product.status === "active" ? "Active" : "Inactive"}
                            </span>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                            {product.category?.name && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                                    <Layers size={12} />
                                    {product.category.name}
                                </span>
                            )}
                            {product.HSNCODE && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                                    <Tag size={12} />
                                    HSN {product.HSNCODE}
                                </span>
                            )}
                        </div>

                        {/* Price block */}
                        {activeVariant && (
                            <div className="mt-4 flex flex-wrap items-end gap-3 border-t border-slate-100 pt-4">
                                <span className="flex items-center text-2xl font-bold text-brand-navy">
                                    <IndianRupee size={18} />
                                    {activeVariant.OutRate}
                                </span>
                                {activeVariant.MrpPrice > activeVariant.OutRate && (
                                    <>
                                        <span className="text-sm text-slate-400 line-through">
                                            ₹{activeVariant.MrpPrice}
                                        </span>
                                        <span className="rounded-md bg-rose-50 px-2 py-0.5 text-xs font-semibold text-rose-600">
                                            {discountPercent}% off
                                        </span>
                                    </>
                                )}
                                <span className="ml-auto text-xs text-slate-500">
                                    In stock:{" "}
                                    <span className="font-semibold text-emerald-600">
                                        {activeVariant.stock}
                                    </span>
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Variant selector */}
                    {product.variants?.length > 1 && (
                        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                            <p className="mb-3 text-sm font-semibold text-brand-navy">
                                Variants
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {product.variants.map((v, idx) => (
                                    <button
                                        key={v._id}
                                        onClick={() => {
                                            setActiveVariantIndex(idx);
                                            setActiveImage(null);
                                        }}
                                        className={`rounded-xl px-4 py-2 text-sm font-medium transition ${idx === activeVariantIndex
                                            ? "bg-brand-navy text-white"
                                            : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                                            }`}
                                    >
                                        {v.quantityValue} {v.quantityUnit}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Pricing & GST breakdown */}
                    {activeVariant && (
                        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                            <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-brand-navy">
                                <Percent size={16} className="text-[#FF7A1A]" />
                                Pricing &amp; GST
                            </p>
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                                <Stat label="Purchase Rate" value={`₹${activeVariant.InRate}`} />
                                <Stat label="Selling Rate" value={`₹${activeVariant.OutRate}`} />
                                <Stat label="MRP" value={`₹${activeVariant.MrpPrice}`} />
                                <Stat
                                    label="Margin"
                                    value={`${activeVariant.marginPercentage}%`}
                                />
                                <Stat label="CGST" value={`${activeVariant.CGST}% (₹${activeVariant.CGSTprice})`} />
                                <Stat label="SGST" value={`${activeVariant.SGST}% (₹${activeVariant.SGSTprice})`} />
                                <Stat label="GST Rate" value={`${activeVariant.gstRate}%`} />
                                <Stat label="GST Amount" value={`₹${activeVariant.gstAmount}`} />
                                <Stat label="Min. Order Qty" value={activeVariant.minQuantity} />
                                <Stat label="Stock" value={activeVariant.stock} />
                            </div>
                        </div>
                    )}

                    {/* Key features */}
                    {keyFeatures.length > 0 && (
                        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                            <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-brand-navy">
                                <CheckCircle2 size={16} className="text-[#FF7A1A]" />
                                Key Features
                            </p>
                            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                {keyFeatures.map((feature, idx) => (
                                    <li
                                        key={idx}
                                        className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600"
                                    >
                                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#FF7A1A]" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Wholesale advantage */}
                    {wholesaleAdvantage.length > 0 && (
                        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                            <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-brand-navy">
                                <ShieldCheck size={16} className="text-[#FF7A1A]" />
                                Wholesale Advantage
                            </p>
                            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                {wholesaleAdvantage.map((point, idx) => (
                                    <li
                                        key={idx}
                                        className="flex items-center gap-2 rounded-lg bg-orange-50/60 px-3 py-2 text-sm text-slate-600"
                                    >
                                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                                        {point}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Description */}
                    {product.description && (
                        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                            <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-brand-navy">
                                <FileText size={16} className="text-[#FF7A1A]" />
                                Description
                            </p>
                            <p className="text-sm leading-relaxed text-slate-600">
                                {product.description}
                            </p>
                        </div>
                    )}

                    {/* Meta */}
                    {/* <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                            <Stat
                                icon={<Boxes size={14} />}
                                label="Product ID"
                                value={product._id.slice(-8)}
                            />
                            <Stat
                                icon={<Calendar size={14} />}
                                label="Created"
                                value={formatDate(product.createdAt)}
                            />
                            <Stat
                                icon={<Calendar size={14} />}
                                label="Last Updated"
                                value={formatDate(product.updatedAt)}
                            />
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    );
}

function Stat({ label, value, icon }) {
    return (
        <div className="rounded-xl bg-slate-50 px-3 py-2">
            <p className="flex items-center gap-1 text-[11px] text-slate-400">
                {icon}
                {label}
            </p>
            <p className="text-sm font-semibold text-brand-navy truncate">{value}</p>
        </div>
    );
}