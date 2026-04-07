import { create } from 'zustand';



const INITIAL_LOGIN = {
    email: '',
    password: '',
}

const INITIAL_CONFIRMATION = {
    email: '',
    code: '',
}

const PAGE_VIEWS = {
    login: 'login',
    confirmation: 'confirm',
    signup: 'signup',
    forgot: 'forgot',
}



export const useAuthZussy = create((set, get) => ({
    confirmationCodeForm: INITIAL_CONFIRMATION,
    loginForm: INITIAL_LOGIN,
    pageView: PAGE_VIEWS.login,
    user: null,
    clearLoginForm: () => set(INITIAL_LOGIN),
    clearConfirmationCodeForm: () => set(INITIAL_CONFIRMATION),

    setConfirmationCode: (payload) => {
        const { confirmationCodeForm } = get();
        set({ confirmationCodeForm: { ...confirmationCodeForm, code: payload }});
    },

    setLoginForm: ({ name, value }) => {
        const { loginForm } = get();
        set({ loginForm: { ...loginForm, [name]: value } });
    },

    setPageView: (payload) => set({ pageView: payload }),

    setUser: (user) => set({ user }),



}));
