
import { useState, useEffect } from 'react';
import { getOrders, updateOrderStatus } from '@/lib/data';
import { Order } from '@/lib/types';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { UserCheck, Truck, Package, CheckCheck, AlertTriangle } from 'lucide-react';

const Admin = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { toast } = useToast();
  
  useEffect(() => {
    // Load orders from localStorage when component mounts
    const fetchedOrders = getOrders();
    setOrders(fetchedOrders);
    setFilteredOrders(fetchedOrders);
  }, []);

  useEffect(() => {
    // Filter orders based on search term and status filter
    let result = orders;
    
    if (searchTerm) {
      result = result.filter(order => 
        order.customerInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerInfo.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      result = result.filter(order => order.status === statusFilter);
    }
    
    setFilteredOrders(result);
  }, [searchTerm, statusFilter, orders]);

  const handleStatusUpdate = (orderId: string, newStatus: Order['status']) => {
    updateOrderStatus(orderId, newStatus);
    
    // Update local state to reflect the change
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        return { ...order, status: newStatus };
      }
      return order;
    });
    
    setOrders(updatedOrders);
    
    toast({
      title: "Statut mis à jour",
      description: `La commande ${orderId.slice(0, 8)}... est maintenant "${getStatusLabel(newStatus)}".`
    });
  };

  const getStatusLabel = (status: Order['status']): string => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'processing': return 'En traitement';
      case 'shipped': return 'Expédié';
      case 'delivered': return 'Livré';
      case 'cancelled': return 'Annulé';
      default: return status;
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending': return <AlertTriangle size={16} className="text-amber-500" />;
      case 'processing': return <Package size={16} className="text-blue-500" />;
      case 'shipped': return <Truck size={16} className="text-purple-500" />;
      case 'delivered': return <CheckCheck size={16} className="text-green-500" />;
      case 'cancelled': return <AlertTriangle size={16} className="text-red-500" />;
      default: return null;
    }
  };

  const getStatusBadgeClass = (status: Order['status']): string => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('fr-FR', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (e) {
      return 'Date invalide';
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold mb-2">Administration</h1>
            <p className="text-muted-foreground">Gestion des commandes et des produits</p>
          </div>
          
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="w-full md:w-1/3">
              <Input 
                type="text" 
                placeholder="Rechercher une commande..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <Button 
                variant={statusFilter === 'all' ? 'default' : 'outline'} 
                onClick={() => setStatusFilter('all')}
                size="sm"
              >
                Tous
              </Button>
              <Button 
                variant={statusFilter === 'pending' ? 'default' : 'outline'} 
                onClick={() => setStatusFilter('pending')}
                size="sm"
              >
                En attente
              </Button>
              <Button 
                variant={statusFilter === 'processing' ? 'default' : 'outline'} 
                onClick={() => setStatusFilter('processing')}
                size="sm"
              >
                En traitement
              </Button>
              <Button 
                variant={statusFilter === 'shipped' ? 'default' : 'outline'} 
                onClick={() => setStatusFilter('shipped')}
                size="sm"
              >
                Expédié
              </Button>
            </div>
          </div>
          
          {/* Orders Table */}
          <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
            {filteredOrders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="py-3 px-4 text-left font-medium text-muted-foreground">Commande</th>
                      <th className="py-3 px-4 text-left font-medium text-muted-foreground">Client</th>
                      <th className="py-3 px-4 text-left font-medium text-muted-foreground">Date</th>
                      <th className="py-3 px-4 text-left font-medium text-muted-foreground">Montant</th>
                      <th className="py-3 px-4 text-left font-medium text-muted-foreground">Statut</th>
                      <th className="py-3 px-4 text-right font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-muted/20 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-medium">#{order.id.slice(0, 8)}</div>
                          <div className="text-xs text-muted-foreground">{order.items.length} article(s)</div>
                        </td>
                        <td className="py-3 px-4">
                          <div>{order.customerInfo.name}</div>
                          <div className="text-xs text-muted-foreground">{order.customerInfo.email}</div>
                        </td>
                        <td className="py-3 px-4">
                          {formatDate(order.date)}
                        </td>
                        <td className="py-3 px-4 font-medium">
                          {order.total.toLocaleString()} FCFA
                        </td>
                        <td className="py-3 px-4">
                          <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeClass(order.status)}`}>
                            {getStatusIcon(order.status)}
                            <span className="ml-1">{getStatusLabel(order.status)}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="inline-flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleStatusUpdate(order.id, 'processing')}
                              disabled={order.status === 'processing' || order.status === 'delivered' || order.status === 'cancelled'}
                            >
                              <Package size={14} />
                              <span className="sr-only md:not-sr-only md:ml-2 md:inline-block">Traitement</span>
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleStatusUpdate(order.id, 'shipped')}
                              disabled={order.status === 'shipped' || order.status === 'delivered' || order.status === 'cancelled'}
                            >
                              <Truck size={14} />
                              <span className="sr-only md:not-sr-only md:ml-2 md:inline-block">Expédié</span>
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleStatusUpdate(order.id, 'delivered')}
                              disabled={order.status === 'delivered' || order.status === 'cancelled'}
                            >
                              <UserCheck size={14} />
                              <span className="sr-only md:not-sr-only md:ml-2 md:inline-block">Livré</span>
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => handleStatusUpdate(order.id, 'cancelled')}
                              disabled={order.status === 'cancelled' || order.status === 'delivered'}
                            >
                              <AlertTriangle size={14} />
                              <span className="sr-only md:not-sr-only md:ml-2 md:inline-block">Annuler</span>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">Aucune commande trouvée</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Admin;
