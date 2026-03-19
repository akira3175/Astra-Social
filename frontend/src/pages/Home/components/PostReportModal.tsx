import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import "./PostReportModal.css";

interface PostReportModalProps {
  postId: number;
  open: boolean;
  onClose: () => void;
  onSubmit?: (reason: string, detail?: string) => Promise<void> | void;
}

const REPORT_REASONS = [
  "Spam",
  "Thông tin sai lệch",
  "Quấy rối hoặc bắt nạt",
  "Nội dung bạo lực",
  "Ngôn từ kích động thù ghét",
  "Nội dung không phù hợp",
  "Khác"
];

const PostReportModal: React.FC<PostReportModalProps> = ({
  postId,
  open,
  onClose,
  onSubmit
}) => {
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [detail, setDetail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (open) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  const handleSubmit = async () => {
    if (!selectedReason) return;

    try {
      setIsSubmitting(true);
      await onSubmit?.(selectedReason, detail);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const modal = (
    <div className="prm-overlay" onClick={onClose}>
      <div
        className="prm-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="prm-header">
          <h3>Báo cáo bài viết</h3>
          <button className="prm-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="prm-body">
          <p className="prm-description">
            Tại sao bạn muốn báo cáo bài viết này?
          </p>

          <div className="prm-reasons">
            {REPORT_REASONS.map((reason) => (
              <label key={reason} className="prm-reason">
                <input
                  type="radio"
                  name="reportReason"
                  value={reason}
                  checked={selectedReason === reason}
                  onChange={() => setSelectedReason(reason)}
                />
                <span>{reason}</span>
              </label>
            ))}
          </div>

          <textarea
            className="prm-textarea"
            placeholder="Mô tả thêm (không bắt buộc)..."
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
          />
        </div>

        <div className="prm-footer">
          <button
            className="prm-btn prm-cancel"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Hủy
          </button>

          <button
            className="prm-btn prm-submit"
            onClick={handleSubmit}
            disabled={!selectedReason || isSubmitting}
          >
            {isSubmitting ? "Đang gửi..." : "Gửi báo cáo"}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
};

export default PostReportModal;
