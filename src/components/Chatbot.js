import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
const socket = io(
    process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
    { path: '/socket.io' }
);
const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [socket, setSocket] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState('disconnected');
    const messagesEndRef = useRef(null);
    const reconnectTimeoutRef = useRef(null);
    const maxReconnectAttempts = 5;
    const reconnectDelay = 2000;

    const commonTopics = [
        { label: 'Donation Info', query: 'How can I donate blood?' },
        { label: 'Eligibility', query: 'What are the requirements to donate?' },
        { label: 'Find Blood Bank', query: 'Where is the nearest blood bank?' },
        {
            label: 'Benefits',
            query: 'What are the benefits of donating blood?',
        },
    ];

    // Fallback responses when server connection fails
    const fallbackResponses = {
        greeting: 'Welcome to Blood Bank Assistant! How can I help you today?',
        donation:
            'To donate blood, you generally need to be at least 17 years old, weigh at least 110 pounds, and be in good health. Would you like to know more?',
        eligibility:
            'General eligibility requirements include being at least 17 years old, weighing at least 110 pounds, being in good health, and not having any recent tattoos or piercings in the last 12 months.',
        location:
            "To find a blood bank near you, I would normally search our database. Since we're currently offline, please visit our website or call our hotline at (555) 123-4567 for location information.",
        benefits:
            'Donating blood helps save lives, provides a free mini health screening, and may reduce the risk of heart disease by reducing iron stores.',
        default:
            "I apologize, but I'm currently operating in offline mode with limited functionality. For more specific information, please try again later when our connection is restored.",
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const connectToServer = () => {
        try {
            const newSocket = io(
                process.env.REACT_APP_API_URL || 'http://localhost:5000',
                {
                    transports: ['websocket'],
                    reconnectionAttempts: maxReconnectAttempts,
                    reconnectionDelay: reconnectDelay,
                    timeout: 10000,
                }
            );

            setSocket(newSocket);

            newSocket.on('connect', () => {
                console.log('Connected to server');
                setConnectionStatus('connected');
                // Send welcome message when we first connect
                if (messages.length === 0) {
                    setMessages([
                        { text: fallbackResponses.greeting, sender: 'bot' },
                    ]);
                }
            });

            newSocket.on('disconnect', () => {
                console.log('Disconnected from server');
                setConnectionStatus('disconnected');
            });

            newSocket.on('botResponse', (data) => {
                setMessages((prev) => [
                    ...prev,
                    { text: data.reply, sender: 'bot' },
                ]);
                setIsLoading(false);
            });

            newSocket.on('connect_error', (err) => {
                console.error('Connection error:', err);
                setConnectionStatus('error');
                setIsLoading(false);

                // If this is the first message and we haven't shown a greeting yet
                if (messages.length === 0) {
                    setMessages([
                        {
                            text: "Welcome to Blood Bank Assistant! I'm currently in offline mode with limited functionality.",
                            sender: 'bot',
                        },
                    ]);
                }
            });

            return newSocket;
        } catch (error) {
            console.error('Socket creation error:', error);
            setConnectionStatus('error');
            return null;
        }
    };

    useEffect(() => {
        const newSocket = connectToServer();

        // Initial greeting message
        if (messages.length === 0) {
            setMessages([{ text: fallbackResponses.greeting, sender: 'bot' }]);
        }

        return () => {
            if (newSocket) {
                newSocket.disconnect();
            }
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
        };
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const getFallbackResponse = (message) => {
        const msg = message.toLowerCase().trim();

        if (msg.match(/\b(hello|hi|hey|greetings)\b/)) {
            return fallbackResponses.greeting;
        } else if (msg.match(/\b(donate|donation|donating|give blood)\b/)) {
            return fallbackResponses.donation;
        } else if (
            msg.match(
                /\b(requirements|eligible|eligibility|qualify|can i donate)\b/
            )
        ) {
            return fallbackResponses.eligibility;
        } else if (
            msg.match(
                /\b(blood bank|location|where|nearby|center|find|closest)\b/
            )
        ) {
            return fallbackResponses.location;
        } else if (
            msg.match(/\b(benefits|advantage|good|why donate|reason)\b/)
        ) {
            return fallbackResponses.benefits;
        }

        return fallbackResponses.default;
    };

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { text: input, sender: 'user' };
        setMessages((prev) => [...prev, userMessage]);
        setIsLoading(true);

        if (connectionStatus === 'connected' && socket?.connected) {
            // Online mode - use socket
            socket.emit('userMessage', { message: input });
        } else {
            // Offline mode - use fallback responses
            setTimeout(() => {
                const fallbackReply = getFallbackResponse(input);
                setMessages((prev) => [
                    ...prev,
                    { text: fallbackReply, sender: 'bot' },
                ]);
                setIsLoading(false);
            }, 500); // Add small delay to simulate processing

            // Try to reconnect
            if (
                connectionStatus !== 'connected' &&
                !reconnectTimeoutRef.current
            ) {
                reconnectTimeoutRef.current = setTimeout(() => {
                    reconnectTimeoutRef.current = null;
                    const newSocket = connectToServer();
                    if (newSocket) {
                        setSocket(newSocket);
                    }
                }, reconnectDelay);
            }
        }

        setInput('');
    };

    const handleTopicClick = (query) => {
        const userMessage = { text: query, sender: 'user' };
        setMessages((prev) => [...prev, userMessage]);
        setIsLoading(true);

        if (connectionStatus === 'connected' && socket?.connected) {
            // Online mode - use socket
            socket.emit('userMessage', { message: query });
        } else {
            // Offline mode - use fallback responses
            setTimeout(() => {
                const fallbackReply = getFallbackResponse(query);
                setMessages((prev) => [
                    ...prev,
                    { text: fallbackReply, sender: 'bot' },
                ]);
                setIsLoading(false);
            }, 500);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 font-sans">
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-gradient-to-r from-red-600 to-red-700 text-white p-4 rounded-full shadow-xl hover:from-red-700 hover:to-red-800 transition-all focus:outline-none focus:ring-4 focus:ring-red-300"
                    aria-label="Open chatbot"
                >
                    <svg
                        className="w-7 h-7"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                        />
                    </svg>
                </button>
            )}

            {isOpen && (
                <div className="w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col h-[34rem] transition-all duration-300">
                    <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-4 rounded-t-2xl flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <h3 className="text-xl font-semibold tracking-tight">
                                Blood Bank Assistant
                            </h3>
                            {connectionStatus !== 'connected' && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-800 text-white"></span>
                            )}
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-white rounded-full p-1"
                            aria-label="Close chatbot"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>

                    <div className="p-4 bg-gray-50 border-b border-gray-200">
                        <div className="flex flex-wrap gap-2">
                            {commonTopics.map((topic, index) => (
                                <button
                                    key={index}
                                    onClick={() =>
                                        handleTopicClick(topic.query)
                                    }
                                    className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium hover:bg-red-200 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400"
                                >
                                    {topic.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 p-4 overflow-y-auto bg-gradient-to-b from-white to-gray-50">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`mb-4 max-w-[85%] ${
                                    msg.sender === 'user'
                                        ? 'ml-auto text-right'
                                        : 'mr-auto text-left'
                                }`}
                            >
                                <div
                                    className={`inline-block px-4 py-2 rounded-xl shadow-md ${
                                        msg.sender === 'user'
                                            ? 'bg-gradient-to-r from-red-600 to-red-700 text-white'
                                            : 'bg-gray-100 text-gray-800'
                                    }`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="mr-auto text-left mb-4">
                                <div className="inline-block px-4 py-2 rounded-xl bg-gray-100 text-gray-600">
                                    <span className="flex items-center">
                                        <span className="h-2 w-2 mr-1 bg-red-600 rounded-full animate-pulse"></span>
                                        <span className="h-2 w-2 mx-1 bg-red-600 rounded-full animate-pulse delay-100"></span>
                                        <span className="h-2 w-2 ml-1 bg-red-600 rounded-full animate-pulse delay-200"></span>
                                    </span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form
                        onSubmit={handleSend}
                        className="p-4 border-t border-gray-200 bg-white rounded-b-2xl"
                    >
                        <div className="flex gap-3">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all outline-none placeholder-gray-400"
                                placeholder="Ask me anything..."
                                aria-label="Chat input"
                            />
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 rounded-lg hover:from-red-700 hover:to-red-800 transition-all focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                aria-label="Send message"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                    />
                                </svg>
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Chatbot;
