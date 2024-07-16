import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, SafeAreaView, Pressable, ScrollView } from 'react-native';
import GroupChat from '../components/GroupChat';

export default function ListGroupScreen({route, navigation}) {
  const { userId } = route.params;
  
  const [groups, setGroups] = useState([]);
  const [acceptedFriends, setAcceptedFriends] = useState([]);
  useEffect(() => {
    // Fetch the groups for the logged-in user
    fetchGroups();
  }, []);



  const fetchGroups = async () => {
    try {
      // Replace 'userId' with the actual ID of the logged-in user
      // const userId = userId; // You should retrieve the actual userId from your authentication system
      const response = await fetch(`http://localhost:8000/groups/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch groups');
      }
      const data = await response.json();
      setGroups(data);
      console.log("Data ==",data);
    } catch (error) {
      console.error('Error fetching groups:', error);
      // Handle error
    }
  };

  return (
    <SafeAreaView>
      <Text>ListGroupScreen</Text>
      
      

      <ScrollView showsVerticalScrollIndicator={false}>
        {
          groups.map((item, index) => {
                  return <View key={index}>
                    <Pressable onPress={() => navigation.navigate('GroupChat', item)}>
                      <Text>Leader: {item.leader}</Text>
                      <Text>Tên nhóm: {item.name}</Text>
                    </Pressable>
                  </View>
          })
        }
      </ScrollView>
      
    </SafeAreaView>
  );
}
