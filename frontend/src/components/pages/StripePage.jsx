import { useState } from 'react';
import { Table, Button } from '@components';
import { useInvoiceQuery } from '@query';
import { stripeService } from '@services';
import { ConnectAccountOnboarding, ConnectComponentsProvider } from "@stripe/react-connect-js";
import { loadConnectAndInitialize } from '@stripe/connect-js';




export const StripePage = () => {
    const [errorMessage, setErrorMessage] = useState('');
    const [stripeConnectInstance] = useState(() => {
        const fetchClientSecret = async () => {
            try {
                const response = await stripeService.createAccount(null);
                return response.data.client_secret;
            } catch (error) {
                console.error('An error occurred: ', error);
                setErrorMessage(error)
                return undefined;
            }
        }
        return loadConnectAndInitialize({
            publishableKey: "pk_test_51TMGseDkUN1GMhs5svH7QRibL9ktvwDJsUa94IhotGEyAxNEjZ2H2ee3OzHt18yPZmaz1LYjd5mv6OQYM09KS86M00P0yZNg2Z",
            fetchClientSecret: fetchClientSecret,
        })
    });

    const handleOnboard = async () => {
        const response = await stripeService.createAccount(null);
        console.log(response.data);
        setSessionSecret(response.data.client_secret)
    }

    //   const handleStartOnboarding = async () => {
    //     try {
    //     const response = await fetch("/api/create-account-link", {
    //         method: "POST",
    //         headers: {
    //         "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify({ accountId }),
    //     });

    //     if (!response.ok) {
    //         throw new Error("Failed to create account link");
    //     }

    //     const data = await response.json();
    //     window.location.href = data.url;
    //     } catch (error) {
    //     console.error("Error creating account link:", error);
    //     }
    // };
    return (
        <div className='max-w-170 bg-white'>
            <h1 className='p-10 pt-10 text-4xl font-extrabold no-wrap'>Invoices:</h1>
            <Button onClick={handleOnboard} >On BOARD SOMEONE</Button>
            <ConnectComponentsProvider connectInstance={stripeConnectInstance}>
            <ConnectAccountOnboarding
                onExit={() => {
                    console.log("The account has exited onboarding");
                }}
                // Optional: make sure to follow our policy instructions above
                // fullTermsOfServiceUrl="{{URL}}"
                // recipientTermsOfServiceUrl="{{URL}}"
                // privacyPolicyUrl="{{URL}}"
                // collectionOptions={{
                //   fields: 'eventually_due',
                //   futureRequirements: 'include',
                //   requirements: {
                //     exclude: ['business_profile.product_description']
                //   }
                // }}
                // onStepChange={(stepChange) => {
                //   console.log(`User entered: ${stepChange.step}`);
                // }}
                />
            </ConnectComponentsProvider>

        </div>
    );
};