import type { Grinder, Brewer, Bag } from './types';
import { useDileBean } from './DileBeanContext';


const Cupboard = () => {
    const { data } = useDileBean();
    const userBrewers: Brewer[] = data.brewers.filter((brewer) => !brewer.isBaseBrewer);
    const userGrinders: Grinder[] = data.grinders.filter((grinder) => !grinder.isBaseGrinder);
    const userBags: Bag[] = data.bags.filter((bag) => !bag.isBaseBag);


    return (
        <div className="flex flex-col items-center justify-center h-screen">
            
            <section>
                <h2 className="text-xl font-semibold mb-2">Brewers</h2>
                <ul>
                    {userBrewers.length > 0 ? (
                        userBrewers.map((brewer) => (
                            <li key={brewer.id}>
                                {brewer.name} — {brewer.method}
                            </li>
                        ))
                    ) : (
                        <li>No user brewers available.</li>
                    )}
                </ul>
                <button>Add brewer</button>
            </section>


            <section>
                <h2 className="text-xl font-semibold mb-2">Grinders</h2>
                <ul>
                    {userGrinders.length > 0 ? (
                        userGrinders.map((grinder) => (
                            <li key={grinder.id}>
                                {grinder.name}
                            </li>
                        ))
                    ) : (
                        <li>No user grinders available.</li>
                    )}
                </ul>
                <button>Add grinder</button>
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-2">Bags</h2>
                <ul>
                    {userBags.length > 0 ? (
                        userBags.map((bag) => (
                            <li key={bag.id}>
                                {bag.name}
                            </li>
                        ))
                    ) : (
                        <li>No user bags available.</li>
                    )}
                </ul>
                <button>Add bag</button>
            </section>
        </div>
    )
}

export default Cupboard;




