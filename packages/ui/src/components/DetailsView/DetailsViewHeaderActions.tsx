import { Button } from "../Button";
import { IconButton } from "../IconButton";
import { MessageSquareIcon, PlusIcon } from "../icons";

export const DetailsViewHeaderActions = () => (
  <div className="flex flex-wrap items-center gap-2">
    <Button size="xs" iconStart={<PlusIcon className="size-4" />}>
      Primary
    </Button>

    <Button
      variant="ghost"
      size="xs"
      iconStart={<PlusIcon className="size-4" />}
    >
      Secondary
    </Button>

    <IconButton
      aria-label="Open chat with AI assistant (feature coming soon)"
      size="md"
    >
      <MessageSquareIcon className="size-3 text-gray-500" />
    </IconButton>
  </div>
);
