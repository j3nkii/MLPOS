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
        pageView: PAGE_VIEWS.login,
        user: null,
        confirmationCodeForm: INITIAL_CONFIRMATION,
        loginForm: INITIAL_LOGIN,
        error: null,

        // postConfirmation: async () => {
        //     try {
        //         const { confirmationCodeForm } = get().auth;
        //         setSlice({ isLoading: true, error: null });
        //         const res = await axios.post('/api/auth/confirm', confirmationCodeForm);
        //         setSlice({ user: res.data, isLoading: false, loginForm: INITIAL_LOGIN, confirmationCodeForm: INITIAL_CONFIRMATION });
        //         // initApplication();
        //     } catch (err) {
        //         console.error(err);
        //         setSlice({ error: err.message, isLoading: false });
        //     }
        // },

        // fetchUser: async () => {
        //     // const { initApplication } = get().general;
        //     const { loginForm } = get().auth;
        //     setSlice({ isLoading: true, error: null });
        //     try {
        //         const res = await axios.post('/api/auth/login', loginForm);
        //         sessionStorage.setItem('accessToken', res.data.tokens.accessToken);
        //         sessionStorage.setItem('refreshToken', res.data.tokens.refreshToken);
        //         sessionStorage.setItem('idToken', res.data.tokens.idToken);
        //         setSlice({ user: res.data.user, isLoading: false, loginForm: INITIAL_LOGIN });
        //         // initApplication();
        //     } catch (err) {
        //         console.error(err.response.data);
        //         if(err.response.data.customErr){
        //             if(err.response.data.metadata.needsConfirmation){
        //                 setSlice({ pageView: PAGE_VIEWS.confirmation, confirmationCodeForm: { code: '', email: err.response.data.metadata.email }});
        //             }
        //         };
        //         setSlice({ error: err.message, isLoading: false });
        //     }
        // },

        // createUser: async () => {
        //     const { loginForm: { email, password }} = get().auth;
        //     setSlice({ isLoading: true, error: null });
        //     try {
        //         const res = await axios.post('/api/auth/signup', { email, password });
        //         setSlice({ pageView: PAGE_VIEWS.confirmation, isLoading: false, loginForm: INITIAL_LOGIN, confirmationCodeForm: { email, code: '' }});
        //     } catch (err) {
        //         console.error(err);
        //         setSlice({ error: err.message, isLoading: false });
        //     }
        // },

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