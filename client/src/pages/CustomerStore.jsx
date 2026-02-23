import { useEffect, useState } from 'react';
import api from '../services/api';
import { ShoppingCart, Plus, Minus, Package, CheckCircle2, AlertCircle } from 'lucide-react';

const CustomerStore = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isOrdering, setIsOrdering] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products/all');
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to load products");
      }
    };
    fetchProducts();
  }, []);

  const addToCart = (product) => {
    const existing = cart.find(item => item.product === product._id);
    if (existing) {
      setCart(cart.map(item =>
        item.product === product._id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { product: product._id, name: product.name, price: product.price, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    const existing = cart.find(item => item.product === productId);
    if (existing && existing.quantity === 1) {
      setCart(cart.filter(item => item.product !== productId));
    } else if (existing) {
      setCart(cart.map(item =>
        item.product === productId ? { ...item, quantity: item.quantity - 1 } : item
      ));
    }
  };

  const placeOrder = async () => {
    if (cart.length === 0) return;
    setIsOrdering(true);
    setMessage('');
    setIsError(false);
    try {
      const orderData = {
        items: cart.map(({ product, quantity }) => ({ product, quantity })),
        address: "123 Default Street, Kochi",
        paymentMethod: "COD"
      };

      const res = await api.post('/orders/create', orderData);
      setMessage(`Order Successful! OTP: ${res.data.order.otp}`);
      setCart([]);
    } catch (err) {
      setIsError(true);
      setMessage(err.response?.data?.msg || "Order failed");
    } finally {
      setIsOrdering(false);
    }
  };

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Products Section */}
        <div className="flex-1">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">QuickSuper Store</h1>
            <p className="text-gray-500 mt-2">Fresh groceries delivered to your door in minutes.</p>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-xl flex items-center space-x-3 backdrop-blur-sm ${isError ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
              {isError ? <AlertCircle className="shrink-0" /> : <CheckCircle2 className="shrink-0" />}
              <p className="font-medium">{message}</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.filter(p => p.isActive).map(p => {
              const cartItem = cart.find(c => c.product === p._id);
              return (
                <div key={p._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
                  <div className="h-40 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl mb-4 flex items-center justify-center text-primary-300 group-hover:scale-[1.02] transition-transform">
                    <Package size={48} strokeWidth={1} />
                  </div>
                  <div className="mb-4">
                    <h3 className="font-bold text-gray-900 text-lg truncate" title={p.name}>{p.name}</h3>
                    <p className="text-primary-600 font-bold text-xl mt-1">₹{p.price}</p>
                  </div>

                  {cartItem ? (
                    <div className="flex items-center justify-between bg-primary-50 rounded-xl p-1 border border-primary-100">
                      <button
                        onClick={() => removeFromCart(p._id)}
                        className="w-10 h-10 flex items-center justify-center text-primary-600 hover:bg-white rounded-lg transition-colors shadow-sm"
                      >
                        <Minus size={18} />
                      </button>
                      <span className="font-bold text-primary-700 w-8 text-center">{cartItem.quantity}</span>
                      <button
                        onClick={() => addToCart(p)}
                        className="w-10 h-10 flex items-center justify-center text-primary-600 hover:bg-white rounded-lg transition-colors shadow-sm"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addToCart(p)}
                      className="w-full py-3 px-4 bg-gray-50 hover:bg-primary-50 text-gray-700 hover:text-primary-700 font-semibold rounded-xl transition-colors border border-gray-200 hover:border-primary-200 flex items-center justify-center space-x-2"
                    >
                      <ShoppingCart size={18} />
                      <span>Add to Cart</span>
                    </button>
                  )}
                </div>
              );
            })}

            {products.length === 0 && (
              <div className="col-span-full py-12 text-center text-gray-500">
                <Package className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                <p>Loading products...</p>
              </div>
            )}
          </div>
        </div>

        {/* Cart Sidebar */}
        <div className="lg:w-96 shrink-0">
          <div className="sticky top-24 glass rounded-3xl p-6 shadow-xl border border-white/40">
            <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-gray-100">
              <div className="p-2 bg-primary-100 text-primary-600 rounded-xl">
                <ShoppingCart size={24} />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Your Cart</h2>
              <span className="ml-auto bg-primary-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                {cart.reduce((acc, item) => acc + item.quantity, 0)}
              </span>
            </div>

            {cart.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="mx-auto h-12 w-12 text-gray-200 mb-3" />
                <p className="text-gray-500 font-medium">Your cart is empty</p>
                <p className="text-sm text-gray-400 mt-1">Add items to get started</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                {cart.map(item => (
                  <div key={item.product} className="flex justify-between items-center py-2 group">
                    <div className="flex-1 min-w-0 pr-4">
                      <p className="font-semibold text-gray-900 truncate">{item.name}</p>
                      <p className="text-sm text-gray-500">₹{item.price} × {item.quantity}</p>
                    </div>
                    <p className="font-bold text-gray-900 shrink-0">₹{item.price * item.quantity}</p>
                  </div>
                ))}
              </div>
            )}

            {cart.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-gray-600 font-medium">Total Amount</span>
                  <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">₹{cartTotal}</span>
                </div>

                <button
                  onClick={placeOrder}
                  disabled={isOrdering}
                  className="w-full py-4 px-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-xl shadow-[0_8px_16px_rgba(249,115,22,0.25)] hover:shadow-[0_12px_20px_rgba(249,115,22,0.3)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex justify-center items-center"
                >
                  {isOrdering ? 'Processing...' : 'Place COD Order'}
                </button>
                <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center">
                  <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                  Cash on delivery available
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerStore;