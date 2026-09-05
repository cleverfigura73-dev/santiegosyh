import React, { useState, useEffect } from 'react';
import { store } from './lib/store';
import { 
  UserProfile, 
  ServiceItem, 
  DiamondPackage, 
  OrderItem, 
  FeedbackItem, 
  NotificationItem, 
  PaymentDetails 
} from './types';
import { LoginScreen } from './components/LoginScreen';
import { ServicesScreen } from './components/ServicesScreen';

export default function App() {
  // Authentication & User state (persisted via localStorage through store)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => store.getCurrentUser());
  
  // Central Store States
  const [services, setServices] = useState<ServiceItem[]>(() => store.getServices());
  const [diamondPackages, setDiamondPackages] = useState<DiamondPackage[]>(() => store.getDiamondPackages());
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>(() => store.getFeedbacks());
  const [orders, setOrders] = useState<OrderItem[]>(() => store.getOrders());
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => store.getNotifications());
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>(() => store.getPaymentDetails());

  const refreshData = () => {
    setCurrentUser(store.getCurrentUser());
    setServices(store.getServices());
    setDiamondPackages(store.getDiamondPackages());
    setFeedbacks(store.getFeedbacks());
    setOrders(store.getOrders());
    setNotifications(store.getNotifications());
    setPaymentDetails(store.getPaymentDetails());
  };

  useEffect(() => {
    const unsubscribe = store.subscribeToStore(() => {
      refreshData();
    });
    return () => unsubscribe();
  }, []);

  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    refreshData();
  };

  const handleLogout = async () => {
    await store.logout();
    setCurrentUser(null);
    refreshData();
  };

  // HARD SEPARATION (TELA 1 VS TELA 2):
  // When unauthenticated, the DOM exclusively contains <LoginScreen />.
  // No services, cards, products, or footer exist in the DOM or on scroll.
  if (!currentUser) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  // When authenticated, render the dedicated Services Screen.
  return (
    <ServicesScreen
      currentUser={currentUser}
      onLogout={handleLogout}
      services={services}
      diamondPackages={diamondPackages}
      feedbacks={feedbacks}
      orders={orders}
      notifications={notifications}
      paymentDetails={paymentDetails}
      onRefreshStore={refreshData}
    />
  );
}
