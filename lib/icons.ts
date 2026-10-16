// 콘텐츠 JSON에서 쓰는 아이콘 목록.
// 필요한 아이콘만 골라 불러와서 화면 용량을 줄인다.
// 새 아이콘을 쓰려면 아래 목록에 이름을 더한다. (npm run check:content 가 이 목록을 확인함)
import {
  Apple, Backpack, Bike, BookOpen, Bot, Brain, Calculator, Cat, CircleHelp, Cookie, Dog,
  Glasses, Image, Languages, Laptop, Lightbulb, MapPin, Mic, Music, Palette, PawPrint,
  Search, Smile, Sparkles, Sun, ThumbsUp, ToyBrick, User, WashingMachine,
  type LucideIcon, type LucideProps,
} from "lucide-react";
import { createElement } from "react";

export const ICONS: Record<string, LucideIcon> = {
  // ICONS-START
  Apple, Backpack, Bike, BookOpen, Bot, Brain, Calculator, Cat, CircleHelp, Cookie, Dog,
  Glasses, Image, Languages, Laptop, Lightbulb, MapPin, Mic, Music, Palette, PawPrint,
  Search, Smile, Sparkles, Sun, ThumbsUp, ToyBrick, User, WashingMachine,
  // ICONS-END
};

// 이름으로 아이콘을 그린다. 목록에 없으면 물음표 아이콘.
export function AppIcon({ name, ...props }: { name?: string } & LucideProps) {
  return createElement((name && ICONS[name]) || CircleHelp, { "aria-hidden": true, ...props });
}
