import './App.css'
import { Routes, Route, Outlet, NavLink, useLocation } from "react-router";
import { DialBeanProvider } from "./DialBeanContext";
import { CounterIcon, CupboardIcon, CookbookIcon } from "./icons";

import Counter from './Counter'
import Cupboard from './Cupboard'
import Cookbook from './Cookbook'


const Layout = () => {
    const location = useLocation();
    const baseClassName = "flex flex-col text-sm items-center px-2 py-1 rounded-md hover:ring hover:ring-bg2";
    const activeClassName = baseClassName + " bg-bg1 active";
    const inactiveClassName = baseClassName + " inactive";
    return (
        <div className="h-dvh w-screen overflow-hidden bg-bg1 flex flex-col justify-stretch items-center landscape:flex-row">
            <div className="flex-grow w-full h-full">
            <Outlet />
            </div>
            <nav className="bg-bg2 w-full landscape:w-fit landscape:h-full landscape:border-l border-t border-bg3 flex landscape:flex-col justify-center items-between gap-2 p-1">
                <NavLink to="/counter" className={({ isActive }) =>
                    (isActive || location.pathname === "/") ? activeClassName : inactiveClassName}>
                    <CounterIcon className="mt-1 main-menu-icon"/>
                    <span>
                        Counter
                    </span>
                </NavLink>
                <NavLink to="/cupboard" className={({ isActive }) =>
                    isActive ? activeClassName : inactiveClassName}>
                    <CupboardIcon  className="mt-1 main-menu-icon"/>
                    <span>
                        Cupboard
                    </span>
                </NavLink>
                <NavLink to="/cookbook" className={({ isActive }) =>
                    isActive ? activeClassName : inactiveClassName}>
                    <CookbookIcon className="mt-1 main-menu-icon"/>
                    <span>
                        Cookbook
                    </span>
                </NavLink>
            </nav>
        </div>

    )
}


function App() {

    return (
        <>
            <DialBeanProvider>
                <Routes>
                    <Route element={<Layout />} >
                        <Route path="/counter?" element={<Counter />} />
                        <Route path="/cupboard" element={<Cupboard />} />
                        <Route path="/cookbook" element={<Cookbook />} />
                    </Route>
                </Routes>
            </DialBeanProvider>
        </>
    )
}

export default App
