import React from "react";
import { View, Text } from "react-native";

import { useTheme } from "@react-navigation/native";
import { MaterialCommunityIcons } from "react-native-vector-icons";
import { Typography } from "../../themes/typography";
import { useDispatch, useSelector } from "react-redux";
import CheckoutTimer from "../../Utils/CheckoutTimer";

const TimerComponent = () => {
  const { theme } = useTheme();

  const remainingTime = useSelector((state) => state.timer.remainingTime);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 2,
      }}
    >
      <Text style={{ fontSize: Typography.size.headingtwo }}>
        {formatTime(remainingTime)}
      </Text>
      <MaterialCommunityIcons
        name="timer"
        size={18}
        style={{ marginHorizontal: 4 }}
        color={theme.dark[900]}
      />
      <CheckoutTimer />
    </View>
  );
};

export default TimerComponent;
