//import liraries
import { useEffect, useState } from "react";
import NetInfo from "@react-native-community/netinfo";
import { showToast } from "../Utils/Toast";

// Internet connection handler
const Internet = () => {
  const [connection, setConnection] = useState(false);
  useEffect(() => {
    const InternetConnection = async () => {
      try {
        const networkState = await NetInfo.fetch();
        setConnection(networkState.isConnected);
      } catch (error) {
        showToast("Problem indentifying your network state");
      }
    };
    InternetConnection();

    const subscription = NetInfo.addEventListener(async (state) => {
      setConnection(state.isConnected);
    });
    return () => {
      subscription.remove();
    };
  }, []);
  return connection;
};

//make this component available to the app
export default Internet;
