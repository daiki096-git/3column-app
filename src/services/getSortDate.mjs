import { getColumnDbModel } from "../models/column/getColumnDbModel.mjs";

//top画面遷移時の3コラ取得及びソート
export const getSortDate=async(id,page)=> {
    try {
      const results = await getColumnDbModel(id,page);    
      let group = [];
      results.data.forEach((memo) => {
        let memo_date = new Date(memo.created_at)
        let formattedDate = `${memo_date.getFullYear()}/${memo_date.getMonth() + 1}/${memo_date.getDate()}`;

        group.push({ date: formattedDate, title: memo.title, content: memo.content, id: memo.id })
      })
      let groupbydate = group.reduce((accum, current) => {
        const date = current.date;
        if (!accum[date]) {
          accum[date] = []
        }
        accum[date].push(current);
        return accum;
      }, {})
      let sort = Object.keys(groupbydate).sort((a, b) => {
        return new Date(b) - new Date(a);
      })
      let sortgroup = {}
      sort.forEach((date) => {
        sortgroup[date] = groupbydate[date]

      })
      const data = { date: sortgroup, userid: id,total:results.total}
      return data
    } catch(error) {
      console.error("エラーが発生しました",error.message);
      throw new Error("日付の取得に失敗しました")
    }
  }