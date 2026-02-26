import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';
import { Badge } from '@/app/components/ui/badge';
import { Send, Search } from 'lucide-react';
import { mockWorkers } from '@/app/data/mockData';
import { Worker } from '@/app/data/types';

interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  isAdmin: boolean;
}

interface Conversation {
  odamworkerId: string;
  worker: Worker;
  messages: ChatMessage[];
  unreadCount: number;
  lastMessage?: ChatMessage;
}

// モックのチャットデータ
const mockConversations: Conversation[] = [
  {
    workerId: 'W001',
    worker: mockWorkers[0],
    unreadCount: 2,
    messages: [
      {
        id: 'CM001',
        senderId: 'admin',
        content: '来週の勤務日程が確定しました。確認をお願いします。',
        timestamp: '2026-01-20T10:00:00',
        isAdmin: true,
      },
      {
        id: 'CM002',
        senderId: 'W001',
        content: '承知しました。確認いたします。',
        timestamp: '2026-01-20T10:30:00',
        isAdmin: false,
      },
      {
        id: 'CM003',
        senderId: 'W001',
        content: '2月1日の勤務ですが、都合により時間の変更は可能でしょうか。',
        timestamp: '2026-01-22T09:00:00',
        isAdmin: false,
      },
      {
        id: 'CM004',
        senderId: 'W001',
        content: '午前中に用事があるため、午後からの出勤を希望します。',
        timestamp: '2026-01-22T09:05:00',
        isAdmin: false,
      },
    ],
  },
  {
    workerId: 'W002',
    worker: mockWorkers[1],
    unreadCount: 0,
    messages: [
      {
        id: 'CM005',
        senderId: 'admin',
        content: 'ご応募いただいた案件が承認されました。当日は9時集合でお願いします。',
        timestamp: '2026-01-21T14:00:00',
        isAdmin: true,
      },
      {
        id: 'CM006',
        senderId: 'W002',
        content: 'ありがとうございます。当日よろしくお願いいたします。',
        timestamp: '2026-01-21T14:30:00',
        isAdmin: false,
      },
    ],
  },
  {
    workerId: 'W003',
    worker: mockWorkers[2],
    unreadCount: 1,
    messages: [
      {
        id: 'CM007',
        senderId: 'W003',
        content: '初めまして。登録したばかりですが、案件に応募させていただきました。',
        timestamp: '2026-01-23T11:00:00',
        isAdmin: false,
      },
    ],
  },
  {
    workerId: 'W004',
    worker: mockWorkers[3],
    unreadCount: 0,
    messages: [
      {
        id: 'CM008',
        senderId: 'admin',
        content: 'いつもご協力ありがとうございます。来月のシフト希望がありましたらお知らせください。',
        timestamp: '2026-01-19T16:00:00',
        isAdmin: true,
      },
      {
        id: 'CM009',
        senderId: 'W004',
        content: '来月は週3日程度で調整可能です。詳細はまた連絡します。',
        timestamp: '2026-01-19T17:00:00',
        isAdmin: false,
      },
    ],
  },
];

export default function MessageManagement() {
  const [conversations, setConversations] = useState<Conversation[]>(
    mockConversations.map(conv => ({
      ...conv,
      lastMessage: conv.messages[conv.messages.length - 1],
    }))
  );
  const [selectedWorkerId, setSelectedWorkerId] = useState<string | null>(mockConversations[0]?.workerId || null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedConversation = conversations.find(c => c.workerId === selectedWorkerId);

  const filteredConversations = conversations.filter(conv =>
    conv.worker.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedConversation?.messages]);

  const handleSelectConversation = (workerId: string) => {
    setSelectedWorkerId(workerId);
    // 未読をクリア
    setConversations(prev =>
      prev.map(conv =>
        conv.workerId === workerId ? { ...conv, unreadCount: 0 } : conv
      )
    );
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedWorkerId) return;

    const newMsg: ChatMessage = {
      id: `CM${Date.now()}`,
      senderId: 'admin',
      content: newMessage,
      timestamp: new Date().toISOString(),
      isAdmin: true,
    };

    setConversations(prev =>
      prev.map(conv =>
        conv.workerId === selectedWorkerId
          ? {
              ...conv,
              messages: [...conv.messages, newMsg],
              lastMessage: newMsg,
            }
          : conv
      )
    );

    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' });
  };

  const getInitials = (name: string) => {
    return name.slice(0, 2);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl">メッセージ</h2>
      
      <div className="flex h-[600px] border rounded-lg overflow-hidden">
        {/* 左サイドバー: ワーカー一覧 */}
        <div className="w-80 border-r bg-gray-50 flex flex-col">
          <div className="p-3 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="ワーカーを検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          
          <ScrollArea className="flex-1">
            {filteredConversations.map((conv) => (
              <div
                key={conv.workerId}
                onClick={() => handleSelectConversation(conv.workerId)}
                className={`p-3 border-b cursor-pointer hover:bg-gray-100 transition-colors ${
                  selectedWorkerId === conv.workerId ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-blue-100 text-blue-700">
                      {getInitials(conv.worker.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm truncate">{conv.worker.name}</span>
                      {conv.lastMessage && (
                        <span className="text-xs text-gray-500">
                          {formatTime(conv.lastMessage.timestamp)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-gray-500 truncate pr-2">
                        {conv.lastMessage?.isAdmin && <span className="text-gray-400">あなた: </span>}
                        {conv.lastMessage?.content}
                      </p>
                      {conv.unreadCount > 0 && (
                        <Badge variant="destructive" className="h-5 w-5 flex items-center justify-center p-0 text-xs">
                          {conv.unreadCount}
                        </Badge>
                      )}
                    </div>
                    <Badge variant="outline" className="mt-1 text-xs">
                      {conv.worker.level}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </ScrollArea>
        </div>

        {/* 右側: チャットエリア */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* ヘッダー */}
              <div className="p-4 border-b bg-white">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-blue-100 text-blue-700">
                      {getInitials(selectedConversation.worker.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{selectedConversation.worker.name}</h3>
                    <p className="text-xs text-gray-500">
                      {selectedConversation.worker.email} · {selectedConversation.worker.level}
                    </p>
                  </div>
                </div>
              </div>

              {/* メッセージエリア */}
              <ScrollArea className="flex-1 p-4 bg-gray-50">
                <div className="space-y-4">
                  {selectedConversation.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isAdmin ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg px-4 py-2 ${
                          message.isAdmin
                            ? 'bg-blue-500 text-white'
                            : 'bg-white border shadow-sm'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        <p
                          className={`text-xs mt-1 ${
                            message.isAdmin ? 'text-blue-100' : 'text-gray-400'
                          }`}
                        >
                          {new Date(message.timestamp).toLocaleString('ja-JP', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* 入力エリア */}
              <div className="p-4 border-t bg-white">
                <div className="flex space-x-2">
                  <Input
                    placeholder="メッセージを入力..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <p>ワーカーを選択してチャットを開始</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
