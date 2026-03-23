import axios from 'axios'


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


export const createAuthSlice = (set, get) => {
    const setSlice = (partial) => set(state => ({
        auth: { ...state.auth, ...partial }
    }));
    return {
        isLoading: false,
        pageView: PAGE_VIEWS.login,
        user: null,
        confirmationCodeForm: INITIAL_CONFIRMATION,
        loginForm: INITIAL_LOGIN,
        error: null,

        setLoading: (isLoading = null) => {
            setSlice({ isLoading });
        },

        setError: (error = null) => {
            setSlice({ error });
        },

        setPageView: (payload) => {
            setSlice({ pageView: payload });
        },

        setConfirmationCode: (payload) => {
            const { confirmationCodeForm } = get().auth;
            setSlice({ confirmationCodeForm: { ...confirmationCodeForm, code: payload }});
        },

        setUser: (user) => {
            setSlice({ user });
        },

        setLoginForm: ({ name, value }) => {
            const { loginForm } = get().auth;
            setSlice({ loginForm: { ...loginForm, [name]: value } });
        },

        clearLoginForm: () => setSlice({ loginForm: INITIAL_LOGIN }),

        logout: async () => {
            sessionStorage.clear();
            setSlice({ user: null });
        },

        isAuthenticated: () => {
            return !!sessionStorage.getItem('accessToken');
        }
    }
};