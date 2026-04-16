import { useState } from 'react';
import { Table, Button } from '@components';
import { useTicketQuery } from '@query';
import { stripeService } from '@services';
import { ConnectAccountOnboarding, ConnectComponentsProvider } from "@stripe/react-connect-js";
import { loadConnectAndInitialize } from '@stripe/connect-js';
import { useEffect } from 'react';




export const StripePage = () => {
    const [errorMessage, setErrorMessage] = useState('');
    const [stripeConnectInstance, setStripeConnectInstance] = useState(null);
    const[clientSecret, setClientSecret] = useState(null);

    useEffect(() => {
        const result = loadConnectAndInitialize({
            publishableKey: "pk_test_51TMGseDkUN1GMhs5svH7QRibL9ktvwDJsUa94IhotGEyAxNEjZ2H2ee3OzHt18yPZmaz1LYjd5mv6OQYM09KS86M00P0yZNg2Z",
            fetchClientSecret: fetchClientSecret,
        });
        setStripeConnectInstance(result);
    }, [clientSecret]);


    const fetchClientSecret = async () => {
        try {
            const response = await stripeService.createAccountSession(null);
            return response.data.client_secret;
        } catch (error) {
            console.error('An error occurred: ', error);
            setErrorMessage(error)
            return undefined;
        }
    }

    const handleOnboard = async () => {
        const response = await stripeService.createAccount(null);
        console.log(response.data);
        if(response.data.client_secret) setClientSecret(response.data.client_secret)
    }

    const createPaymentLink = async () => {
        const response = await stripeService.createPaymentLink();
        console.log(response.data);
    }

    const createAccountLink = async () => {
        const response = await stripeService.createAccountLink();
        console.log(response.data);
    }

    const createAccountSession = async () => {
        const response = await stripeService.createAccountSession();
        console.log(response.data);
    }

    return (
        <div className='max-w-170 bg-white'>
            <h1 className='p-10 pt-10 text-4xl font-extrabold no-wrap'>Stripe:</h1>
            <Button onClick={handleOnboard}>TEST CREATE ACCOUNT</Button>
            <Button onClick={createPaymentLink} >TEST CREATE PAYMENT LINK</Button>
            <Button onClick={createAccountLink} >TEST ACCOUNT LINK</Button>
            <Button onClick={createAccountSession} >TEST ACCOUNT SESSION</Button>
            { stripeConnectInstance && <ConnectComponentsProvider connectInstance={stripeConnectInstance}>
                <ConnectAccountOnboarding
                    onExit={() => {
                        console.log("The account has exited onboarding");
                    }}
                    // Optional: make sure to follow our policy instructions above
                    fullTermsOfServiceUrl="{{URL}}"
                    recipientTermsOfServiceUrl="{{URL}}"
                    privacyPolicyUrl="{{URL}}"
                    collectionOptions={{
                    fields: 'eventually_due',
                    futureRequirements: 'include',
                    requirements: {
                        exclude: ['business_profile.product_description']
                    }
                    }}
                    onStepChange={(stepChange) => {
                    console.log(`User entered: ${stepChange.step}`);
                    }}
                    />
                </ConnectComponentsProvider>
            }

        </div>
    );
};