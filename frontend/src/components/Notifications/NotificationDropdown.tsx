import React from "react";
import { IconButton } from "../ui/IconButton";
import { BookmarkIcon } from "../ui/Icons";
import { Badge } from "../ui/Badge/Badge";

const NotificationDropdown: React.FC = () => {
    return (
        <IconButton>
            <Badge badgeContent={0} color="error" invisible>
                <BookmarkIcon />
            </Badge>
        </IconButton>
    );
};

export default NotificationDropdown;
