import React, { useState, useCallback, useEffect, useRef } from "react";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { usePolling } from "../../hooks/usePolling";
import { useSearchParams } from "react-router-dom";
import ConversationList from "./components/ConversationList";
import ChatArea from "./components/ChatArea";
import * as chatService from "../../services/chatService";
import friendshipService from "../../services/friendshipService";
import { useCurrentUser } from "../../context/currentUserContext";
import { SearchIcon, PlusIcon, PersonAddIcon, EditIcon, CrownIcon } from "../../components/ui";
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
    const [isCreatingGroup, setIsCreatingGroup] = useState(false);

    const [isFriendDropdownOpen, setIsFriendDropdownOpen] = useState(false);
    const [isAddMemberDropdownOpen, setIsAddMemberDropdownOpen] = useState(false);

    const [newGroupName, setNewGroupName] = useState("");
    const [tempGroupName, setTempGroupName] = useState("");
    const [selectedFriendIds, setSelectedFriendIds] = useState<number[]>([]);
    const [selectedNewMemberIds, setSelectedNewMemberIds] = useState<number[]>([]);
    const [createSearchQuery, setCreateSearchQuery] = useState("");
    const [addMemberSearchQuery, setAddMemberSearchQuery] = useState("");

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
        if (!newGroupName.trim() || selectedFriendIds.length === 0 || isCreatingGroup) return;
        setIsCreatingGroup(true);
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
        finally {
            setIsCreatingGroup(false);
        }
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

            {/* ═══ CREATE GROUP MODAL ═══ */}
            {isCreateModalOpen && (() => {
                const getAvatarSrc = (user: any) => (user as any).avatar_url || (user as any).avatarUrl || "/default-avatar.png";
                const getDisplayName = (user: any) => `${user.lastName || ""} ${user.firstName || ""}`.trim() || user.username;
                const filteredFriends = friends.filter(f => {
                    const name = getDisplayName(f.user);
                    return name.toLowerCase().includes(createSearchQuery.toLowerCase());
                });
                return (
                <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setIsCreateModalOpen(false); }}>
                    <div className="modal-box">
                        <div className="modal-header">
                            <div className="modal-header-title">
                                <div className="modal-header-icon">
                                    <PlusIcon size={20} />
                                </div>
                                <div>
                                    <h3>Tạo nhóm mới</h3>
                                    <span className="modal-header-subtitle">Thêm bạn bè vào nhóm chat</span>
                                </div>
                            </div>
                            <button className="close-btn" onClick={() => setIsCreateModalOpen(false)}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="input-with-icon">
                                <span className="input-icon">👥</span>
                                <input className="group-name-input" placeholder="Nhập tên nhóm..." value={newGroupName} onChange={e => setNewGroupName(e.target.value)} />
                            </div>

                            {selectedFriendIds.length > 0 && (
                                <div className="selected-members-chips">
                                    {selectedFriendIds.map(id => {
                                        const friend = friends.find(f => Number(f.user.id) === id);
                                        if (!friend) return null;
                                        const name = getDisplayName(friend.user);
                                        return (
                                            <div key={id} className="member-chip">
                                                <img className="member-chip-avatar" src={getAvatarSrc(friend.user)}
                                                    onError={(e) => { e.currentTarget.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(name) + '&background=c7d2fe&color=4338ca&size=48'; }} alt="" />
                                                <span>{name}</span>
                                                <button className="member-chip-remove" onClick={() => setSelectedFriendIds(prev => prev.filter(i => i !== id))}>×</button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            <div className="member-selection-section">
                                <span className="member-section-label">Chọn thành viên</span>
                                <div className="friend-search-wrapper">
                                    <span className="search-icon"><SearchIcon size={16} /></span>
                                    <input className="friend-search-input" placeholder="Tìm bạn bè..." value={createSearchQuery} onChange={e => setCreateSearchQuery(e.target.value)} />
                                </div>
                                <div className="friend-list-container">
                                    {filteredFriends.length === 0 ? (
                                        <div className="friend-list-empty">Không tìm thấy bạn bè</div>
                                    ) : filteredFriends.map(f => {
                                        const isSelected = selectedFriendIds.includes(Number(f.user.id));
                                        const name = getDisplayName(f.user);
                                        return (
                                            <div key={f.user.id} className={`fb-style-friend-item ${isSelected ? 'selected' : ''}`}
                                                onClick={() => {
                                                    const id = Number(f.user.id);
                                                    setSelectedFriendIds(prev => isSelected ? prev.filter(i => i !== id) : [...prev, id]);
                                                }}>
                                                <div className="friend-info">
                                                    <img className="friend-avatar-modal" src={getAvatarSrc(f.user)}
                                                        onError={(e) => { e.currentTarget.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(name) + '&background=c7d2fe&color=4338ca&size=80'; }} alt="" />
                                                    <span>{name}</span>
                                                </div>
                                                <div className={`checkbox-circle ${isSelected ? 'checked' : ''}`}>
                                                    {isSelected && <span className="check-mark">✓</span>}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-cancel" onClick={() => setIsCreateModalOpen(false)}>Hủy</button>
                            <button className="btn-confirm" onClick={handleCreateGroup} disabled={!newGroupName.trim() || selectedFriendIds.length === 0 || isCreatingGroup}>
                                {isCreatingGroup ? "Đang tạo..." : "Tạo nhóm"}
                            </button>
                        </div>
                    </div>
                </div>
                );
            })()}

            {/* ═══ ADD MEMBER MODAL ═══ */}
            {isAddMemberModalOpen && (() => {
                const getAvatarSrc = (user: any) => (user as any).avatar_url || (user as any).avatarUrl || "/default-avatar.png";
                const getDisplayName = (user: any) => `${user.lastName || ""} ${user.firstName || ""}`.trim() || user.username;
                const availableFriends = friends.filter(f => !selectedConversation?.members?.some(m => Number(m.user_id) === Number(f.user.id)));
                const filteredFriends = availableFriends.filter(f => {
                    const name = getDisplayName(f.user);
                    return name.toLowerCase().includes(addMemberSearchQuery.toLowerCase());
                });
                return (
                <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setIsAddMemberModalOpen(false); }}>
                    <div className="modal-box">
                        <div className="modal-header">
                            <div className="modal-header-title">
                                <div className="modal-header-icon">
                                    <PersonAddIcon size={20} />
                                </div>
                                <div>
                                    <h3>Thêm thành viên</h3>
                                    <span className="modal-header-subtitle">Mời bạn bè vào nhóm</span>
                                </div>
                            </div>
                            <button className="close-btn" onClick={() => setIsAddMemberModalOpen(false)}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>
                        <div className="modal-body">
                            {selectedNewMemberIds.length > 0 && (
                                <div className="selected-members-chips">
                                    {selectedNewMemberIds.map(id => {
                                        const friend = friends.find(f => Number(f.user.id) === id);
                                        if (!friend) return null;
                                        const name = getDisplayName(friend.user);
                                        return (
                                            <div key={id} className="member-chip">
                                                <img className="member-chip-avatar" src={getAvatarSrc(friend.user)}
                                                    onError={(e) => { e.currentTarget.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(name) + '&background=c7d2fe&color=4338ca&size=48'; }} alt="" />
                                                <span>{name}</span>
                                                <button className="member-chip-remove" onClick={() => setSelectedNewMemberIds(prev => prev.filter(i => i !== id))}>×</button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            <div className="member-selection-section">
                                <span className="member-section-label">Bạn bè có thể thêm</span>
                                <div className="friend-search-wrapper">
                                    <span className="search-icon"><SearchIcon size={16} /></span>
                                    <input className="friend-search-input" placeholder="Tìm bạn bè..." value={addMemberSearchQuery} onChange={e => setAddMemberSearchQuery(e.target.value)} />
                                </div>
                                <div className="friend-list-container">
                                    {filteredFriends.length === 0 ? (
                                        <div className="friend-list-empty">Không có bạn bè nào để thêm</div>
                                    ) : filteredFriends.map(f => {
                                        const isSelected = selectedNewMemberIds.includes(Number(f.user.id));
                                        const name = getDisplayName(f.user);
                                        return (
                                            <div key={f.user.id} className={`fb-style-friend-item ${isSelected ? 'selected' : ''}`}
                                                onClick={() => {
                                                    const id = Number(f.user.id);
                                                    setSelectedNewMemberIds(prev => isSelected ? prev.filter(i => i !== id) : [...prev, id]);
                                                }}>
                                                <div className="friend-info">
                                                    <img className="friend-avatar-modal" src={getAvatarSrc(f.user)}
                                                        onError={(e) => { e.currentTarget.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(name) + '&background=c7d2fe&color=4338ca&size=80'; }} alt="" />
                                                    <span>{name}</span>
                                                </div>
                                                <div className={`checkbox-circle ${isSelected ? 'checked' : ''}`}>
                                                    {isSelected && <span className="check-mark">✓</span>}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-cancel" onClick={() => setIsAddMemberModalOpen(false)}>Hủy</button>
                            <button className="btn-confirm" onClick={handleAddMembers} disabled={selectedNewMemberIds.length === 0}>Thêm thành viên</button>
                        </div>
                    </div>
                </div>
                );
            })()}

            {/* ═══ RENAME GROUP MODAL ═══ */}
            {isRenameModalOpen && (
                <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setIsRenameModalOpen(false); }}>
                    <div className="modal-box">
                        <div className="modal-header">
                            <div className="modal-header-title">
                                <div className="modal-header-icon">
                                    <EditIcon size={20} />
                                </div>
                                <div>
                                    <h3>Đổi tên nhóm</h3>
                                    <span className="modal-header-subtitle">Cập nhật tên hiển thị của nhóm</span>
                                </div>
                            </div>
                            <button className="close-btn" onClick={() => setIsRenameModalOpen(false)}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="input-with-icon">
                                <span className="input-icon">✏️</span>
                                <input className="group-name-input" value={tempGroupName} onChange={e => setTempGroupName(e.target.value)} placeholder="Nhập tên mới..." />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-cancel" onClick={() => setIsRenameModalOpen(false)}>Hủy</button>
                            <button className="btn-confirm" onClick={() => handleGroupAction('RENAME')} disabled={!tempGroupName.trim()}>Lưu thay đổi</button>
                        </div>
                    </div>
                </div>
            )}

            {/* ═══ TRANSFER ADMIN MODAL ═══ */}
            {isTransferAdminModalOpen && (() => {
                const getAvatarSrc = (user: any) => (user as any)?.avatar_url || (user as any)?.avatarUrl || "/default-avatar.png";
                const getDisplayName = (user: any) => `${user?.lastName || ""} ${user?.firstName || ""}`.trim() || user?.username || "Người dùng";
                return (
                <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setIsTransferAdminModalOpen(false); }}>
                    <div className="modal-box">
                        <div className="modal-header">
                            <div className="modal-header-title">
                                <div className="modal-header-icon" style={{ background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(217, 119, 6, 0.12) 100%)', color: '#d97706' }}>
                                    <CrownIcon size={20} />
                                </div>
                                <div>
                                    <h3>Chuyển nhóm trưởng</h3>
                                    <span className="modal-header-subtitle">Chọn thành viên để chuyển quyền Admin</span>
                                </div>
                            </div>
                            <button className="close-btn" onClick={() => setIsTransferAdminModalOpen(false)}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="friend-list-container">
                                {selectedConversation?.members?.filter(m => Number(m.user_id) !== currentUserId).map(m => {
                                    const name = getDisplayName(m.user);
                                    return (
                                        <div key={m.user_id} className="fb-style-friend-item" style={{ cursor: 'pointer' }}
                                            onClick={() => handleGroupAction('ADD_ADMIN', m.user_id)}>
                                            <div className="friend-info">
                                                <img className="friend-avatar-modal" src={getAvatarSrc(m.user)}
                                                    onError={(e) => { e.currentTarget.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(name) + '&background=fef3c7&color=d97706&size=80'; }} alt="" />
                                                <span>{name}</span>
                                            </div>
                                            <div style={{ color: '#d97706', fontSize: '0.8rem', fontWeight: 500 }}>Chọn →</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
                );
            })()}

            {/* ═══ LEAVE GROUP MODAL ═══ */}
            {isLeaveModalOpen && (
                <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setIsLeaveModalOpen(false); }}>
                    <div className="modal-box">
                        <div className="modal-header">
                            <div className="modal-header-title">
                                <div className="modal-header-icon" style={{ background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%)', color: '#ef4444' }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                        <polyline points="16 17 21 12 16 7"></polyline>
                                        <line x1="21" y1="12" x2="9" y2="12"></line>
                                    </svg>
                                </div>
                                <h3>Rời khỏi nhóm</h3>
                            </div>
                            <button className="close-btn" onClick={() => setIsLeaveModalOpen(false)}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="leave-confirm-content">
                                <span className="leave-confirm-icon">⚠️</span>
                                <p>Bạn có chắc muốn rời nhóm <strong>{selectedConversation?.name}</strong>?<br/>Bạn sẽ không thể xem tin nhắn nhóm nữa.</p>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-cancel" onClick={() => setIsLeaveModalOpen(false)}>Ở lại</button>
                            <button className="btn-confirm danger" onClick={() => handleGroupAction('LEAVE')}>Rời nhóm</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MessagesPage;