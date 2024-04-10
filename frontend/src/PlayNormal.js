import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

function PlayNormal() {
    const { worldParam } = useParams();
    const [game, setGame] = useState([]);
    const [question, setQuestion] = useState({number: 0});
    const [notFound, setNotFound] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    
    const getQuestion = () => {
        console.log(game);
        axios.post('/play/normal/getquestion', {world: worldParam, game: game})
        .then(response => {
            if (response.data["notFound"]) {
                setNotFound(true);
                return;
            }

            if (response.data["gameOver"]) {
                setGameOver(true);
                return;
            }

            setQuestion({question: response.data["question"], id: response.data["questionID"], number: question.number + 1});
        }) 
        .catch(error => {
            console.error('Error fetching question:', error);
        });
    }

    const answer = (ans) => {
        let newGame = [...game];
        newGame.push([question.id, ans]);
        setGame(newGame);
    }


    useEffect(getQuestion, [game]);

    return (
        <div>
            {gameOver ? (
                <h1> Game over </h1>
            ) : (
                <div>
                    <h1> Question {question.number} </h1>
                    <p> {question.question} </p>
                    <button onClick={() => {answer(0)}}> Yes </button>
                    <button onClick={() => {answer(2)}}> I don't know </button>
                    <button onClick={() => {answer(1)}}> No </button>
                </div>
            )}
        </div>
    );
}

export default PlayNormal;