import 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Loggin, PageLoader } from '@components';
import { useAuthQuery } from '@query';
import { useEffect } from 'react';



export const AuthWrapper = () => {
    const { readUser } = useAuthQuery();
    useEffect(() => {
        console.log(readUser.data)
    }, [readUser])
    // if (!readUser.data && !sessionStorage.getItem('accessToken'))
    //     return <Loggin />
    
    return (
        <>
            { !readUser.data || !sessionStorage.getItem('accessToken') ? <Loggin /> : <Outlet /> }
            <PageLoader />
        </>
    )
}
