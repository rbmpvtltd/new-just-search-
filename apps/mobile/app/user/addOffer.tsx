import { View, Text } from "react-native";
import React from "react";
import BoundaryWrapper from "@/components/layout/BoundaryWrapper";
import AddOffer from "@/components/forms/addOffer";

const addOffer = () => {
  return (
    <BoundaryWrapper>
      <AddOffer />
    </BoundaryWrapper>
  );
};

export default addOffer;
