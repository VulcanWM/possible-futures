import { useState, useEffect } from 'react'
import { lifeFutures, type Future } from "./lifeFutures.ts"

type FutureRoom = { [key: string]: Future }

function App() {
    const [page, setPage] = useState<'start' | 'game' | 'end'>("start")
    const [currentRoom, setCurrentRoom] = useState<string>("C3")
    const [doorFutures, setDoorFutures] = useState<FutureRoom>({})
    const [survivalPoints, setSurvivalPoints] = useState<number>(0)
    const [futurePoints, setFuturePoints] = useState<number>(0)
    const [exit, setExit] = useState<string>("")
    const [msg, setMsg] = useState<string>("")
    const [round, setRound] = useState<number>(0)
    const [endMessage, setEndMessage] = useState<string>("")
    const [highscore, setHighscore] = useState<number>(0)

    const letters = ['A', 'B', 'C', 'D', 'E']
    const directions = ["north", "south", "east", "west"]
    const corners = ['A1', 'A5', 'E1', 'E5']

    // Load highscore from localStorage when app mounts
    useEffect(() => {
        const storedHighscore = localStorage.getItem("futureHighscore")
        if (storedHighscore) setHighscore(parseInt(storedHighscore))
    }, [])

    function updateHighscore(points: number) {
        if (points > highscore) {
            setHighscore(points)
            localStorage.setItem("futureHighscore", points.toString())
        }
    }

    function roomChange(room: string, isFirstMove = false, roundNumber?: number) {
        setCurrentRoom(room)
        const newRound = roundNumber !== undefined ? roundNumber : round + 1
        setRound(newRound)

        if (!isFirstMove && Object.keys(doorFutures).length !== 0) {
            const survivalRanges = [1, 1, 1, 1, 1, 2, 2, 2, 3, 3, 4, 4, 7]
            const survival = survivalRanges[Math.floor(Math.random() * survivalRanges.length)]

            const futureValue = doorFutures[room]?.value ?? 0
            setSurvivalPoints(prev => prev - survival)
            setFuturePoints(prev => prev + futureValue)
            setMsg(`You lost ${survival} survival points and gained ${futureValue} future points.`)

            if (survivalPoints - survival <= 0) {
                setPage("end")
                setDoorFutures({})
                setEndMessage("You died because you lost all your survival points")
                return
            }
        }

        if (newRound > 15) {
            setPage("end")
            setDoorFutures({})
            setEndMessage("You died because you ran out of rounds.")
            return
        }

        if (room === exit) {
            setPage("end")
            setDoorFutures({})
            setEndMessage("You won!")
            updateHighscore(futurePoints)
            return
        }

        const newDoorFutures: FutureRoom = {}
        for (const direction of directions) {
            const adj = getAdjacentRoom(room, direction)
            if (adj !== "X") {
                newDoorFutures[adj] = lifeFutures[Math.floor(Math.random() * lifeFutures.length)]
            }
        }
        setDoorFutures(newDoorFutures)
    }

    function gameStart() {
        setSurvivalPoints(15)
        setFuturePoints(10)
        setRound(0)
        setMsg("")
        setEndMessage("")
        const newExit = corners[Math.floor(Math.random() * corners.length)]
        setExit(newExit)
        setDoorFutures({})
        setPage("game")
        roomChange("C3", true, 1)
    }

    function handleRoomClick(room: string) {
        roomChange(room)
    }

    function getAdjacentRoom(current: string, dir: string) {
        const row = letters.indexOf(current[0])
        const col = parseInt(current[1])

        let newRow = row
        let newCol = col

        if (dir === "north") newRow -= 1
        if (dir === "south") newRow += 1
        if (dir === "west") newCol -= 1
        if (dir === "east") newCol += 1

        if (newRow < 0 || newRow >= letters.length || newCol < 1 || newCol > 5) return "X"
        return letters[newRow] + newCol
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col items-center p-4">
            {/* START PAGE */}
            {page === "start" &&
                <div className="bg-gray-800 rounded-xl p-8 shadow-xl max-w-lg w-full text-center flex flex-col justify-between min-h-[60vh]">
                    <h1 className="text-4xl font-extrabold mb-6 text-orange-400">Welcome to Possible Futures</h1>
                    <div className="text-left mb-4 bg-gray-700 p-4 rounded-lg space-y-2 flex-1">
                        <p className="font-semibold text-lg mb-2">Instructions:</p>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                            <li>You start in room C3 with 15 survival points and 10 future points.</li>
                            <li>Each move may cost survival points but earns future points.</li>
                            <li>Reach the exit before running out of rounds or survival points to win.</li>
                            <li>See adjacent rooms and their possible outcomes before moving.</li>
                            <li>Plan your path carefully!</li>
                        </ul>
                    </div>
                    <p className="mb-4 text-yellow-400 font-bold text-lg">Highscore: {highscore} Future Points</p>
                    <button
                        onClick={gameStart}
                        className="px-8 py-3 bg-orange-500 hover:bg-orange-600 rounded-lg font-bold text-lg transition-all shadow-md"
                    >
                        Start Game
                    </button>
                </div>
            }

            {/* GAME PAGE */}
            {page === "game" &&
                <div className="w-full max-w-4xl flex flex-col justify-between min-h-screen">
                    {/* Top menu / stats */}
                    <div className="flex flex-col items-center gap-2 mb-4">
                        <div className="flex justify-center gap-6">
                            <div className="bg-gray-700 px-4 py-2 rounded shadow">
                                Round: <span className="text-orange-400 font-bold">{round}</span>
                            </div>
                            <div className="bg-gray-700 px-4 py-2 rounded shadow">
                                Survival Points: <span className="text-orange-400 font-bold">{survivalPoints}</span>
                            </div>
                            <div className="bg-gray-700 px-4 py-2 rounded shadow">
                                Future Points: <span className="text-orange-400 font-bold">{futurePoints}</span>
                            </div>
                        </div>

                        {/* Message below points */}
                        {msg && <p className="text-center text-red-400 font-semibold mt-2">{msg}</p>}
                    </div>

                    {/* Center content */}
                    <div className="relative flex flex-col items-center justify-center flex-1">
                        {/* Mini-grid top-right */}
                        <div className="absolute top-0 right-0 m-4">
                            <div className="grid grid-cols-5 gap-2 p-2 bg-gray-700 rounded shadow-lg">
                                {Array.from({ length: 25 }).map((_, i) => {
                                    const row = Math.floor(i / 5)
                                    const col = (i % 5) + 1
                                    const roomName = letters[row] + col
                                    return (
                                        <div
                                            key={i}
                                            className={`flex items-center justify-center h-5 w-5 border rounded-md text-xs
                                                ${roomName === currentRoom ? "bg-orange-400 text-black font-bold" : "border-gray-500"}`}
                                        >
                                            {roomName}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Big room */}
                        <div className="relative w-64 h-64 bg-gray-900 border-4 border-gray-700 rounded-xl shadow-lg flex items-center justify-center">
                            {/* North */}
                            {getAdjacentRoom(currentRoom, "north") !== "X" &&
                                (() => {
                                    const northRoom = getAdjacentRoom(currentRoom, "north")
                                    return (
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full flex flex-col items-center gap-1">
                                            <div className="bg-gray-700 text-white text-xs px-2 py-1 rounded shadow w-24 text-center">
                                                {doorFutures[northRoom]?.description}
                                            </div>
                                            <div
                                                className="w-16 h-8 bg-red-500 flex items-center justify-center rounded-lg cursor-pointer text-xs
           transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 hover:rotate-3 hover:shadow-xl"
                                                onClick={() => handleRoomClick(northRoom)}
                                            >
                                                {northRoom}
                                            </div>
                                        </div>
                                    )
                                })()
                            }

                            {/* East */}
                            {getAdjacentRoom(currentRoom, "east") !== "X" &&
                                (() => {
                                    const eastRoom = getAdjacentRoom(currentRoom, "east")
                                    return (
                                        <div className="absolute top-1/2 right-0 translate-x-full -translate-y-1/2 flex flex-row items-center gap-2">
                                            <div
                                                className="w-8 h-16 bg-green-500 flex items-center justify-center rounded-lg cursor-pointer text-xs rotate-90
           transition-all duration-300 transform hover:scale-110 hover:translate-x-1 hover:rotate-3 hover:shadow-xl"
                                                onClick={() => handleRoomClick(eastRoom)}
                                            >
                                                {eastRoom}
                                            </div>
                                            <div className="bg-gray-700 text-white text-xs px-2 py-1 rounded shadow w-24 ml-2">
                                                {doorFutures[eastRoom]?.description}
                                            </div>
                                        </div>
                                    )
                                })()
                            }

                            {/* South */}
                            {getAdjacentRoom(currentRoom, "south") !== "X" &&
                                (() => {
                                    const southRoom = getAdjacentRoom(currentRoom, "south")
                                    return (
                                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full flex flex-col items-center gap-1">
                                            <div
                                                className="w-16 h-8 bg-blue-500 flex items-center justify-center rounded-lg cursor-pointer text-xs
           transition-all duration-300 transform hover:scale-110 hover:translate-y-1 hover:-rotate-3 hover:shadow-xl"
                                                onClick={() => handleRoomClick(southRoom)}
                                            >
                                                {southRoom}
                                            </div>
                                            <div className="bg-gray-700 text-white text-xs px-2 py-1 rounded shadow w-24 text-center">
                                                {doorFutures[southRoom]?.description}
                                            </div>
                                        </div>
                                    )
                                })()
                            }

                            {/* West */}
                            {getAdjacentRoom(currentRoom, "west") !== "X" &&
                                (() => {
                                    const westRoom = getAdjacentRoom(currentRoom, "west")
                                    return (
                                        <div className="absolute top-1/2 left-0 -translate-x-full -translate-y-1/2 flex flex-row items-center gap-2">
                                            <div className="bg-gray-700 text-white text-xs px-2 py-1 rounded shadow w-24 mr-2 text-right">
                                                {doorFutures[westRoom]?.description}
                                            </div>
                                            <div
                                                className="w-8 h-16 bg-yellow-500 flex items-center justify-center rounded-lg cursor-pointer text-xs -rotate-90
           transition-all duration-300 transform hover:scale-110 hover:-translate-x-1 hover:-rotate-3 hover:shadow-xl"
                                                onClick={() => handleRoomClick(westRoom)}
                                            >
                                                {westRoom}
                                            </div>
                                        </div>
                                    )
                                })()
                            }

                            <div className="text-2xl font-extrabold text-orange-400">{currentRoom}</div>
                        </div>
                    </div>

                    {/* Bottom button */}
                    <button
                        onClick={() => setPage("end")}
                        className="mt-6 px-6 py-3 bg-red-500 hover:bg-red-600 rounded-lg font-bold shadow-lg transition"
                    >
                        End Game
                    </button>
                </div>
            }

            {/* END PAGE */}
            {page === "end" &&
                <div
                    className={`rounded-xl p-8 shadow-xl max-w-md w-full text-center flex flex-col justify-between min-h-[50vh]
            ${endMessage === "You won!" ? "bg-green-800 text-green-100" : "bg-red-800 text-red-100"}`}
                >
                    <h1 className="text-4xl font-bold mb-4">
                        {endMessage === "You won!" ? "Victory!" : "Game Over"}
                    </h1>

                    <div className="mb-6 space-y-2">
                        <p>Rounds Played: <span className="font-bold text-orange-400">{round}</span></p>
                        <p>Survival Points Remaining: <span className="font-bold text-orange-400">{survivalPoints > 0 ? survivalPoints : 0}</span></p>
                        <p>Future Points Earned: <span className="font-bold text-orange-400">{futurePoints}</span></p>
                        <p>Highscore: <span className="font-bold text-yellow-400">{highscore}</span></p>
                    </div>

                    <button
                        onClick={gameStart}
                        className={`px-8 py-3 rounded-lg font-bold text-lg transition-all shadow-md
                ${endMessage === "You won!" ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}`}
                    >
                        Play Again
                    </button>
                </div>
            }
        </div>
    )
}

export default App