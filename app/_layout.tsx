import { Tabs } from "expo-router";
import { ChartNoAxesColumn, Home, List, Settings } from "lucide-react-native";
import { Animated, Image, StyleSheet, View } from "react-native";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import { useFinanceStore } from "@/stores/financeStore";
import { useSettingsStore } from "@/stores/settingsStore";
import { Onboarding } from "@/components/Onboarding";

function Splash() {
  const t = useTheme();

  const opacity = useRef(new Animated.Value(0)).current;
  const iconScale = useRef(new Animated.Value(0.72)).current;
  const iconY = useRef(new Animated.Value(18)).current;
  const textY = useRef(new Animated.Value(14)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const glowScale = useRef(new Animated.Value(0.8)).current;
  const dotOpacity = useRef(new Animated.Value(0.25)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),

        Animated.spring(iconScale, {
          toValue: 1,
          tension: 55,
          friction: 7,
          useNativeDriver: true,
        }),

        Animated.spring(iconY, {
          toValue: 0,
          tension: 55,
          friction: 8,
          useNativeDriver: true,
        }),

        Animated.timing(glowScale, {
          toValue: 1,
          duration: 650,
          useNativeDriver: true,
        }),
      ]),

      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 450,
          useNativeDriver: true,
        }),

        Animated.spring(textY, {
          toValue: 0,
          tension: 55,
          friction: 9,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(dotOpacity, {
          toValue: 1,
          duration: 650,
          useNativeDriver: true,
        }),
        Animated.timing(dotOpacity, {
          toValue: 0.25,
          duration: 650,
          useNativeDriver: true,
        }),
      ]),
    );

    pulse.start();

    return () => {
      pulse.stop();
    };
  }, []);

  return (
    <View
      style={[
        splash.root,
        {
          backgroundColor: t.background,
        },
      ]}
    >
      {/* Ambient background */}
      <Animated.View
        style={[
          splash.glow,
          {
            backgroundColor: t.lavender + "38",
            transform: [{ scale: glowScale }],
          },
        ]}
      />

      <View
        style={[
          splash.glowTwo,
          {
            backgroundColor: t.peach + "28",
          },
        ]}
      />

      <View
        style={[
          splash.orb,
          {
            backgroundColor: t.accentSoft,
          },
        ]}
      />

      {/* Main content */}
      <Animated.View
        style={[
          splash.content,
          {
            opacity,
          },
        ]}
      >
        {/* Decorative top label */}
        <Animated.Text
          style={[
            splash.eyebrow,
            {
              color: t.secondary,
              opacity: textOpacity,
            },
          ]}
        >
          PERSONAL FINANCE, BUT BETTER
        </Animated.Text>

        {/* App icon */}
        <Animated.View
          style={[
            splash.iconWrapper,
            {
              opacity,
              transform: [{ translateY: iconY }, { scale: iconScale }],
            },
          ]}
        >
          <View
            style={[
              splash.iconShadow,
              {
                backgroundColor: t.accent + "18",
              },
            ]}
          />

          <View style={splash.mark}>
            <Image
              source={require("../assets/images/Monee.png")}
              style={splash.icon}
              resizeMode="cover"
            />
          </View>
        </Animated.View>

        {/* Brand */}
        <Animated.View
          style={[
            splash.brandBlock,
            {
              opacity: textOpacity,
              transform: [{ translateY: textY }],
            },
          ]}
        >
          <Animated.Text
            style={[
              splash.logo,
              {
                color: t.text,
              },
            ]}
          >
            Monee
          </Animated.Text>

          <Animated.Text
            style={[
              splash.tag,
              {
                color: t.secondary,
              },
            ]}
          >
            quietly know your money.
          </Animated.Text>
        </Animated.View>

        {/* Loading indicator */}
        <Animated.View
          style={[
            splash.loading,
            {
              opacity: dotOpacity,
            },
          ]}
        >
          <View
            style={[
              splash.loadingLine,
              {
                backgroundColor: t.border,
              },
            ]}
          />

          <View
            style={[
              splash.loadingDot,
              {
                backgroundColor: t.accent,
              },
            ]}
          />
        </Animated.View>
      </Animated.View>

      {/* Bottom micro-copy */}
      <Animated.Text
        style={[
          splash.bottomText,
          {
            color: t.secondary,
            opacity: textOpacity,
          },
        ]}
      >
        YOUR MONEY. YOUR FLOW.
      </Animated.Text>
    </View>
  );
}

export default function Layout() {
  const t = useTheme();
  const hydrateFinance = useFinanceStore((s) => s.hydrate);
  const hydrateSettings = useSettingsStore((s) => s.hydrate);
  const ready = useSettingsStore((s) => s.hydrated);
  const onboarded = useSettingsStore((s) => s.onboardingComplete);
  const [splash, setSplash] = useState(true);
  useEffect(() => {
    Promise.all([hydrateSettings(), hydrateFinance()]).finally(() =>
      setTimeout(() => setSplash(false), 950),
    );
  }, [hydrateSettings, hydrateFinance]);
  if (splash || !ready) return <Splash />;
  if (!onboarded) return <Onboarding onDone={() => {}} />;
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: t.accent,
        tabBarInactiveTintColor: t.secondary,
        tabBarStyle: {
          backgroundColor: t.surface,
          borderTopColor: t.border,
          height: 82,
          paddingTop: 8,
          paddingBottom: 22,
        },
        tabBarLabelStyle: { fontSize: 10, fontWeight: "700" },
        tabBarItemStyle: { borderRadius: 18 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          title: "Activity",
          tabBarIcon: ({ color, size }) => <List color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="insights"
        options={{
          title: "Insights",
          tabBarIcon: ({ color, size }) => (
            <ChartNoAxesColumn color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => (
            <Settings color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
const splash = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  content: {
    alignItems: "center",
    justifyContent: "center",
  },

  /*
   * Ambient lavender glow
   */
  glow: {
    position: "absolute",
    width: 420,
    height: 420,
    borderRadius: 210,
    top: -180,
    right: -150,
  },

  /*
   * Warm secondary glow
   */
  glowTwo: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    bottom: -160,
    left: -130,
  },

  /*
   * Small floating orb
   */
  orb: {
    position: "absolute",
    width: 110,
    height: 110,
    borderRadius: 55,
    top: "27%",
    left: -55,
    opacity: 0.65,
  },

  eyebrow: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 2.1,
    marginBottom: 22,
  },

  iconWrapper: {
    width: 104,
    height: 104,
    alignItems: "center",
    justifyContent: "center",
  },

  iconShadow: {
    position: "absolute",
    width: 92,
    height: 92,
    borderRadius: 30,
    transform: [{ scale: 1.08 }],
  },

  mark: {
    width: 88,
    height: 88,
    borderRadius: 28,
    overflow: "hidden",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.18,
    shadowRadius: 18,

    elevation: 10,
  },

  icon: {
    width: "100%",
    height: "100%",
  },

  brandBlock: {
    alignItems: "center",
    marginTop: 20,
  },

  logo: {
    fontSize: 46,
    fontWeight: "900",
    letterSpacing: -2.4,
    textAlign: "center",
  },

  tag: {
    fontSize: 13,
    fontWeight: "500",
    letterSpacing: 0.15,
    textAlign: "center",
    marginTop: 7,
  },

  loading: {
    width: 38,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 34,
  },

  loadingLine: {
    width: 30,
    height: 3,
    borderRadius: 3,
    opacity: 0.55,
  },

  loadingDot: {
    position: "absolute",
    width: 7,
    height: 7,
    borderRadius: 4,
  },

  bottomText: {
    position: "absolute",
    bottom: 34,
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 1.8,
  },
});
