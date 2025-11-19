import React from 'react';

const avatars = [
    { id: 1, name: 'Alice', color: 'bg-red-500', initial: 'A' },
    { id: 2, name: 'Bob', color: 'bg-blue-500', initial: 'B' },
    { id: 3, name: 'Charlie', color: 'bg-green-500', initial: 'C' },
];

export const Collaborators: React.FC = () => {
    return (
        <div className="fixed top-4 right-4 flex items-center gap-[-8px] z-50">
            <div className="flex -space-x-2">
                {avatars.map((user) => (
                    <div
                        key={user.id}
                        className={`w-8 h-8 rounded-full ${user.color} border-2 border-background flex items-center justify-center text-white text-xs font-bold shadow-sm`}
                        title={user.name}
                    >
                        {user.initial}
                    </div>
                ))}
            </div>
            <div className="ml-3 px-2 py-1 bg-accent/20 text-accent-foreground text-xs rounded-full font-medium">
                3 Active
            </div>
        </div>
    );
};
