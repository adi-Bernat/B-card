import React from 'react';
import { Card } from './models';

interface CardsListProps {
    cards: Card[];
    onDelete: (id: string) => void;
}

const CardsList: React.FC<CardsListProps> = ({ cards, onDelete }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((card) => (
                <div key={card._id} className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
                    <h3 className="text-lg font-bold">{card.title}</h3>
                    <p className="text-sm">{card.phone}</p>
                    <p className="text-sm">{card.address?.city}</p>
                    <img
                        src={card.image?.url || '/img/default.jpg'}
                        alt={card.image?.alt || 'no img'}
                        className="w-full h-32 object-cover mt-2 rounded"
                    />
                    <button
                        onClick={() => onDelete(card._id)}
                        className="bg-red-500 hover:bg-red-600 text-white mt-4 px-4 py-2 rounded w-full"
                    >
                        מחק כרטיס
                    </button>
                </div>
            ))}
        </div>
    );
};

export default CardsList;
