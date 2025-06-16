import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CreateCardForm from './CreateCardForm';
import CardsList from './cardList';
interface Address {
    country: string;
    city: string;
    street: string;
    houseNumber: string;
    zip: string;
}

interface Image {
    url: string;
    alt: string;
}

export interface Card {
    _id: string;
    title: string;
    phone: string;
    address: Address;
    image: Image;
    isBusiness: boolean;
}

export interface FormData {
    title: string;
    phone: string;
    address: Address;
    image: Image;
    isBusiness: boolean;
}

const CreateCard = () => {
    const [cards, setCards] = useState<Card[]>([]);
    const [formData, setFormData] = useState<FormData>({
        title: '',
        phone: '',
        address: { country: '', city: '', street: '', houseNumber: '', zip: '' },
        image: { url: '', alt: '' },
        isBusiness: true,
    });
    const [showForm, setShowForm] = useState(false);

    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const isAdmin = localStorage.getItem('isAdmin') === 'true';

    useEffect(() => {

        const fetchCards = async () => {
            try {
                const res = await axios.get<Card[]>('https://monkfish-app-z9uza.ondigitalocean.app/bcard2/cards', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCards(res.data);
            } catch (error) {
                toast.error('שגיאה בטעינת הכרטיסים');
                console.error('Fetch cards error:', error);
            }
        };

        fetchCards();
    }, [token, isAdmin, navigate]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };


    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof Address) => {
        const value = e.target.value;
        setFormData(prev => ({
            ...prev,
            address: { ...prev.address, [field]: value },
        }));
    };


    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof Image) => {
        const value = e.target.value;
        setFormData(prev => ({
            ...prev,
            image: { ...prev.image, [field]: value },
        }));
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!token) {
            toast.error('אנא התחבר מחדש');
            return;
        }

        try {
            const res = await axios.post<Card>(
                'https://monkfish-app-z9uza.ondigitalocean.app/bcard2/cards',
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setCards(prev => [...prev, res.data]);
            toast.success('כרטיס נוצר בהצלחה!');

            setFormData({
                title: '',
                phone: '',
                address: { country: '', city: '', street: '', houseNumber: '', zip: '' },
                image: { url: '', alt: '' },
                isBusiness: true,
            });
            setShowForm(false);
        } catch (error) {
            toast.error('שגיאה ביצירת כרטיס');
            console.error('Create card error:', error);
        }
    };
    const handleDelete = async (id: string) => {
        if (!token) {
            toast.error('אנא התחבר מחדש');
            return;
        }

        if (window.confirm('האם למחוק כרטיס זה?')) {
            try {
                await axios.delete(
                    `https://monkfish-app-z9uza.ondigitalocean.app/bcard2/cards/${id}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setCards(prev => prev.filter(card => card._id !== id));
                toast.success('כרטיס נמחק בהצלחה');
            } catch (error) {
                toast.error('שגיאה במחיקת הכרטיס');
                console.error('Delete card error:', error);
            }
        }
    };

    return (
        <div className="max-w-5xl mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-6 text-center text-blue-400"> ניהול כרטיסים</h1>

            <button
                onClick={() => setShowForm(prev => !prev)}
                className="mb-6 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
                {showForm ? 'סגור יצירת כרטיס' : ' צור כרטיס חדש'}
            </button>

            {showForm && (
                <CreateCardForm
                    formData={formData}
                    onChange={handleChange}
                    onAddressChange={handleAddressChange}
                    onImageChange={handleImageChange}
                    onToggleIsBusiness={() =>
                        setFormData(prev => ({ ...prev, isBusiness: !prev.isBusiness }))
                    }
                    onSubmit={handleSubmit}
                />
            )}

            <CardsList cards={cards} onDelete={handleDelete} />

            <ToastContainer />
        </div>
    );
};

export default CreateCard;
