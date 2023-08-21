<View style={styles.homeSection2}>
  <ScrollView contentContainerStyle={{ minHeight: 40 }}>
    <View>
      <ScrollView
        horizontal
        contentContainerStyle={styles.categories}
        showsHorizontalScrollIndicator={false}
      >
        {Category.map((item, index) => (
          <Categories
            key={index}
            icon={item.icon}
            category={item.name}
            border={item.color}
            background={
              active === item.name ? item.color : theme.background.main
            }
            color={
              active === item.name ? Constants.background : Constants.Inverse
            }
            onPress={() => handleCategoryClick(item.name, item.type)}
          />
        ))}
      </ScrollView>
    </View>
  </ScrollView>
</View>;
