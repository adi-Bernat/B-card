import { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "flowbite-react";
import { toast, ToastContainer } from "react-toastify";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { FiPhone, FiMapPin } from "react-icons/fi";
import "react-toastify/dist/ReactToastify.css";
import { Ncards, LikeUser } from "./Ncards";
import { Link, useLocation } from "react-router-dom";

export const Home = () => {
    const [cards, setCards] = useState<Ncards[]>([]);
    const [likedCards, setLikedCards] = useState<string[]>([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get("q")?.toLowerCase() || "";

    const getCards = async () => {
        try {
            const response = await axios.get<Ncards[]>(
                "https://monkfish-app-z9uza.ondigitalocean.app/bcard2/cards"
            );
            setCards(response.data);

            if (isLoggedIn && userId) {
                const userLikedCards = response.data
                    .filter((card) =>
                        card.likes?.some((like) => {
                            if (typeof like === "string") return like === userId;
                            if (typeof like === "object")
                                return like._id === userId || like.id === userId;
                            return false;
                        })
                    )
                    .map((card) => card._id);

                setLikedCards(userLikedCards);
                localStorage.setItem("likedCards", JSON.stringify(userLikedCards));
            }
        } catch (error) {
            toast.error("שגיאה בקבלת כרטיסים");
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        const loggedIn = !!token;
        setIsLoggedIn(loggedIn);

        if (token) {
            try {
                const tokenPayload = JSON.parse(atob(token.split(".")[1]));
                const userIdFromToken = tokenPayload._id || tokenPayload.id;
                setUserId(userIdFromToken);
            } catch (error) {
                console.error("Failed to decode token:", error);
            }
        }

        getCards();
    }, []);

  const filteredCards = cards.filter((card) => {
  if (!query) return true;

  return (
    (card.title ?? "").toLowerCase().includes(query) ||
    (card.phone ?? "").toLowerCase().includes(query) ||
    (card.address?.country ?? "").toLowerCase().includes(query) ||
    (card.address?.city ?? "").toLowerCase().includes(query) ||
    (card.address?.street ?? "").toLowerCase().includes(query)
  );
});

    const toggleLike = async (cardId: string) => {
        if (!isLoggedIn) {
            toast.info("יש להתחבר כדי לסמן כרטיסים כאהובים");
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("לא נמצא טוקן. אנא התחבר מחדש.");
            return;
        }

        try {
            const response = await axios.patch(
                `https://monkfish-app-z9uza.ondigitalocean.app/bcard2/cards/${cardId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "x-auth-token": token,
                    },
                    timeout: 10000,
                }
            );

            const updatedCard = response.data;
            const isNowLiked = updatedCard.likes?.some((like: string | LikeUser) => {
                if (typeof like === "string") return like === userId;
                if (typeof like === "object") return like._id === userId || like.id === userId;
                return false;
            }) ?? false;

            setLikedCards((prev) => {
                const updated = isNowLiked
                    ? prev.includes(cardId)
                        ? prev
                        : [...prev, cardId]
                    : prev.filter((id) => id !== cardId);

                localStorage.setItem("likedCards", JSON.stringify(updated));
                return updated;
            });

            setCards((prev) => prev.map((card) => (card._id === cardId ? updatedCard : card)));

            toast.success(isNowLiked ? "הכרטיס נוסף למועדפים!" : "הכרטיס הוסר מהמועדפים!");
        } catch (error: any) {
            if (error.response?.status === 401) {
                toast.error("אתה לא מחובר. אנא התחבר שוב.");
            } else {
                toast.error("שגיאה בעדכון הלייק. נסה שוב.");
            }
        }
    };

    return (
        <div className="flex flex-wrap justify-center gap-6 p-6 bg-emerald-100 dark:bg-gray-800 min-h-screen">
            {filteredCards.length === 0 && (
                <p className="text-gray-700 dark:text-gray-300 text-lg">לא נמצאו כרטיסים המתאימים לחיפוש.</p>
            )}

            {filteredCards.map((card) => (
                <Card
                    key={card._id}
                    className="w-80 bg-white dark:bg-gray-900 rounded-lg shadow-md relative"
                >
                    {isLoggedIn && (
                        <button
                            onClick={() => toggleLike(card._id)}
                            className="absolute top-2 right-2 text-2xl z-10 hover:scale-110 transition-transform"
                            title={likedCards.includes(card._id) ? "הסר מהמועדפים" : "הוסף למועדפים"}
                        >
                            {likedCards.includes(card._id) ? (
                                <AiFillHeart className="text-red-600 drop-shadow-lg" />
                            ) : (
                                <AiOutlineHeart className="text-gray-400 hover:text-red-500 transition-colors" />
                            )}
                        </button>
                    )}

                    <div className="w-full h-48 overflow-hidden rounded-t-lg">
                        <img
                            src={card.image?.url ?? "path/to/default-image.jpg"}
                            alt={card.image?.alt ?? card.title ?? "Image"}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="p-4 flex flex-col justify-between h-40">
                        <h5 className="text-xl font-semibold text-gray-900 dark:text-white truncate">
                            {card.title ?? "כותרת לא זמינה"}
                        </h5>

                        <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-400 mt-1">
                            <FiPhone className="text-lg" />
                            {card.phone ?? "-"}
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-400">
                            <FiMapPin className="text-lg" />
                            {card.address?.country ?? "-"}
                        </div>

                        <Link
                            to={`/business/${card._id}`}
                            className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-center text-sm"
                        >
                            לפרטים
                        </Link>
                    </div>
                </Card>
            ))}

            <ToastContainer />
        </div>
    );
};

export default Home;
