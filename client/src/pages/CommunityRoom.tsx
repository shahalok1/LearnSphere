import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

type Message = {
  name: string;
  message: string;
  created_at: string;
};

export default function CommunityRoom() {
  const { roomId } = useParams<{ roomId: string }>();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");

  // ✅ FIX
  if (!user) return null;

  const fetchMessages = () => {
    api.get(`/community/${roomId}`).then((res) => {
      setMessages(res.data);
    });
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [roomId]);

  const sendMessage = async () => {
    if (!text.trim()) return;

    await api.post("/community", {
      room_id: roomId,
      user_id: user.id,
      message: text
    });

    setText("");
    fetchMessages();
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
        Community Room
      </h1>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 h-[60vh] overflow-y-auto mb-4">
        {messages.map((msg, i) => (
          <div key={i} className="mb-3">
            <p className="text-sm font-semibold text-indigo-600">
              {msg.name}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              {msg.message}
            </p>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ask something..."
          className="flex-1 p-3 rounded-lg border dark:bg-gray-700 dark:text-white"
        />
        <button
          onClick={sendMessage}
          className="bg-indigo-600 text-white px-6 rounded-lg hover:bg-indigo-700"
        >
          Send
        </button>
      </div>
    </div>
  );
}
