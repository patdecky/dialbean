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
import { InstallPwaBanner } from './pwa';


const Layout = () => {
    const location = useLocation();
    return (
        <main className="overflow-hidden h-dvh w-full bg-bg1 flex flex-col justify-stretch items-stretch landscape:flex-row">
            <div className="flex-1 min-h-0 min-w-0">
                <Outlet />
            </div>
            <nav className="shrink-0 bg-bg2 landscape:border-l portrait:border-t border-bg3 p-1 flex justify-center landscape:flex-col">
                <div className="flex flex-row landscape:flex-col items-center justify-between w-full h-full max-w-90 max-h-70 gap-2">
                    <NavLink
                        to="/counter"
                        className={({ isActive }) =>
                            isActive || location.pathname === "/" ? "nav-item active" : "nav-item inactive"
                        }
                    >
                        <CounterIcon className="mt-1 nav-icon" />
                        <span>Counter</span>
                    </NavLink>

                    <NavLink
                        to="/cupboard"
                        className={({ isActive }) => (isActive ? "nav-item active" : "nav-item inactive")}
                    >
                        <CupboardIcon className="mt-1 nav-icon" />
                        <span>Cupboard</span>
                    </NavLink>

                    <NavLink
                        to="/cookbook"
                        className={({ isActive }) => (isActive ? "nav-item active" : "nav-item inactive")}
                    >
                        <CookbookIcon className="mt-1 nav-icon" />
                        <span>Cookbook</span>
                    </NavLink>

                    <NavLink
                        to="/settings"
                        className={({ isActive }) =>
                            (isActive ? "nav-item active" : "nav-item inactive")
                        }
                    >
                        <MenuActionIcon className="mt-1 nav-icon" size={24} strokeColor="black"/>
                        <span>More</span>
                    </NavLink>
                </div>
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
    const [showPWABanner, setShowPWABanner] = useState<boolean>(false);
    console.log("App.tsx rendered. showPWABanner:", showPWABanner);
    return (
        <>
            <MessageBlock message={message} onClear={() => setMessage("")} />
            <DialBeanProvider setMessage={setMessage} onPromptPWA={() => setShowPWABanner(true)}>
                {showPWABanner && <InstallPwaBanner onDismiss={() => {setShowPWABanner(false); console.log("and error");}} />}
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
