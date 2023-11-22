export function parseCellSuggestionCallback(suggestionKey, lsSuggestionField){
	return (G, row, col, val) => {
		try {
			if(col + "Suggest" !== suggestionKey){
				return
			}

			let suggestionData = row[suggestionKey]
			// console.log(suggestionData)
			const s_items = suggestionData.Items;
			for (let i = 0; i < s_items.length; i++) {
			   if (s_items[i].Value === val) {
				  // Clear the undo buffer to remove the entry with html string
				  G.ClearUndo();
				  for (let j = 0; j < lsSuggestionField.length; j++) {
					 let field = lsSuggestionField[j]
					 G.SetValue(row, field, s_items[i][field], 1);
				  }
				  break;
			   }
			}
		 } catch (ex) {
			console.log(ex)
		 }
	}
}

export function parseItemSuggestionCallBack(suggestionKey, data, lsSuggestionField){
	let jsonData = JSON.parse(data);
	let dataSuggest = jsonData.Changes[0][suggestionKey];
	let Items = dataSuggest.Items;

	// TreeGrid error when Items is empty
	// if (Items.length == 0) { return data; }

	let lsField = lsSuggestionField
	let nRow = Items.length + 1

	let dummyItems = []
	let tableItems = new Array(lsField.length * (Items.length + 1))

	//create header
	let idx = 0;

	lsField.forEach(function (value, index) { tableItems[idx] = { "Text": `<b>${value}</b>`, "Disabled": 1, Name: value }; idx += nRow; })
	idx = 1
	for (let i = 0; i < Items.length; i++) {
	   let Item = Items[i]
	   let rowValue = ""
	   let allValue = []
	   for (let j = 0; j < lsField.length; j++) {
		  allValue.push(Item[lsField[j]]);
	   }
	   rowValue = allValue.join("__")

	   for (let j = 0; j < lsField.length; j++) {
		  tableItems[idx] = { Value: rowValue, Text: Item[lsField[j]], Name: Item[lsField[j]] }
		  idx += nRow
	   }
	   idx = i + 2
	   dummyItems.push({ ...{ Value: rowValue, Hidden: 1, Name: rowValue}, ...Item })
	}
	Items = [{ Columns: lsField.length, Items: tableItems, Value: "<<dummy value>>", Name: "" }]
	Items = Items.concat(dummyItems)
	jsonData.Changes[0][suggestionKey] = { Head: "suggest", Items: Items }
	return JSON.stringify(jsonData)
}
