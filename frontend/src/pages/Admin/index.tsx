import React, { ReactNode } from "react";
import { Outlet } from 'react-router-dom';
import Sidebar from "./components/Sidebar";


const AdminPage = () =>{
    return (
        <>
            <div className="p-3 d-flex flex-row gap-3 align-items-start">
                <Sidebar/>
                <>
                    <Outlet />
                </>

            </div>
        </>
    );
};

export default AdminPage;
