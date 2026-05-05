import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolWeight, SymbolViewProps } from "expo-symbols";
import { ComponentProps } from "react";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";

type IconMapping = Record<SymbolViewProps["name"], ComponentProps<typeof MaterialIcons>["name"]>;
type IconSymbolName = keyof typeof MAPPING;

const MAPPING = {
  // Navigation
  "house.fill": "home",
  "magnifyingglass": "search",
  "bag.fill": "shopping-bag",
  "person.fill": "person",
  // Live
  "video.fill": "videocam",
  "video.slash.fill": "videocam-off",
  "mic.fill": "mic",
  "mic.slash.fill": "mic-off",
  "dot.radiowaves.left.and.right": "radio",
  "eye.fill": "visibility",
  // Shopping
  "cart.fill": "shopping-cart",
  "creditcard.fill": "credit-card",
  "checkmark.circle.fill": "check-circle",
  "xmark.circle.fill": "cancel",
  "tag.fill": "local-offer",
  "bolt.fill": "flash-on",
  // UI
  "chevron.right": "chevron-right",
  "chevron.left": "chevron-left",
  "chevron.down": "expand-more",
  "chevron.up": "expand-less",
  "xmark": "close",
  "plus": "add",
  "minus": "remove",
  "ellipsis": "more-horiz",
  "bell.fill": "notifications",
  "heart.fill": "favorite",
  "heart": "favorite-border",
  "star.fill": "star",
  "share": "share",
  "arrow.right": "arrow-forward",
  "arrow.left": "arrow-back",
  "paperplane.fill": "send",
  "chevron.left.forwardslash.chevron.right": "code",
  // Status
  "exclamationmark.triangle.fill": "warning",
  "info.circle.fill": "info",
  "clock.fill": "schedule",
  "checkmark": "check",
  "person.2.fill": "group",
  "flame.fill": "local-fire-department",
  "trophy.fill": "emoji-events",
  "gift.fill": "card-giftcard",
  "camera.fill": "camera-alt",
  "photo.fill": "photo",
  "location.fill": "location-on",
  "lock.fill": "lock",
  "gear": "settings",
  "arrow.counterclockwise": "refresh",
  "hand.thumbsup.fill": "thumb-up",
  "sparkles": "auto-awesome",
} as unknown as IconMapping;

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
