import { View, Text, SafeAreaView, StatusBar, StyleSheet, ScrollView, Image, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { supabase } from '@/config/supabase';
import { Ionicons } from '@expo/vector-icons';

const Header = () => {

    const [userName, setUserName] = useState("User");
  
   useEffect(() => {
    const fetchUserName = async () => {
      // 1. Get auth session
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      console.log(session);

      if (sessionError || !session?.user) {
        console.log("No session");
        return;
      }

      // 2. Extract phone number
      if (!session?.user?.phone) return;

      // Normalize phone number
      const rawPhone = session.user.phone;
      const phone = rawPhone.replace(/^\+91/, "").replace(/^91/, "");

      if (!phone) {
        console.log("Phone not found in session");
        return;
      }

      // 3. Query your table using phone
      const { data, error } = await supabase
        .from("workers") // 👈 change if table name is different
        .select("name")
        .eq("phone", phone)
        .single();

      if (error) {
        console.log("User fetch error:", error);
        return;
      }

      // 4. Set name
      if (data?.name) {
        setUserName(data.name);
      }
    };

    fetchUserName();
  }, []);
 return(
  <SafeAreaView style={styles.safe}>
      <View style={styles.wrapper}>
        <ScrollView contentContainerStyle={styles.container}>
          {/* HEADER */}
          <View style={styles.header}>
            <View style={styles.headerRow}>
              <View style={styles.profileRow}>
                <View style={styles.avatarWrapper}>
                  <Image
                    source={{
                      uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuAWXCc0O3_vkc_QlLSoXYUG2brus8jzI9FXyziLdOM7M_ueqYw8BkbVcxoJkv6IWlyIxAz6OILmlcnZOxE45H9TtJzrhJIiq4mfBhsS5w04xp7El0rtRAmfrFLKVERe-dxgZNcsEEU_mmtVMqq8EboNGJTiWtlD1T8mWnxnORelAC01dv9puNyw4nKVbDaHSuwXb5JnsaWk266zWrmqaNCqybPlPEgTeXV4f_7UEmefsVLH_2XpPex3w288TaL06cvIMLzLcxUj38A",
                    }}
                    style={styles.avatar}
                  />
                </View>

                <View>
                  <Text style={styles.mutedSmall}>Hello! </Text>
                  <Text style={styles.name}>{userName.toUpperCase()}</Text>
                </View>
              </View>

              <View style={{ alignItems: "flex-end" }}>
                <Text style={styles.mutedTiny}>SKILL POINTS</Text>
                <Text style={styles.boldSmall}>2,450 XP</Text>
              </View>
            </View>
          </View>
          <View>
            <View style={styles.searchContainer}>
            <TextInput placeholder='Search Courses' style={styles.searchBar}/>
            <Ionicons name='search' size={24} color="black" />
          </View>
          </View>

        </ScrollView>
      </View>
    </SafeAreaView>
 )
}

export default Header

const styles = StyleSheet.create({
  safe: {
    // flex: 1,
    // backgroundColor: "#f9f9f8",
    marginTop: StatusBar.currentHeight,
  },
  wrapper: {
    // flex: 1,
  },
  container: {
    // flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    gap: 24,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  profileRow: {
    flexDirection: "row",
    gap: 12,
  },
  avatarWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "rgba(161,230,51,0.2)",
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  activityScroll: {
    marginTop: 12,
    // maxHeight: Dimensions.get("window").height * 0.53, // ~45% screen
  },
  mutedSmall: {
    fontSize: 10,
    fontWeight: "700",
    opacity: 0.4,
  },
  mutedTiny: {
    fontSize: 8,
    fontWeight: "700",
    opacity: 0.4,
    letterSpacing: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "800",
  },
  boldSmall: {
    fontSize: 12,
    fontWeight: "800",
  },
  searchContainer:{
    marginTop: 12,
    display:'flex',
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  searchBar:{
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 16,
    color:"black",
    width:"80%",
  }
});
