import React, { useState, useRef, useEffect } from "react";
import {
    Modal,
    Avatar,
    ImageIcon,
    SendIcon,
} from "../../../components/ui";
import { useCurrentUser } from "../../../context/currentUserContext";
import { createPost } from "../../../services/postService";
import { improvePostText, generateCaptionFromImages } from "../../../services/aiService";
import "./CreatePostModal.css";

interface CreatePostModalProps {
    open: boolean;
    onClose: () => void;
    onPostCreated?: () => void;
}

interface FileWithPreview {
    file: File;
    previewUrl: string;
    id: string;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ open, onClose, onPostCreated }) => {
    const [content, setContent] = useState<string>("");
    const [filesWithPreview, setFilesWithPreview] = useState<FileWithPreview[]>([]);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
    const [aiAction, setAiAction] = useState<"improve" | "caption" | null>(null);
    const [error, setError] = useState<string | null>(null);
    const { currentUser } = useCurrentUser() ?? {};
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        return () => {
            filesWithPreview.forEach((f) => URL.revokeObjectURL(f.previewUrl));
        };
    }, []);

    const handleClose = () => {
        filesWithPreview.forEach((f) => URL.revokeObjectURL(f.previewUrl));
        setContent("");
        setFilesWithPreview([]);
        setError(null);
        setIsAiLoading(false);
        setAiAction(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        onClose();
    };

    const handleCreatePost = async () => {
        if (!content.trim() && filesWithPreview.length === 0) return;
        setIsUploading(true);
        setError(null);
        try {
            const files = filesWithPreview.map((f) => f.file);
            await createPost({
                content: content.trim() || undefined,
                privacy: "PUBLIC",
                files: files.length > 0 ? files : undefined,
            });
            handleClose();
            onPostCreated?.();
        } catch (err: any) {
            setError(err?.response?.data?.message || "Không thể đăng bài. Vui lòng thử lại.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleImageClick = () => {
        if (filesWithPreview.length >= 4) { alert("Bạn chỉ có thể tải lên tối đa 4 ảnh"); return; }
        if (fileInputRef.current) { fileInputRef.current.value = ""; fileInputRef.current.click(); }
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
        if (event.target) event.target.value = "";
    };

    const handleRemoveSelectedImage = (idToRemove: string) => {
        setFilesWithPreview((files) => {
            const fileToRemove = files.find((f) => f.id === idToRemove);
            if (fileToRemove) URL.revokeObjectURL(fileToRemove.previewUrl);
            return files.filter((f) => f.id !== idToRemove);
        });
    };

    // ── AI handlers ─────────────────────────────────────────────
    const handleImproveText = async () => {
        if (!content.trim()) return;
        setIsAiLoading(true);
        setAiAction("improve");
        setError(null);
        try {
            const improved = await improvePostText(content);
            setContent(improved);
        } catch (e: any) {
            setError(e?.message || "AI không thể cải thiện bài viết. Thử lại sau.");
        } finally {
            setIsAiLoading(false);
            setAiAction(null);
        }
    };

    const handleGenerateCaption = async () => {
        if (filesWithPreview.length === 0) return;
        setIsAiLoading(true);
        setAiAction("caption");
        setError(null);
        try {
            const caption = await generateCaptionFromImages(filesWithPreview.map(f => f.file));
            setContent(caption);
        } catch (e: any) {
            setError(e?.message || "AI không thể tạo nội dung từ ảnh. Thử lại sau.");
        } finally {
            setIsAiLoading(false);
            setAiAction(null);
        }
    };

    const isBusy = isUploading || isAiLoading;

    return (
        <Modal open={open} onClose={handleClose} title="Tạo bài viết mới" maxWidth="sm" fullWidth>
            <div className="create-post-modal-content">
                <div className="create-post-modal-header">
                    <Avatar
                        src={currentUser?.avatar}
                        alt={currentUser?.username || "User"}
                        width={44}
                        height={44}
                        className="create-post-modal-avatar"
                    >
                        {!currentUser?.avatar && (currentUser?.firstName?.[0] || currentUser?.username?.[0] || "U")}
                    </Avatar>
                    <textarea
                        className="create-post-modal-textarea"
                        placeholder="Bạn đang nghĩ gì?"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={4}
                        disabled={isBusy}
                    />
                </div>

                {/* AI toolbar — appears when there's content or images */}
                {(content.trim() || filesWithPreview.length > 0) && (
                    <div className="create-post-ai-toolbar">
                        <span className="create-post-ai-label">✨ AI</span>

                        {content.trim() && (
                            <button
                                className="create-post-ai-btn"
                                onClick={handleImproveText}
                                disabled={isBusy}
                                type="button"
                            >
                                {isAiLoading && aiAction === "improve"
                                    ? <><span className="ai-spinner" /> Đang cải thiện...</>
                                    : <>✨ Cải thiện bài viết</>}
                            </button>
                        )}

                        {filesWithPreview.length > 0 && (
                            <button
                                className="create-post-ai-btn"
                                onClick={handleGenerateCaption}
                                disabled={isBusy}
                                type="button"
                            >
                                {isAiLoading && aiAction === "caption"
                                    ? <><span className="ai-spinner" /> Đang phân tích ảnh...</>
                                    : <>🖼️ Tạo nội dung từ ảnh</>}
                            </button>
                        )}
                    </div>
                )}

                {filesWithPreview.length > 0 && (
                    <div className="create-post-images">
                        {filesWithPreview.map((fileData) => (
                            <div key={fileData.id} className="create-post-image-preview">
                                <img src={fileData.previewUrl} alt="Preview" />
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

                {error && <div className="create-post-error">{error}</div>}

                <div className="create-post-modal-divider" />

                <div className="create-post-modal-actions">
                    <button className="create-post-add-image-btn" onClick={handleImageClick} disabled={isBusy} type="button">
                        <ImageIcon size={20} />
                        Thêm ảnh
                    </button>
                    <button
                        className="create-post-submit-btn"
                        onClick={handleCreatePost}
                        disabled={isBusy || (!content.trim() && filesWithPreview.length === 0)}
                        type="button"
                    >
                        <SendIcon size={18} />
                        {isUploading ? "Đang đăng..." : "Đăng bài"}
                    </button>
                </div>

                <input type="file" accept="image/*" multiple style={{ display: "none" }} ref={fileInputRef} onChange={handleFileChange} />
            </div>
        </Modal>
    );
};

export default CreatePostModal;
