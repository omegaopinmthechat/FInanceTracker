import React, { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { colors, radii, spacing } from "@/theme/colors";

const skeletonColor = "#E9E9E9";

type PulseProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

type BarProps = {
  width?: number | `${number}%`;
  height?: number;
  style?: StyleProp<ViewStyle>;
};

function SkeletonPulse({ children, style }: PulseProps) {
  const opacity = useRef(new Animated.Value(0.52)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.9,
          duration: 850,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.52,
          duration: 850,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    loop.start();

    return () => {
      loop.stop();
    };
  }, [opacity]);

  return <Animated.View style={[styles.pulseWrap, style, { opacity }]}>{children}</Animated.View>;
}

function Bar({ width = "100%", height = 14, style }: BarProps) {
  return <View style={[styles.bar, { width, height }, style]} />;
}

export function SplashSkeleton() {
  return (
    <SkeletonPulse style={styles.splashWrap}>
      <Bar width={190} height={30} style={styles.roundLg} />
      <Bar width={130} height={12} style={[styles.roundSm, styles.mtSm]} />
    </SkeletonPulse>
  );
}

export function DashboardSkeleton() {
  return (
    <SkeletonPulse>
      <Bar width="62%" height={34} style={styles.roundLg} />
      <Bar width="88%" height={14} style={[styles.roundSm, styles.mtSm]} />

      <Bar width="100%" height={46} style={[styles.roundMd, styles.mtLg]} />

      <View style={styles.summaryRow}>
        <Bar width="48%" height={72} style={styles.roundMd} />
        <Bar width="48%" height={72} style={styles.roundMd} />
      </View>

      <Bar width="100%" height={74} style={[styles.roundMd, styles.mtMd]} />
      <Bar width="100%" height={188} style={[styles.roundLg, styles.mtMd]} />
      <Bar width="100%" height={224} style={[styles.roundLg, styles.mtLg]} />
      <Bar width="100%" height={224} style={[styles.roundLg, styles.mtLg]} />
    </SkeletonPulse>
  );
}

export function FormTableSkeleton() {
  return (
    <SkeletonPulse>
      <Bar width="56%" height={32} style={styles.roundLg} />
      <Bar width="84%" height={14} style={[styles.roundSm, styles.mtSm]} />

      <Bar width="100%" height={48} style={[styles.roundMd, styles.mtLg]} />
      <Bar width="100%" height={48} style={[styles.roundMd, styles.mtMd]} />
      <Bar width="100%" height={48} style={[styles.roundMd, styles.mtMd]} />
      <Bar width="100%" height={48} style={[styles.roundMd, styles.mtMd]} />
      <Bar width="100%" height={48} style={[styles.roundMd, styles.mtMd]} />
      <Bar width="100%" height={50} style={[styles.roundMd, styles.mtLg]} />

      <Bar width="42%" height={20} style={[styles.roundSm, styles.mtLg]} />
      <Bar width="100%" height={40} style={[styles.roundSm, styles.mtSm]} />
      <Bar width="100%" height={54} style={[styles.roundSm, styles.mtSm]} />
      <Bar width="100%" height={54} style={[styles.roundSm, styles.mtSm]} />
      <Bar width="100%" height={54} style={[styles.roundSm, styles.mtSm]} />
      <Bar width="100%" height={54} style={[styles.roundSm, styles.mtSm]} />
    </SkeletonPulse>
  );
}

const styles = StyleSheet.create({
  pulseWrap: {
    width: "100%",
    alignSelf: "stretch",
  },
  bar: {
    backgroundColor: skeletonColor,
    borderColor: colors.border,
    borderWidth: 1,
  },
  splashWrap: {
    width: "100%",
    alignItems: "center",
  },
  summaryRow: {
    width: "100%",
    marginTop: spacing.lg,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  roundSm: {
    borderRadius: radii.sm,
  },
  roundMd: {
    borderRadius: radii.md,
  },
  roundLg: {
    borderRadius: radii.lg,
  },
  mtSm: {
    marginTop: spacing.sm,
  },
  mtMd: {
    marginTop: spacing.md,
  },
  mtLg: {
    marginTop: spacing.lg,
  },
});
