import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const MIN_NAME_LENGTH = 5;
const MAX_NAME_LENGTH = 20;
const MAX_DESC_LENGTH = 200;
const MAX_CHAR_LENGTH = 20;
const REGEX = /^[a-zA-Z0-9,;.:\-_#'+*~´`?\\}=\])[({/&%$§"!^°<>| ]*$/;

function Create() {
    const [worldName, setWorldName] = useState("");
    const [worldDesc, setWorldDesc] = useState("");
    const [isPublic, setIsPublic] = useState(true);
    const [characters, setCharacters] = useState(["", ""]);
    const [validation, setValidation] = useState({});
    const validationMessages = { 
        nameTooShort: `World name must be at least ${MIN_NAME_LENGTH} characters long.`, 
        nameTooLong: `World name must be at most ${MAX_NAME_LENGTH} characters long.`, 
        descTooLong: `World description must be at least ${MAX_DESC_LENGTH} characters long.`, 
        nameSpecialChars: `World name can only contain alphanumeric characters and certain punctuation.`, 
        descSpecialChars: `World description can only contain alphanumeric characters and certain punctuation.`, 
        emptyCharacters: `Characters can't have an empty name.`, 
        characterTooLong: `Characters' names must be at most ${MAX_CHAR_LENGTH} characters long.`, 
        characterSpecialChars: `Characters' names can only contain alphanumeric characters and certain punctuation.`,
        characterDuplicates: `There can't be multiple characters with the same name.`
    };

    const navigate = useNavigate();

    const updateValidation = () => {
        setValidation({
            nameTooShort: worldName.trim().length < MIN_NAME_LENGTH,
            nameTooLong: worldName.trim().length > MAX_NAME_LENGTH,
            descTooLong: worldDesc.trim().length > MAX_DESC_LENGTH,
            nameSpecialChars: !REGEX.test(worldName),
            descSpecialChars: !REGEX.test(worldDesc),
            emptyCharacters: !characters.every((c) => c.trim()),
            characterTooLong: !characters.every((c) => c.trim().length <= MAX_NAME_LENGTH),
            characterSpecialChars: !characters.every((c) => REGEX.test(c)),
            characterDuplicates: (new Set(characters.map((c) => c.trim().toLowerCase()))).size !== characters.length
        });
    }

    useEffect(updateValidation, [worldName, worldDesc, characters]);

    const formIsCorrect = () => {
        return !validation.nameTooShort && !validation.nameTooLong && !validation.descTooLong && !validation.specialChars && !validation.emptyCharacters;
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post('/create', { 
            name: worldName, 
            desc: worldDesc, 
            isPublic: isPublic, 
            characters: characters 
        })
            .then(response => {
                if (response.data.taken) {
                    alert("This world name is already taken");
                    return;
                }

                navigate("/play/" + encodeURIComponent(worldName.trim()));
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
                </label> <br /> <br />

                {characters.map((c, i) => (
                    <label>
                        <input type="text" value={c} onChange={(e) => {
                            let newChars = [...characters];
                            newChars[i] = e.target.value;
                            setCharacters(newChars);
                        }} placeholder={"Character " + (i + 1)} /> <br />
                    </label>

                ))}

                <label>
                    <button onClick={() => {
                        let newChars = [...characters];
                        newChars.push("");
                        setCharacters(newChars);
                    }}> Add character </button>
                </label>

                {characters.length > 2 && (<label>
                    <button onClick={() => {
                        let newChars = [...characters];
                        newChars.pop();
                        setCharacters(newChars);
                    }}> Remove character </button>
                </label>)}

                <br /> <br />

                <label>
                    <button type="submit" disabled={!formIsCorrect()}>
                        Submit
                    </button>
                </label>

            </form>

            {!isPublic && (
                <p style={{ color: 'orange' }}>
                    If you forget your world name, your world will be lost!
                </p>
            )
            }

            {Object.keys(validation).map((val) => (
                validation[val] && (
                    <p style={{ color: 'red' }}>
                        {validationMessages[val]}
                    </p>
                )
            ))}
        </div>
    )
}

export default Create;