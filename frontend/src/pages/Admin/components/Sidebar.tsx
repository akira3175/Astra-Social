import React, { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { GoReport } from "react-icons/go";
import "./Sidebar.css";

const Sidebar = () =>{
    return (
        <>
            <div className="width-280 my-custome border rounded-4">
                <ul className="list-unstyled m-4">
                    <li>
                        <NavLink to="/admin/report" className={({isActive}) =>  `${isActive ? "active" :""} text-dark bg-hover text-hover p-3 text-decoration-none d-flex gap-3 align-items-center `}>
                            <GoReport className="fs-5" />
                            <span>
                            Báo cáo
                            </span>
                        </NavLink>
                    </li>
                </ul>   
            </div>
        </>
    );
};

export default Sidebar;