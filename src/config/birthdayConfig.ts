export interface MemoryItem {
  id: string;
  title: string;
  date: string;
  location: string;
  image: string;
  caption: string;
  tag: string;
}

export interface BirthdayConfig {
  girlfriendName: string;
  girlfriendNickname: string;
  boyfriendName: string;
  passcode: string;
  birthdayDate: string; // YYYY-MM-DD
  relationshipStartDate: string; // YYYY-MM-DD
  hintMessage: string;
  letter: {
    greeting: string;
    paragraphs: string[];
    closing: string;
    sign: string;
  };
  memories: MemoryItem[];
}

export const birthdayConfig: BirthdayConfig = {
  girlfriendName: "เจ้าหญิงคนเก่งของปป 3 ขวบ",
  girlfriendNickname: "ที่รัก 🎀",
  boyfriendName: "ปอนด์",
  passcode: "11092569", // 11 กันยายน 2569 (11/09/2569)
  birthdayDate: "2569-09-11",
  relationshipStartDate: "2569-05-05", // วันที่เริ่มคบกัน (ปรับแต่งได้)
  hintMessage: "คำใบ้วันเกิดคนพิเศษ: วันที่ 11 เดือน 09 ปี 2569 นะคะคนดี 🎂💖 (11/09/2569)",

  letter: {
    greeting: "สุขสันต์วันเกิดนะคนเก่งของปอนด์ 🎂✨",
    paragraphs: [
      "แฮปปี้เบิร์ธเดย์นะคะที่รัก! ขอให้ปีนี้เป็นปีที่มีแต่รอยยิ้มสดใส มีความสุขในทุกๆ วันที่ตื่นมา ",
      "ขอบคุณที่ก้าวเข้ามาในชีวิตปังปอนด์ เป็นทั้งความสดใส และความสบายใจที่อบอุ่นที่สุดเสมอมานะปอนด์แฮปปี้มากๆเวลาอยู่กับอ้วน ",
      "เวลาอยู่กับอ้วน ปอนด์เป็นตัวเองมากๆและขอบคุณที่เป็นเซฟโซนที่ปลอดภัยให้ปปนะ ขอบคุณสำหรับทุกความรักและความเอาใจใส่เลยนะ ",
      "ขอให้ทุกความปรารถนาของอีฟๆเป็นจริง สุขภาพแข็งแรง น่ารักสดใสแบบนี้ตลอดไป ปปสัญญาว่าจะคอยดูแล คอยจับมือ และอยู่เคียงข้างเธอในความสำเร็จทุกๆก้าวเสมอเลยนะ ",
    ],
    closing: "รักอีฟที่สุดในโลกเลยนะคะ 💖",
    sign: "จาก ปป 3 ขวบ 🎀✨",
  },

  memories: [
    {
      id: "1",
      title: "ไออ้วนตัวกลมขอถ่ายรูปด้วย ✌️👅",
      date: "5 กรกฎาคม 2026",
      location: "ห้องของหมา 💖",
      image: "/images/couple/photo1-selfie.jpg",
      caption: "ไออ้วนขอถ่ายรูปด้วยก่อนกลับบบบบ",
      tag: "Cutest Selfie ✌️",
    },
    {
      id: "2",
      title: "ไออ้วนกอดไต๋ฝุ่นนน 🐾🐱",
      date: "5 กรกฎาคม 2026",
      location: "เตียงนุ่มๆ ในห้องนอน 🛋️",
      image: "/images/couple/photo2-blackcat.png",
      caption: "น้องแมวดำตากลมโตตัวโปรดของเธอ หน้าตาน่าเอ็นดูเหมือนเจ้าของเวลานั่งมองตากลมๆ อ้อนเอาใจเลย!",
      tag: "Fluffy Black Cat 🐾",
    },
    {
      id: "3",
      title: "ไยไยไยเบะปากทำม่ะ 🥺💕",
      date: "5 กรกฎาคม 2026",
      location: "ช่วงเวลาอ้อนก่อนนอน 🌙",
      image: "/images/couple/photo3-pout.png",
      caption: "ขนาดทำหน้างอแงยังน่ารักขนาดนี้เลย! ใครจะไปทนไหว",
      tag: "Cute Pout 🥺",
    },
    {
      id: "4",
      title: "ยิ้มหวานข้างๆ กัน ☀️🥰",
      date: "5 กรกฎาคม 2026",
      location: "ในห้องของหมาบ้า 🌅",
      image: "/images/couple/photo4-closeup.png",
      caption: "รูปคู่ครั้งแรกของเราาาา",
      tag: "Warm Sunshine ☀️",
    },
    {
      id: "5",
      title: "เจ้าหมูโง่ 🐽🐶",
      date: "ไอหมากลายเป็นหมูที่มหาลัย",
      location: "สตอรี่ที่มีแค่เราสองคน 📱💌",
      image: "/images/couple/photo5-story.png",
      caption: "พบเจอหมูปีศาจ 1 อัตรา",
      tag: "Story to You 🐽",
    },
    {
      id: "6",
      title: "ออกเดทนอกสถาที่ๆๆๆๆ 🍉🍲",
      date: "11 กันยายน 2569",
      location: "ร้านชาบูบุฟเฟต์ครั้งแรกกก 🥢",
      image: "/images/couple/photo6-watermelon.jpg",
      caption: "ขอยาดดดอ้วกกกอิ่มฟุดๆแนะ!",
      tag: "Shabu & Watermelon 🍉",
    },
  ],
};
