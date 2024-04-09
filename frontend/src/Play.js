import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function Play() {
    const { worldParam } = useParams();
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const [desc, setDesc] = useState("");

    useEffect(() => {
        axios.get('/getdesc', {params: {name: worldParam}})
        .then(response => {
            if (response.data["found"]) {
                setDesc(response.data["desc"]);
                setSuccess(true);
            } else {
                setSuccess(false);
            }

            setLoading(false);
        })
        .catch(error => {
            console.error('Error fetching public worlds:', error);
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
                    <p> {desc} </p>
                ) : (
                    <p style={{color: 'red'}}>
                        This world doesn't exist
                    </p>
                )
            )}    
        </div>
    )
}

export default Play;