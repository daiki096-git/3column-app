//検索結果を日付順にソート
export const getSearchDate=(results, id)=>{
      let group = [];
      let name = "release";
      results.forEach((memo) => {
        let memo_date = new Date(memo.created_at)
        let formattedDate = `${memo_date.getFullYear()}/${memo_date.getMonth() + 1}/${memo_date.getDate()}`;
        group.push({ date: formattedDate, title: memo.title, content: memo.content, id: memo.id, name: name })
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
      const data={ date: sortgroup,userid: id }
      return data
    } 