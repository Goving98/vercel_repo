"use client";
import React from 'react'
// import GlobalStyleProvider from './GlobalStyleProvider';
import { GlobalProvider } from '../context/globalProvider';

interface Props{
    children : React.ReactNode;
}


function ContextProvider({children}: Props) {
    const [isReady , setisReady] = React.useState(false);
    React.useEffect(() =>{
        setTimeout(()=>{
            setisReady(true);
        },200);
    },[]);
    if(!isReady){
        return null;
    }
    return <GlobalProvider>{children}</GlobalProvider>;
}

export default ContextProvider;