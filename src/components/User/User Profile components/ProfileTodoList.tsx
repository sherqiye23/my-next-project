// components/TodoList.js
import React from 'react';
import ProfileTodoCard from './ProfileTodoCard';

const ProfileTodoList = () => {
    const todos = [
        {
            title: "Team Meeting",
            description: "Lorem ipsum dolor sit amet, consectetur elit idd. rtem idjsfjf.",
            time: "10:30 AM - 12:00 PM",
            color: "blue"
        },
        {
            title: "Work on Branding",
            description: "Lorem ipsum dolor sit amet, consectetur elit idd. rtem idjsfjf.",
            time: "10:30 AM - 12:00 PM",
            color: "purple"
        },
        {
            title: "Create a planner",
            description: "Lorem ipsum dolor sit amet, consectetur elit idd. rtem idjsfjf.",
            time: "10:30 AM - 12:00 PM",
            color: "pink"
        },
        {
            title: "Create Treatment Plan",
            description: "Lorem ipsum dolor sit amet, consectetur elit idd. rtem idjsfjf.",
            time: "10:30 AM - 12:00 PM",
            color: "green"
        },
        {
            title: "Make a Report for client",
            description: "Lorem ipsum dolor sit amet, consectetur elit idd. rtem idjsfjf.",
            time: "10:30 AM - 12:00 PM",
            color: "orange"
        },
    ];

    return (
        <div className="todo-list">
            {todos.map((todo, index) => (
                <ProfileTodoCard
                    key={index}
                    title={todo.title}
                    description={todo.description}
                    time={todo.time}
                    color={todo.color}
                />
            ))}
        </div>
    );
};

export default ProfileTodoList;
