import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Package, Edit2, Check, X, RefreshCw, Plus, Trash2 } from "lucide-react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useProducts, Product } from "@/hooks/useProducts";
import { useCurrency } from "@/context/CurrencyContext";
import { axios } from "@/config/axios";

const AdminProductsPage = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAdminAuth();
    const { products, loading, fetchProducts, createProduct, updateProduct, deleteProduct } = useProducts();
    const { formatPrice } = useCurrency();

    // Editing State
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editData, setEditData] = useState({
        productCategory: "",
        code: "",
        price: ""
    });

    // New Product State
    const [showNewForm, setShowNewForm] = useState(false);
    const [newData, setNewData] = useState({
        productCategory: "",
        code: "",
        price: "",
        quantity: 100
    });

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login");
            return;
        }
    }, [navigate, isAuthenticated]);

    const handleEdit = (product: Product) => {
        setEditingId(product._id);
        setEditData({
            productCategory: product.productCategory,
            code: product.code,
            price: product.price.toString()
        });
    };

    const handleSave = async (id: string) => {
        const priceNum = parseFloat(editData.price);
        if (isNaN(priceNum)) return alert("Invalid price");
        if (!editData.productCategory || !editData.code) return alert("Fields cannot be empty");

        const success = await updateProduct(id, {
            productCategory: editData.productCategory,
            code: editData.code,
            price: priceNum
        });

        if (success) {
            setEditingId(null);
        }
    };

    const handleCreate = async () => {
        const priceNum = parseFloat(newData.price);
        if (isNaN(priceNum)) return alert("Invalid price");
        if (!newData.productCategory || !newData.code) return alert("Fields cannot be empty");

        const success = await createProduct({
            ...newData,
            price: priceNum
        });

        if (success) {
            setShowNewForm(false);
            setNewData({ productCategory: "", code: "", price: "", quantity: 100 });
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            await deleteProduct(id);
        }
    };

    if (!isAuthenticated) return null;

    return (
        <div className="min-h-screen w-full bg-[#080319] bg-[url('/general/selectmethod.png')] bg-cover bg-center bg-no-repeat bg-fixed p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate("/admin/dashboard")}
                        className="h-[40px] w-[40px] flex items-center justify-center rounded-lg bg-[#4A0E64] border border-white/20 hover:bg-[#5A1E74] cursor-pointer transition-all"
                    >
                        <ArrowLeft className="w-5 h-5 text-white" />
                    </button>
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-white mb-2">Product Management</h1>
                        <p className="text-white/60">Configure your Storefront items</p>
                    </div>
                    <div className="flex gap-2 whitespace-nowrap">
                        <button
                            onClick={async () => {
                                if (window.confirm("Ensure T-shirt and Mug products exist in the store?")) {
                                    try {
                                        const res = await axios.get("/products/migrate");
                                        if (res.data.success) {
                                            alert("Success! Standard items are now in your store.");
                                            fetchProducts();
                                        }
                                    } catch (e) {
                                        alert("Failed to migrate.");
                                    }
                                }
                            }}
                            className="bg-white/5 hover:bg-white/10 text-white/60 px-4 py-2 rounded-xl flex items-center gap-2 transition-all font-bold border border-white/10"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Reset Store Items
                        </button>
                        {/* <button
                            onClick={() => setShowNewForm(!showNewForm)}
                            className="bg-[#F70353] hover:bg-[#C20241] text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all font-bold shadow-lg shadow-[#F70353]/20"
                        >
                            <Plus className="w-4 h-4" />
                            {showNewForm ? "Close Form" : "Add Product"}
                        </button> */}
                        <button
                            onClick={() => fetchProducts()}
                            className="p-2 text-white/60 hover:text-white transition-colors"
                        >
                            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                </div>

                {/* New Product Form */}
                {showNewForm && (
                    <div className="bg-[#16121E]/90 backdrop-blur-xl border border-[#F70353]/30 p-6 rounded-2xl mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
                        <h2 className="text-white font-bold mb-4 uppercase tracking-wider text-sm flex items-center gap-2">
                            <Plus className="text-[#F70353] w-4 h-4" />
                            Create New Product
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs text-white/40 uppercase font-bold">Category Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. T-shirt"
                                    value={newData.productCategory}
                                    onChange={(e) => setNewData({ ...newData, productCategory: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white focus:border-[#F70353] outline-none transition-all placeholder:text-white/20"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-white/40 uppercase font-bold">Unique Code</label>
                                <input
                                    type="text"
                                    placeholder="e.g. price-tshirt"
                                    value={newData.code}
                                    onChange={(e) => setNewData({ ...newData, code: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white focus:border-[#F70353] outline-none transition-all placeholder:text-white/20"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-white/40 uppercase font-bold">Base Price</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        value={newData.price}
                                        onChange={(e) => setNewData({ ...newData, price: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white focus:border-[#F70353] outline-none transition-all placeholder:text-white/20"
                                    />
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={handleCreate}
                            className="mt-6 w-full bg-gradient-to-r from-[#F70353] to-[#C20241] py-3 rounded-xl text-white font-black uppercase tracking-tighter hover:opacity-90 transition-all flex items-center justify-center gap-2"
                        >
                            Save Design to Storefront
                        </button>
                    </div>
                )}

                {/* Products List */}
                <div className="grid grid-cols-1 gap-4">
                    {products.map((product) => (
                        <div
                            key={product._id}
                            className={`bg-[#16121E]/80 backdrop-blur-sm border p-6 rounded-2xl transition-all duration-300 ${editingId === product._id ? 'border-[#F70353] shadow-lg shadow-[#F70353]/10' : 'border-white/10'}`}
                        >
                            {editingId === product._id ? (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="text-[10px] text-white/40 uppercase font-bold tracking-widest block mb-1">Name</label>
                                            <input
                                                type="text"
                                                value={editData.productCategory}
                                                onChange={(e) => setEditData({ ...editData, productCategory: e.target.value })}
                                                className="w-full px-4 py-2 rounded-lg bg-black/40 border border-white/20 text-white focus:border-[#F70353] outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-white/40 uppercase font-bold tracking-widest block mb-1">Store Code</label>
                                            <input
                                                type="text"
                                                value={editData.code}
                                                onChange={(e) => setEditData({ ...editData, code: e.target.value })}
                                                className="w-full px-4 py-2 rounded-lg bg-black/40 border border-white/20 text-white focus:border-[#F70353] outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-white/40 uppercase font-bold tracking-widest block mb-1">Price</label>
                                            <input
                                                type="number"
                                                value={editData.price}
                                                onChange={(e) => setEditData({ ...editData, price: e.target.value })}
                                                className="w-full px-4 py-2 rounded-lg bg-black/40 border border-[#F70353] text-white focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => handleSave(product._id)}
                                            className="px-6 py-2 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600 transition-all flex items-center gap-2"
                                        >
                                            <Check className="w-4 h-4" />
                                            Update
                                        </button>
                                        <button
                                            onClick={() => setEditingId(null)}
                                            className="px-4 py-2 bg-white/5 text-white/60 rounded-lg font-bold hover:bg-white/10 transition-all flex items-center gap-2"
                                        >
                                            <X className="w-4 h-4" />
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-gradient-to-br from-[#F70353]/10 to-[#F70353]/5 rounded-xl flex items-center justify-center border border-[#F70353]/20 shadow-inner group">
                                            <Package className="w-8 h-8 text-[#F70353] group-hover:scale-110 transition-transform" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-white uppercase tracking-tighter">{product.productCategory}</h3>
                                            <div className="flex items-center gap-2">
                                                <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-bold text-white/40 uppercase tracking-widest">
                                                    Code: {product.code}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="text-right mr-4">
                                            <p className="text-white/40 text-[10px] font-black uppercase tracking-[2px] mb-1">Storefront Price</p>
                                            <p className="text-3xl font-black text-[#F70353] tracking-tighter drop-shadow-[0_0_10px_rgba(247,3,83,0.3)]">
                                                {formatPrice(product.price)}
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(product)}
                                                className="p-3 bg-white/5 border border-white/10 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all"
                                                title="Edit Details"
                                            >
                                                <Edit2 className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product._id)}
                                                className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500/60 hover:text-red-500 hover:bg-red-500/20 transition-all"
                                                title="Delete Product"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}

                    {products.length === 0 && !loading && (
                        <div className="text-center py-16 bg-[#16121E]/40 border border-white/5 border-dashed rounded-3xl">
                            <Package className="w-16 h-16 text-white/10 mx-auto mb-4" />
                            <p className="text-white/40 font-bold uppercase tracking-widest text-sm">No Products Found</p>
                            <p className="text-white/20 text-xs mt-1">Start by adding your first product using the form above</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminProductsPage;
