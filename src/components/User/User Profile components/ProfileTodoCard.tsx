// components/TodoCard.js
import React from 'react';
type MyComponentsType = {
    title: string;
    description: string;
    time: string;
    color: string;
}
const ProfileTodoCard = ({ title, description, time, color }: MyComponentsType) => {
    return (
        <div className="todo-card">
            <h3>{title}</h3>
            <p>{description}</p>
            <span>{time}</span>
        </div>
    );
};

export default ProfileTodoCard;
