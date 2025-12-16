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

        setPageView: (payload) => {
            setSlice({ pageView: payload });
        },

        setConfirmationCode: (payload) => {
            const { confirmationCodeForm } = get().auth;
            setSlice({ confirmationCodeForm: { ...confirmationCodeForm, code: payload }});
        },

        postConfirmation: async () => {
            try {
                const { confirmationCodeForm } = get().auth;
                setSlice({ isLoading: true, error: null });
                const res = await axios.post('/api/auth/confirm', confirmationCodeForm);
                setSlice({ user: res.data, isLoading: false, loginForm: INITIAL_LOGIN, confirmationCodeForm: INITIAL_CONFIRMATION });
                initApplication();
            } catch (err) {
                console.error(err);
                setSlice({ error: err.message, isLoading: false });
            }
        },

        fetchUser: async () => {
            const { initApplication } = get().general;
            const { loginForm } = get().auth;
            setSlice({ isLoading: true, error: null });
            try {
                const res = await axios.post('/api/auth/login', loginForm);
                console.log('#### RES');
                console.log(res)
                setSlice({ user: res.data, isLoading: false, loginForm: INITIAL_LOGIN });
                initApplication();
            } catch (err) {
                console.error(err.response.data);
                if(err.response.data.customErr){
                    if(err.response.data.metadata.needsConfirmation){
                        setSlice({ pageView: PAGE_VIEWS.confirmation, confirmationCodeForm: { code: '', email: err.response.data.metadata.email }});
                    }
                };
                setSlice({ error: err.message, isLoading: false });
            }
        },

        setLoginForm: ({ name, value }) => {
            const { loginForm } = get().auth;
            setSlice({ loginForm: { ...loginForm, [name]: value } });
        },

        clearLoginForm: () => setSlice({ loginForm: INITIAL_LOGIN }),

        logout: () => setSlice({ user: null }),

        createUser: async () => {
            const { loginForm: { email, password }} = get().auth;
            setSlice({ isLoading: true, error: null });
            try {
                const res = await axios.post('/api/auth/signup', { email, password });
                setSlice({ user: res.data, isLoading: false, loginForm: INITIAL_LOGIN });
            } catch (err) {
                console.error(err);
                setSlice({ error: err.message, isLoading: false });
            }
        },

        isAuthenticated: () => {
            const token = sessionStorage.getItem('accessToken');
            if (!token)
                return false;
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.exp * 1000 > Date.now();
        }
    }
};