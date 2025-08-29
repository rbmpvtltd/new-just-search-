import { useLocalSearchParams } from "expo-router";
import React, { useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Pressable } from "react-native-gesture-handler";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Loading } from "@/components/ui/Loading";
import { useChatMessages } from "@/query/chatMessages";
import { useSendMessage } from "@/query/sendMessage";
import { useAuthStore } from "@/store/authStore";

const ChatScreen = () => {
  const { chat } = useLocalSearchParams();
  const [inputText, setInputText] = useState<string>("");
  const role = useAuthStore((state) => state.role);
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList>(null);
  const chatSessionId = Array.isArray(chat) ? chat[0] : chat;
  const { data, isLoading, isError, refetch } = useChatMessages(chatSessionId);
  const { mutate: sendMutation } = useSendMessage();

  if (isLoading) {
    return <Loading position="center" />;
  }

  if (isError || !data?.chat_session) {
    return (
      <Text className="text-center mt-10 text-error">
        Chat could not be loaded try again.
      </Text>
    );
  }

  const messages = data?.messages;

  const sendMessage = () => {
    if (inputText.trim()) {
      sendMutation(
        {
          sessionType: data?.chat_session?.type,
          body: {
            message: inputText,
            chat_session_id: Number(chatSessionId),
            sender_type: role === "visitor" ? "user" : "owner",
          },
        },
        {
          onSuccess: async () => {
            await refetch();
          },
          onError: (err) => {
            console.error("Send failed:", err);
          },
        },
      );
      setInputText("");
    }
  };

  const renderMessage = ({ item }: { item: any }) => {
    return (
      <View
        className={`flex-row gap-4 justify-between items-end max-w-[80%] min-w-[30%] p-[10px] my-1 rounded-xl ${item.thisuser ? "self-end bg-success-content" : "self-start bg-error-content"}`}
      >
        <Text
          className={`text-[16px] ${item.thisuser ? "text-success" : "text-error"}`}
        >
          {item.message}
        </Text>
        <Text className="text-[10px] w-max">
          {new Date(item.created_at).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-base-200" edges={["top"]}>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        contentContainerStyle={[
          styles.messageList,
          { justifyContent: "flex-end" },
        ]}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? insets.bottom : 0}
      >
        <View
          className="flex-row p-[10px] bg-base-100 border-t-secondary"
          style={{ paddingBottom: insets.bottom }}
        >
          <TextInput
            className="bg-base-100 flex-1 rounded-[20px] p-[10px] mr-[10px] text-[16px] text-secondary"
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type your message..."
            placeholderTextColor="#999"
          />
          <Pressable
            className="bg-primary rounded-[20px] p-[10px] justify-center items-center"
            onPress={sendMessage}
          >
            <Text className="text-secondary text-[16px] font-semibold">
              Send
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#007AFF",
    padding: 15,
    alignItems: "center",
  },
  headerText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  messageList: {
    flexGrow: 1,
    padding: 10,
  },
  messageContainer: {
    maxWidth: "80%",
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
  },
  userMessage: {
    backgroundColor: "#007AFF",
    alignSelf: "flex-end",
  },
  botMessage: {
    backgroundColor: "#e5e5ea",
    alignSelf: "flex-start",
  },
  messageText: {
    color: "#000",
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  input: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    padding: 10,
    marginRight: 10,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: "#007AFF",
    borderRadius: 20,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default React.memo(ChatScreen);
