import React, {useEffect, useState,useContext} from 'react';
import {QuizzData} from "./QuizzData";
import "./game.css";
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
    const socket = useContext(SocketContext);
    const currentUser = props.currentUser;
    const opponent = props.opponent;
    const roomId = props.roomId;
    const questions = QuizzData;
    const listSpellAnimation = [spellAttack,spellDefense,spellTransfigurate];
    const [showFinalScore, setShowFinalScore] = useState(false);
    const [readyUser, setReadyUser] = useState(false);
    const [readyBot, setReadyBot] = useState(false);
    const listSpell = ["attack","defense","transfigurate"];


    const [UserHP, setUserHP] = useState(8);
    const [BotHP, setBotHP] = useState(8);

    const [userSpell, setUserSpell] = useState(false);
    const [botSpell, setBotSpell] = useState(false);

    const [userSpellAnimation, setUserSpellAnimation] = useState(null);
    const [botSpellAnimation, setBotSpellAnimation,getbotSpellAnimation] = useState(null);

    const [nextUserSpell, setNextUserSpell] = useState(null);
    const [nextBotSpell, setNextBotSpell, getNextBotSpell] = useState(null);

    const [duel, setDuel] = useState(true);

    const [currentQuestion, setCurrentQuestion] = useState(0);

    const [showScore, setShowScore] = useState(false);
    const [score, setScore] = useState(0);


    socket.on('spell',(spellOpponent,spellAnimationOpponent,currentUserId) =>{
        if(currentUserId === currentUser){
        }else{
            console.log(spellOpponent,spellAnimationOpponent,currentUserId);
            if(readyUser){
                setReadyBot(true)
                setNextBotSpell(spellOpponent);
                setBotSpellAnimation(spellAnimationOpponent);
                handleDuel(spellOpponent,spellAnimationOpponent);
            }
            else{
                console.log("ready bot")
                setReadyBot(true)
                setNextBotSpell(spellOpponent)
                setBotSpellAnimation(spellAnimationOpponent)
            }
        }
    });


    const handleDeadUser = () => {
        setShowFinalScore(true)
    }

    const handleDeadBot = () => {
        setShowFinalScore(true)
    }


    const handleAnswerOptionClick = (index) => {
        if (index === questions[currentQuestion].goodAnswer) {
            setScore(score + 1);
            setReadyUser(true)
            socket.emit('spell', roomId, nextUserSpell,userSpellAnimation, currentUser);
            if (readyBot) {
                handleDuel();
            }
        }

        const nextQuestion = currentQuestion + 1;
        if (nextQuestion < 8) {
            setCurrentQuestion(nextQuestion);
            setDuel(true)
        } else {
            setShowScore(true);
        }
    };
    const handleDuel = (spellOponnent) => {

        let _nextBotSpell = nextBotSpell === null ? spellOponnent : nextBotSpell ;
        console.log(nextUserSpell, _nextBotSpell)

        setUserSpell(true)
        setBotSpell(true)

        if (nextUserSpell === _nextBotSpell) {
        }else if(nextUserSpell=== "attack" && _nextBotSpell === "transfigurate" || nextUserSpell === "defense" && _nextBotSpell === "attack" || nextUserSpell === "transfigurate" && _nextBotSpell === "defense") {
            setTimeout(() => {
                setBotSpellAnimation(hit)
            },1500);
            setBotHP(BotHP - 2);
            setTimeout(() => {
                if (UserHP - 2 === 0) {
                    handleDeadBot()
                }
            },3000);

        }else if(nextUserSpell === "attack" && _nextBotSpell === "defense" || nextUserSpell === "defense" && _nextBotSpell === "transfigurate" || nextUserSpell === "transfigurate" && _nextBotSpell === "attack") {
            setTimeout(() => {
                setUserSpellAnimation(hit)
            },1500);
            setUserHP(UserHP - 2);
            setTimeout(() => {
                if (UserHP - 2 === 0) {
                    handleDeadUser()
                }
            },3000);

        }
        setTimeout(() => {
            setUserSpell(false)
            setBotSpell(false)
        },3000)
        setReadyUser(false)
        setReadyBot(false)
    }
    const saveDuel = (spell) => {
        switch (spell) {
            case "attack":
                setUserSpellAnimation(listSpellAnimation[0])
                setNextUserSpell(listSpell[0])
                break;
            case "defence":
                setUserSpellAnimation(listSpellAnimation[1])
                setNextUserSpell(listSpell[1])
                break;
            case "transfigurate":
                setUserSpellAnimation(listSpellAnimation[2])
                setNextUserSpell(listSpell[2])
                break;
        }
        setDuel(false)
    }

    return (
        <div className="QuizzApp">
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
                            <HealthBar hp={UserHP} maxHp={8}/>
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
                                                        <span>Question {currentQuestion + 1}</span>/10
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
                            <HealthBar hp={BotHP} maxHp={8}/>
                        </div>
                    </div>

                </div>
                )
            }



        </div>
    );

}

export default MainQuizz;