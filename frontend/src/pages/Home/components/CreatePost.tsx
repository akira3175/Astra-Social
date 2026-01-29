import React, { useState } from "react";
import { Avatar } from "../../../components/ui";
import { useCurrentUser } from "../../../context/currentUserContext";
import CreatePostModal from "./CreatePostModal";
import "./CreatePost.css";

const CreatePost: React.FC = () => {
    const { currentUser } = useCurrentUser() ?? {};
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <div className="create-post-card">
                <div className="create-post-header">
                    <Avatar
                        src={currentUser?.avatar}
                        alt={currentUser?.username || "User"}
                        className="create-post-avatar"
                        width={48}
                        height={48}
                    >
                        {!currentUser?.avatar && (currentUser?.firstName?.[0] || currentUser?.username?.[0] || "U")}
                    </Avatar>
                    <div className="create-post-input" onClick={handleOpenModal}>
                        <span className="create-post-placeholder">
                            Bạn đang nghĩ gì, {currentUser?.firstName || "bạn"}?
                        </span>
                    </div>
                </div>
                <div className="create-post-actions">
                    <button className="create-post-action-btn" onClick={handleOpenModal}>
                        <span className="action-icon-photo">📷</span>
                        <span>Ảnh</span>
                    </button>
                    <button className="create-post-action-btn" onClick={handleOpenModal}>
                        <span className="action-icon-video">🎥</span>
                        <span>Video</span>
                    </button>
                    <button className="create-post-action-btn" onClick={handleOpenModal}>
                        <span className="action-icon-event">📅</span>
                        <span>Sự kiện</span>
                    </button>
                </div>
            </div>

            <CreatePostModal open={isModalOpen} onClose={handleCloseModal} />
        </>
    );
};

export default CreatePost;
