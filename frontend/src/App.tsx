import './App.css'
import { Routes, Route } from "react-router";


import Shelf from './Shelf'
import Counter from './Counter'


function App() {

    return (
        <>
            <Routes>
                <Route path="/" element={<Counter />} />
                <Route path="/shelf" element={<Shelf />} />
            </Routes>
        </>
    )
}

export default App
