import { PDFDownloadLink, Document, Page, View, Text, Image, StyleSheet, Font } from '@react-pdf/renderer';
import { toPng } from 'html-to-image';
import { useRef, useState } from 'react';

// ✅ Register IBM Plex Sans Fonts
Font.register({
  family: 'IBMPlexSans',
  fonts: [
    { src: '/fonts/IBMPlexSans-Regular.ttf', fontWeight: 'normal' },
    { src: '/fonts/IBMPlexSans-Medium.ttf', fontWeight: 'medium' },
    { src: '/fonts/IBMPlexSans-Bold.ttf', fontWeight: 'bold' }
  ],
});

const styles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      backgroundColor: '#F3F4F6',
      padding: 10,
      fontFamily: 'IBMPlexSans',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    logo: {
      width: 50, // Reduced logo size
      height: 50,
    },
    title: {
      fontSize: 20, // Reduced title size
      fontWeight: 'bold',
      color: '#065F46',
      marginLeft: 20,
    },
    section: {
      backgroundColor: 'white',
      borderRadius: 3,
      padding: 5,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: '#E5E7EB',
    },
    chartContainer: {
      width: 300, // Ensures correct aspect ratio
      height: 'auto',
      marginVertical: 10,
    },
    mealPlanHeader: {
      backgroundColor: '#D1FAE5',
      padding: 5,
      borderRadius: 5,
      fontSize:10,
      marginBottom: 5,
      fontWeight: 'medium',
    },
    mealEntry: {
      marginBottom: 6,
      paddingLeft: 6,
      borderLeftWidth: 1.5,
      borderLeftColor: '#10B981',
    },
    mealTitle: {
      fontSize: 10, // Smaller meal title font size
      fontWeight: 'medium',
    },
    mealText: {
      fontSize: 10, // Smaller meal ingredient font size
      color: '#6B7280',
    },
  });
  

interface Meal {
  meal: string;
  ingredients: string[];
}

interface DayPlan {
  day: number;
  breakfast: Meal[];
  lunch: Meal[];
  snacks: Meal[];
  dinner: Meal[];
}

interface UserData {
  user: {
    firstName: string;
    lastName: string;
    activityLevel: string;
    dietaryRestrictions: string;
  };
}

type MealType = 'breakfast' | 'lunch' | 'snacks' | 'dinner';

interface DietPlan {
  daily_plan?: DayPlan[];
}

interface DietPlanPDFProps {
  userData: UserData;
  dietPlan: DietPlan;
  chartImage: string | null;
}

const DietPlanPDF = ({ userData, dietPlan, chartImage }: DietPlanPDFProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Image src="/img/LOGO.png" style={styles.logo} />
        <Text style={styles.title}>Personalized Nutrition Plan</Text>
      </View>

      {/* User Details */}
      <View style={styles.section}>
        <Text style={{ fontWeight: 'medium' , fontSize:10}}>{userData.user.firstName} {userData.user.lastName}</Text>
        <Text style={{ fontWeight: 'medium' , fontSize:10}}>Activity Level: {userData.user.activityLevel}</Text>
        <Text style={{ fontWeight: 'medium' , fontSize:10}}>Dietary Restrictions: {userData.user.dietaryRestrictions}</Text>
      </View>

      {/* Nutrition Chart */}
      {chartImage && (
        <View style={styles.section}>
          <Text style={{ marginBottom: 8, fontSize:10}}>Macronutrient Distribution</Text>
          <Image src={chartImage} style={styles.chartContainer} />
        </View>
      )}

      {/* Meal Plan */}
      {dietPlan.daily_plan?.map((dayPlan, index) => (
        <View key={dayPlan.day} style={styles.section}>
          <View style={styles.mealPlanHeader}>
            <Text>Day {index + 1}</Text>
          </View>

          {['breakfast', 'lunch', 'snacks', 'dinner'].map((mealType) => (
            <View key={mealType} style={{ marginBottom: 12 }}>
              <Text style={styles.mealTitle}>{mealType.charAt(0).toUpperCase() + mealType.slice(1)}</Text>
              {dayPlan[mealType as MealType]?.map((meal: Meal, i: number) => (
                <View key={i} style={styles.mealEntry}>
                  <Text style={styles.mealTitle}>{meal.meal}</Text>
                  <Text style={styles.mealText}>{meal.ingredients.join(', ')}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      ))}
    </Page>
  </Document>
);

export default DietPlanPDF;
