import React, { useState, useCallback, useEffect, useRef } from "react";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { usePolling } from "../../hooks/usePolling";
import { useSearchParams } from "react-router-dom";
import ConversationList from "./components/ConversationList";
import ChatArea from "./components/ChatArea";
import * as chatService from "../../services/chatService";
import friendshipService from "../../services/friendshipService";
import { useCurrentUser } from "../../context/currentUserContext";
import type { Conversation, Message } from "../../types/chat"; 
import type { Friend } from "../../types/friendship";
import "./MessagesPage.css";

const MessagesPage: React.FC = () => {
    const isMobile = useMediaQuery("(max-width: 900px)");
    const [searchParams, setSearchParams] = useSearchParams();
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [friends, setFriends] = useState<Friend[]>([]);

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
    const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
    const [isTransferAdminModalOpen, setIsTransferAdminModalOpen] = useState(false);
    const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);

    const [isFriendDropdownOpen, setIsFriendDropdownOpen] = useState(false);
    const [isAddMemberDropdownOpen, setIsAddMemberDropdownOpen] = useState(false);

    const [newGroupName, setNewGroupName] = useState("");
    const [tempGroupName, setTempGroupName] = useState("");
    const [selectedFriendIds, setSelectedFriendIds] = useState<number[]>([]);
    const [selectedNewMemberIds, setSelectedNewMemberIds] = useState<number[]>([]);

    const currentUserContext = useCurrentUser();
    const currentUserId = Number(currentUserContext?.currentUser?.id || 0);

    const fetchData = useCallback(async () => {
        try {
            const [convRes, friendRes] = await Promise.all([
                chatService.getConversations(),
                friendshipService.getFriends()
            ]);
            if (convRes.success) setConversations(convRes.data);
            if (friendRes) setFriends(friendRes);
        } catch (e) { console.error("Lỗi tải dữ liệu:", e); }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    // ─── Smart Polling for real-time updates ─────────────────
    const selectedConvRef = useRef(selectedConversation);
    const messagesRef = useRef(messages);
    selectedConvRef.current = selectedConversation;
    messagesRef.current = messages;

    // Poll for new messages in selected conversation
    const pollMessages = useCallback(async (): Promise<boolean> => {
        const conv = selectedConvRef.current;
        if (!conv || !conv.id) return false;

        try {
            const res = await chatService.getMessages(conv.id);
            const newMsgs = res.data || [];
            const currentMsgs = messagesRef.current;

            if (newMsgs.length > currentMsgs.length) {
                setMessages(newMsgs);
                return true; // New data found → poll faster
            }
        } catch { /* silent */ }
        return false;
    }, []);

    // Poll for conversation list updates (new conversations, last message preview)
    const pollConversations = useCallback(async (): Promise<boolean> => {
        try {
            const res = await chatService.getConversations();
            if (res.success) {
                const oldLen = conversations.length;
                setConversations(res.data);
                return res.data.length !== oldLen;
            }
        } catch { /* silent */ }
        return false;
    }, [conversations.length]);

    // Combined polling callback
    const pollAll = useCallback(async (): Promise<boolean> => {
        const [hasNewMsgs, hasNewConvs] = await Promise.all([
            pollMessages(),
            pollConversations(),
        ]);
        return hasNewMsgs || hasNewConvs;
    }, [pollMessages, pollConversations]);

    usePolling(pollAll, 3000, 8000);

    // Auto-open conversation when userId param is present (from Profile → Message)
    useEffect(() => {
        const targetUserId = searchParams.get('userId');
        if (!targetUserId || !conversations.length) return;

        const openConversation = async () => {
            try {
                const res = await chatService.getOrCreateConversation(Number(targetUserId));
                if (res.success && res.data) {
                    // Find in conversations list or use the returned one
                    const existing = conversations.find(c => c.id === res.data.id);
                    const conv = existing || res.data;
                    setSelectedConversation(conv);
                    if (conv.id) {
                        const msgRes = await chatService.getMessages(conv.id);
                        setMessages(msgRes.data || []);
                    }
                    if (!existing) {
                        fetchData(); // Refresh list to include the new conversation
                    }
                }
            } catch (e) {
                console.error("Lỗi mở hội thoại:", e);
            }
            // Clear the param to prevent re-triggering
            setSearchParams({}, { replace: true });
        };

        openConversation();
    }, [searchParams, conversations.length]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleSelect = useCallback(async (item: any, type: 'chat' | 'friend') => {
        if (type === 'friend') {
            const targetId = Number(item.user.id);
            const existing = conversations.find(c => 
                c.type === 'PRIVATE' && 
                c.members?.some(m => Number(m.user_id) === targetId)
            );
            
            if (existing) {
                setSelectedConversation(existing);
                const res = await chatService.getMessages(existing.id);
                setMessages(res.data || []);
            } else {
                setSelectedConversation({
                    id: 0, 
                    type: "PRIVATE",
                    name: item.user.username,
                    members: [
                        { user_id: currentUserId },
                        { user_id: targetId, user: item.user }
                    ]
                } as any);
                setMessages([]);
            }
        } else {
            setSelectedConversation(item);
            const res = await chatService.getMessages(item.id);
            setMessages(res.data || []);
        }
    }, [conversations, currentUserId]);

    const handleSend = useCallback(async (content: string, files?: File[]) => {
        if (!selectedConversation || (!content.trim() && (!files || files.length === 0))) return;

        const tempId = Date.now();
        const tempMsg: Message = { 
            id: tempId, 
            conversation_id: selectedConversation.id,
            sender_id: currentUserId, 
            content, 
            created_at: new Date().toISOString() 
        };
        setMessages(prev => [...prev, tempMsg]);

        try {
            let res;
            if (selectedConversation.id === 0) {
                const other = selectedConversation.members?.find(m => m.user_id !== currentUserId);
                res = await chatService.sendPrivateMessage(Number(other?.user_id), content, files);
                if (res.success) fetchData();
            } else {
                res = await chatService.sendGroupMessage(selectedConversation.id, content, files);
            }

            if (res?.success && res.data) {
                // Replace temp message with real message (which includes attachments)
                setMessages(prev => prev.map(msg => msg.id === tempId ? res.data : msg));
            }
        } catch (e) { 
            // Remove temp msg on failure
            setMessages(prev => prev.filter(msg => msg.id !== tempId));
            alert("Lỗi gửi tin: Có thể file tải lên quá lớn."); 
        }
    }, [selectedConversation, currentUserId, fetchData]);

    const handleCreateGroup = async () => {
        if (!newGroupName.trim() || selectedFriendIds.length === 0) return;
        try {
            const res = await chatService.createGroup(newGroupName, selectedFriendIds);
            if (res.success) {
                setIsCreateModalOpen(false);
                setNewGroupName("");
                setSelectedFriendIds([]);
                setIsFriendDropdownOpen(false);
                fetchData();
            }
        } catch (e) { alert("Lỗi tạo nhóm!"); }
    };

    const handleGroupAction = async (actionType: string, payload?: any) => {
        if (!selectedConversation || selectedConversation.id === 0) return;
        const id = selectedConversation.id;

        try {
            switch (actionType) {
                case 'RENAME':
                    if (tempGroupName.trim()) {
                        await chatService.renameGroup(id, tempGroupName);
                        setSelectedConversation(prev => prev ? {...prev, name: tempGroupName} : null);
                        setIsRenameModalOpen(false);
                    }
                    break;
                case 'LEAVE':
                    await chatService.leaveGroup(id);
                    setSelectedConversation(null);
                    setMessages([]);
                    setIsLeaveModalOpen(false);
                    break;
                case 'ADD_ADMIN':
                    await chatService.addAdmin(id, payload);
                    setIsTransferAdminModalOpen(false);
                    alert("Đã chỉ định Admin mới");
                    break;
                case 'REMOVE_MEMBER':
                    await chatService.removeMember(id, payload);
                    break;
            }
            fetchData();
        } catch (e) { alert("Thao tác thất bại!"); }
    };

    const handleAddMembers = async () => {
        if (!selectedConversation || selectedNewMemberIds.length === 0) return;
        try {
            await Promise.all(
                selectedNewMemberIds.map(userId => chatService.addAdmin(selectedConversation.id, userId))
            );
            setIsAddMemberModalOpen(false);
            setSelectedNewMemberIds([]);
            setIsAddMemberDropdownOpen(false);
            fetchData();
        } catch (e) { alert("Lỗi khi thêm thành viên!"); }
    };

    return (
        <div className={`messages-page ${isMobile ? "mobile" : "desktop"}`}>
            {(!isMobile || !selectedConversation) && (
                <div className="messages-sidebar">
                    <ConversationList
                        conversations={conversations as any}
                        friends={friends}
                        selectedId={selectedConversation?.id as any || null}
                        onSelect={handleSelect}
                        currentUserId={String(currentUserId)}
                        onCreateNewGroup={() => setIsCreateModalOpen(true)}
                    />
                </div>
            )}
            
            {(!isMobile || selectedConversation) && (
                <div className="messages-content">
                    {selectedConversation ? (
                        <ChatArea
                            conversation={selectedConversation as any}
                            messages={messages as any}
                            currentUserId={String(currentUserId)}
                            onSendMessage={handleSend}
                            onRenameGroup={() => {
                                setTempGroupName(selectedConversation.name || "");
                                setIsRenameModalOpen(true);
                            }}
                            onLeaveGroup={() => setIsLeaveModalOpen(true)}
                            onAddMember={() => setIsAddMemberModalOpen(true)}
                            onTransferAdmin={() => setIsTransferAdminModalOpen(true)}
                            onBack={() => setSelectedConversation(null)}
                            isMobile={isMobile}
                        />
                    ) : (
                        <div className="empty-state"></div>
                    )}
                </div>
            )}

            {isCreateModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <div className="modal-header">
                            <h3>Tạo nhóm mới</h3>
                            <button className="close-btn" onClick={() => setIsCreateModalOpen(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <input className="group-name-input" placeholder="Tên nhóm..." value={newGroupName} onChange={e => setNewGroupName(e.target.value)} />
                            <div className="custom-dropdown-container">
                                <div className="dropdown-trigger" onClick={() => setIsFriendDropdownOpen(!isFriendDropdownOpen)}>
                                    {selectedFriendIds.length > 0 ? `Đã chọn ${selectedFriendIds.length} bạn bè` : "Chọn thành viên..."}
                                    <span className={`arrow ${isFriendDropdownOpen ? 'up' : 'down'}`}>▼</span>
                                </div>
                                {isFriendDropdownOpen && (
                                    <div className="dropdown-content">
                                        {friends.map(f => {
                                            const isSelected = selectedFriendIds.includes(Number(f.user.id));
                                            return (
                                                <div key={f.user.id} className={`dropdown-item ${isSelected ? 'selected' : ''}`}
                                                    onClick={() => {
                                                        const id = Number(f.user.id);
                                                        setSelectedFriendIds(prev => isSelected ? prev.filter(i => i !== id) : [...prev, id]);
                                                    }}>
                                                    <img src={(f.user as any).avatarUrl || (f.user as any).avatar_url || "/default-avatar.png"} alt="" />
                                                    <span>{f.user.username}</span>
                                                    {isSelected && <span className="check-mark">✓</span>}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-cancel" onClick={() => setIsCreateModalOpen(false)}>Hủy</button>
                            <button className="btn-confirm" onClick={handleCreateGroup} disabled={!newGroupName.trim() || selectedFriendIds.length === 0}>Xác nhận</button>
                        </div>
                    </div>
                </div>
            )}

            {isAddMemberModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <div className="modal-header">
                            <h3>Thêm vào nhóm</h3>
                            <button className="close-btn" onClick={() => setIsAddMemberModalOpen(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="custom-dropdown-container">
                                <div className="dropdown-trigger" onClick={() => setIsAddMemberDropdownOpen(!isAddMemberDropdownOpen)}>
                                    {selectedNewMemberIds.length > 0 ? `Đã chọn ${selectedNewMemberIds.length} người` : "Chọn bạn bè..."}
                                    <span className={`arrow ${isAddMemberDropdownOpen ? 'up' : 'down'}`}>▼</span>
                                </div>
                                {isAddMemberDropdownOpen && (
                                    <div className="dropdown-content">
                                        {friends.filter(f => !selectedConversation?.members?.some(m => Number(m.user_id) === Number(f.user.id))).map(f => {
                                            const isSelected = selectedNewMemberIds.includes(Number(f.user.id));
                                            return (
                                                <div key={f.user.id} className={`dropdown-item ${isSelected ? 'selected' : ''}`}
                                                    onClick={() => {
                                                        const id = Number(f.user.id);
                                                        setSelectedNewMemberIds(prev => isSelected ? prev.filter(i => i !== id) : [...prev, id]);
                                                    }}>
                                                    <img src={(f.user as any).avatarUrl || (f.user as any).avatar_url || "/default-avatar.png"} alt="" />
                                                    <span>{f.user.username}</span>
                                                    {isSelected && <span className="check-mark">✓</span>}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-cancel" onClick={() => setIsAddMemberModalOpen(false)}>Hủy</button>
                            <button className="btn-confirm" onClick={handleAddMembers} disabled={selectedNewMemberIds.length === 0}>Thêm</button>
                        </div>
                    </div>
                </div>
            )}

            {isRenameModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <div className="modal-header">
                            <h3>Đổi tên nhóm</h3>
                            <button className="close-btn" onClick={() => setIsRenameModalOpen(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <input className="group-name-input" value={tempGroupName} onChange={e => setTempGroupName(e.target.value)} placeholder="Nhập tên mới..." />
                        </div>
                        <div className="modal-footer">
                            <button className="btn-cancel" onClick={() => setIsRenameModalOpen(false)}>Hủy</button>
                            <button className="btn-confirm" onClick={() => handleGroupAction('RENAME')}>Lưu</button>
                        </div>
                    </div>
                </div>
            )}

            {isTransferAdminModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <div className="modal-header">
                            <h3>Chỉ định Admin</h3>
                            <button className="close-btn" onClick={() => setIsTransferAdminModalOpen(false)}>×</button>
                        </div>
                        <div className="modal-body friend-selector-list">
                            {selectedConversation?.members?.filter(m => Number(m.user_id) !== currentUserId).map(m => (
                                <div key={m.user_id} className="dropdown-item cursor-pointer" onClick={() => handleGroupAction('ADD_ADMIN', m.user_id)}>
                                    <img src={(m.user as any)?.avatar_url || (m.user as any)?.avatarUrl || "/default-avatar.png"} alt="" />
                                    <span>{m.user?.username}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {isLeaveModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <div className="modal-header">
                            <h3>Rời khỏi nhóm</h3>
                            <button className="close-btn" onClick={() => setIsLeaveModalOpen(false)}>×</button>
                        </div>
                        <div className="modal-body text-center">
                            <p>Bạn có chắc muốn rời nhóm <strong>{selectedConversation?.name}</strong>?</p>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-cancel" onClick={() => setIsLeaveModalOpen(false)}>Hủy</button>
                            <button className="btn-confirm danger" onClick={() => handleGroupAction('LEAVE')}>Rời nhóm</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MessagesPage;