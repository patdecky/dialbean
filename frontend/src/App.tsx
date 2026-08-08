import './App.css'
import { Routes, Route, Outlet, NavLink, useLocation } from "react-router";
import { DialBeanProvider } from "./DialBeanContext";

import Counter from './Counter'
import Cupboard from './Cupboard'
import Cookbook from './Cookbook'
import Compost from './Compost'


const Layout = () => {
    const location = useLocation();
    const baseClassName = "block px-4 py-2";
    const activeClassName = baseClassName + " bg-taupe-500";
    const inactiveClassName = baseClassName + " bg-taupe-400";
    return (
        <div className="App bg-amber-50 h-dvh w-screen overflow-hidden">
            <div className="absolute top-0 left-0 w-full flex justify-center">
                <nav className="flex font-bold justify-center items-center border mt-4 rounded-lg bg-red-100 overflow-hidden">
                    <ul className="flex justify-center items-center">
                        <li><NavLink to="/counter" className={({ isActive }) =>
                            (isActive || location.pathname === "/") ? activeClassName : inactiveClassName}>
                            Counter
                        </NavLink></li>
                        <li><NavLink to="/cupboard" className={({ isActive }) =>
                            isActive ? activeClassName : inactiveClassName}>
                            Cupboard
                        </NavLink></li>
                        <li><NavLink to="/cookbook" className={({ isActive }) =>
                            isActive ? activeClassName : inactiveClassName}>
                            Cookbook
                        </NavLink></li>
                        <li><NavLink to="/compost" className={({ isActive }) =>
                            isActive ? activeClassName : inactiveClassName}>
                            Compost
                        </NavLink></li>
                    </ul>
                </nav>
            </div>
            <Outlet />
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
                        <Route path="/compost" element={<Compost />} />
                    </Route>
                </Routes>
            </DialBeanProvider>
        </>
    )
}

export default App
