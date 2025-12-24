import { Redirect } from "expo-router";
import { useState } from "react";
import { Modal, Text } from "react-native";
import { checkAppNeedUpdate } from "..";

export const UpdateModel = ({ latestVersion }: { latestVersion: string }) => {
  const [show, setShow] = useState(false);
  const data = checkAppNeedUpdate(latestVersion);
  if (data.major || data.minor || data.patch) {
    setShow(true);
  }
  return (
    <Modal visible={show} onRequestClose={() => setShow(false)}>
      <Text>Update</Text>
      <Text>major {data.major && "yes"}</Text>
      <Text>minor {data.minor && "yes"}</Text>
      <Text>patch {data.patch && "yes"}</Text>
    </Modal>
  );
};

const RedirectComponent = ({ latestVersion }: { latestVersion: string }) => {
  const data = checkAppNeedUpdate(latestVersion);
  if (data.major) {
    return <Redirect href="/(root)/(home)/home" />;
  }
  return <Redirect href="/(root)/(home)/home" />;
};
