import React, { useState } from "react";
import { Avatar } from "../../../components/ui";
import { useCurrentUser } from "../../../context/currentUserContext";
import CreatePostModal from "./CreatePostModal";
import "./CreatePost.css";

interface CreatePostProps {
    onPostCreated?: () => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ onPostCreated }) => {
    const { currentUser } = useCurrentUser() ?? {};
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [initialAction, setInitialAction] = useState<"photo" | "video" | null>(null);

    const handleOpenModal = (action: "photo" | "video" | null = null) => {
        setInitialAction(action);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setInitialAction(null);
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
                    <div className="create-post-input" onClick={() => handleOpenModal(null)}>
                        <span className="create-post-placeholder">
                            Bạn đang nghĩ gì, {currentUser?.firstName || "bạn"}?
                        </span>
                    </div>
                </div>
                <div className="create-post-actions">
                    <button className="create-post-action-btn" onClick={() => handleOpenModal("photo")}>
                        <span className="action-icon-photo">📷</span>
                        <span>Ảnh</span>
                    </button>
                    <button className="create-post-action-btn" onClick={() => handleOpenModal("video")}>
                        <span className="action-icon-video">🎥</span>
                        <span>Video</span>
                    </button>
                </div>
            </div>

            <CreatePostModal
                open={isModalOpen}
                onClose={handleCloseModal}
                onPostCreated={onPostCreated}
                initialAction={initialAction}
            />
        </>
    );
};

export default CreatePost;
