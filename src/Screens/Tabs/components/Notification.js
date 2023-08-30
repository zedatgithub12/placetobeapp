import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { Typography } from "../../../themes/typography";

export const NotificationsTab = ({ focused, color, notificationCount }) => {
  const { theme } = useTheme();
  return (
    <View>
      <Ionicons
        name={focused ? "notifications" : "notifications-outline"}
        size={22}
        color={color}
      />
      {notificationCount > 0 && (
        <View
          style={{
            position: "absolute",
            top: -6,
            right: -6,
            backgroundColor: "#FF0000",
            borderRadius: 10,
            width: 20,
            height: 20,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: theme.background.main,
              fontSize: 12,
              fontWeight: Typography.weight.bold,
            }}
          >
            {notificationCount}
          </Text>
        </View>
      )}
    </View>
  );
};
