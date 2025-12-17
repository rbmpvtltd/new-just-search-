import React, { useRef, useState } from "react";
import { StyleSheet, View, TextInput, useColorScheme } from "react-native";
import { useSearchBox, type UseSearchBoxProps } from "react-instantsearch-core";
import Colors from "@/constants/Colors";

interface SearchBoxProps extends UseSearchBoxProps {
  placeholder?: string;
}

export function SearchBox(props: SearchBoxProps) {
  const { query, refine } = useSearchBox(props);
  const [inputValue, setInputValue] = useState(query);
  const inputRef = useRef<TextInput>(null);
  const colorSheme = useColorScheme();

  function setQuery(newQuery: string) {
    setInputValue(newQuery);
    refine(newQuery);
  }

  // Track when the InstantSearch query changes to synchronize it with
  // the React state.
  // Bypass the state update if the input is focused to avoid concurrent
  // updates when typing.
  if (query !== inputValue && !inputRef.current?.isFocused()) {
    setInputValue(query);
  }

  return (
    <View className="bg-base-300 w-full ">
      <TextInput
        placeholder={props.placeholder ?? "Search Anything"}
        placeholderTextColor={
          Colors[colorSheme ?? "light"]["secondary-content"]
        }
        ref={inputRef}
        value={inputValue}
        onChangeText={setQuery}
        clearButtonMode="while-editing"
        autoCapitalize="none"
        autoCorrect={false}
        spellCheck={false}
        autoComplete="off"
        className=" p-3 text-xl bg-base-200 text-secondary-content rounded border-2 border-secondary"
      />
    </View>
  );
}
