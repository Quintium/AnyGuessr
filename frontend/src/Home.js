import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Home() {
    const [publicWorlds, setPublicWorlds] = useState([]);
    const [privateWorld, setPrivateWorld] = useState("");

    const updateWorlds = () => {
        axios.get('/publicworlds')
        .then(response => {
            setPublicWorlds(response.data);
        })
        .catch(error => {
            console.error('Error fetching public worlds:', error);
        });
    }

    useEffect(updateWorlds, []);

    return (
        <div>
            <p> Join one of the public worlds: </p>
            <ul>
                {publicWorlds.map(world => (
                    <li key={world}> 
                        <Link to={'/play/' + encodeURIComponent(world)}> {world} </Link> 
                    </li>
                ))}
            </ul>
            <p> Or select a private world: </p>
            <input type="text" value={privateWorld} onChange={(e) => setPrivateWorld(e.target.value)} />
            <Link to={"/play/" + encodeURIComponent(privateWorld.trim())}> 
                <button disabled={!privateWorld}> Join </button> 
            </Link>
            <p>
                <Link to="/create/">
                    Or create a new world yourself!
                </Link>
            </p>
            
        </div>
    )
}

export default Home;