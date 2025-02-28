import { Document, Page, View, Text, Image, StyleSheet, Font, LinearGradient } from '@react-pdf/renderer';
import { DietPlanTypes } from '../types/index';
// Register Fonts
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
    backgroundColor: '#FFFFFF',
    padding: 0,
    fontFamily: 'IBMPlexSans',
    position: 'relative',
  },
  header: {
    backgroundColor: '#065F46',
    height: 80,
    marginBottom: 25,
    position: 'relative',
    zIndex: 1,
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  logoContainer: {
    position: 'absolute',
    top: 20,
    left: 30,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    zIndex: 2,
  },
  logo: {
    width: 40,
    height: 40,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  userDetails: {
    paddingHorizontal: 30,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Ensures even spacing
    marginBottom: 8,
    gap: 20, // Adds spacing between pairs
  },
  detailItem: {
    flexDirection: 'row', 
    flex: 1, // Ensures even width for each item
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '500', // 'medium' is not valid in React Native, use '500'
  },
  detailValue: {
    fontSize: 10,
    color: '#111827',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#065F46',
    marginBottom: 12,
    paddingLeft: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#10B981',
  },
  chartContainer: {
    marginHorizontal: 30,
    marginBottom: 20,
    height: 150,
  },
  guidelines: {
    marginHorizontal: 30,
    marginBottom: 10,
    padding: 15,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
  },
  guidelineItem: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  guidelineIcon: {
    fontSize: 12,
    color: '#059669',
    fontWeight: 'bold',
  },
  guidelineText: {
    fontSize: 9,
    color: '#374151',
    lineHeight: 1.4,
  },
  ingredientList: {
    marginHorizontal: 30,
    marginBottom: 10,
    padding: 15,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
  },
  table: {
    marginHorizontal: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#059669',
    paddingVertical: 10,
  },
  tableHeaderCell: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingVertical: 12,
    backgroundColor: '#F9FAFB',
    minHeight: 80,
  },
  tableCell: {
    flex: 1,
    fontSize: 9,
    color: '#374151',
    paddingHorizontal: 8,
    textAlign: 'center',
    lineHeight: 1.4,
  },
  footer: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    paddingVertical: 10,
    backgroundColor: '#059669',
  },
  footerText: {
    fontSize: 8,
    color: '#D1FAE5',
  },

  ingredientContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5, // Adjusts spacing between badges
  },
  badge: {
    backgroundColor: '#f0f0f0', // Light gray background
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    fontSize: 10,
    marginBottom: 5,
  },
});

type Meal = {
  meal: string;
  ingredients: string[];
};

// SVG for Curved Background
const evenRowStyle = { backgroundColor: '#FFFFFF' };

const DietPlanPDF = ({ userData, dietPlan, chartImage }: { userData: any; dietPlan: DietPlanTypes; chartImage: string | null }) => (
  <Document>
    {/* Page 1 - Overview */}
    <Page size="A4" style={styles.page}>
      {/* Header */}
      {/* Curved Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image src="/img/LOGO.png" style={styles.logo} />
          <Text style={styles.headerTitle}>NUTRITION PLAN</Text>
        </View>
      </View>

      {/* User Details */}
      <View style={styles.userDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>NAME:</Text>
          <Text style={styles.detailValue}>
            {userData.user.firstName || 'John'} {userData.user.lastName || 'Doe'}
          </Text>
          <Text style={styles.detailLabel}>GENDER:</Text>
          <Text style={styles.detailValue}>{userData.user.gender || 'Not Specified'}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>ACTIVITY LEVEL:</Text>
          <Text style={styles.detailValue}>{userData.user.activityLevel || 'Moderate'}</Text>
          <Text style={styles.detailLabel}>DIETARY NEEDS:</Text>
          <Text style={styles.detailValue}>{userData.user.dietaryRestrictions || 'None'}</Text>
        </View>
      </View>

      {/* Nutrition Chart */}
      {chartImage && (
        <View style={styles.chartContainer}>
          <Text style={styles.sectionTitle}>MACRONUTRIENT DISTRIBUTION</Text>
          <Image
            src={{ uri: chartImage }}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain'
            }}
          />
        </View>
      )}

      {/* Guidelines */}
      <View style={styles.guidelines}>
        <Text style={styles.sectionTitle}>KEY GUIDELINES</Text>
        <View style={{ flexDirection: 'column', gap: 15 }}>
            {(dietPlan?.instructions ?? []).reduce((rows: [string, string | undefined][], text: string, index: number) => {
            if (index % 2 === 0) {
              // Create a new row with two items (if possible)
              rows.push([text, dietPlan?.instructions?.[index + 1]]);
            }
            return rows;
            }, []).map((row: [string, string | undefined], rowIndex: number) => (
            <View key={rowIndex} style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 20 }}>
              {row.map((text: string | undefined, colIndex: number) => text && ( // Ensure text exists before rendering
              <View key={colIndex} style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                <Text style={styles.guidelineIcon}>•&nbsp;</Text>
                <Text style={styles.guidelineText}> {text}</Text>
              </View>
              ))}
            </View>
            ))}
        </View>
      </View>


      {/*  Ingredient List */}
      <View style={styles.ingredientList}>
        <Text style={styles.sectionTitle}>LIST OF INGRDIENTS INCLUDED IN YOUR PLAN</Text>
        <View style={styles.ingredientContainer}>
          {dietPlan?.all_ingredients?.map((ingredient:String, index:number) => (
            <Text key={index} style={styles.badge}>
              {ingredient}
            </Text>
          ))}
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Generated by Personalized Diet Planner • {new Date().toLocaleDateString()}</Text>
        <Text style={styles.footerText}>Page 1 of 2</Text>
        <Text style={styles.footerText}>https://personalized-mealplanner.vercel.app/</Text>
      </View>
    </Page>

    {/* Page 2 - Meal Plan Table */}
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image src="/img/LOGO.png" style={styles.logo} />
          <Text style={styles.headerTitle}>MEAL PLAN DETAILS</Text>
        </View>
      </View>

      {/* Meal Table */}
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderCell}>DAY</Text>
          <Text style={styles.tableHeaderCell}>BREAKFAST</Text>
          <Text style={styles.tableHeaderCell}>LUNCH</Text>
          <Text style={styles.tableHeaderCell}>SNACKS</Text>
          <Text style={styles.tableHeaderCell}>DINNER</Text>
        </View>
        {dietPlan.daily_plan?.map((dayPlan, index: number) => (
          <View
            key={index}
            style={[
              styles.tableRow,
              index % 2 === 0 ? evenRowStyle : {}
            ]}
          >
            <Text style={styles.tableCell}>Day {index + 1}</Text>
            <Text style={styles.tableCell}>
              {dayPlan.breakfast.map((meal: Meal) => `• ${meal.meal}\n(${meal.ingredients.slice(0, 3).join(', ')})`).join('\n')}
            </Text>
            <Text style={styles.tableCell}>
              {dayPlan.lunch.map((meal: Meal) => `• ${meal.meal}\n(${meal.ingredients.slice(0, 3).join(', ')})`).join('\n')}
            </Text>
            <Text style={styles.tableCell}>
              {dayPlan.snacks.map((meal: Meal) => `• ${meal.meal}\n(${meal.ingredients.slice(0, 2).join(', ')})`).join('\n')}
            </Text>
            <Text style={styles.tableCell}>
              {dayPlan.dinner.map((meal: Meal) => `• ${meal.meal}\n(${meal.ingredients.slice(0, 3).join(', ')})`).join('\n')}
            </Text>
          </View>
        ))}
      </View>

      {/* Food to Avoid List */}
      <View style={styles.ingredientList}>
        <Text style={styles.sectionTitle}>FOOD TO AVOID</Text>
        <View style={styles.ingredientContainer}>
          {dietPlan?.foods_to_avoid?.map((food:String, index:number) => (
            <Text key={index} style={styles.badge}>
              {food}
            </Text>
          ))}
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Generated by Personalized Diet Planner • {new Date().toLocaleDateString()}</Text>
        <Text style={styles.footerText}>Page 2 of 2</Text>
        <Text style={styles.footerText}>https://personalized-mealplanner.vercel.app/</Text>
      </View>
    </Page>
  </Document>
);

export default DietPlanPDF;