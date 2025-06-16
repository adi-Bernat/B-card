import { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "flowbite-react";
import { ToastContainer, toast } from "react-toastify";
import { FiPhone, FiMapPin } from "react-icons/fi";
import "react-toastify/dist/ReactToastify.css";
import { Ncards } from "../home/Ncards";
import { AiFillHeart } from "react-icons/ai";

const Favorites = () => {
    const [favoriteCards, setFavoriteCards] = useState<Ncards[]>([]);
    const [userId, setUserId] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const loggedIn = !!token;
        setIsLoggedIn(loggedIn);

        if (!loggedIn) {
            toast.error("יש להתחבר כדי לצפות באהובים");
            return;
        }

        if (token) {
            try {
                const tokenPayload = JSON.parse(atob(token.split('.')[1]));
                const userIdFromToken = tokenPayload._id || tokenPayload.id;
                setUserId(userIdFromToken);
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (err) {
                toast.error("שגיאה בפענוח הטוקן");
                return;
            }
        }

        const fetchFavoriteCards = async () => {
            try {
                const response = await axios.get<Ncards[]>(
                    "https://monkfish-app-z9uza.ondigitalocean.app/bcard2/cards"
                );

                const userLiked = response.data.filter(card =>
                    card.likes &&
                    Array.isArray(card.likes) &&
                    card.likes.some(like =>
                        (typeof like === 'string' && like === userId) ||
                        (typeof like === 'object' && (like._id === userId || like.id === userId))
                    )
                );

                setFavoriteCards(userLiked);
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error) {
                toast.error("שגיאה בטעינת הכרטיסים");
            }
        };

        if (userId) {
            fetchFavoriteCards();
        }
    }, [userId]);

    if (!isLoggedIn) {
        return <div className="text-center mt-10 text-xl text-red-500">יש להתחבר כדי לראות כרטיסים אהובים</div>;
    }

    return (
        <div className="flex flex-wrap justify-center gap-6 p-6 bg-yellow-50 dark:bg-gray-800 min-h-screen">
            {favoriteCards.length === 0 ? (
                <p className="text-gray-700 dark:text-white text-xl">אין כרטיסים אהובים עדיין.</p>
            ) : (
                favoriteCards.map((card) => (
                    <Card
                        key={card._id}
                        className="w-80 bg-white dark:bg-gray-900 rounded-lg shadow-md relative"
                    >
                        <button className="absolute top-2 right-2 text-2xl z-10" disabled>
                            <AiFillHeart className="text-red-600" />
                        </button>
                        <div className="w-full h-48 overflow-hidden rounded-t-lg">
                            <img
                                src={card.image.url}
                                alt={card.image.alt || card.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="p-4 flex flex-col justify-between h-40">
                            <h5 className="text-xl font-semibold text-gray-900 dark:text-white truncate">
                                {card.title}
                            </h5>
                            <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-400 mt-1">
                                <FiPhone className="text-lg" />
                                {card.phone}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-400">
                                <FiMapPin className="text-lg" />
                                {card.address.country}
                            </div>
                        </div>
                    </Card>
                ))
            )}
            <ToastContainer />
        </div>
    );
};

export default Favorites;
