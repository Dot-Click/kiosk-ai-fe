// import { useEffect, useState, useRef } from "react";
// import { useSearchParams, useNavigate } from "react-router-dom";
// import { useStripeCheckout } from "@/hooks/useStripeCheckout";
// import { CheckCircle, Printer, Home, ShoppingBag,Zap,Truck, MapPin, Loader2 } from "lucide-react";
// import { useReactToPrint } from "react-to-print";

// export default function CheckoutSuccessPage() {
//   const [searchParams] = useSearchParams();
//   const sessionId = searchParams.get("session_id");
//   const navigate = useNavigate();
//   const { verifySession } = useStripeCheckout();

//   const [order, setOrder] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // Print Ref
//   const componentRef = useRef<HTMLDivElement>(null);
//   const handlePrint = useReactToPrint({
//     contentRef: componentRef,
//   });

//   useEffect(() => {
//     if (!sessionId) {
//       navigate("/");
//       return;
//     }

//     const verify = async () => {
//       try {
//         const res = await verifySession(sessionId);
//         if (res.success) {
//           setOrder(res.data);
//           // Auto print after a short delay
//           setTimeout(() => {
//             handlePrint();
//           }, 1000);
//         } else {
//           setError("Failed to verify order details.");
//         }
//       } catch (err) {
//         console.error(err);
//         setError("Error loading order details.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     verify();
//   }, [sessionId, verifySession, navigate, handlePrint]);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-[#080319] flex items-center justify-center text-white">
//         <Loader2 className="w-10 h-10 animate-spin text-[#F70353]" />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-[#080319] flex flex-col items-center justify-center text-white p-4">
//         <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl text-center max-w-md">
//           <h1 className="text-xl font-bold text-red-400 mb-2">Something went wrong</h1>
//           <p className="text-white/60 mb-6">{error}</p>
//           <button
//             onClick={() => navigate("/")}
//             className="px-6 py-3 bg-white/10 rounded-xl hover:bg-white/20 transition-all font-semibold"
//           >
//             Return Home
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen w-full bg-[#080319] text-white font-['Outfit'] relative overflow-x-hidden p-4 md:p-8">
//       <div className="max-w-3xl mx-auto">

//         {/* Success Message */}
//         <div className="text-center mb-10">
//           <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 ring-4 ring-green-500/10">
//             <CheckCircle className="w-10 h-10 text-green-400" />
//           </div>
//           <h1 className="text-3xl md:text-5xl font-black tracking-tighter mb-4">
//             ORDER <span className="text-[#F70353]">CONFIRMED!</span>
//           </h1>
//           <p className="text-white/60 text-lg">
//             Thank you for your purchase. Your order has been placed.
//           </p>
//         </div>

//         {/* Action Buttons - No Print */}
//         <div className="flex flex-wrap justify-center gap-4 mb-10 print:hidden">
//           <button
//             onClick={() => handlePrint()}
//             className="flex items-center gap-2 px-8 py-4 bg-[#F70353] hover:bg-[#C20241] rounded-xl font-bold transition-all shadow-lg shadow-[#F70353]/20"
//           >
//             <Printer size={20} />
//             Print Receipt
//           </button>
//           <button
//             onClick={() => navigate("/")}
//             className="flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 rounded-xl font-bold transition-all"
//           >
//             <Home size={20} />
//             Back to Home
//           </button>
//         </div>

//         {/* Receipt / Invoice */}
//         <div className="bg-white text-black p-8 md:p-12 rounded-lg shadow-2xl max-w-2xl mx-auto print:bg-white print:text-black print:shadow-none print:w-full print:max-w-none" ref={componentRef}>

//           {/* Receipt Header */}
//           <div className="flex justify-between items-start mb-8 border-b border-gray-200 pb-8">
//             <div>
//               <h2 className="text-2xl font-black uppercase tracking-wider mb-2">PROMPT<span className="text-[#F70353]">WIZARD</span></h2>
//               <p className="text-gray-500 text-sm">Automated Kiosk System</p>
//               <p className="text-gray-500 text-sm">Store ID: #88742</p>
//             </div>
//             <div className="text-right">
//               <h3 className="text-gray-400 font-bold uppercase tracking-widest text-sm mb-1">Order #</h3>
//               <p className="text-2xl font-bold">{order?.orderNumber}</p>
//               <p className="text-gray-500 text-sm mt-1">{new Date(order?.createdAt).toLocaleDateString()} {new Date(order?.createdAt).toLocaleTimeString()}</p>
//             </div>
//           </div>

//           {/* Customer & Fulfillment */}
//           <div className="grid grid-cols-2 gap-8 mb-8 text-sm">
//             <div>
//               <h4 className="font-bold text-gray-400 uppercase tracking-wider mb-2">Billed To</h4>
//               <p className="font-bold text-lg mb-1">{order?.customer.name}</p>
//               <p className="text-gray-600">{order?.customer.phone}</p>
//               <p className="text-gray-600">{order?.customer.email}</p>
//             </div>
//             <div>
//               <h4 className="font-bold text-gray-400 uppercase tracking-wider mb-2">Fulfillment</h4>
//               <div className="flex items-center gap-2 mb-1">
//                 {order?.fulfillment.method === 'express' ? <Zap className="w-4 h-4 text-[#F70353]" /> : <Truck className="w-4 h-4 text-[#F70353]" />}
//                 <span className="font-bold capitalize">{order?.fulfillment.method} Delivery</span>
//               </div>
//               {order?.fulfillment.method === 'doorstep' && order.fulfillment.address && (
//                 <div className="text-gray-600">
//                   <p>{order.fulfillment.address.street}</p>
//                   <p>{order.fulfillment.address.city}, {order.fulfillment.address.zip}</p>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Items Table */}
//           <table className="w-full mb-8">
//             <thead>
//               <tr className="border-b-2 border-black">
//                 <th className="text-left py-3 font-bold uppercase tracking-wider text-sm">Item</th>
//                 <th className="text-center py-3 font-bold uppercase tracking-wider text-sm">Qty</th>
//                 <th className="text-right py-3 font-bold uppercase tracking-wider text-sm">Price</th>
//                 <th className="text-right py-3 font-bold uppercase tracking-wider text-sm">Total</th>
//               </tr>
//             </thead>
//             <tbody className="text-gray-700">
//               {order?.items.map((item: any, index: number) => (
//                 <tr key={index} className="border-b border-gray-100">
//                   <td className="py-4 font-medium">{item.productName}</td>
//                   <td className="py-4 text-center">{item.quantity}</td>
//                   <td className="py-4 text-right">${item.price.toFixed(2)}</td>
//                   <td className="py-4 text-right font-bold">${(item.price * item.quantity).toFixed(2)}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           {/* Totals */}
//           <div className="border-t-2 border-black pt-6 flex flex-col items-end gap-2">
//             <div className="flex justify-between w-full md:w-1/2 text-gray-600">
//               <span>Subtotal</span>
//               <span>${(order?.payment.amount - (order?.fulfillment.method === 'doorstep' ? 5 : 0)).toFixed(2)}</span>
//             </div>
//             {order?.fulfillment.method === 'doorstep' && (
//               <div className="flex justify-between w-full md:w-1/2 text-gray-600">
//                 <span>Shipping</span>
//                 <span>$5.00</span>
//               </div>
//             )}
//             <div className="flex justify-between w-full md:w-1/2 text-2xl font-black mt-2">
//               <span>TOTAL</span>
//               <span>${order?.payment.amount.toFixed(2)}</span>
//             </div>
//           </div>

//           {/* Footer */}
//           <div className="mt-12 pt-8 border-t border-gray-200 text-center text-gray-400 text-sm">
//             <p className="mb-2">Thank you for shopping with us!</p>
//             <p className="text-xs">For support, please contact kiosk-help@example.com</p>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }


import { useEffect, useState, useRef, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useStripeCheckout } from "@/hooks/useStripeCheckout";
import { CheckCircle, Printer, Home, Loader2 } from "lucide-react";
import { useReactToPrint } from "react-to-print";

export default function CheckoutSuccessPage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const navigate = useNavigate();
  const { verifySession } = useStripeCheckout();

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState("");

  const componentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
  });

  // FIXED LOGIC: Correcting the Price vs Total calculation
  const totals = useMemo(() => {
    if (!order) return { subtotal: 0, shipping: 0, total: 0, products: [], deliveryItems: [] };

    // Separate products from delivery items
    const products = order.items.filter((item: any) =>
      !item.productName.toLowerCase().includes("delivery") &&
      !item.productName.toLowerCase().includes("shipping")
    );

    const deliveryItems = order.items.filter((item: any) =>
      item.productName.toLowerCase().includes("delivery") ||
      item.productName.toLowerCase().includes("shipping")
    );

    // Calculate Subtotal (only products)
    const subtotal = products.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);

    // Calculate Shipping (all delivery-related items)
    const shipping = deliveryItems.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);

    // Total from payment amount (source of truth)
    const total = order.payment.amount;

    return { subtotal, shipping, total, products, deliveryItems };
  }, [order]);

  const isVerifying = useRef(false);

  useEffect(() => {
    if (!sessionId || order || isVerifying.current) {
      if (!sessionId) navigate("/");
      return;
    }

    const verify = async () => {
      isVerifying.current = true;
      try {
        console.log("Verifying session:", sessionId);
        const res = await verifySession(sessionId);
        if (res.success) {
          setOrder(res.data);
          setTimeout(() => handlePrint(), 1000);
        } else {
          setError("Failed to verify order details.");
        }
      } catch (err) {
        setError("Error loading order details.");
      } finally {
        setLoading(false);
      }
    };
    verify();
  }, [sessionId, verifySession, navigate, handlePrint, order]);

  if (loading) return (
    <div className="min-h-screen bg-[#080319] flex items-center justify-center text-white">
      <Loader2 className="w-10 h-10 animate-spin text-[#F70353]" />
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-[#080319] text-white font-['Outfit'] p-4 md:p-8">
      <div className="max-w-2xl mx-auto">

        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
          <h1 className="text-3xl font-black tracking-tight mb-2 uppercase">
            ORDER <span className="text-[#F70353]">CONFIRMED</span>
          </h1>
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-3 mb-10 print:hidden">
          <button onClick={() => handlePrint()} className="flex items-center gap-2 px-6 py-3 bg-[#F70353] rounded-xl font-bold">
            <Printer size={18} /> Print Receipt
          </button>
          <button onClick={() => navigate("/")} className="flex items-center gap-2 px-6 py-3 bg-white/10 rounded-xl font-bold">
            <Home size={18} /> Home
          </button>
        </div>

        {/* FIXED RECEIPT SLIP */}
        <div
          ref={componentRef}
          className="bg-white text-black p-8 mx-auto w-full font-mono text-sm shadow-2xl print:shadow-none"
          style={{ maxWidth: '480px' }}
        >
          {/* Header */}
          <div className="text-center border-b-2 border-dashed border-gray-200 pb-6 mb-6">
            <h2 className="text-xl font-black uppercase">PROMPT<span className="text-[#F70353]">WIZARD</span></h2>
            <p className="text-[10px] text-gray-400 mt-1 uppercase">Terminal #88742 • Receipt Online</p>
          </div>

          {/* Info */}
          <div className="space-y-1 mb-6">
            <div className="flex justify-between">
              <span className="font-bold uppercase text-[11px]">Order ID:</span>
              <span className="font-bold">{order?.orderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold uppercase text-[11px]">Date:</span>
              <span>{new Date(order?.createdAt).toLocaleDateString()} {new Date(order?.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>

          {/* Customer */}
          <div className="mb-8 border border-gray-100 p-4 rounded-md">
            <p className="font-bold text-[10px] text-gray-400 uppercase mb-1">Customer</p>
            <p className="font-bold text-base uppercase leading-none">{order?.customer.name}</p>
            <p className="text-gray-500 text-xs mt-1">{order?.customer.email}</p>
          </div>

          {/* Table Header */}
          <div className="border-b-2 border-black pb-2 mb-4 flex justify-between font-bold uppercase text-[11px]">
            <span>Item Description</span>
            <span>Total</span>
          </div>

          {/* Items - Products Only */}
          <div className="space-y-6 mb-8">
            {totals.products.map((item: any, index: number) => {
              const unitPrice = item.price;
              const lineTotal = item.price * item.quantity;

              return (
                <div key={index} className="flex justify-between items-start">
                  <div className="max-w-[75%]">
                    <p className="font-bold leading-tight uppercase text-base">{item.productName}</p>
                    <p className="text-gray-400 mt-1 text-xs">
                      {item.quantity} x ${unitPrice.toFixed(2)}
                    </p>
                  </div>
                  <span className="font-bold text-base">${lineTotal.toFixed(2)}</span>
                </div>
              );
            })}
          </div>

          {/* Totals Section */}
          <div className="border-t-2 border-dashed border-gray-200 pt-4 space-y-2">
            <div className="flex justify-between text-gray-500 uppercase text-[11px] font-bold">
              <span>Subtotal</span>
              <span className="text-black text-sm">${totals.subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-gray-500 uppercase text-[11px] font-bold">
              <span>Shipping</span>
              <span className="text-black text-sm">${totals.shipping.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-2xl font-black pt-4 border-t-2 border-black mt-2">
              <span>TOTAL</span>
              <span className="text-[#F70353]">${totals.total.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-8 text-center text-[10px] font-bold text-gray-300 uppercase underline decoration-dashed decoration-gray-200 underline-offset-4">
            Method: {order?.fulfillment.method} Delivery
          </div>

          {/* Barcode & Footer */}
          <div className="mt-10 text-center">
            <div className="inline-block border border-gray-100 p-2 mb-4">
              <div className="h-8 w-40 bg-[url('https://bwipjs-api.metafloor.com/?bcid=code128&text=PROMPTWIZARD')] bg-no-repeat bg-center bg-contain opacity-70"></div>
            </div>
            <p className="font-black text-sm uppercase tracking-tighter">Thank You!</p>
            <p className="text-[10px] text-gray-400 mt-1">Please keep this receipt for your records.</p>
          </div>

        </div>
      </div>
    </div>
  );
}