import React, { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
    Modal,
    Avatar,
    ImageIcon,
    SendIcon,
} from "../../../components/ui";
import { useCurrentUser } from "../../../context/currentUserContext";
// import { usePostStore } from "../../../stores/postStore";
// import { uploadToCloudinary } from "../../../utils/uploadUtils";
import "./CreatePostModal.css";

interface CreatePostModalProps {
    open: boolean;
    onClose: () => void;
}

interface FileWithPreview {
    file: File;
    previewUrl: string;
    id: string;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ open, onClose }) => {
    const navigate = useNavigate();
    const [content, setContent] = useState<string>("");
    const [filesWithPreview, setFilesWithPreview] = useState<FileWithPreview[]>([]);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const { currentUser } = useCurrentUser() ?? {};
    // const { addPost } = usePostStore();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Cleanup object URLs when component unmounts or files change
    useEffect(() => {
        return () => {
            filesWithPreview.forEach((f) => URL.revokeObjectURL(f.previewUrl));
        };
    }, []);

    const handleClose = () => {
        // Revoke all URLs before closing
        filesWithPreview.forEach((f) => URL.revokeObjectURL(f.previewUrl));
        setContent("");
        setFilesWithPreview([]);
        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        onClose();
    };

    const handleCreatePost = async () => {
        if (!content.trim() && filesWithPreview.length === 0) return;

        setIsUploading(true);
        try {
            // TODO: Implement actual upload and post creation
            // const cloudinaryUrls = await uploadToCloudinary(filesWithPreview.map(f => f.file));
            // await addPost(content, cloudinaryUrls);
            console.log("Creating post:", { content, files: filesWithPreview.map(f => f.file) });
            handleClose();
        } catch (error) {
            console.error("Error creating post:", error);
        } finally {
            setIsUploading(false);
        }
    };

    const handleImageClick = () => {
        if (filesWithPreview.length >= 4) {
            alert("Bạn chỉ có thể tải lên tối đa 4 ảnh");
            return;
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const remainingSlots = 4 - filesWithPreview.length;
            const filesToAdd = Array.from(files).slice(0, remainingSlots);

            const newFilesWithPreview: FileWithPreview[] = filesToAdd.map((file) => ({
                file,
                previewUrl: URL.createObjectURL(file),
                id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            }));
            setFilesWithPreview((prev) => [...prev, ...newFilesWithPreview]);
        }
        // Reset input after handling
        if (event.target) {
            event.target.value = "";
        }
    };

    const handleRemoveSelectedImage = (idToRemove: string) => {
        setFilesWithPreview((files) => {
            const fileToRemove = files.find((f) => f.id === idToRemove);
            if (fileToRemove) {
                URL.revokeObjectURL(fileToRemove.previewUrl);
            }
            return files.filter((f) => f.id !== idToRemove);
        });
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            title="Tạo bài viết mới"
            maxWidth="sm"
            fullWidth
        >
            <div className="create-post-modal-content">
                <div className="create-post-modal-header">
                    <Avatar
                        src={currentUser?.avatar}
                        alt={currentUser?.username || "User"}
                        width={44}
                        height={44}
                        className="create-post-modal-avatar"
                    >
                        {!currentUser?.avatar &&
                            (currentUser?.firstName?.[0] ||
                                currentUser?.username?.[0] ||
                                "U")}
                    </Avatar>
                    <textarea
                        className="create-post-modal-textarea"
                        placeholder="Bạn đang nghĩ gì?"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={4}
                    />
                </div>

                {filesWithPreview.length > 0 && (
                    <div className="create-post-images">
                        {filesWithPreview.map((fileData) => (
                            <div key={fileData.id} className="create-post-image-preview">
                                <img
                                    src={fileData.previewUrl}
                                    alt="Preview"
                                />
                                <button
                                    className="create-post-image-remove"
                                    onClick={() => handleRemoveSelectedImage(fileData.id)}
                                    type="button"
                                    aria-label="Xóa ảnh"
                                >
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                        <path d="M9 3L3 9M3 3L9 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <div className="create-post-modal-divider" />

                <div className="create-post-modal-actions">
                    <button
                        className="create-post-add-image-btn"
                        onClick={handleImageClick}
                        disabled={isUploading}
                        type="button"
                    >
                        <ImageIcon size={20} />
                        Thêm ảnh
                    </button>
                    <button
                        className="create-post-submit-btn"
                        onClick={handleCreatePost}
                        disabled={
                            isUploading || (!content.trim() && filesWithPreview.length === 0)
                        }
                        type="button"
                    >
                        <SendIcon size={18} />
                        {isUploading ? "Đang đăng..." : "Đăng bài"}
                    </button>
                </div>

                <input
                    type="file"
                    accept="image/*"
                    multiple
                    style={{ display: "none" }}
                    ref={fileInputRef}
                    onChange={handleFileChange}
                />
            </div>
        </Modal>
    );
};

export default CreatePostModal;
