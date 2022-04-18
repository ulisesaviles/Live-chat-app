import { Appearance, StyleSheet } from "react-native";
import colors from "../../config/colors";

const getColorScheme = () => {
  return Appearance.getColorScheme() || 'dark';
};

export const styles: any = StyleSheet.create({
  chat: {
    flex: 1,
    backgroundColor: colors[getColorScheme()].background,
    padding: 20
  },
  loading: {
    color: colors[getColorScheme()].font.primary,
  },
  title: {
    fontWeight: "600",
    fontSize: 18,
    color: colors[getColorScheme()].font.primary,
  },

  areaView: {
    backgroundColor: colors[getColorScheme()].background
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: colors[getColorScheme()].background
  },
  
  flexRow: {
    flexDirection: "row",
    alignItems: 'center'
  },
  
  headerImage: {
    width: 38,
    height: 38,
    borderRadius: 1000,
    marginRight: 10
  },
  
  icon: {
    fontSize: 28,
    color: colors['dark'].font.primary
  },
  backIcon: {
    marginRight: 20
  },
  gradientBtn: {
    borderRadius: 20,
    overflow: 'hidden'
  },
  callIconSize: {
    fontSize: 16,
    borderRadius: 100
  },
});