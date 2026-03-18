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

  useEffect(() => {
    if (id) {
      loadPost();
    }
  }, [id]);

  const loadPost = async () => {
    try {
      const data = await getPostById(Number(id));
      setPost(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleClose = () => {
    setOpen(false);
    navigate(-1); // quay lại trang trước
  };
  return (
    <PostDetailModal
      open={open}
      post={post}
      onClose={handleClose}
    />
  );
};

export default PostDetailPage;