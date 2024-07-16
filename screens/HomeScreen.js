import { StyleSheet, Text, View, Button } from "react-native";
import React, { useLayoutEffect, useContext, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { UserType } from "../UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
//import AsyncStorage from "react-native";
import jwt_decode from "jwt-decode";
import axios from "axios";
import User from "../components/User";

const HomeScreen = () => {
  const navigation = useNavigation();
  const { userId, setUserId } = useContext(UserType);
  const [users, setUsers] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerLeft: () => (
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>Chat</Text>
      ),
      headerRight: () => (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <MaterialIcons
            onPress= {handleToListGroup}
            name="group"
            size={32}
            color="pink"
          />
          <Ionicons
            onPress={() => navigation.navigate("Chats")}
            name="chatbox-ellipses-outline"
            size={32}
            color="pink"
          />
          <MaterialIcons
            onPress={() => navigation.navigate("Friends")}
            name="person-add"
            size={32}
            color="pink"
          />
          <MaterialIcons
            onPress= {handleCreateGroup}
            name="group-add"
            size={32}
            color="blue"
          />

          <Button title="Logout" onPress={handleLogout} />
        </View>
      ),
    });
  }, []);


  const handleCreateGroup = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const decodedToken = jwt_decode(token);
      const userId = decodedToken.userId;
      setUserId(userId);

      const response = await axios.get(`http://localhost:8000/users/${userId}`);
      const usersData = response.data;
      setUsers(usersData);
      console.log("userId :",userId);
      console.log("user :",users);
      navigation.navigate("CreateGroupScreen", {
        users: usersData,
        userId: userId,
      });
      
    } catch (error) {
      console.log("Error fetching users:", error);
    }
  };

  const handleToListGroup = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const decodedToken = jwt_decode(token);
      const userId = decodedToken.userId;
      setUserId(userId);

      const response = await axios.get(`http://localhost:8000/users/${userId}`);
      const usersData = response.data;
      setUsers(usersData);

      navigation.navigate("ListGroupChat", {
        users: usersData,
        userId: userId,
      });
      
    } catch (error) {
      console.log("Error fetching users:", error);
    }
  }


  const handleLogout = async () => {
    // Clear the authentication token from AsyncStorage
    await AsyncStorage.removeItem("authToken");

    // Clear the user ID in the context
    setUserId(null);

    // Navigate to the login screen
    navigation.navigate("Login");
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const token = await AsyncStorage.getItem("authToken");
      const decodedToken = jwt_decode(token);
      const userId = decodedToken.userId;
      setUserId(userId);

      axios
        .get(`http://localhost:8000/users/${userId}`)
        .then((response) => {
          setUsers(response.data);
        })
        .catch((error) => {
          console.log("error retrieving users", error);
        });
    };

    fetchUsers();
  }, []);

  console.log("users", users);
  return (
    <View>
      <View style={{ padding: 10 }}>
        {users.map((item, index) => (
          <User key={index} item={item} />
        ))}
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});