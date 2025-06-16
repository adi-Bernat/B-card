import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Button, Spinner } from 'flowbite-react';
import {
    FaPhone, FaEnvelope, FaGlobe, FaMapMarkerAlt,
    FaHeart, FaRegHeart, FaShare, FaDirections
} from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import { Ncards } from './Ncards';

const BusinessPage = () => {
    const { id } = useParams<{ id: string }>();
    const [card, setCard] = useState<Ncards | null>(null);
    const [loading, setLoading] = useState(true);
    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        const fetchCard = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const headers = token ? {
                    'Authorization': `Bearer ${token}`,
                    'x-auth-token': token
                } : {};

                const res = await axios.get<Ncards>(
                    `https://monkfish-app-z9uza.ondigitalocean.app/bcard2/cards/${id}`,
                    { headers }
                );

                setCard(res.data);

                if (token && res.data.likes) {
                    try {
                        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
                        const userId = tokenPayload._id;
                        setIsLiked(res.data.likes.includes(userId));
                    } catch (error) {
                        console.error('Error parsing token:', error);
                    }
                }
            } catch (err) {
                console.error('Error fetching card:', err);
                toast.error('שגיאה בטעינת פרטי העסק');
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchCard();
    }, [id]);

    const handleLike = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('עליך להתחבר כדי לסמן כמועדף');
                return;
            }

            await axios.patch(
                `https://monkfish-app-z9uza.ondigitalocean.app/bcard2/cards/${id}`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'x-auth-token': token,
                    }
                }
            );

            setIsLiked(!isLiked);
            toast.success(isLiked ? 'הוסר מהמועדפים' : 'נוסף למועדפים');

        } catch (error) {
            console.error('Error toggling like:', error);
            toast.error('שגיאה בעדכון המועדפים');
        }
    };

    const handleShare = async () => {
        const url = window.location.href;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: card?.title || 'כרטיס ביקור',
                    text: card?.subtitle || '',
                    url
                });
            } catch (error) {
                console.error('Error sharing:', error);
            }
        } else {
            try {
                await navigator.clipboard.writeText(url);
                toast.success('הקישור הועתק ללוח');
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error) {
                toast.error('לא ניתן להעתיק את הקישור');
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
                <Spinner size="xl" />
            </div>
        );
    }

    if (!card || !card.title) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
                <Card className="max-w-md text-center">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">כרטיס לא נמצא</h2>
                    <p className="text-gray-600 dark:text-gray-400">לא הצלחנו לטעון את פרטי הכרטיס</p>
                </Card>
            </div>
        );
    }

    const addressParts = [
        card.address?.street && card.address?.houseNumber
            ? `${card.address.street} ${card.address.houseNumber}`
            : card.address?.street,
        card.address?.city,
        card.address?.state,
        card.address?.country,
    ].filter(Boolean);

    const fullAddress = addressParts.join(', ');
    const encodedAddress = encodeURIComponent(fullAddress);
    const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4" dir="rtl">
            <div className="max-w-6xl mx-auto">
                <Card className="overflow-hidden shadow-lg">
                    <div className="relative">
                        {card.image?.url ? (
                            <img
                                src={card.image.url}
                                alt={card.image?.alt || card.title}
                                className="w-full h-64 md:h-80 object-cover"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = `https://via.placeholder.com/800x400/6366f1/ffffff?text=${encodeURIComponent(card.title)}`;
                                }}
                            />
                        ) : (
                            <div className="w-full h-64 bg-gray-300 flex items-center justify-center text-white text-lg">
                                ללא תמונה
                            </div>
                        )}

                        <div className="absolute top-4 right-4 flex gap-2">
                            <Button size="sm" pill color={isLiked ? "failure" : "gray"} onClick={handleLike}>
                                {isLiked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
                            </Button>
                            <Button size="sm" pill color="gray" onClick={handleShare}>
                                <FaShare />
                            </Button>
                        </div>
                    </div>

                    <div className="p-6">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{card.title}</h1>
                        {card.subtitle && <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">{card.subtitle}</p>}

                        {card.description && (
                            <p className="text-gray-700 dark:text-gray-300 mb-6">{card.description}</p>
                        )}

                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            {/* Contact Info */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">פרטי קשר</h3>
                                <div className="space-y-3">
                                    {card.phone && (
                                        <div className="flex items-center gap-3">
                                            <FaPhone className="text-blue-500" />
                                            <a href={`tel:${card.phone}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                                                {card.phone}
                                            </a>
                                        </div>
                                    )}
                                    {card.email && (
                                        <div className="flex items-center gap-3">
                                            <FaEnvelope className="text-green-500" />
                                            <a href={`mailto:${card.email}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                                                {card.email}
                                            </a>
                                        </div>
                                    )}
                                    {card.web && (
                                        <div className="flex items-center gap-3">
                                            <FaGlobe className="text-purple-500" />
                                            <a
                                                href={card.web.startsWith('http') ? card.web : `https://${card.web}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 dark:text-blue-400 hover:underline"
                                            >
                                                {card.web}
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Address */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">כתובת</h3>
                                <div className="flex items-start gap-3">
                                    <FaMapMarkerAlt className="text-red-500 mt-1" />
                                    <div>
                                        <p className="text-gray-700 dark:text-gray-300">{fullAddress || 'כתובת לא זמינה'}</p>
                                        {fullAddress && (
                                            <Button
                                                size="xs"
                                                color="blue"
                                                onClick={() => window.open(googleMapsDirectionsUrl, '_blank')}
                                                className="mt-2"
                                            >
                                                <FaDirections className="ml-1" />
                                                Google Maps
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
            <ToastContainer />
        </div>
    );
};

export default BusinessPage;
