import Editor from "@/components/dom-components/hello-dom";
import Preview from "@/components/dom-components/Preview";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";

export default function TextEditorDemo() {
  const [editorState, setEditorState] = useState<string | null>(null);
  const [plainText, setPlainText] = useState("");
  const wordCount = editorState?.split(" ").length ?? 0;
  return (
    <ScrollView className="flex-1">
      {/* <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 16 }}>Words: {wordCount}</Text>
      </View> */}
      <View style={{ height: 270 }}>
        <Editor setPlainText={setPlainText} setEditorState={setEditorState} />
      </View>
    </ScrollView>
  );
}
