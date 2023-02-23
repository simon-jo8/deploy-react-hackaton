import React, {useEffect, useState,useContext} from 'react';
import {QuizzData} from "./QuizzData";
import "./game.css";
import '../index.css';
import user1 from "../assets/perso_1.gif";
import user2 from "../assets/perso_2.gif";
import attack from "../assets/attack.gif";
import spellAttack from "../assets/attack_spell.gif";
import spellDefense from "../assets/defense_spell.gif";
import spellTransfigurate from "../assets/transfo_spell.gif";
import defence from "../assets/defence.gif";
import transfigurate from "../assets/transfo.gif";
import hit from "../assets/hit_1.gif";
import background from "../assets/background.webp";
import HealthBar from "./HealthBar";
import {SocketContext} from '../context/socket';



function MainQuizz(props) {
    const socket = props.socket;
    const currentUser = props.currentUser;
    const opponent = props.opponent;
    const roomId = props.roomId;
    const questions = QuizzData;

    const [_currentUser,_setCurrentUser] = useState({id:currentUser, hp:8, spell:null, spellAnimation:null,ready:false,hit:false});
    const [_opponent,_setOpponent] = useState({id:opponent, hp:8, spell:null, spellAnimation:null,ready:false,hit:false});



    const listSpellAnimation = [spellAttack,spellDefense,spellTransfigurate];
    const [showFinalScore, setShowFinalScore] = useState(false);
    const listSpell = ["attack","defence","transfigurate"];

    const [userSpell, setUserSpell] = useState(false);
    const [botSpell, setBotSpell] = useState(false);

    const [userSpellAnimation, setUserSpellAnimation] = useState(null);
    const [botSpellAnimation, setBotSpellAnimation,getbotSpellAnimation] = useState(null);


    const [duel, setDuel] = useState(true);

    const [currentQuestion, setCurrentQuestion] = useState(0);

    const [showScore, setShowScore] = useState(false);
    const [score, setScore] = useState(0);




    const handleDeadUser = () => {
        setShowFinalScore(true)
    }

    const handleDeadBot = () => {
        setShowFinalScore(true)
    }


    const handleAnswerOptionClick = (index) => {
        // if (index === questions[currentQuestion].goodAnswer) {
        //     socket.emit('playerReady', _currentUser, roomId);
        // }

        socket.emit('playerReady', _currentUser, roomId);

        const nextQuestion = currentQuestion + 1;
        if (nextQuestion < 8) {
            setCurrentQuestion(nextQuestion);
            setDuel(true)
        } else {
            setShowScore(true);
        }
    };
    const saveDuel = (spell) => {
        switch (spell) {
            case "attack":
                _setCurrentUser({..._currentUser, spell:listSpell[0], spellAnimation:listSpellAnimation[0],ready: true});
                break;
            case "defence":
                _setCurrentUser({..._currentUser, spell:listSpell[1], spellAnimation:listSpellAnimation[1],ready: true});
                break;
            case "transfigurate":
                _setCurrentUser({..._currentUser, spell:listSpell[2], spellAnimation:listSpellAnimation[2],ready: true});
                break;
        }
        setDuel(false)
    }

    socket.on('gameStart', (player1, player2) => {
        if(player1.id === currentUser){
            _setCurrentUser(player1);
            _setOpponent(player2);
            setUserSpellAnimation(player1.spellAnimation);
            setBotSpellAnimation(player2.spellAnimation);
            setUserSpell(true);
            setBotSpell(true);
            if (player1.hit) {
                setTimeout(() => {
                  setUserSpellAnimation(hit)
                },1350)
            }
            if (player2.hit) {
                setTimeout(() => {
                  setBotSpellAnimation(hit)
                },1350)
            }
            setTimeout(() => {
                setUserSpell(false);
                setBotSpell(false);
                setUserSpellAnimation(null);
                setBotSpellAnimation(null);
            },2700);
            if (player1.hp === 0) {
                handleDeadUser();
            }else if (player2.hp === 0) {
                handleDeadBot();
            }
        }else{
            _setCurrentUser(player2);
            _setOpponent(player1);
            setUserSpellAnimation(player2.spellAnimation);
            setBotSpellAnimation(player1.spellAnimation);
            setUserSpell(true);
            setBotSpell(true);
            if (player1.hp === 0) {
                handleDeadUser();
            }else if (player2.hp === 0) {
                handleDeadBot();
            }
            if (player2.hit) {
                setTimeout(() => {
                    setUserSpellAnimation(hit)
                },1350)
            }
            if (player1.hit) {
                setTimeout(() => {
                    setBotSpellAnimation(hit)
                },1350)
            }
            setTimeout(() => {
                setUserSpell(false);
                setBotSpell(false);
                setUserSpellAnimation(null);
                setBotSpellAnimation(null);
            },2700);

        }
    })


    return (
        <div className="QuizzApp app">
            <h1>Hogwarts Quizz</h1>
            {showFinalScore ? (
                <div>
                    <h1>Fin du jeu</h1>
                    <h2>Vous avez {score} bonnes réponses</h2>
                </div>
                )
                : (
                    <div className="mainFrame">
                    <div className="leftUser userCol">
                        <div className="user">
                            <img src={user1} alt=""/>
                            <HealthBar hp={_currentUser.hp} maxHp={8}/>
                            <p>Player 1</p>
                        </div>
                    </div>
                    <div className="mainGame">
                        {showScore ? (
                                <div className='score-section'>
                                    You scored {score} out of {questions.length}
                                </div>
                            ) :
                            (
                                <div className="duel">
                                    <div className="duel-visuel">
                                        <img src={background} className="background-image"/>
                                        <div className="duel-fighter">
                                            <img src={userSpell ? userSpellAnimation : user1} alt="" className="perso"/>
                                            <img src={botSpell ? botSpellAnimation : user2} alt="" className="reverse bot-perso"/>
                                        </div>
                                    </div>
                                    {duel ? (
                                            <div className="duel-button">
                                                <button onClick={()=>saveDuel("attack")}>
                                                    <img src={attack}/>
                                                    Attack
                                                </button>

                                                <button onClick={()=>saveDuel("defence")}>
                                                    <img src={defence}/>
                                                    Defense</button>
                                                <button onClick={()=>saveDuel("transfigurate")}>
                                                    <img src={transfigurate}/>
                                                    Transfigurate</button>
                                            </div>
                                        )
                                        :(
                                            <div>
                                                <div className='question-section'>
                                                    <div className='question-count'>
                                                        <span className="question">Question {currentQuestion + 1}</span>/10
                                                    </div>
                                                    <h2 className='question-text'>{questions[currentQuestion].question}</h2>
                                                </div>
                                                <div className='answer-section'>
                                                    {questions[currentQuestion].answers.map((answerOption,index) => (
                                                        <button onClick={()=>handleAnswerOptionClick(index)}>{answerOption}</button>
                                                    ))}
                                                </div>
                                            </div>
                                        )
                                    }

                                </div>
                            )

                        }
                    </div>
                    <div className="rightUser userCol">
                        <div className="user">
                            <img src={user2} alt=""/>
                            <HealthBar hp={_opponent.hp} maxHp={8}/>
                            <p>Player 2</p>
                        </div>
                    </div>

                </div>
                )
            }
        </div>
    );

}

export default MainQuizz;