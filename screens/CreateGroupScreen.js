import React, { useState } from "react";
import { View, Text, TextInput, ScrollView, Button, SafeAreaView, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import User from "../components/User";
import CheckBox from 'expo-checkbox';
import { useNavigation } from "@react-navigation/native";

export default function CreateGroup({ route }) {
  const { users,userId } = route.params;
  
  const navigation = useNavigation();
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);

  const toggleSelectUser = (userId) => {
    // Toggle the selection state of the user
    setSelectedUsers(prevSelectedUsers => {
      if (prevSelectedUsers.includes(userId)) {
        // If the user is already selected, remove them from the selectedUsers array
        return prevSelectedUsers.filter((id) => id !== userId);
      } else {
        // If the user is not selected, add them to the selectedUsers array
        return [...prevSelectedUsers, userId];
      }
    });
  };

  const handleCreateGroup = () => {
    // gán userId của người tạo gr vào mảng selectedUsers
    const usersWithSelf = [...selectedUsers, userId];

    // Validate group name and selected users
    if (!groupName) {
      Alert.alert("Error","Please enter a group name.");      
      return;
    }
    if (usersWithSelf.length < 2) {
      
      Alert.alert("Error","You need to select at least two users to create a group.");      
      return;
    }

    // Perform further actions for creating the group
    console.log("Group Name:", groupName);
    console.log("Selected Users:", usersWithSelf);
    
    
    const requestData = {
      groupName: groupName,
      selectedUsers: usersWithSelf,
      leader: userId
    };
    
    try {
      // Post request to server to create a group
      fetch("http://localhost:8000/create-group", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestData)
      })
      //thông báo tạo group thành công. bấm ok mới quay về Home
      
      Alert.alert("Success","Group created successfully.");
    } catch (error) {
      console.log("Error creating group:", error);
      // Show error message to user
      alert("Error creating group. Please try again.");
    }
    // Navigate to the group chat screen và truyền danh sách id user đã chọn
    navigation.navigate("Home");

  };

  return (
    <SafeAreaView>
      <Ionicons
            onPress={() => navigation.goBack()}
            name="arrow-back"
            size={24}
            color="black"
          />
      <Text style={{ fontSize: 18, fontWeight: "600" }}>Group Name</Text>
      <TextInput
        value={groupName}
        onChangeText={(text) => setGroupName(text)}
        style={{
          fontSize: groupName ? 18 : 18,
          borderBottomColor: "gray",
          borderBottomWidth: 1,
          marginVertical: 10,
          width: 300
        }}
        placeholder="Enter your group name"
      />
      <ScrollView>
        {users.map((user) => (
          <View key={user._id} style={{ flexDirection: "row", alignItems: "center" }}>
            <CheckBox
              value={selectedUsers.includes(user._id)}
              onValueChange={() => toggleSelectUser(user._id)}
            />
            {/* <User item={user} /> */}
            <Text>{user.email}</Text>
          </View>
        ))}
      </ScrollView>
      <Button title="Create Group" onPress={handleCreateGroup} />
    </SafeAreaView>
  );
}
