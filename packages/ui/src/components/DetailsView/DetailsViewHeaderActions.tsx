import { MessageSquare, Plus } from "lucide-react";

import { Button } from "../Button";
import { IconButton } from "../IconButton";

export const DetailsViewHeaderActions = () => (
  <div className="flex flex-wrap items-center gap-2">
    <Button size="6" iconStart={<Plus className="size-4" />}>
      Primary
    </Button>

    <Button variant="ghost" size="6" iconStart={<Plus className="size-4" />}>
      Secondary
    </Button>

    <IconButton aria-label="Open chat with AI assistant (feature coming soon)">
      <MessageSquare className="size-3 text-gray-500" />
    </IconButton>
  </div>
);
