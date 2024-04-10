import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

function PlayOverview() {
    const { worldParam } = useParams();
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const [desc, setDesc] = useState("");

    useEffect(() => {
        axios.get('/getdesc', {params: {name: worldParam}})
        .then(response => {
            if (response.data["notFound"]) {
                setSuccess(false);
                setLoading(false);
                return;
            }

            setDesc(response.data["desc"]);
            setSuccess(true);
            setLoading(false);
        }) 
        .catch(error => {
            console.error('Error fetching description:', error);
        });
    }, []);

    return (
        <div>
            <h1> {worldParam} </h1>
            {
            loading ? (
                <p> Loading... </p>
            ) : (
                success ? (
                    <div>
                        <p> {desc} </p>
                        <Link to={"/play/normal/" + encodeURIComponent(worldParam)}> Normal mode</Link> <br />
                        <Link to={"/play/reversed/" + encodeURIComponent(worldParam)}> Reversed mode </Link> <br />
                        <Link to={"/play/train/" + encodeURIComponent(worldParam)}> Training mode </Link> <br />
                    </div>
                ) : (
                    <p style={{color: 'red'}}>
                        This world doesn't exist
                    </p>
                )
            )}    
        </div>
    )
}

export default PlayOverview;