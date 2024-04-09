import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const MIN_NAME_LENGTH = 5;
const MAX_NAME_LENGTH = 20;
const MAX_DESC_LENGTH = 200;
const NAME_REGEX = /^[a-zA-Z0-9_ ]*$/;
const DESC_REGEX = /^[a-zA-Z0-9,;.:\-_#'+*~´`?\\}=\])[({/&%$§"!^°<>| ]*$/;

function Create() {
    const [worldName, setWorldName] = useState("");
    const [worldDesc, setWorldDesc] = useState("");
    const [isPublic, setIsPublic] = useState(true);
    const [validation, setValidation] = useState({nameTooShort: true, nameTooLong: false, descTooLong: false, specialChars: false});

    const navigate = useNavigate();

    useEffect(() => {
        let newValidation = {... validation};
        newValidation.nameTooShort = worldName.length < MIN_NAME_LENGTH;
        newValidation.nameTooLong = worldName.length > MAX_NAME_LENGTH;
        newValidation.descTooLong = worldDesc.length > MAX_DESC_LENGTH;

        newValidation.specialChars = !NAME_REGEX.test(worldName) || !DESC_REGEX.test(worldDesc);

        setValidation(newValidation);
    }, [worldName, worldDesc]);

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post('/create', null, {params: {"worldName": worldName, "worldDesc" : worldDesc, "isPublic" : isPublic}})
        .then(response => {
            alert("World created successfully");
            navigate("/");
        }) 
        .catch(error => {
            console.error('Error creating world:', error);
        });
    }

    return (
        <div>
            <h1> Create a new world </h1>
            <form onSubmit={handleSubmit}>
                <label>
                    World name:
                    <input type="text" value={worldName} onChange={(e) => setWorldName(e.target.value)} />
                </label> <br />
                <label>
                    World description (Optional): <br />
                    <textarea value={worldDesc} onChange={(e) => setWorldDesc(e.target.value)} />
                </label> <br />
                <label>
                    Public?
                    <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
                </label> <br />
                <label>
                    <button type="submit">
                        Submit
                    </button>
                </label>
            </form>

            {validation.nameTooShort && (
                <p style={{color: 'red'}}>
                    World name must be at least {MIN_NAME_LENGTH} characters long.
                </p>
            )}

            {validation.nameTooLong && (
                <p style={{color: 'red'}}>
                    World name must be at most {MAX_NAME_LENGTH} characters long.
                </p>
            )}

            {validation.descTooLong && (
                <p style={{color: 'red'}}>
                    World description must be at least {MAX_DESC_LENGTH} characters long.
                </p>
            )}

            {validation.specialChars && (
                <p style={{color: 'red'}}>
                    World name and description can only contain alphanumeric characters and certain punctuation.
                </p>
            )}
        </div>
    )
}

export default Create;