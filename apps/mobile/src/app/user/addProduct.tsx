import { View, Text } from "react-native";
import React from "react";
import AddProduct from "@/components/forms/addProduct";
import BoundaryWrapper from "@/components/layout/BoundaryWrapper";

const addProduct = () => {
  return (
    <BoundaryWrapper>
      <AddProduct />
    </BoundaryWrapper>
  );
};

export default addProduct;
