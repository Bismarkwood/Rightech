import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Icon } from '@iconify/react';
import { useConsignment } from '../../context/ConsignmentContext';
import { useRetailer } from '../retailer/RetailerContext';
import { MOCK_AGENTS } from '../../data/agentData';
import { toast } from 'sonner';
import { ConsignmentItem, ConsignmentProduct } from '../../data/consignmentData';

export function NewConsignmentModal() {
  const { isNewConsignmentModalOpen, setNewConsignmentModalOpen, addInboundConsignment, addOutboundConsignment } = useConsignment();
  const { suppliers } = useRetailer();
  
  const MOCK_DEALERS = [
    { id: 'DLR-101', name: 'Metro Electronics' },
    { id: 'DLR-102', name: 'Westside Tech' },
  ];

  const [type, setType] = useState<'Inbound' | 'Outbound'>('Inbound');
  const [consignmentName, setConsignmentName] = useState('');
  const [partnerId, setPartnerId] = useState('');
  const [items, setItems] = useState<ConsignmentProduct[]>([]);
  
  // Current Item Form
  const [currentProductName, setCurrentProductName] = useState('');
  const [currentSku, setCurrentSku] = useState('');
  const [currentQty, setCurrentQty] = useState(1);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [currentImage, setCurrentImage] = useState('');

  // Logistics
  const [deliveryMethod, setDeliveryMethod] = useState<'Pickup' | 'Delivery'>('Pickup');
  const [agentId, setAgentId] = useState('');
  const [location, setLocation] = useState('');
  const [locationSuggestions, setLocationSuggestions] = useState<any[]>([]);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);

  useEffect(() => {
    if (location.length > 2 && !isSearchingLocation) {
      const delayDebounce = setTimeout(() => {
        searchLocation(location);
      }, 500);
      return () => clearTimeout(delayDebounce);
    }
  }, [location]);

  const searchLocation = async (query: string) => {
    setIsSearchingLocation(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=Accra+${query}&addressdetails=1&limit=5`);
      const data = await res.json();
      setLocationSuggestions(data);
    } catch (error) {
      console.error('Error fetching location:', error);
    } finally {
      setIsSearchingLocation(false);
    }
  };

  if (!isNewConsignmentModalOpen) return null;

  const addItem = () => {
    if (!currentProductName || !currentSku || currentQty <= 0) {
      toast.error('Please fill in all product details correctly');
      return;
    }
    const newItem: ConsignmentProduct = {
      id: Math.random().toString(36).substr(2, 9),
      productName: currentProductName,
      sku: currentSku,
      suppliedQty: currentQty,
      soldQty: 0,
      returnedQty: 0,
      unitPrice: currentPrice,
      image: currentImage || `https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100&h=100&fit=crop`
    };
    setItems([...items, newItem]);
    setCurrentProductName('');
    setCurrentSku('');
    setCurrentQty(1);
    setCurrentPrice(0);
    setCurrentImage('');
    toast.success('Product added to list');
  };

  const removeItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  const calculateTotal = () => items.reduce((acc, item) => acc + (item.suppliedQty * item.unitPrice), 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consignmentName) {
      toast.error('Please enter a consignment name');
      return;
    }
    if (!partnerId) {
      toast.error('Please select a partner');
      return;
    }
    if (items.length === 0) {
      toast.error('Please add at least one product');
      return;
    }
    if (deliveryMethod === 'Delivery' && !agentId) {
      toast.error('Please assign a delivery agent');
      return;
    }

    const partner = type === 'Inbound' 
      ? suppliers.find(s => s.id === partnerId) 
      : MOCK_DEALERS.find(d => d.id === partnerId);

    const newConsignment: ConsignmentItem = {
      id: `${type === 'Inbound' ? 'SCON' : 'DCON'}-${Math.floor(Math.random() * 1000)}`,
      name: consignmentName,
      partnerId,
      partnerName: partner?.name || 'Unknown',
      date: new Date().toISOString().split('T')[0],
      status: deliveryMethod === 'Delivery' ? 'In Transit' : 'On Shelf',
      type,
      location,
      agentId: deliveryMethod === 'Delivery' ? agentId : undefined,
      items: items,
      totalValue: calculateTotal()
    };

    if (type === 'Inbound') addInboundConsignment(newConsignment);
    else addOutboundConsignment(newConsignment);

    toast.success('Consignment created successfully');
    setNewConsignmentModalOpen(false);
    setItems([]);
    setConsignmentName('');
    setPartnerId('');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setNewConsignmentModalOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-xl"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
          className="relative w-full max-w-[900px] bg-white border border-white/50 rounded-[32px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="px-10 py-8 border-b border-black/5 flex items-center justify-between bg-white/60 sticky top-0 z-10 backdrop-blur-md">
            <div>
              <h2 className="text-[26px] font-black text-[#111111] tracking-tight">Initialize Movement</h2>
              <p className="text-[14px] text-[#525866] font-medium mt-1">Scale your stock operations with multi-item consignments</p>
            </div>
            <button
              onClick={() => setNewConsignmentModalOpen(false)}
              className="w-12 h-12 rounded-full hover:bg-black/5 flex items-center justify-center transition-all text-[#525866] border border-black/5"
            >
              <Icon icon="solar:close-square-bold" className="text-[28px]" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
            {/* Batch Config Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-4">
                <label className="text-[12px] font-black text-[#111111] uppercase tracking-[0.1em] ml-1">Consignment Name</label>
                <input
                  type="text"
                  value={consignmentName}
                  onChange={(e) => setConsignmentName(e.target.value)}
                  placeholder="e.g. Batch A - October"
                  className="w-full h-14 px-5 bg-[#F9FAFB] border border-[#ECEDEF] rounded-[18px] text-[15px] font-bold focus:outline-none focus:border-[#D40073] transition-all"
                />
              </div>

              <div className="space-y-4">
                <label className="text-[12px] font-black text-[#111111] uppercase tracking-[0.1em] ml-1">Flow Direction</label>
                <div className="flex bg-[#F3F4F6] p-1.5 rounded-[18px]">
                  <button
                    type="button"
                    onClick={() => setType('Inbound')}
                    className={`flex-1 h-11 rounded-[14px] text-[13px] font-bold transition-all flex items-center justify-center gap-2 ${
                      type === 'Inbound' ? 'bg-white text-[#D40073] shadow-md border border-[#D40073]/10' : 'text-[#8B93A7] hover:text-[#111111]'
                    }`}
                  >
                    <Icon icon="solar:import-bold" className="text-[18px]" />
                    Inbound
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('Outbound')}
                    className={`flex-1 h-11 rounded-[14px] text-[13px] font-bold transition-all flex items-center justify-center gap-2 ${
                      type === 'Outbound' ? 'bg-white text-[#D40073] shadow-md border border-[#D40073]/10' : 'text-[#8B93A7] hover:text-[#111111]'
                    }`}
                  >
                    <Icon icon="solar:export-bold" className="text-[18px]" />
                    Outbound
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[12px] font-black text-[#111111] uppercase tracking-[0.1em] ml-1">
                  {type === 'Inbound' ? 'Supplier Source' : 'Delivery Dealer'}
                </label>
                <div className="relative group">
                  <Icon icon={type === 'Inbound' ? 'solar:shop-2-bold' : 'solar:users-group-two-rounded-bold'} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D40073] text-[20px]" />
                  <select
                    value={partnerId}
                    onChange={(e) => setPartnerId(e.target.value)}
                    className="w-full h-14 pl-12 pr-10 bg-[#F9FAFB] border border-[#ECEDEF] rounded-[18px] text-[15px] font-bold focus:outline-none focus:border-[#D40073] transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Select Partner</option>
                    {type === 'Inbound' 
                      ? suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)
                      : MOCK_DEALERS.map(d => <option key={d.id} value={d.id}>{d.name}</option>)
                    }
                  </select>
                  <Icon icon="solar:alt-arrow-down-bold" className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8B93A7] pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Product Intake Section */}
            <div className="space-y-6 pt-6 border-t border-black/5">
              <div className="flex items-center justify-between">
                <h3 className="text-[18px] font-black text-[#111111]">Items Inventory</h3>
                <span className="text-[11px] font-bold text-[#D40073] bg-[#D40073]/5 px-3 py-1 rounded-full uppercase tracking-wider">{items.length} Products Added</span>
              </div>

              <div className="bg-[#F9FAFB] p-6 rounded-[24px] border border-[#ECEDEF] space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="col-span-2 space-y-2">
                    <label className="text-[11px] font-bold text-[#8B93A7] uppercase tracking-wider ml-1">Product Description</label>
                    <input
                      type="text"
                      value={currentProductName}
                      onChange={(e) => setCurrentProductName(e.target.value)}
                      placeholder="e.g. Samsung Galaxy A54 5G"
                      className="w-full h-12 px-4 bg-white border border-[#ECEDEF] rounded-[14px] text-[14px] font-medium focus:border-[#D40073] outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-[#8B93A7] uppercase tracking-wider ml-1">SKU / Model</label>
                    <input
                      type="text"
                      value={currentSku}
                      onChange={(e) => setCurrentSku(e.target.value)}
                      placeholder="SMA546-BL"
                      className="w-full h-12 px-4 bg-white border border-[#ECEDEF] rounded-[14px] text-[14px] font-medium focus:border-[#D40073] outline-none transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-[#8B93A7] uppercase tracking-wider ml-1">Qty</label>
                      <input
                        type="number"
                        value={currentQty}
                        onChange={(e) => setCurrentQty(Number(e.target.value))}
                        className="w-full h-12 px-4 bg-white border border-[#ECEDEF] rounded-[14px] text-[14px] font-black focus:border-[#D40073] outline-none transition-all text-center"
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={addItem}
                        className="w-full h-12 bg-[#111111] hover:bg-[#333333] text-white rounded-[14px] flex items-center justify-center transition-all shadow-lg"
                      >
                        <Icon icon="solar:add-circle-bold" className="text-[22px]" />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-[#8B93A7] uppercase tracking-wider ml-1">Unit Price (GHS)</label>
                    <input
                      type="number"
                      value={currentPrice}
                      onChange={(e) => setCurrentPrice(Number(e.target.value))}
                      placeholder="Enter cost per unit"
                      className="w-full h-12 px-4 bg-white border border-[#ECEDEF] rounded-[14px] text-[14px] font-black focus:border-[#D40073] outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-[#8B93A7] uppercase tracking-wider ml-1">Image URL (Optional)</label>
                    <div className="relative">
                      <Icon icon="solar:gallery-bold" className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B93A7]" />
                      <input
                        type="text"
                        value={currentImage}
                        onChange={(e) => setCurrentImage(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full h-12 pl-10 pr-4 bg-white border border-[#ECEDEF] rounded-[14px] text-[14px] font-medium focus:border-[#D40073] outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Added Items List */}
              <AnimatePresence>
                {items.length > 0 && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-white border border-[#ECEDEF] rounded-[20px] hover:border-[#D40073] transition-all group">
                        <div className="flex items-center gap-4">
                          <img 
                            src={item.image} 
                            alt={item.productName} 
                            className="w-12 h-12 rounded-[12px] object-cover bg-[#F3F4F6]"
                          />
                          <div>
                            <p className="text-[14px] font-bold text-[#111111]">{item.productName}</p>
                            <p className="text-[11px] font-medium text-[#8B93A7] uppercase">{item.sku} • Qty: {item.suppliedQty}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <p className="text-[15px] font-black text-[#111111]">GHS {(item.suppliedQty * item.unitPrice).toLocaleString()}</p>
                          <button 
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="p-2 text-[#DC2626] opacity-0 group-hover:opacity-100 transition-all hover:bg-[#FEF2F2] rounded-full"
                          >
                            <Icon icon="solar:trash-bin-trash-bold" className="text-[18px]" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Logistics & Location */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 pt-6 border-t border-black/5">
              <div className="space-y-6">
                <h3 className="text-[18px] font-black text-[#111111]">Logistics Strategy</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('Pickup')}
                    className={`h-24 rounded-[24px] border-2 transition-all flex flex-col items-center justify-center gap-2 ${
                      deliveryMethod === 'Pickup' ? 'border-[#D40073] bg-[#D40073]/5 text-[#D40073]' : 'border-[#ECEDEF] bg-white text-[#525866] grayscale hover:grayscale-0'
                    }`}
                  >
                    <Icon icon="solar:box-bold" className="text-[28px]" />
                    <span className="text-[12px] font-black uppercase tracking-wider">Self Collection</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('Delivery')}
                    className={`h-24 rounded-[24px] border-2 transition-all flex flex-col items-center justify-center gap-2 ${
                      deliveryMethod === 'Delivery' ? 'border-[#D40073] bg-[#D40073]/5 text-[#D40073]' : 'border-[#ECEDEF] bg-white text-[#525866] grayscale hover:grayscale-0'
                    }`}
                  >
                    <Icon icon="solar:delivery-bold" className="text-[28px]" />
                    <span className="text-[12px] font-black uppercase tracking-wider">Transit Delivery</span>
                  </button>
                </div>

                {deliveryMethod === 'Delivery' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                    <label className="text-[12px] font-black text-[#111111] uppercase tracking-[0.1em] ml-1">Destination Address (Accra)</label>
                    <div className="relative">
                      <Icon icon="solar:map-point-bold" className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D40073] text-[22px]" />
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Enter neighborhood or GPS address..."
                        className="w-full h-14 pl-12 pr-10 bg-[#F9FAFB] border border-[#ECEDEF] rounded-[18px] text-[15px] font-bold focus:outline-none focus:border-[#D40073] transition-all"
                      />
                      {isSearchingLocation && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                          <Icon icon="solar:spinner-bold" className="animate-spin text-[#8B93A7]" />
                        </div>
                      )}
                      
                      <AnimatePresence>
                        {locationSuggestions.length > 0 && location.length > 2 && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                            className="absolute bottom-full mb-2 left-0 right-0 bg-white border border-[#ECEDEF] rounded-[20px] shadow-2xl overflow-hidden z-20"
                          >
                            {locationSuggestions.map((s, idx) => (
                              <button
                                key={idx} type="button"
                                onClick={() => { setLocation(s.display_name); setLocationSuggestions([]); }}
                                className="w-full h-12 px-4 text-left text-[13px] font-medium hover:bg-[#F3F4F6] flex items-center gap-3 border-b border-black/5 last:border-0"
                              >
                                <Icon icon="solar:map-point-linear" className="text-[#8B93A7]" />
                                <span className="truncate">{s.display_name}</span>
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}
              </div>

              <div className="space-y-6">
                <h3 className="text-[18px] font-black text-[#111111]">Agent Assignment</h3>
                {deliveryMethod === 'Delivery' ? (
                  <div className="bg-[#F9FAFB] p-6 rounded-[24px] border border-[#ECEDEF] max-h-[220px] overflow-y-auto no-scrollbar space-y-3">
                    {MOCK_AGENTS.filter(a => a.status === 'active').map(agent => (
                      <button
                        key={agent.id}
                        type="button"
                        onClick={() => setAgentId(agent.id)}
                        className={`w-full flex items-center justify-between p-4 rounded-[18px] border-2 transition-all ${
                          agentId === agent.id ? 'border-[#111111] bg-[#111111] text-white shadow-lg' : 'border-transparent bg-white hover:border-[#D40073]/20'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-[14px] ${agentId === agent.id ? 'bg-white/20' : 'bg-[#D40073]/10 text-[#D40073]'}`}>
                            {agent.name.charAt(0)}
                          </div>
                          <div className="text-left">
                            <p className="text-[14px] font-black">{agent.name}</p>
                            <p className={`text-[11px] font-bold ${agentId === agent.id ? 'text-white/60' : 'text-[#8B93A7]'}`}>{agent.vehicleType}</p>
                          </div>
                        </div>
                        <Icon icon="solar:check-circle-bold" className={`text-[20px] ${agentId === agent.id ? 'text-white' : 'opacity-0'}`} />
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="h-40 border-2 border-dashed border-[#ECEDEF] rounded-[24px] flex flex-col items-center justify-center text-[#8B93A7] gap-2 px-10 text-center">
                    <Icon icon="solar:delivery-linear" className="text-[32px] opacity-20" />
                    <p className="text-[13px] font-medium">Agent assignment is only available for Transit Delivery</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="px-10 py-8 border-t border-black/5 bg-white/60 backdrop-blur-md flex items-center justify-between sticky bottom-0 z-10">
            <div className="hidden sm:block">
              <p className="text-[12px] font-black text-[#8B93A7] uppercase tracking-wider">Total Inventory Value</p>
              <p className="text-[28px] font-black text-[#111111] tracking-tighter">GHS {calculateTotal().toLocaleString()}</p>
            </div>
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setNewConsignmentModalOpen(false)}
                className="flex-1 sm:flex-none h-14 px-8 border border-[#ECEDEF] rounded-[20px] text-[14px] font-black text-[#111111] hover:bg-black/5 transition-all"
              >
                Discard
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="flex-1 sm:flex-none h-14 px-10 bg-[#D40073] hover:bg-[#B80063] text-white font-black text-[15px] rounded-[20px] transition-all shadow-xl shadow-[#D40073]/20 flex items-center justify-center gap-3"
              >
                Record Movement
                <Icon icon="solar:round-arrow-right-bold" className="text-[22px]" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
