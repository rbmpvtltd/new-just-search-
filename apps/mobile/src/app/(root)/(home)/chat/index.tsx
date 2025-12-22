import BoundaryWrapper from "@/components/layout/BoundaryWrapper";
import ConversationList from "@/features/chat/ConversationList";

export default function index() {
  return (
    <BoundaryWrapper>
      <ConversationList />
    </BoundaryWrapper>
  );
}
