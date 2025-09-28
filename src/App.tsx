import { useState } from 'react'
import './App.css'

function App() {
    const [page, setPage] = useState<'start' | 'game' | 'end'>("start")
    const [currentRoom, setCurrentRoom] = useState<string>("C3")
    const letters = ['A', 'B', 'C', 'D', 'E']

    function handleRoomClick(room: string) {
        console.log(room)
    }

    function getAdjacentRoom(current: string, dir: "north" | "south" | "east" | "west") {
        const letters = ['A', 'B', 'C', 'D', 'E'];
        const row = letters.indexOf(current[0]);
        const col = parseInt(current[1]);

        let newRow = row;
        let newCol = col;

        if (dir === "north") newRow -= 1;
        if (dir === "south") newRow += 1;
        if (dir === "west") newCol -= 1;
        if (dir === "east") newCol += 1;

        if (newRow < 0 || newRow >= letters.length || newCol < 1 || newCol > 5) {
            return "X"; // no room in that direction
        }
        return letters[newRow] + newCol;
    }

    return (
        <>
            {page == "start" &&
                <>
                    <h1>Start</h1>
                    <button onClick={() => setPage("game")}>Start Game</button>
                </>
            }
            {page == "game" &&
                <>
                    <h1 className="text-center text-2xl font-bold mb-4">Game</h1>

                    {/* Mini grid in top-right */}
                    <div className="absolute top-4 right-4">
                        <div className="grid grid-cols-5 gap-2 p-4">
                            {Array.from({ length: 25 }).map((_, i) => {
                                const row = Math.floor(i / 5);
                                const col = (i % 5) + 1;
                                const roomName = letters[row] + col;

                                return (
                                    <div
                                        key={i}
                                        className={`flex items-center justify-center h-6 w-6 border-2 border-orange-500 rounded-md
              ${roomName == currentRoom ? "bg-white text-black" : ""}`}
                                    >
                                        {roomName}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Big room in the middle */}
                    <div className="flex justify-center items-center h-screen">
                        <div className="relative w-80 h-80 bg-gray-900 border-4 border-gray-700 rounded-lg">

                            {/* Top (North) */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full flex flex-col items-center gap-2">
                                <div className="bg-gray-800 text-white text-sm px-3 py-1 rounded shadow w-32 text-center">
                                    A dark hallway stretches north...
                                </div>
                                <div
                                    className="w-20 h-10 bg-red-500 flex items-center justify-center text-white rounded cursor-pointer"
                                    onClick={() => handleRoomClick(getAdjacentRoom(currentRoom, "north"))}
                                >
                                    {getAdjacentRoom(currentRoom, "north")}
                                </div>
                            </div>

                            {/* Right (East) */}
                            <div className="absolute top-1/2 right-0 translate-x-full -translate-y-1/2 flex flex-row items-center gap-2">
                                <div
                                    className="w-10 h-20 bg-green-500 flex items-center justify-center text-white rounded rotate-90 cursor-pointer"
                                    onClick={() => handleRoomClick(getAdjacentRoom(currentRoom, "east"))}
                                >
                                    {getAdjacentRoom(currentRoom, "east")}
                                </div>
                                <div className="bg-gray-800 text-white text-sm px-3 py-1 rounded shadow w-32">
                                    A faint glow shines from the east...
                                </div>
                            </div>

                            {/* Bottom (South) */}
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full flex flex-col items-center gap-2">
                                <div
                                    className="w-20 h-10 bg-blue-500 flex items-center justify-center text-white rounded cursor-pointer"
                                    onClick={() => handleRoomClick(getAdjacentRoom(currentRoom, "south"))}
                                >
                                    {getAdjacentRoom(currentRoom, "south")}
                                </div>
                                <div className="bg-gray-800 text-white text-sm px-3 py-1 rounded shadow w-32 text-center">
                                    You hear dripping water below...
                                </div>
                            </div>

                            {/* Left (West) */}
                            <div className="absolute top-1/2 left-0 -translate-x-full -translate-y-1/2 flex flex-row items-center gap-2">
                                <div className="bg-gray-800 text-white text-sm px-3 py-1 rounded shadow w-32 text-right">
                                    A cold draft comes from the west...
                                </div>
                                <div
                                    className="w-10 h-20 bg-yellow-500 flex items-center justify-center text-white rounded -rotate-90 cursor-pointer"
                                    onClick={() => handleRoomClick(getAdjacentRoom(currentRoom, "west"))}
                                >
                                    {getAdjacentRoom(currentRoom, "west")}
                                </div>
                            </div>

                            {/* Room name in the centre */}
                            <div className="flex items-center justify-center h-full text-white text-3xl font-bold">
                                {currentRoom}
                            </div>
                        </div>
                    </div>

                    <div className="text-center mt-4">
                        <button onClick={() => setPage("end")}
                                className="px-4 py-2 bg-orange-500 text-white rounded-lg">
                            End Game
                        </button>
                    </div>
                </>
            }
            {page == "end" &&
                <>
                    <h1>End</h1>
                    <button onClick={() => setPage("game")}>Start Game</button>
                </>
            }
        </>
    )
}

export default App