import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import HelpAndSupportChat from "@/features/help-and-support/chat/HelpAndSupportPrivateChat";

export default function Chats() {
  const { id } = useLocalSearchParams();
  const conversationId = Array.isArray(id) ? id[0] : id;

  return (
    <View>
      <HelpAndSupportChat chatTokenSessionId={Number(conversationId)} />
    </View>
  );
}
