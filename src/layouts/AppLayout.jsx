import { Outlet } from "react-router-dom";
import React from 'react';
import Header from "@/components/Header";


const AppLayout = () => {
    return <div>
        <main className="min-h-screen w-full max-w-[1440px] mx-auto px-4">
            
            <Header />
            <Outlet />
        </main>

      
        <footer>
            <div className="p-10 text-center text-white bg-gray-800 mt-10">
                Made with 💗 by Vihar || JSX
                <p>© 2025 URL Shortener</p>
            </div>
           
        </footer>
    </div>
};

export default AppLayout;