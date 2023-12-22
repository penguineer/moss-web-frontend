import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu } from 'primereact/menu';

import backendAxios from './Backend';

function UserMenu({ updateUser }) {
    const [user, setUser] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const noLoginPaths = ['/', '/impressum', '/datenschutz'];

    const menuRef = useRef();

    const triggerLogin = async () => {
        if (location.pathname !== '/login')
            navigate('/login?redirect=' + location.pathname + location.search);
    }

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await backendAxios.get(`/user/info`);
                setUser(response.data);

                // Pass the user data to the parent component
                updateUser(response.data);

                if (!response.data || !response.data.id) {
                    await triggerLogin();
                }
            } catch (error) {
                // Set null if 404 (no user) is returned
                if (error.response && error.response.status === 404) {
                    updateUser(null);
                    if (!noLoginPaths.some(path => location.pathname.startsWith(path)))
                        await triggerLogin();
                } else
                    console.error('There was an error!', error);
            }
        };

        if (!user) {
            fetchUserInfo();
        }
    });

    const handleAvatarClick = (event) => {
        event.stopPropagation();
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = async () => {
        try {
            await backendAxios.post('/user/logout', {});
            setUser(null);
            updateUser(null);
        } catch (error) {
            console.error('There was an error!', error);
        }
    };

    const handleLogin = () => {
        triggerLogin();
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target))
                setIsMenuOpen(false);

        }

        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuRef]);

    const items = [
        {
            label: 'Logout',
            icon: 'pi pi-fw pi-sign-out',
            command: () => { handleLogout(); setIsMenuOpen(false); },            
            userRequired: true
        },
        {
            label: 'Login',
            icon: 'pi pi-fw pi-sign-in',
            command: () => { handleLogin(); setIsMenuOpen(false); },
            userRequired: false
        }
        // Add more items here as needed
    ];

    return (
        <div>
            <img className="avatar"
                src={user ? (user.avatar_url ? user.avatar_url : "user-no-avatar.svg") : "/anonymous-user.svg"}
                alt={user ? user.display_name : "Not logged in"}
                onMouseDown={handleAvatarClick}
            />
            {isMenuOpen && (
                <div class="menu-container" ref={menuRef}>
                    <Menu model={items.filter(item => item.userRequired === !!user)} className="menu" />
                </div>
            )}
        </div>
    );
}

export default UserMenu;