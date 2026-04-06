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
    clearLoginForm: () => set(INITIAL_LOGIN),
    clearConfirmationCodeForm: () => set(INITIAL_CONFIRMATION),

    setConfirmationCode: (payload) => {
        const { confirmationCodeForm } = get();
        setSlice({ confirmationCodeForm: { ...confirmationCodeForm, code: payload }});
    },

    setLoginForm: ({ name, value }) => {
        const { loginForm } = get();
        setSlice({ ...loginForm, [name]: value });
    },

    setPageView: (payload) => {
        setSlice({ pageView: payload });
    },
}));