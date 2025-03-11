'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Send, User, Users, Phone, Video, ArrowLeft, Plus, Search, X, MessageSquare } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";

// Kiểu dữ liệu cho tin nhắn
interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
}

// Kiểu dữ liệu cho người dùng
interface User {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'away';
  lastSeen?: Date;
}

// Kiểu dữ liệu cho cuộc trò chuyện
interface Conversation {
  id: string;
  participants: User[];
  messages: Message[];
  isGroup: boolean;
  name?: string;
}

// Mock data cho người dùng
const mockUsers: User[] = [
  {
    id: 'user1',
    name: 'Nguyễn Văn A',
    avatar: '/avatars/user1.png',
    status: 'online'
  },
  {
    id: 'user2',
    name: 'Trần Thị B',
    avatar: '/avatars/user2.png',
    status: 'online'
  },
  {
    id: 'user3',
    name: 'Lê Văn C',
    avatar: '/avatars/user3.png',
    status: 'offline',
    lastSeen: new Date(Date.now() - 3600000) // 1 giờ trước
  },
  {
    id: 'user4',
    name: 'Phạm Thị D',
    avatar: '/avatars/user4.png',
    status: 'away'
  },
  {
    id: 'user5',
    name: 'Hoàng Văn E',
    avatar: '/avatars/user5.png',
    status: 'online'
  }
];

// Mock data cho cuộc trò chuyện
const mockConversations: Conversation[] = [
  {
    id: 'conv1',
    participants: [mockUsers[0], mockUsers[1]],
    isGroup: false,
    messages: [
      {
        id: 'msg1',
        senderId: 'user1',
        content: 'Chào bạn, bài tập hôm nay thế nào rồi?',
        timestamp: new Date(Date.now() - 3600000 * 2) // 2 giờ trước
      },
      {
        id: 'msg2',
        senderId: 'user2',
        content: 'Mình đã làm xong rồi, còn bạn?',
        timestamp: new Date(Date.now() - 3600000 * 1.5) // 1.5 giờ trước
      },
      {
        id: 'msg3',
        senderId: 'user1',
        content: 'Mình còn bài toán cuối chưa hiểu lắm',
        timestamp: new Date(Date.now() - 3600000) // 1 giờ trước
      }
    ]
  },
  {
    id: 'conv2',
    participants: [mockUsers[0], mockUsers[2], mockUsers[3]],
    isGroup: true,
    name: 'Nhóm học toán',
    messages: [
      {
        id: 'msg4',
        senderId: 'user3',
        content: 'Các bạn đã làm bài tập về nhà chưa?',
        timestamp: new Date(Date.now() - 7200000) // 2 giờ trước
      },
      {
        id: 'msg5',
        senderId: 'user1',
        content: 'Mình đang làm dở',
        timestamp: new Date(Date.now() - 5400000) // 1.5 giờ trước
      },
      {
        id: 'msg6',
        senderId: 'user4',
        content: 'Mình chưa hiểu bài 5 lắm',
        timestamp: new Date(Date.now() - 3600000) // 1 giờ trước
      }
    ]
  },
  {
    id: 'conv3',
    participants: [mockUsers[0], mockUsers[4]],
    isGroup: false,
    messages: [
      {
        id: 'msg7',
        senderId: 'user5',
        content: 'Bạn có thể giúp mình bài tập văn không?',
        timestamp: new Date(Date.now() - 86400000) // 1 ngày trước
      },
      {
        id: 'msg8',
        senderId: 'user1',
        content: 'Được chứ, bạn cần giúp gì?',
        timestamp: new Date(Date.now() - 82800000) // 23 giờ trước
      }
    ]
  }
];

// Thêm danh sách tất cả người dùng có thể chat
const allUsers: User[] = [
  ...mockUsers,
  {
    id: 'user6',
    name: 'Vũ Thị F',
    avatar: '/avatars/user6.png',
    status: 'online'
  },
  {
    id: 'user7',
    name: 'Đặng Văn G',
    avatar: '/avatars/user7.png',
    status: 'offline',
    lastSeen: new Date(Date.now() - 86400000) // 1 ngày trước
  },
  {
    id: 'user8',
    name: 'Trịnh Thị H',
    avatar: '/avatars/user8.png',
    status: 'away'
  },
  {
    id: 'user9',
    name: 'Ngô Văn I',
    avatar: '/avatars/user9.png',
    status: 'online'
  },
  {
    id: 'user10',
    name: 'Lý Thị K',
    avatar: '/avatars/user10.png',
    status: 'offline',
    lastSeen: new Date(Date.now() - 172800000) // 2 ngày trước
  }
];

// Component hiển thị tin nhắn
const MessageItem = ({ message, isCurrentUser, sender, prevMessage }: { 
  message: Message, 
  isCurrentUser: boolean, 
  sender: User,
  prevMessage?: Message
}) => {
  // Kiểm tra xem tin nhắn này có phải là tin nhắn đầu tiên của ngày mới không
  const isNewDay = prevMessage ? 
    !isSameDay(new Date(message.timestamp), new Date(prevMessage.timestamp)) : 
    true;
  
  // Kiểm tra xem tin nhắn này có cách tin nhắn trước đó hơn 1 giờ không
  const isTimeGap = prevMessage ? 
    (new Date(message.timestamp).getTime() - new Date(prevMessage.timestamp).getTime() > 3600000) : 
    false;
  
  return (
    <>
      {/* Hiển thị ngăn cách ngày nếu là ngày mới */}
      {isNewDay && (
        <div className="flex justify-center my-4">
          <div className="bg-muted px-3 py-1 rounded-full text-xs text-muted-foreground">
            {formatMessageDate(message.timestamp)}
          </div>
        </div>
      )}
      
      {/* Hiển thị ngăn cách thời gian nếu cách nhau hơn 1 giờ */}
      {!isNewDay && isTimeGap && (
        <div className="flex justify-center my-3">
          <div className="bg-muted/50 px-2 py-0.5 rounded-full text-xs text-muted-foreground">
            {formatTime(message.timestamp)}
          </div>
        </div>
      )}
      
      <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}>
        {!isCurrentUser && (
          <Avatar className="h-8 w-8 mr-2 flex-shrink-0">
            <AvatarImage src={sender.avatar} alt={sender.name} />
            <AvatarFallback>{sender.name.charAt(0)}</AvatarFallback>
          </Avatar>
        )}
        <div>
          {!isCurrentUser && (
            <div className="text-xs text-muted-foreground mb-1">{sender.name}</div>
          )}
          <div className={`px-3 py-2 rounded-lg max-w-xs break-words ${
            isCurrentUser 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-muted'
          }`}>
            {message.content}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {formatTime(message.timestamp)}
          </div>
        </div>
        {isCurrentUser && (
          <Avatar className="h-8 w-8 ml-2 flex-shrink-0">
            <AvatarImage src={sender.avatar} alt={sender.name} />
            <AvatarFallback>{sender.name.charAt(0)}</AvatarFallback>
          </Avatar>
        )}
      </div>
    </>
  );
};

// Hàm kiểm tra xem hai ngày có cùng ngày không
function isSameDay(date1: Date, date2: Date) {
  return date1.getDate() === date2.getDate() && 
         date1.getMonth() === date2.getMonth() && 
         date1.getFullYear() === date2.getFullYear();
}

// Hàm định dạng ngày tháng cho tin nhắn
function formatMessageDate(timestamp: Date) {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const messageDate = new Date(timestamp);
  
  if (isSameDay(messageDate, today)) {
    return 'Hôm nay';
  } else if (isSameDay(messageDate, yesterday)) {
    return 'Hôm qua';
  } else {
    return messageDate.toLocaleDateString('vi-VN', { 
      day: 'numeric', 
      month: 'numeric',
      year: 'numeric'
    });
  }
}

// Hàm định dạng thời gian cho tin nhắn
function formatTime(timestamp: Date) {
  return new Date(timestamp).toLocaleTimeString('vi-VN', { 
    hour: '2-digit', 
    minute: '2-digit'
  });
}

// Component hiển thị danh sách cuộc trò chuyện
const ConversationList = ({ 
  conversations, 
  activeConversation, 
  setActiveConversation,
  currentUser,
  isMobileView = false
}: { 
  conversations: Conversation[], 
  activeConversation: string, 
  setActiveConversation: (id: string) => void,
  currentUser: User,
  isMobileView?: boolean
}) => {
  return (
    <div className="space-y-2">
      {conversations.map(conversation => {
        // Xác định tên hiển thị cho cuộc trò chuyện
        let displayName = '';
        let avatar = '';
        
        if (conversation.isGroup) {
          displayName = conversation.name || 'Nhóm chat';
          avatar = '/avatars/group.png';
        } else {
          // Lấy thông tin người dùng khác trong cuộc trò chuyện 1-1
          const otherUser = conversation.participants.find(p => p.id !== currentUser.id);
          if (otherUser) {
            displayName = otherUser.name;
            avatar = otherUser.avatar;
          }
        }
        
        // Lấy tin nhắn cuối cùng
        const lastMessage = conversation.messages[conversation.messages.length - 1];
        const sender = conversation.participants.find(p => p.id === lastMessage.senderId);
        const senderName = sender?.id === currentUser.id ? 'Bạn' : sender?.name;
        
        return (
          <div 
            key={conversation.id}
            className={`flex items-center p-3 rounded-lg cursor-pointer hover:bg-muted ${
              activeConversation === conversation.id ? 'bg-muted' : ''
            }`}
            onClick={() => setActiveConversation(conversation.id)}
          >
            <Avatar className="h-10 w-10 mr-3">
              <AvatarImage src={avatar} alt={displayName} />
              <AvatarFallback>
                {conversation.isGroup ? <Users className="h-4 w-4" /> : displayName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            {!isMobileView && (
              <div className="flex-1 overflow-hidden">
                <div className="flex justify-between">
                  <div className="font-medium truncate">{displayName}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(lastMessage.timestamp).toLocaleDateString('vi-VN', { 
                      hour: '2-digit', 
                      minute: '2-digit',
                      day: 'numeric',
                      month: 'numeric'
                    })}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground truncate">
                  {senderName}: {lastMessage.content}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export function Chat() {
  // Giả định người dùng hiện tại là user1
  const currentUser = mockUsers[0];
  
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [activeConversation, setActiveConversation] = useState<string>(conversations[0].id);
  const [newMessage, setNewMessage] = useState<string>('');
  const [showMobileChat, setShowMobileChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // State cho dialog tạo cuộc trò chuyện mới
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [newChatName, setNewChatName] = useState('');
  
  // Lấy cuộc trò chuyện hiện tại
  const currentConversation = conversations.find(conv => conv.id === activeConversation);
  
  // Cuộn xuống tin nhắn mới nhất
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentConversation?.messages]);
  
  // Lọc người dùng theo từ khóa tìm kiếm
  const filteredUsers = allUsers.filter(user => 
    user.id !== currentUser.id && // Không hiển thị người dùng hiện tại
    !selectedUsers.some(selected => selected.id === user.id) && // Không hiển thị người đã chọn
    (user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     user.id.toLowerCase() === searchTerm.toLowerCase())
  );
  
  // Xử lý gửi tin nhắn mới
  const handleSendMessage = () => {
    if (!newMessage.trim() || !currentConversation) return;
    
    const newMsg: Message = {
      id: `msg${Date.now()}`,
      senderId: currentUser.id,
      content: newMessage.trim(),
      timestamp: new Date()
    };
    
    // Cập nhật danh sách tin nhắn
    const updatedConversations = conversations.map(conv => {
      if (conv.id === activeConversation) {
        return {
          ...conv,
          messages: [...conv.messages, newMsg]
        };
      }
      return conv;
    });
    
    setConversations(updatedConversations);
    setNewMessage('');
  };
  
  // Xử lý phím Enter để gửi tin nhắn
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // Xử lý chuyển đổi giữa danh sách và chat trên mobile
  const handleConversationSelect = (convId: string) => {
    setActiveConversation(convId);
    setShowMobileChat(true);
  };
  
  // Quay lại danh sách cuộc trò chuyện trên mobile
  const handleBackToList = () => {
    setShowMobileChat(false);
  };
  
  // Xử lý chọn người dùng để tạo cuộc trò chuyện mới
  const handleSelectUser = (user: User) => {
    setSelectedUsers(prev => [...prev, user]);
    setSearchTerm('');
  };
  
  // Xử lý xóa người dùng đã chọn
  const handleRemoveUser = (userId: string) => {
    setSelectedUsers(prev => prev.filter(user => user.id !== userId));
  };
  
  // Xử lý tạo cuộc trò chuyện mới
  const handleCreateNewChat = () => {
    if (selectedUsers.length === 0) return;
    
    const isGroup = selectedUsers.length > 1;
    const newConversationId = `conv${Date.now()}`;
    
    const newConversation: Conversation = {
      id: newConversationId,
      participants: [currentUser, ...selectedUsers],
      isGroup: isGroup,
      name: isGroup ? (newChatName || `Nhóm mới (${selectedUsers.length + 1})`) : undefined,
      messages: []
    };
    
    setConversations(prev => [newConversation, ...prev]);
    setActiveConversation(newConversationId);
    setShowMobileChat(true);
    setIsNewChatOpen(false);
    setSelectedUsers([]);
    setNewChatName('');
  };
  
  return (
    <div className="container">
      <Card className="h-[calc(100vh-90px)] overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle>Tin nhắn</CardTitle>
            <Dialog open={isNewChatOpen} onOpenChange={setIsNewChatOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="flex items-center gap-1">
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Cuộc trò chuyện mới</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Tạo cuộc trò chuyện mới</DialogTitle>
                  <DialogDescription>
                    Chọn người dùng để bắt đầu cuộc trò chuyện
                  </DialogDescription>
                </DialogHeader>
                
                {/* Hiển thị người dùng đã chọn */}
                {selectedUsers.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedUsers.map(user => (
                      <Badge key={user.id} variant="secondary" className="flex items-center gap-1 py-1">
                        <span>{user.name}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 p-0 ml-1"
                          onClick={() => handleRemoveUser(user.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                )}
                
                {/* Tìm kiếm người dùng */}
                <Command className="rounded-lg border shadow-md">
                  <CommandInput 
                    placeholder="Tìm theo tên hoặc nhập username..." 
                    value={searchTerm}
                    onValueChange={setSearchTerm}
                  />
                  <CommandList>
                    <CommandEmpty>Không tìm thấy người dùng</CommandEmpty>
                    <CommandGroup heading="Gợi ý">
                      {filteredUsers.map(user => (
                        <CommandItem
                          key={user.id}
                          onSelect={() => handleSelectUser(user)}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span>{user.name}</span>
                            <span className="text-xs text-muted-foreground">@{user.id}</span>
                          </div>
                          <div className="ml-auto">
                            <Badge variant={user.status === 'online' ? 'default' : 'secondary'} className="text-xs">
                              {user.status === 'online' ? 'Online' : user.status === 'away' ? 'Bận' : 'Offline'}
                            </Badge>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
                
                {/* Tên nhóm (chỉ hiển thị khi chọn nhiều người) */}
                {selectedUsers.length > 1 && (
                  <div className="space-y-2 mt-4">
                    <label htmlFor="group-name" className="text-sm font-medium">
                      Tên nhóm (tùy chọn)
                    </label>
                    <Input
                      id="group-name"
                      placeholder="Nhập tên nhóm..."
                      value={newChatName}
                      onChange={(e) => setNewChatName(e.target.value)}
                    />
                  </div>
                )}
                
                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsNewChatOpen(false);
                      setSelectedUsers([]);
                      setNewChatName('');
                    }}
                  >
                    Hủy
                  </Button>
                  <Button 
                    onClick={handleCreateNewChat}
                    disabled={selectedUsers.length === 0}
                  >
                    Bắt đầu trò chuyện
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="p-0 h-[calc(100%-80px)]">
          <div className="grid grid-cols-12 h-full">
            {/* Danh sách cuộc trò chuyện */}
            <div className={`col-span-12 md:col-span-4 border-r h-full flex flex-col ${
              showMobileChat ? 'hidden md:flex' : 'flex'
            }`}>
              <Tabs defaultValue="all">
                <div className="px-4">
                  <TabsList className="w-full">
                    <TabsTrigger value="all" className="flex-1 text-xs sm:text-sm">Tất cả</TabsTrigger>
                    <TabsTrigger value="unread" className="flex-1 text-xs sm:text-sm">Chưa đọc</TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value="all" className="m-0 flex-1 overflow-hidden">
                  <ScrollArea className="h-[calc(100vh-200px)] pt-3 px-4">
                    <div className="md:hidden flex flex-wrap justify-center gap-2 mb-4">
                      <div 
                        className="flex flex-col items-center p-2 cursor-pointer"
                        onClick={() => setIsNewChatOpen(true)}
                      >
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-1">
                          <Plus className="h-6 w-6 text-primary" />
                        </div>
                        <span className="text-xs">Mới</span>
                      </div>
                      
                      {conversations.map(conversation => {
                        let avatar = '';
                        let displayName = '';
                        
                        if (conversation.isGroup) {
                          displayName = conversation.name || 'Nhóm chat';
                          avatar = '/avatars/group.png';
                        } else {
                          const otherUser = conversation.participants.find(p => p.id !== currentUser.id);
                          if (otherUser) {
                            displayName = otherUser.name;
                            avatar = otherUser.avatar;
                          }
                        }
                        
                        return (
                          <div 
                            key={conversation.id}
                            className={`flex flex-col items-center p-2 ${
                              activeConversation === conversation.id ? 'opacity-100' : 'opacity-70'
                            }`}
                            onClick={() => handleConversationSelect(conversation.id)}
                          >
                            <Avatar className="h-12 w-12 mb-1">
                              <AvatarImage src={avatar} alt={displayName} />
                              <AvatarFallback>
                                {conversation.isGroup ? <Users className="h-4 w-4" /> : displayName.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs truncate max-w-[60px]">{displayName}</span>
                          </div>
                        );
                      })}
                    </div>
                    
                    <div className="hidden md:block">
                      <Button 
                        variant="ghost" 
                        className="w-full flex items-center justify-start gap-2 mb-2 hover:bg-primary/10"
                        onClick={() => setIsNewChatOpen(true)}
                      >
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Plus className="h-5 w-5 text-primary" />
                        </div>
                        <span>Tạo cuộc trò chuyện mới</span>
                      </Button>
                      
                      <ConversationList 
                        conversations={conversations} 
                        activeConversation={activeConversation}
                        setActiveConversation={setActiveConversation}
                        currentUser={currentUser}
                      />
                    </div>
                  </ScrollArea>
                </TabsContent>
                <TabsContent value="unread" className="m-0 flex-1 overflow-hidden">
                  <div className="h-[calc(100vh-200px)] flex items-center justify-center text-muted-foreground">
                    Không có tin nhắn chưa đọc
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Khu vực chat */}
            <div className={`col-span-12 md:col-span-8 flex flex-col h-full ${
              !showMobileChat ? 'hidden md:flex' : 'flex'
            }`}>
              {currentConversation ? (
                <>
                  {/* Header cuộc trò chuyện */}
                  <div className="p-4 border-b flex items-center justify-between">
                    <div className="flex items-center">
                      {showMobileChat && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="mr-2 md:hidden" 
                          onClick={handleBackToList}
                        >
                          <ArrowLeft className="h-4 w-4" />
                        </Button>
                      )}
                      <Avatar className="h-10 w-10 mr-3">
                        {currentConversation.isGroup ? (
                          <>
                            <AvatarImage src="/avatars/group.png" alt={currentConversation.name} />
                            <AvatarFallback><Users className="h-4 w-4" /></AvatarFallback>
                          </>
                        ) : (
                          <>
                            {(() => {
                              const otherUser = currentConversation.participants.find(
                                p => p.id !== currentUser.id
                              );
                              return (
                                <>
                                  <AvatarImage src={otherUser?.avatar} alt={otherUser?.name} />
                                  <AvatarFallback>{otherUser?.name.charAt(0)}</AvatarFallback>
                                </>
                              );
                            })()}
                          </>
                        )}
                      </Avatar>
                      <div>
                        <div className="font-medium">
                          {currentConversation.isGroup 
                            ? currentConversation.name 
                            : currentConversation.participants.find(p => p.id !== currentUser.id)?.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {currentConversation.isGroup 
                            ? `${currentConversation.participants.length} thành viên` 
                            : (() => {
                                const otherUser = currentConversation.participants.find(
                                  p => p.id !== currentUser.id
                                );
                                return otherUser?.status === 'online' 
                                  ? 'Đang hoạt động' 
                                  : otherUser?.status === 'away'
                                  ? 'Đang bận'
                                  : 'Ngoại tuyến';
                              })()}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon" className="hidden sm:flex">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="hidden sm:flex">
                        <Video className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <User className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Khu vực tin nhắn */}
                  <ScrollArea className="flex-1 p-4">
                    {currentConversation.messages.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center p-4">
                        <div className="bg-primary/10 p-4 rounded-full mb-4">
                          <Send className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="text-lg font-medium mb-2">Bắt đầu cuộc trò chuyện</h3>
                        <p className="text-muted-foreground max-w-md">
                          Đây là khởi đầu cuộc trò chuyện của bạn với{' '}
                          {currentConversation.isGroup 
                            ? currentConversation.name 
                            : currentConversation.participants.find(p => p.id !== currentUser.id)?.name}.
                          Hãy gửi tin nhắn đầu tiên!
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {currentConversation.messages.map((message, index) => {
                          const sender = currentConversation.participants.find(
                            p => p.id === message.senderId
                          ) as User;
                          const isCurrentUser = message.senderId === currentUser.id;
                          const prevMessage = index > 0 ? currentConversation.messages[index - 1] : undefined;
                          
                          return (
                            <MessageItem 
                              key={message.id} 
                              message={message} 
                              isCurrentUser={isCurrentUser}
                              sender={sender}
                              prevMessage={prevMessage}
                            />
                          );
                        })}
                        <div ref={messagesEndRef} />
                      </div>
                    )}
                  </ScrollArea>
                  
                  {/* Khu vực nhập tin nhắn */}
                  <div className="p-4 border-t">
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Nhập tin nhắn..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1"
                      />
                      <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-4">
                  <div className="bg-primary/10 p-6 rounded-full mb-4">
                    <MessageSquare className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">Chưa có cuộc trò chuyện nào được chọn</h3>
                  <p className="text-muted-foreground max-w-md mb-6">
                    Chọn một cuộc trò chuyện từ danh sách hoặc tạo cuộc trò chuyện mới để bắt đầu
                  </p>
                  <Button onClick={() => setIsNewChatOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Tạo cuộc trò chuyện mới
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 