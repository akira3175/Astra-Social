import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import PostDetailModal from "../Home/components/PostDetailModal";
import type { Post } from "../../types/post";
import {getPostById} from "../../services/postService";

const PostDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [open, setOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadPost();
    }
  }, [id]);

  const loadPost = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getPostById(Number(id));
      if (data.success) {
        setPost(data.data);
      } else {
        setError("Không tìm thấy bài viết");
      }
    } catch (err) {
      console.error(err);
      setError("Đã xảy ra lỗi khi tải bài viết");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    navigate(-1); // quay lại trang trước
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <p>Đang tải bài viết...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', flexDirection: 'column' }}>
        <p>{error}</p>
        <button onClick={() => navigate(-1)} style={{ marginTop: '10px' }}>Quay lại</button>
      </div>
    );
  }

  if (!post) {
      return null;
  }

  return (
    <PostDetailModal
      key={post.id}
      open={open}
      post={post}
      onClose={handleClose}
    />
  );
};

export default PostDetailPage;