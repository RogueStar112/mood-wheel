import Image from "next/image";
import MoodWheel from "./components/MoodWheel";

export default function Home() {
  return (
    <div className="text-center">
      <p>Mood Wheel Journal</p>
      
      <MoodWheel />
    </div>
  );
}
