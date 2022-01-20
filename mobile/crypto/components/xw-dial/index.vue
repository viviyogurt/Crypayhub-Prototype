<template>
	<view style="display: flex;">
		<view class="dial">
			<view class="dial_list" 
			@click="addPhone(item)"
			v-for="(item,i) in list" :key="i">
				{{item.name}}
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "Dail",
		data() {
			return {
				list: [{
						id: "1",
						name: "1",
					},
					{
						id: "2",
						name: "2",
					},
					{
						id: "3",
						name: "3",
					},
					{
						id: "4",
						name: "4",
					},
					{
						id: "5",
						name: "5",
					},
					{
						id: "6",
						name: "6",
					},
					{
						id: "7",
						name: "7",
					},
					{
						id: "8",
						name: "8",
					},
					{
						id: "9",
						name: "9",
					},
					{
						id: "*",
						name: "*",
					},
					{
						id: "0",
						name: "0",
					},
					{
						id: "#",
						name: "#",
					}
				],
				
				phone:[],
			}
		},
		onLoad() {

		},
		methods: {
			//点击数字键
			addPhone(item){
				if(isNaN(parseInt(item.name))){
					this.phone.push(item.name)
				}else{
					this.phone.push(parseInt(item.name))
				}
				this.returnPhone()
				// console.log(this.phone)
			},
			//删除键
			delPhone(){
				this.phone.pop()
				// console.log(this.phone)
				this.returnPhone()
			},
			//清除全部
			delAll(){
				this.phone = []
				this.returnPhone()
			},
			//返回数据
			returnPhone(){
				this.$emit("returnPhone",this.phone)
			}
		},
	}
</script>

<style lang="scss" scoped>
	.dial {
		display: grid;
		grid-template-columns: 139rpx 139rpx 139rpx;
		grid-template-rows: 139rpx 139rpx 139rpx 139rpx;
		grid-gap: 29rpx 89rpx;
		margin: 0 auto;
		background: #FFFFFF;

		.dial_list {
			width: 139rpx;
			height: 139rpx;
			font-size: 56rpx;
			color: #333333;
			line-height: 139rpx;
			text-align: center;
			background: #F6F6F6;
			border-radius: 50%;
			overflow: hidden;
			font-weight: bold;
		}

		.dial_list:active {
			color: #2C7FFB;
			background: #2C7FFB;
			background: rgba(44, 127, 251, 0.1);
		}
	}
</style>
