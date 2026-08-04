import {Link} from "react-router"


const Counter = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <div className="grid grid-cols-2 gap-4">
            <Link to="/shelf">Shelf</Link>
            <Link to="/rubbish">Rubbish</Link>
            <Link to="/recipes">Recipes</Link>
            <Link to="/machines">Machines</Link>
            </div>
        </div>
    )
}

export default Counter;




