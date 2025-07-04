'use client';
import { useState } from 'react';
import { FiMail, FiPhone, FiMessageSquare } from 'react-icons/fi';

const orders = [
  {
    id: '#390561',
    customer: 'James Miller',
    status: 'Paid',
    total: '$1,620.00',
    date: 'Jan 8',
    avatar: '/avatar.jpg',
    items: [
      { name: 'Ryobi ONE drill/driver', price: '$409.00' },
      { name: 'Socket Systeme Electric', price: '$238.00' },
      { name: 'DVB-T2 receiver bbk', price: '$139.00' },
      { name: 'Inforce oil-free compressor', price: '$135.00' },
      { name: 'TIG-200 welding inverter', price: '$699.00' },
    ],
  },
];

export default function AdminPanel() {
  const [selectedOrder, setSelectedOrder] = useState(orders[0]);
  const [isClicked, setIsClicked] = useState(false);
  const [activeTab, setActiveTab] = useState('Orders'); // 👈 active tab state

  const tabs = [
    'Dashboard',
    'Orders',
    'Payments',
    'Customers',
    'Reports',
    'Statistic',
    'Notification',
    'Help',
    'Settings',
  ];

  return (
    <div className="w-screen h-screen bg-[#d6c6aa] flex items-center justify-center">
      <div className="w-full h-full p-4 box-border">
        <div
          onClick={() => setIsClicked(true)}
          className={`w-full h-full rounded-[32px] p-4 box-border flex overflow-hidden transition-colors duration-300 cursor-pointer ${
            isClicked ? 'bg-white' : 'bg-[#0f1114]'
          }`}
        >
          <div className="w-full h-full bg-white rounded-2xl shadow-xl flex overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-[#0f1114] text-white p-6 space-y-4 rounded-l-2xl">
              <h1 className="text-xl font-bold">ProfitPulse</h1>
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <div
                    key={tab}
                    onClick={(e) => {
                      e.stopPropagation(); // stop background click
                      setActiveTab(tab); // update active tab
                    }}
                    className={`py-2 px-4 rounded-lg cursor-pointer transition-colors duration-200 ${
                      activeTab === tab
                        ? 'bg-white text-black'
                        : 'hover:bg-gray-800'
                    }`}
                  >
                    {tab}
                  </div>
                ))}
              </nav>
              <button className="text-sm text-gray-400 mt-8">Log out</button>
            </aside>

            {/* Main Content */}
            <div className="flex-1 p-6 bg-[#fdfcf9] flex flex-col overflow-hidden rounded-r-2xl">
              <div className="flex justify-between mb-4 shrink-0">
                <h2 className="text-2xl font-semibold">Orders</h2>
                <div className="flex items-center gap-2">
                  <span>Kristina Evans</span>
                  <img
                    src="/avatar.jpg"
                    alt="Kristina"
                    className="w-8 h-8 rounded-full"
                  />
                </div>
              </div>

              <div className="flex gap-4 flex-1 overflow-hidden">
                {/* Order List */}
                <div className="w-2/3 space-y-4 overflow-y-auto pr-2">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className={`p-4 border rounded-lg flex justify-between items-center cursor-pointer ${
                        selectedOrder.id === order.id
                          ? 'bg-gray-100'
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation(); // prevent background toggle
                        setSelectedOrder(order);
                      }}
                    >
                      <div>
                        <p className="font-semibold">{order.id}</p>
                        <p className="text-sm text-gray-500">
                          {order.customer}
                        </p>
                      </div>
                      <div>
                        <span
                          className={`px-2 py-1 rounded-full text-sm ${
                            order.status === 'Paid'
                              ? 'bg-yellow-100 text-yellow-700'
                              : order.status === 'Delivered'
                              ? 'bg-orange-100 text-orange-700'
                              : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <div className="text-right">
                        <p>{order.total}</p>
                        <p className="text-sm text-gray-500">{order.date}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Details */}
                <div className="w-1/3 bg-[#f9f9f9] p-4 rounded-lg shadow h-full overflow-y-auto">
                  <h3 className="font-bold mb-2">
                    Order {selectedOrder.id}
                  </h3>
                  <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded">
                    {selectedOrder.status}
                  </span>

                  <div className="mt-4 flex items-center gap-2">
                    <img
                      src={selectedOrder.avatar}
                      alt={selectedOrder.customer}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="font-semibold">{selectedOrder.customer}</p>
                      <div className="flex gap-2 mt-1 text-gray-600">
                        <FiMail className="cursor-pointer" />
                        <FiPhone className="cursor-pointer" />
                        <FiMessageSquare className="cursor-pointer" />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="font-semibold">Order items</h4>
                    <ul className="mt-2 space-y-1">
                      {selectedOrder.items.map((item, index) => (
                        <li
                          key={index}
                          className="flex justify-between text-sm"
                        >
                          <span>{item.name}</span>
                          <span>{item.price}</span>
                        </li>
                      ))}
                    </ul>
                    <hr className="my-3" />
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>{selectedOrder.total}</span>
                    </div>
                    <div className="flex justify-between mt-4 gap-2">
                      <button className="w-1/2 bg-black text-white py-2 rounded-lg">
                        Track
                      </button>
                      <button className="w-1/2 bg-yellow-200 text-yellow-800 py-2 rounded-lg">
                        Refund
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
