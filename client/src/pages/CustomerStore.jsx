import { useEffect, useState } from 'react';
import api from '../services/api';

const CustomerStore = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]); 
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await api.get('/products/all');
      setProducts(res.data);
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

  const placeOrder = async () => {
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
      setMessage(err.response?.data?.msg || "Order failed");
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>QuickSuper Store</h1>
      {message && <p style={{ color: 'green', fontWeight: 'bold' }}>{message}</p>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        {products.filter(p=>p.isActive).map(p => (
          <div key={p._id} style={{ border: '1px solid #ddd', padding: '10px' }}>
            <h4>{p.name}</h4>
            <p>₹{p.price}</p>
            <button onClick={() => addToCart(p)}>Add to Cart</button>
          </div>
        ))}
      </div>

      <hr />
      <h3>Your Cart</h3>
      {cart.map(item => (
        <p key={item.product}>{item.name} x {item.quantity}</p>
      ))}
      {cart.length > 0 && (
        <button onClick={placeOrder} style={{ backgroundColor: 'orange', padding: '10px' }}>
          Place COD Order
        </button>
      )}
    </div>
  );
};

export default CustomerStore;