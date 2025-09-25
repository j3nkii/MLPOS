// store/types.js
export const MODAL_TYPES = {
    CONFIRM_DELETE: 'confirmDelete',
    ADD_CUSTOMER: 'addCustomer',
    EDIT_CUSTOMER: 'editCustomer',
};

// store/slices/authSlice.js
import axios from 'axios';

export const createAuthSlice = (set, get) => ({
  // State
  user: null,
  isLoading: false,
  error: null,
  loginForm: {
    username: '',
    password: '',
  },

  // Actions
  fetchUser: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.post('/api/user', get().loginForm);
      set({ user: res.data, isLoading: false });
    } catch (err) {
      set({ error: err.message, isLoading: false });
    }
  },

  logout: () => set({ user: null, loginForm: { username: '', password: '' } }),

  setLoginForm: (field, value) => {
    set(state => ({
      loginForm: { ...state.loginForm, [field]: value }
    }));
  },

  // Computed values
  get isAuthenticated() {
    return !!get().user;
  }
});

// store/slices/customerSlice.js
import axios from 'axios';

const initialCustomerForm = {
  name: '',
  phone: '',
  email: '',
};

export const createCustomerSlice = (set, get) => ({
  // State
  customers: [],
  isLoading: false,
  error: null,
  addNewCustomerForm: { ...initialCustomerForm },

  // Actions
  fetchCustomers: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.get('/api/customer');
      set({ customers: res.data, isLoading: false });
    } catch (err) {
      set({ error: err.message, isLoading: false });
    }
  },

  submitNewCustomer: async () => {
    const { addNewCustomerForm, user } = get();
    
    set({ isLoading: true, error: null });
    try {
      await axios.post('/api/customer', {
        ...addNewCustomerForm,
        userID: user.id
      });
      
      // Reset form and refresh data
      set({ 
        addNewCustomerForm: { ...initialCustomerForm },
        isLoading: false 
      });
      
      // Refresh customer list
      await get().fetchCustomers();
      
      // Close modal if open
      get().closeModal();
      
    } catch (err) {
      set({ error: err.message, isLoading: false });
    }
  },

  deleteCustomer: async (customerId) => {
    set({ isLoading: true, error: null });
    try {
      await axios.delete(`/api/customer/${customerId}`);
      set(state => ({
        customers: state.customers.filter(c => c.id !== customerId),
        isLoading: false
      }));
      get().closeModal();
    } catch (err) {
      set({ error: err.message, isLoading: false });
    }
  },

  setNewCustomerForm: (field, value) => {
    set(state => ({
      addNewCustomerForm: { ...state.addNewCustomerForm, [field]: value }
    }));
  },

  resetCustomerForm: () => {
    set({ addNewCustomerForm: { ...initialCustomerForm } });
  }
});

// store/slices/uiSlice.js
import { MODAL_TYPES } from '../types';

export const createUISlice = (set, get) => ({
  // State
  modal: null,
  notifications: [],

  // Actions
  setModal: (modalType, modalData = null) => {
    if (!Object.values(MODAL_TYPES).includes(modalType)) {
      console.warn(`Invalid modal type: ${modalType}`);
      return;
    }
    set({ modal: { type: modalType, data: modalData } });
  },

  closeModal: () => {
    set({ modal: null });
    // Reset any form data when closing modals
    if (get().modal?.type === MODAL_TYPES.ADD_CUSTOMER) {
      get().resetCustomerForm();
    }
  },

  addNotification: (message, type = 'info') => {
    const id = Date.now();
    set(state => ({
      notifications: [...state.notifications, { id, message, type }]
    }));
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      get().removeNotification(id);
    }, 5000);
  },

  removeNotification: (id) => {
    set(state => ({
      notifications: state.notifications.filter(n => n.id !== id)
    }));
  }
});

// store/index.js
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { createAuthSlice } from './slices/authSlice';
import { createCustomerSlice } from './slices/customerSlice';
import { createUISlice } from './slices/uiSlice';

// Main store combining all slices
export const useStore = create(
  devtools(
    (set, get, api) => ({
      ...createAuthSlice(set, get, api),
      ...createCustomerSlice(set, get, api),
      ...createUISlice(set, get, api),
    }),
    { name: 'app-store' }
  )
);

// Selective hooks for better performance
export const useAuth = () => useStore(state => ({
  user: state.user,
  isLoading: state.isLoading,
  error: state.error,
  loginForm: state.loginForm,
  isAuthenticated: state.isAuthenticated,
  fetchUser: state.fetchUser,
  logout: state.logout,
  setLoginForm: state.setLoginForm,
}));

export const useCustomers = () => useStore(state => ({
  customers: state.customers,
  isLoading: state.isLoading,
  error: state.error,
  addNewCustomerForm: state.addNewCustomerForm,
  fetchCustomers: state.fetchCustomers,
  submitNewCustomer: state.submitNewCustomer,
  deleteCustomer: state.deleteCustomer,
  setNewCustomerForm: state.setNewCustomerForm,
  resetCustomerForm: state.resetCustomerForm,
}));

export const useUI = () => useStore(state => ({
  modal: state.modal,
  notifications: state.notifications,
  setModal: state.setModal,
  closeModal: state.closeModal,
  addNotification: state.addNotification,
  removeNotification: state.removeNotification,
}));

// store/actions/customerActions.js - Complex business logic
export const customerActions = {
  async createCustomerWithValidation(customerData) {
    const { user, setModal, addNotification, submitNewCustomer } = useStore.getState();
    
    // Business logic validation
    if (!user) {
      addNotification('You must be logged in to create customers', 'error');
      return false;
    }
    
    if (!customerData.name.trim()) {
      addNotification('Customer name is required', 'error');
      return false;
    }
    
    try {
      await submitNewCustomer();
      addNotification('Customer created successfully!', 'success');
      return true;
    } catch (error) {
      addNotification('Failed to create customer', 'error');
      return false;
    }
  },

  async deleteCustomerWithConfirmation(customerId, customerName) {
    const { setModal } = useStore.getState();
    
    setModal(MODAL_TYPES.CONFIRM_DELETE, {
      title: 'Delete Customer',
      message: `Are you sure you want to delete "${customerName}"?`,
      onConfirm: async () => {
        const { deleteCustomer, addNotification } = useStore.getState();
        try {
          await deleteCustomer(customerId);
          addNotification('Customer deleted successfully', 'success');
        } catch (error) {
          addNotification('Failed to delete customer', 'error');
        }
      }
    });
  }
};