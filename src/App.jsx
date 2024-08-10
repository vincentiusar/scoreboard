import { useRef, useState } from 'react';
import './App.css'

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
        const duration = 1000; // 1 second

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

    
    const [score, setScore] = useState([0, 0, 0, 0, 0]);
    const [teamName, setTeamName] = useState(["Team 1", "Team 2", "Team 3", "Team 4", "Team 5"]);
    // const [showingScore, setShowingScore] = useState([0, 0, 0, 0, 0]);
    const showingScore = [0, 0, 0, 0, 0];
    const {value, increment, decrement, status } = useCounter(1);
    const animate = status === 'increase' ? 'animate-green' : status === 'decrease' ? 'animate-red' : '';
    
    const nameChange = (e) => {
        const t = [...teamName];
        t[Number(e.target.name)] = e.target.value;
        setTeamName(t);
    }

    const valueInput = (e) => {
        console.log("val", e.target.value);
        console.log("id", e.target.name);
        const s = [...score];
        s[Number(e.target.name)] = Number(e.target.value);
        setScore(s);
    }

    const manualInput = (e) => {
        console.log(score);
        e.preventDefault();
        console.log(e.target.id);
        const s = [...score];
        setShowingScore(s);
    }

    return (
        <div className='h-screen w-screen mx-auto flex flex-col items-center justify-center'>
            <div className='flex flex-col items-center h-full w-full'>
                <div className='aspect-video w-10/12 border-2 border-yellow-400 p-7 bg-white flex flex-col justify-evenly'>
                    <div className='flex justify-around border border-red-500'>
                        <div className='font-semibold flex flex-col items-center'>
                            <p className='text-gray-600'>
                                {teamName[0]}
                            </p>
                            <div className="relative px-24 py-12 max-w-sm bg-white border-b-4 border-t border-l border-r border-b-red-500 border-red-300 rounded-lg shadow flex flex-col justify-center">
                                <div className='h-10 w-full left-0 top-0 rounded-t absolute bg-red-500'></div>
                                <p className={`mb-2 text-2xl font-bold tracking text-gray-600 pt-5 counter-box ${animate}`}>{value}</p>
                            </div>
                        </div>
                        <div>
                            <div className='font-semibold flex flex-col items-center'>
                                <p className='text-gray-600'>
                                    {teamName[1]}
                                </p>
                                <div className="relative px-24 py-12 max-w-sm bg-white border-b-4 border-t border-l border-r border-b-blue-500 border-blue-300 rounded-lg shadow flex flex-col justify-center">
                                    <div className='h-10 w-full left-0 top-0 rounded-t absolute bg-blue-500'></div>
                                    <p className="mb-2 text-2xl font-bold tracking-tight text-gray-600 pt-5">{showingScore[1]}</p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className='font-semibold flex flex-col items-center'>
                                <p className='text-gray-600'>
                                    {teamName[2]}
                                </p>
                                <div className="relative px-24 py-12 max-w-sm bg-white border-b-4 border-t border-l border-r border-b-green-500 border-green-300 rounded-lg shadow flex flex-col justify-center">
                                    <div className='h-10 w-full left-0 top-0 rounded-t absolute bg-green-500'></div>
                                    <p className="mb-2 text-2xl font-bold tracking-tight text-gray-600 pt-5">{showingScore[2]}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='flex justify-evenly border border-red-500'>
                        <div className='font-semibold flex flex-col items-center'>
                            <p className='text-gray-600'>
                                {teamName[3]}
                            </p>
                            <div className="relative px-24 py-12 max-w-sm bg-white border-b-4 border-t border-l border-r border-b-yellow-500 border-yellow-300 rounded-lg shadow flex flex-col justify-center">
                                <div className='h-10 w-full left-0 top-0 rounded-t absolute bg-yellow-500'></div>
                                <p className="mb-2 text-2xl font-bold tracking-tight text-gray-600 pt-5">{showingScore[3]}</p>
                            </div>
                        </div>
                        <div>
                            <div className='font-semibold flex flex-col items-center'>
                                <p className='text-gray-600'>
                                    {teamName[4]}
                                </p>
                                <div className="relative px-24 py-12 max-w-sm bg-white border-b-4 border-t border-l border-r border-b-purple-500 border-purple-300 rounded-lg shadow flex flex-col justify-center">
                                    <div className='h-10 w-full left-0 top-0 rounded-t absolute bg-purple-500'></div>
                                    <p className="mb-2 text-2xl font-bold tracking-tight text-gray-600 pt-5">{showingScore[4]}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex items-center justify-around w-full pt-2 gap-3'>
                    <div className='flex flex-col items-center gap-2 border-2 border-orange-500 p-2'>
                        <div className='flex items-center gap-2 w-full'>
                            <p className='w-36'>Team Name</p>
                            <input type='text' className='w-full h-full p-1.5 rounded-lg text-black text-center' name="0" onChange={nameChange} />
                        </div>
                        <div className='flex items-center gap-4'>
                            <button onClick={() => increment(10)} type="button" className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">+</button>
                            <button onClick={() => decrement(10)} type="button" className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-3.5 py-1.5 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">-</button>
                            <form onSubmit={manualInput} className='h-full w-full flex gap-2' id='0'>
                                <input type='number' className='w-16 h-full p-1.5 rounded-lg text-black text-center' name='0' onChange={valueInput} />
                                <button type="submit" className="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">OK</button>
                            </form>
                        </div>
                    </div>
                    <div className='flex flex-col items-center gap-2 border-2 border-orange-500 p-2'>
                        <div className='flex items-center gap-2 w-full'>
                            <p className='w-36'>Team Name</p>
                            <input type='text' className='w-full h-full p-1.5 rounded-lg text-black text-center' name="1" onChange={nameChange} />
                        </div>
                        <div className='flex items-center gap-4'>
                            <button type="button" className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">+</button>
                            <button type="button" className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-3.5 py-1.5 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">-</button>
                            <form onSubmit={manualInput} className='h-full w-full flex gap-2' id='1'>
                                <input type='number' className='w-16 h-full p-1.5 rounded-lg text-black text-center' name='1' onChange={valueInput} />
                                <button type="submit" className="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">OK</button>
                            </form>
                        </div>
                    </div>
                    <div className='flex flex-col items-center gap-2 border-2 border-orange-500 p-2'>
                        <div className='flex items-center gap-2 w-full'>
                            <p className='w-36'>Team Name</p>
                            <input type='text' className='w-full h-full p-1.5 rounded-lg text-black text-center' name="2" onChange={nameChange} />
                        </div>
                        <div className='flex items-center gap-4'>
                            <button type="button" className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">+</button>
                            <button type="button" className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-3.5 py-1.5 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">-</button>
                            <form onSubmit={manualInput} className='h-full w-full flex gap-2' id='0'>
                                <input type='number' className='w-16 h-full p-1.5 rounded-lg text-black text-center' name='2' onChange={valueInput} />
                                <button type="submit" className="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">OK</button>
                            </form>
                        </div>
                    </div>
                    <div className='flex flex-col items-center gap-2 border-2 border-orange-500 p-2'>
                        <div className='flex items-center gap-2 w-full'>
                            <p className='w-36'>Team Name</p>
                            <input type='text' className='w-full h-full p-1.5 rounded-lg text-black text-center' name="3" onChange={nameChange} />
                        </div>
                        <div className='flex items-center gap-4'>
                            <button type="button" className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">+</button>
                            <button type="button" className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-3.5 py-1.5 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">-</button>
                            <form onSubmit={manualInput} className='h-full w-full flex gap-2' id='0'>
                                <input type='number' className='w-16 h-full p-1.5 rounded-lg text-black text-center' name='3' onChange={valueInput} />
                                <button type="submit" className="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">OK</button>
                            </form>
                        </div>
                    </div>
                    <div className='flex flex-col items-center gap-2 border-2 border-orange-500 p-2'>
                        <div className='flex items-center gap-2 w-full'>
                            <p className='w-36'>Team Name</p>
                            <input type='text' className='w-full h-full p-1.5 rounded-lg text-black text-center' name="4" onChange={nameChange} />
                        </div>
                        <div className='flex items-center gap-4'>
                            <button type="button" className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">+</button>
                            <button type="button" className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-3.5 py-1.5 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">-</button>
                            <form onSubmit={manualInput} className='h-full w-full flex gap-2' id='0'>
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
