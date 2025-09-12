import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const [user, setUser] = useState(null);
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);

    // 🔑 Sync token with localStorage
    useEffect(() => {
        if (token) {
            localStorage.setItem("token", token);
        } else {
            localStorage.removeItem("token");
        }
    }, [token]);

    const logout = () => {
        setToken(null);
        setUser(null);
        setChats([]);
        setSelectedChat(null);
        localStorage.removeItem("token");
        navigate("/login");
        toast.error("Session expired. Please login again.");
    };

    const fetchUser = async () => {
        try {
            const { data } = await axios.get(backendUrl + "/api/user/data", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (data.success) {
                setUser(data.user);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);

        } finally {
            setLoadingUser(false);
        }
    };

    const createNewChat = async () => {
        try {
            if (!user) {
                toast.error("Login to continue.");
                return null;
            }

            const { data } = await axios.get(backendUrl + "/api/chat/create", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (data.success) {
                // ✅ Update immediately
                setChats(prev => [data.chat, ...prev]);
                setSelectedChat(data.chat);
                navigate("/"); // Go to chat page
                return data.chat;
            } else {
                toast.error(data.message);
                return null;
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
            return null;
        }
    };



    const fetchUserChats = async () => {
        try {
            const { data } = await axios.get(backendUrl + "/api/chat/get", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (data.success) {
                if (data.chats.length === 0) {
                    await createNewChat();
                    const { data: newData } = await axios.get(
                        backendUrl + "/api/chat/get",
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    if (newData.success && newData.chats.length > 0) {
                        setChats(newData.chats);
                        setSelectedChat(newData.chats[0]);
                    }
                } else {
                    setChats(data.chats);
                    setSelectedChat(data.chats[0]);
                }
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    useEffect(() => {
        if (token) {
            fetchUser();
        } else {
            setUser(null);
            setLoadingUser(false);
        }
    }, [token]);

    useEffect(() => {
        if (user) {
            fetchUserChats();
        } else {
            setChats([]);
            setSelectedChat(null);
        }
    }, [user]);

    const value = {
        navigate,
        user,
        setUser,
        chats,
        setChats,
        selectedChat,
        setSelectedChat,
        backendUrl,
        token,
        setToken,
        createNewChat,
        loadingUser,
        fetchUserChats,
        fetchUser,
        logout,
        setLoadingUser,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
