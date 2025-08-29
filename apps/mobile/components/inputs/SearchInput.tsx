// import React, { useCallback } from "react";
// import { View, StyleSheet } from "react-native";
// import Input from "./Input";
// import debounce from "lodash.debounce";
//
// const SearchInput = (apiUrl:string,method:string) => {
//   const handleSearch = (text: string) => {
//     console.log("Debounced Search:", text);
//     // add api call with apiUrl and method which is pass where its use
//   };
//
//   const debouncedSearch = useCallback(debounce(handleSearch, 500), []);
//
//   return (
//     <View style={styles.container}>
//       <Input
//         placeholder="Search..."
//         onChangeText={debouncedSearch}
//         customStyle={{
//           borderBottomColor: "gray",
//           color: "black",
//         }}
//       />
//     </View>
//   );
// };
//
// export default SearchInput;
//
// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//   },
// });
