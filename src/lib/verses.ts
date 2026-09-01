export interface Verse {
  reference: string;
  text: string;
}

// Short, well-known passages paraphrased for daily encouragement (not a verbatim
// translation quote from any single copyrighted edition).
const VERSES: Verse[] = [
  { reference: "詩篇 23:1", text: "主は私の羊飼い。私には何も欠けることがない。" },
  { reference: "ピリピ 4:13", text: "私を強くしてくださる方によって、私はどんなことでもできる。" },
  { reference: "イザヤ 40:31", text: "主を待ち望む者は新しく力を得、鷲のように翼をかって上る。" },
  { reference: "マタイ 11:28", text: "疲れた人、重荷を負っている人は、私のもとに来なさい。休ませてあげよう。" },
  { reference: "ヨシュア記 1:9", text: "強くあれ、雄々しくあれ。恐れてはならない。主が共にいてくださる。" },
  { reference: "ローマ 8:28", text: "神を愛する人たち、神のご計画に従って召された人たちのために、神はすべてを働かせて益としてくださる。" },
  { reference: "詩篇 121:1-2", text: "私は山に向かって目を上げる。私の助けはどこから来るのか。私の助けは主から来る。" },
  { reference: "ガラテヤ 6:9", text: "たゆまず善を行いましょう。あきらめずにいれば、時が来て刈り取ることになります。" },
  { reference: "コロサイ 3:23", text: "何をするにも、人のためにではなく、主のためにするように、心から行いなさい。" },
  { reference: "エペソ 3:20", text: "私たちのうちに働く力によって、願うところ、思うところを、はるかに超えて豊かに満たすことができる方に。" },
  { reference: "ネヘミヤ 8:10", text: "主を喜ぶことはあなたがたの力です。" },
  { reference: "詩篇 46:1", text: "神は私たちの避け所、また力。苦しむとき、そこにある助け。" },
];

function dayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function verseOfTheDay(date: Date = new Date()): Verse {
  return VERSES[dayOfYear(date) % VERSES.length];
}
