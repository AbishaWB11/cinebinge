import { Bookmark, LogOut } from "lucide-react";
function Header({ openWatchlist, isOpen, onLogout, goHome }) {
    return (
        <div className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 py-4 bg-black/30 backdrop-blur-md border-b border-white/10 shadow-lg">

            <h1
                onClick={goHome}
                className="relative text-2xl font-bold text-white cursor-pointer"
            >
                <span className="absolute inset-0 blur-lg opacity-40 bg-gradient-to-r from-blue-600 to-purple-700"></span>
                <span className="relative">CineBinge</span>
            </h1>
            <div className="flex gap-4 items-center">

                <button
                    onClick={openWatchlist}
                    className={`flex items-center justify-center px-4 py-2 rounded-lg transition font-medium
                    ${isOpen
                            ? "bg-gradient-to-r from-blue-600 to-purple-700 shadow-lg"
                            : "bg-white/10 hover:bg-white/20"
                        }`}
                >
                    <span className="sm:hidden">
                        <Bookmark size={20} />
    
                    </span>
                    <span className="hidden sm:inline">Watchlist</span>
                </button>

                <button
                    onClick={onLogout}
                    className="flex items-center justify-center px-4 py-2 rounded-lg bg-red-500/80 hover:bg-red-600 transition"
                >
                    <span className="sm:hidden">
                        <LogOut size={20} />
                    </span>
                    <span className="hidden sm:inline">Logout</span>
                </button>

            </div>
        </div>
    );
}

export default Header;