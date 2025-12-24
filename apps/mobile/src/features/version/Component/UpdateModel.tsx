import { useEffect, useState } from "react";
import {
  BackHandler,
  Linking,
  Modal,
  Pressable,
  Text,
  View,
} from "react-native";
import { checkAppNeedUpdate } from "@/features/version";

const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.rbm.justsearch";

export function UpdateModel({ latestVersion }: { latestVersion: string }) {
  const [showUpdate, setShowUpdate] = useState(false);

  const update = checkAppNeedUpdate(latestVersion);
  const needUpdate = update.major || update.minor || update.patch;

  // ✅ Home load hone ke baad modal dikhe
  useEffect(() => {
    if (needUpdate) {
      setShowUpdate(true);
    }
  }, [needUpdate]);

  // 🔒 Major update → back button disable
  useEffect(() => {
    if (update.major) {
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        () => true,
      );
      return () => backHandler.remove();
    }
  }, [update.major]);

  const openStore = () => {
    Linking.openURL(PLAY_STORE_URL);
  };

  return (
    <View style={{ flex: 1 }}>
      {/* ✅ HOME PAGE CONTENT (NOW VISIBLE) */}
      <Text style={{ fontSize: 22, margin: 20 }}>
        Home Page Loaded Successfully
      </Text>

      {/* 🔔 UPDATE MODAL */}
      <Modal
        visible={showUpdate}
        transparent
        animationType="fade"
        onRequestClose={() => {
          // ❌ Major update → close block
          if (!update.major) setShowUpdate(false);
        }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              padding: 20,
              borderRadius: 12,
              width: "85%",
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              Update Available
            </Text>

            <Text>Major: {update.major ? "Yes" : "No"}</Text>
            <Text>Minor: {update.minor ? "Yes" : "No"}</Text>
            <Text>Patch: {update.patch ? "Yes" : "No"}</Text>

            {/* 🔴 MAJOR UPDATE → FORCE UPDATE */}
            {update.major && (
              <Pressable
                style={{
                  marginTop: 20,
                  backgroundColor: "#e11d48",
                  padding: 12,
                  borderRadius: 8,
                }}
                onPress={openStore}
              >
                <Text style={{ color: "white", textAlign: "center" }}>
                  Update Now
                </Text>
              </Pressable>
            )}

            {/* 🟡 MINOR / PATCH → OPTIONAL */}
            {!update.major && (
              <View style={{ marginTop: 20 }}>
                <Pressable
                  style={{
                    backgroundColor: "#2563eb",
                    padding: 12,
                    borderRadius: 8,
                    marginBottom: 10,
                  }}
                  onPress={openStore}
                >
                  <Text style={{ color: "white", textAlign: "center" }}>
                    Update
                  </Text>
                </Pressable>

                <Pressable onPress={() => setShowUpdate(false)}>
                  <Text style={{ textAlign: "center", color: "#555" }}>
                    Later
                  </Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}
