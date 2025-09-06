import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import ProfileDetail from "@/components/forms/ProfileDetail";
import { useSuspenceData } from "@/query/getAllSuspense";
import { PROFILE_URL } from "@/constants/apis";

export default function User() {
  const { data: userProfile } = useSuspenceData(
    PROFILE_URL.url,
    PROFILE_URL.key,
  );

  return (
    <ScrollView className="mx-auto w-[100%]">
      <ProfileDetail />
    </ScrollView>
  );
}

