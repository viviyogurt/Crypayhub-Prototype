export default {
	transactions: function(){
		let txArray = [
			{
				tx_id: "4",
				tx_type: "Grocery",
				tx_date: "Nov 11",
				tx_money_number: "2333",
				tx_item_name: "Management"
			},
			{
				tx_id: "3",
				tx_type: "Entertainment",
				tx_date: "Nov 1",
				tx_money_number: "121",
				tx_item_name: "Game"
			},
			{
				tx_id: "2",
				tx_type: "Equipment",
				tx_date: "Nov 1",
				tx_money_number: "45.5",
				tx_item_name: "Camera.png"
			},
			{
				tx_id: "1",
				tx_type: "Office items",
				tx_date: "Nov 1",
				tx_money_number: "847.12",
				tx_item_name: "Pens"
			},
		];
		return txArray;
	}
}
