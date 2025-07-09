import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPEN_API_KEY,
});

export async function getAdviceFromChat(content, feeling_obj, autothink_obj) {
  const prompt = `
以下は認知行動療法の3コラムです。
利用者が感じた「状況」「感情・気分」「自動思考」が以下に記載されています（それぞれ最大5つ）。
これらの情報をもとに、以下の2つを含めて文章で返してください：

①共感しながら、やさしく、心が少し軽くなるようなポジティブなアドバイス(回答にこの文章は含めない)
②自動思考から推測される「思考の癖（認知の歪み）」の名前と簡単な説明（例：白黒思考、自己関連づけなど）(回答にこの文章は含めない)

●状況: ${content}
●感情: ${JSON.stringify(feeling_obj)}
 →例：{不安: 80} は「不安な気分が80%あった」と読み取ってください
●自動思考: ${JSON.stringify(autothink_obj)}
 →例：{腹が立つ: 70} は「腹が立つという自動的な思考が70%の強さであった」と読み取ってください

【注意】専門的すぎる言葉は使わず、10〜20代の人にも伝わるやさしい言葉でお願いします。
`;

  const chatCompletion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 1000,
  });

  return chatCompletion.choices[0].message.content.trim();
}
