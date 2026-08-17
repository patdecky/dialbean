import './App.css'
import { Routes, Route, Outlet, NavLink, useLocation } from "react-router";
import { useEffect, useState } from "react";

import { DialBeanProvider } from "./DialBeanContext";
import { CounterIcon, CupboardIcon, CookbookIcon } from "./icons";
import { MenuActionIcon } from "./action_icons";

import Counter from './Counter'
import Cupboard from './Cupboard'
import Cookbook from './Cookbook'
import Settings from './Settings'
import { MessageBlock } from './modals';


const Layout = () => {
    const location = useLocation();
    const baseClassName = "flex flex-col text-sm items-center px-2 py-1 rounded-md hover:ring hover:ring-bg2";
    const activeClassName = baseClassName + " bg-bg1 ";
    const inactiveClassName = baseClassName + " inactive";
    return (
        <main className="overflow-hidden h-dvh w-full bg-bg1 flex flex-col justify-stretch items-stretch landscape:flex-row">
            <div className="flex-1 min-h-0 min-w-0 w-full">
                <Outlet />
            </div>
            <nav id="mainNav" className="shrink-0 bg-bg2 landscape:border-l border-t border-bg3 flex p-1 landscape:flex-col justify-center items-between gap-2">
                <NavLink to="/counter" className={({ isActive }) =>
                    (isActive || location.pathname === "/") ? activeClassName : inactiveClassName}>
                    <CounterIcon className="mt-1 main-menu-icon" />
                    <span className="main-menu-text">
                        Counter
                    </span>
                </NavLink>
                <NavLink to="/cupboard" className={({ isActive }) =>
                    isActive ? activeClassName : inactiveClassName}>
                    <CupboardIcon className="mt-1 main-menu-icon" />
                    <span className="main-menu-text">
                        Cupboard
                    </span>
                </NavLink>
                <NavLink to="/cookbook" className={({ isActive }) =>
                    isActive ? activeClassName : inactiveClassName}>
                    <CookbookIcon className="mt-1 main-menu-icon" />
                    <span className="main-menu-text">
                        Cookbook
                    </span>
                </NavLink>
                <NavLink to="/settings" className={({ isActive }) =>
                    (isActive ? activeClassName : inactiveClassName) + " landscape:order-first"}>
                    <MenuActionIcon className="mt-1 main-menu-icon" />
                    <span className="main-menu-text">
                        Settings
                    </span>
                </NavLink>
            </nav>
        </main>

    )
}


function App() {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Tab') {
                e.preventDefault(); // Completely disables the Tab key across the entire application
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);
    const [message, setMessage] = useState<string>("");

    return (
        <>
            <MessageBlock message={message} onClear={() => setMessage("")} />
            <DialBeanProvider setMessage={setMessage}>
                <Routes>
                    <Route element={<Layout />} >
                        <Route path="/counter?" element={<Counter />} />
                        <Route path="/cupboard" element={<Cupboard />} />
                        <Route path="/cookbook" element={<Cookbook />} />
                        <Route path="/settings" element={<Settings />} />
                    </Route>
                </Routes>
            </DialBeanProvider>
        </>
    )
}

export default App
