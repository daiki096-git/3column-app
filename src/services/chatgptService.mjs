import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai=new OpenAI({
    apiKey:process.env.OPEN_API_KEY,
})

export async function getAdviceFromChat(content, feeling_obj, autothink_obj,action) {
    
    const prompt=`
    以下は認知行動療法の3コラムです。
    状況とそれに対する感情・気分と自動思考を記載しています(それぞれ最大5つ)。
    ・状況:${content}
    ・感情:${JSON.stringify(feeling_obj)}
     →オブジェクトで{不快:80}等とあるがこれは、気分が不快で、その度合いが80%と読み取って
    ・自動思考:${JSON.stringify(autothink_obj)}
    ・上記状況に対して実際にとった行動:${action}
     →オブジェクトで{腹が立つ:80}等とあるがこれは、自動思考が腹が立つで、その度合いが80%と読み取って

    この情報をもとに、共感しつつポジティブなアドバイスをください。`
    const chatCompletion=await openai.chat.completions.create({
        model:'gpt-3.5-turbo',
        messages:[{role:'user',content:prompt}],
        temperature:0.7,
        max_tokens:800,
    })
    return chatCompletion.choices[0].message.content.trim();
}
