import { useEffect, useRef, useState } from 'react';
import './App.css'
import Confetti from 'react-confetti'

// Custom ease-out function
function easeOut(t) {
    return 1 - Math.pow(1 - t, 3);
}

function useCounter(initialValue) {
    const from = useRef(initialValue);
    const to =  useRef(initialValue);
    const [value, setValue] = useState(initialValue);
    const [status, setStatus] = useState('idle');
    const requestRef = useRef();

    function startCounting() {
        const L = from.current, R = to.current;
        const len = Math.abs(L - R) + 1;
        setStatus(L <= R ? 'increase' : 'decrease');

        const startTime = performance.now();
        const duration = 1500; // 1 second

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = elapsed / duration;
            const easedProgress = easeOut(progress);

            if (progress < 1) {
                const newVal = L <= R ? Math.floor(easedProgress * len) + L : L - Math.floor(easedProgress * len);

                setValue(newVal);
                requestRef.current = requestAnimationFrame(updateCounter);
            } else {
                setValue(R);
                from.current = R;
                setStatus('idle');
            }
        }

        requestRef.current = requestAnimationFrame(updateCounter);
    }

    function increment(v) {
        if (status !== 'idle') {
            return;
        }

        to.current = from.current + v;
        startCounting();
    }

    function decrement(v) {
        increment(-v);
    }

    return {
        value,
        increment,
        decrement,
        status
    }
}

function App() {

    const [loaded, setLoaded] = useState(false);
    const [point, setPoint] = useState(10);
    const [score, setScore] = useState([0, 0, 0, 0, 0]);
    const [teamName, setTeamName] = useState(["Team 1", "Team 2", "Team 3", "Team 4", "Team 5"]);
    // const [showingScore, setShowingScore] = useState([0, 0, 0, 0, 0]);
    const showingScore = [useCounter(0), useCounter(0), useCounter(0), useCounter(0), useCounter(0)];
    const refs = [useRef(), useRef(), useRef(), useRef(), useRef()];
    const teamBox = [useRef(), useRef(), useRef(), useRef(), useRef()];
    const confettis = [useState(false), useState(false), useState(false), useState(false), useState(false)];

    const ACSound = new Audio('correct.mp3');

    const nameChange = (e) => {
        const t = [...teamName];
        t[Number(e.target.name)] = e.target.value;
        setTeamName(t);
    }

    const valueInput = (e) => {
        const s = [...score];
        s[Number(e.target.name)] = Number(e.target.value);
        setScore(s);
    }

    const manualInput = (e) => {
        e.preventDefault();
        e.target.reset();
        const from = showingScore[e.target.id].value;
        if (from < score[e.target.id]) {
            playUp(e.target.id);
            showingScore[e.target.id].increment(score[e.target.id] - from);
        }
        else {
            playDown(e.target.id);
            showingScore[e.target.id].decrement(from - score[e.target.id]);
        }
    }

    const batchUpdate = () => {
        showingScore.forEach((item, idx) => {
            const from = item.value;
            if (from < score[idx]) {
                ACSound.play();
                playUp(idx);
                item.increment(score[idx] - from);
            }
            else
                item.decrement(from - score[idx]);    
        });
    }

    const playUp = (e) => {
        if (!refs[e].current.classList.contains('increment')) {
            ACSound.play();
            refs[e].current.classList.add('increment');
            setTimeout(() => refs[e].current.classList.remove('increment'), 1500);
            confettis[e][1](true);
            setTimeout(() => confettis[e][1](false), 800);
        }
    }

    const playDown = (e) => {
        if (!refs[e].current.classList.contains('decrement')) {
            refs[e].current.classList.add('decrement');
            setTimeout(() => refs[e].current.classList.remove('decrement'), 1500);
        }
    }

    const getEl = (e) => {
        const el = teamBox[e].current.getBoundingClientRect();
        return { x: el.x, y: el.y, w: el.width, h: el.height };
    }

    useEffect(() => {
        setLoaded(true);
    }, []);

    return (
        <div className='h-screen w-screen mx-auto flex flex-col items-center justify-center'>
            <div className='flex flex-col items-center h-full w-full'>
                <div className='w-full flex justify-between h-5/6'>
                    <div className='p-2 flex flex-col place-items-center justify-end'>
                        <button type='button' className="w-full focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Finish</button>
                        <label>Score Round</label>
                        <input onChange={(e) => setPoint(Number(e.target.value))} value={10} className='w-20 h-10 text-xl text-center text-black' type='number' />
                    </div>
                    <div className='aspect-video w-10/12 p-7 bg-white flex flex-col justify-evenly'>
                        <div className='flex justify-around'>
                            <div className='font-semibold flex flex-col items-center' ref={teamBox[0]}>
                                <p className='text-gray-600'>
                                    {teamName[0]}
                                </p>
                                {loaded && <Confetti
                                    recycle={confettis[0][0]}
                                    numberOfPieces={130}
                                    friction={0.97}
                                    gravity={0.15}
                                    confettiSource={{
                                        w: getEl(0).w,
                                        h: getEl(0).h,
                                        x: getEl(0).x,
                                        y: getEl(0).y
                                    }}
                                />}
                                <div className="relative px-24 py-12 max-w-sm bg-white border-b-4 border-t border-l border-r border-b-red-500 border-red-300 rounded-lg shadow flex flex-col justify-center">
                                    <div className='h-10 w-full left-0 top-0 rounded-t absolute bg-red-500'></div>
                                    <div className='w-10 flex flex-col items-center'>
                                        <p ref={refs[0]} className={`mb-2 text-6xl font-bold tracking text-gray-600 pt-5 counter-box`}>{showingScore[0].value}</p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className='font-semibold flex flex-col items-center' ref={teamBox[1]}>
                                    <p className='text-gray-600'>
                                        {teamName[1]}
                                    </p>
                                    {loaded && <Confetti
                                        recycle={confettis[1][0]}
                                        numberOfPieces={130}
                                        friction={0.97}
                                        gravity={0.15}
                                        confettiSource={{
                                            w: getEl(1).w,
                                            h: getEl(1).h,
                                            x: getEl(1).x,
                                            y: getEl(1).y
                                        }}
                                    />}
                                    <div className="relative px-24 py-12 max-w-sm bg-white border-b-4 border-t border-l border-r border-b-blue-500 border-blue-300 rounded-lg shadow flex flex-col justify-center">
                                        <div className='h-10 w-full left-0 top-0 rounded-t absolute bg-blue-500'></div>
                                        <div className='w-10 flex flex-col items-center'>
                                            <p ref={refs[1]} className="mb-2 text-6xl font-bold tracking-tight text-gray-600 pt-5">{showingScore[1].value}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className='font-semibold flex flex-col items-center' ref={teamBox[2]}>
                                    <p className='text-gray-600'>
                                        {teamName[2]}
                                    </p>
                                    {loaded && <Confetti
                                        recycle={confettis[2][0]}
                                        numberOfPieces={130}
                                        friction={0.97}
                                        gravity={0.15}
                                        confettiSource={{
                                            w: getEl(2).w,
                                            h: getEl(2).h,
                                            x: getEl(2).x,
                                            y: getEl(2).y
                                        }}
                                    />}
                                    <div className="relative px-24 py-12 max-w-sm bg-white border-b-4 border-t border-l border-r border-b-green-500 border-green-300 rounded-lg shadow flex flex-col justify-center">
                                        <div className='h-10 w-full left-0 top-0 rounded-t absolute bg-green-500'></div>
                                        <div className='w-10 flex flex-col items-center'>
                                            <p ref={refs[2]} className="mb-2 text-6xl font-bold tracking-tight text-gray-600 pt-5">{showingScore[2].value}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='flex justify-evenly'>
                            <div className='font-semibold flex flex-col items-center' ref={teamBox[3]}>
                                <p className='text-gray-600'>
                                    {teamName[3]}
                                </p>
                                {loaded && <Confetti
                                    recycle={confettis[3][0]}
                                    numberOfPieces={130}
                                    friction={0.97}
                                    gravity={0.15}
                                    confettiSource={{
                                        w: getEl(3).w,
                                        h: getEl(3).h,
                                        x: getEl(3).x,
                                        y: getEl(3).y
                                    }}
                                />}
                                <div className="relative px-24 py-12 max-w-sm bg-white border-b-4 border-t border-l border-r border-b-yellow-500 border-yellow-300 rounded-lg shadow flex flex-col justify-center">
                                    <div className='h-10 w-full left-0 top-0 rounded-t absolute bg-yellow-500'></div>
                                    <div className='w-10 flex flex-col items-center'>
                                        <p ref={refs[3]} className="mb-2 text-6xl font-bold tracking-tight text-gray-600 pt-5">{showingScore[3].value}</p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className='font-semibold flex flex-col items-center' ref={teamBox[4]}>
                                    <p className='text-gray-600'>
                                        {teamName[4]}
                                    </p>
                                    {loaded && <Confetti
                                        recycle={confettis[4][0]}
                                        numberOfPieces={130}
                                        friction={0.97}
                                        gravity={0.15}
                                        confettiSource={{
                                            w: getEl(4).w,
                                            h: getEl(4).h,
                                            x: getEl(4).x,
                                            y: getEl(4).y
                                        }}
                                    />}
                                    <div className="relative px-24 py-12 max-w-sm bg-white border-b-4 border-t border-l border-r border-b-purple-500 border-purple-300 rounded-lg shadow flex flex-col justify-center">
                                        <div className='h-10 w-full left-0 top-0 rounded-t absolute bg-purple-500'></div>
                                        <div className='w-10 flex flex-col items-center'>
                                            <p ref={refs[4]} className="mb-2 text-6xl font-bold tracking-tight text-gray-600 pt-5">{showingScore[4].value}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='p-2 flex flex-col items-center justify-end'>
                        <button onClick={() => batchUpdate()} type='button' className='className="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"'>All Update</button>
                    </div>
                </div>
                <div className='flex items-center justify-around w-full pt-2 gap-3'>
                    <div className='flex flex-col items-center gap-2 border-2 border-orange-500 p-2'>
                        <div className='flex items-center gap-2 w-full'>
                            <p className='w-36'>Team Name</p>
                            <input value={"Team 1"} type='text' className='w-full h-full p-1.5 rounded-lg text-black text-center' name="0" onChange={nameChange} />
                        </div>
                        <div className='flex items-center gap-4'>
                            <button onClick={() => { showingScore[0].increment(point); playUp(0); }} type="button" className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">+</button>
                            <button onClick={() => { showingScore[0].decrement(point); playDown(0); }} type="button" className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-3.5 py-1.5 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">-</button>
                            <form onSubmit={manualInput} className='h-full w-full flex gap-2' id='0'>
                                <input type='number' className='w-16 h-full p-1.5 rounded-lg text-black text-center' name='0' onChange={valueInput} />
                                <button type="submit" className="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">OK</button>
                            </form>
                        </div>
                    </div>
                    <div className='flex flex-col items-center gap-2 border-2 border-orange-500 p-2'>
                        <div className='flex items-center gap-2 w-full'>
                            <p className='w-36'>Team Name</p>
                            <input value={"Team 2"} type='text' className='w-full h-full p-1.5 rounded-lg text-black text-center' name="1" onChange={nameChange} />
                        </div>
                        <div className='flex items-center gap-4'>
                            <button onClick={() => { showingScore[1].increment(point); playUp(1); } } type="button" className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">+</button>
                            <button onClick={() => { showingScore[1].decrement(point); playDown(1); }} type="button" className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-3.5 py-1.5 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">-</button>
                            <form onSubmit={manualInput} className='h-full w-full flex gap-2' id='1'>
                                <input type='number' className='w-16 h-full p-1.5 rounded-lg text-black text-center' name='1' onChange={valueInput} />
                                <button type="submit" className="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">OK</button>
                            </form>
                        </div>
                    </div>
                    <div className='flex flex-col items-center gap-2 border-2 border-orange-500 p-2'>
                        <div className='flex items-center gap-2 w-full'>
                            <p className='w-36'>Team Name</p>
                            <input value={"Team 3"} type='text' className='w-full h-full p-1.5 rounded-lg text-black text-center' name="2" onChange={nameChange} />
                        </div>
                        <div className='flex items-center gap-4'>
                            <button onClick={() => { showingScore[2].increment(point); playUp(2); }} type="button" className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">+</button>
                            <button onClick={() => { showingScore[2].decrement(point); playDown(2); }} type="button" className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-3.5 py-1.5 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">-</button>
                            <form onSubmit={manualInput} className='h-full w-full flex gap-2' id='2'>
                                <input type='number' className='w-16 h-full p-1.5 rounded-lg text-black text-center' name='2' onChange={valueInput} />
                                <button type="submit" className="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">OK</button>
                            </form>
                        </div>
                    </div>
                    <div className='flex flex-col items-center gap-2 border-2 border-orange-500 p-2'>
                        <div className='flex items-center gap-2 w-full'>
                            <p className='w-36'>Team Name</p>
                            <input value={"Team 4"} type='text' className='w-full h-full p-1.5 rounded-lg text-black text-center' name="3" onChange={nameChange} />
                        </div>
                        <div className='flex items-center gap-4'>
                            <button onClick={() => { showingScore[3].increment(point); playUp(3); }} type="button" className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">+</button>
                            <button onClick={() => { showingScore[3].decrement(point); playDown(3); }} type="button" className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-3.5 py-1.5 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">-</button>
                            <form onSubmit={manualInput} className='h-full w-full flex gap-2' id='3'>
                                <input type='number' className='w-16 h-full p-1.5 rounded-lg text-black text-center' name='3' onChange={valueInput} />
                                <button type="submit" className="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">OK</button>
                            </form>
                        </div>
                    </div>
                    <div className='flex flex-col items-center gap-2 border-2 border-orange-500 p-2'>
                        <div className='flex items-center gap-2 w-full'>
                            <p className='w-36'>Team Name</p>
                            <input value={"Team 5"} type='text' className='w-full h-full p-1.5 rounded-lg text-black text-center' name="4" onChange={nameChange} />
                        </div>
                        <div className='flex items-center gap-4'>
                            <button onClick={() => { showingScore[4].increment(point); playUp(4); } } type="button" className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">+</button>
                            <button onClick={() => { showingScore[4].decrement(point); playDown(4); } } type="button" className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-3.5 py-1.5 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">-</button>
                            <form onSubmit={manualInput} className='h-full w-full flex gap-2' id='4'>
                                <input type='number' className='w-16 h-full p-1.5 rounded-lg text-black text-center' name='4' onChange={valueInput} />
                                <button type="submit" className="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">OK</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default App
