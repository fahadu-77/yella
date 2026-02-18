import { useEffect, useState } from 'react';
import api from '../services/api';

const DeliveryTask = () => {
  const [task, setTask] = useState(null);
  const [isOnline, setIsOnline] = useState(false);
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');

  
  useEffect(() => {
    const init = async () => {
      try {
        const res = await api.get('/users/me');
        setIsOnline(res.data.isOnline);
      } catch (err) {
        console.error(err);
      }
    };
    init();
  }, []);

  const fetchTask = async () => {
    try {
      const res = await api.get('/orders/my-task');
      setTask(res.data._id ? res.data : null);
    } catch (err) {
      console.log("No active tasks");
    }
  };

  useEffect(() => {
    fetchTask();
  }, []);

  const handleToggleDuty = async () => {
    const res = await api.put('/users/toggle-duty');
    setIsOnline(res.data.isOnline);
    if (res.data.isOnline) fetchTask();
  };

  const handleComplete = async () => {
    try {
      await api.post('/orders/verify-delivery', {
        orderId: task._id,
        otp: otp
      });
      setMessage("Delivery Verified! You are now available for new orders.");
      setTask(null);
      setOtp('');
    } catch (err) {
      alert("Invalid OTP! Try again.");
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: 'auto' }}>
      <h1>Delivery Partner</h1>
      
      <button 
        onClick={handleToggleDuty} 
        style={{ backgroundColor: isOnline ? 'red' : 'green', color: 'white', padding: '10px', width: '100%' }}
      >
        {isOnline ? 'Go Offline' : 'Go Online'}
      </button>

      {message && <p style={{ color: 'blue', marginTop: '10px' }}>{message}</p>}

      <hr style={{ margin: '20px 0' }} />

      {!isOnline ? (
        <p>You are currently offline. Go online to receive orders.</p>
      ) : !task ? (
        <p>Waiting for new orders... 🚚</p>
      ) : (
        <div style={{ border: '2px solid orange', padding: '15px', borderRadius: '8px' }}>
          <h3>New Task Assigned!</h3>
          <p><strong>Customer:</strong> {task.customer.name}</p>
          <p><strong>Address:</strong> {task.address}</p>
          <p><strong>Amount to Collect:</strong> ₹{task.totalAmount}</p>
          
          <input 
            placeholder="Enter Customer OTP" 
            value={otp} 
            onChange={(e) => setOtp(e.target.value)}
            style={{ padding: '10px', width: '80%', marginBottom: '10px' }}
          />
          <button onClick={handleComplete} style={{ padding: '10px', backgroundColor: 'black', color: 'white' }}>
            Verify & Complete
          </button>
        </div>
      )}
    </div>
  );
};

export default DeliveryTask;
