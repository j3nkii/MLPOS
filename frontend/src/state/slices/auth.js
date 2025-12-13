import axios from 'axios'


const INITIAL_LOGIN = {
    email: '',
    password: '',
}


export const createAuthSlice = (set, get) => {
    const setSlice = (partial) => set(state => ({
        auth: { ...state.auth, ...partial }
    }));
    return {
        user: null,
        confirmationCode: '',
        loginForm: INITIAL_LOGIN,

        setConfirmationCode: (payload) => {
            setSlice({ confirmationCode: payload });
        },

        postConfirmation: async () => {
            try {
                const { confirmationCode } = get().auth;
                setSlice({ isLoading: true, error: null });
                const res = await axios.post('/api/user/confirm', confirmationCode);
                setSlice({ user: res.data, isLoading: false, loginForm: INITIAL_LOGIN, confirmationCode: '' });
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
                const res = await axios.post('/api/user/login', loginForm);
                setSlice({ user: res.data, isLoading: false, loginForm: INITIAL_LOGIN });
                initApplication();
            } catch (err) {
                console.error(err);
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