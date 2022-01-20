<template>
	<view class="top-up-content">
		<view class="top-bar">
			<view class="top-bar-left">
				<view class="cuIcon-back"></view>
			</view>
			<view class="top-bar-center">
				Top-up
			</view>
		</view>
		<view class="top-up-amount">
			<view class="top-up-amount-title">
				CPHT Amount
			</view>
			<view class="top-up-amount-number">
				{{amountValue}}
			</view>
		</view>
		<view class="top-up-details">
			???
		</view>
		<view class="digit-panel">
			<xwDial ref="delPhone" @returnPhone="returnPhone"></xwDial>
				
		</view>
			
		<view class="sliding">
			
		</view>
		
	</view>
</template>

<script>
	import xwDial from '@/components/xw-dial'
	export default {
		components: {
		        xwDial
		    }, 
		data() {
			return {
				phone:[],
				tel:"",
				amountValue: "150.0000"
			};
		},
		methods: {
		//回删数据
			delPhone(){
				this.$refs.delPhone.delPhone()
			},
			//清除全部数据
			delAll(){
				this.$refs.delPhone.delAll()
			},
			//返回数据
			returnPhone(data){
				this.phone = data
				this.tel = data.join("")
				console.log(this.phone,this.tel)
			}
		},
	}
</script>

<style lang="scss">
	@import "uview-ui/index.scss";
.top-up-content {
	background-color: #FFFFFF;
}
.top-bar {
	display: inline-block;
	height: 120rpx;
	width: 100%;
	padding-top: 80rpx;
}
.top-bar-left {
	float: left;
	padding-left: 40rpx;
}
.top-bar-center {
	text-align: center;
	padding-right: 100rpx;
	font-size: $uni-font-size-title;
	font-weight: bold;
	font-family: 'Montserrat', sans-serif;
	src: url('../../static/fonts/Montserrat-VariableFont_wght.ttf');
}
.top-up-amount {
	width: 100%;
	height: 200rpx;
	border: 1px solid red;
	.top-up-amount-title {
		padding-top: 45rpx;
		text-align: center;
		font-size: $uni-font-size-title;
		font-family: 'Montserrat', sans-serif;
		src: url('../../static/fonts/Montserrat-VariableFont_wght.ttf');
	}
	.top-up-amount-number {
		text-align: center;
		font-size: 35px;
		color: #525298;
		font-weight: bold;
	}
}
</style>
