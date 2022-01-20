<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-left">
				<view class="cuIcon-close"></view>
			</view>
		</view>
		<view class="content-input">
			<view class="overall-panel">
				<view class="panel-title">
					Secure Code
				</view>
				<view class="input-password">
					<validcode ref="pwd" :maxlength="4" :isPwd="true" @finish="getPwd"></validcode>
				</view>
				<button class="confirm-button">
					
						<view class="text">
							Confirm
						</view>
					
				</button>
			</view>
		</view>
	</view>
</template>

<script>
	import validCode from '../../components/p-validCode/validCode.vue'
	export default {
		methods: {
			getPwd(val) {
			                console.log(val);
			},
		} 
	}

</script>

<style lang="scss">
	@import "uview-ui/index.scss";
	
.top-bar {
	background-color: rgba(0,0,0,0.3);
}
.top-bar-left {
	position: fixed;
	top: 40rpx;
	left: 50rpx;
}
.cuIcon-close {
	font-size: 50rpx;
}
.content-input {
	background-color: rgba(0,0,0,0.3);
	width: 100%;
	height: 100%;
	position:absolute;
	display: flex;
	align-items: center;
}
.overall-panel {
	background-color: #FFFFFF;
	width: 610rpx;
	height: 500rpx;
	margin: 0 auto;
	position: relative;
	border-radius: $uni-border-radius-base;
}
.panel-title {
	padding-top: 40rpx;
	padding-left: 40rpx;
	font-size: 38rpx;
	font-weight: bold;
}
.input-password {
	padding-top: 60rpx;
	padding-bottom: 50rpx;
}
.confirm-button {
	height: 100rpx;
	width: 510rpx;
	background-color: black;
	text-align: center;
	border-radius: $uni-border-radius-sm;
	display: flex;
	align-items: center;
	margin: 0 auto;
	position: relative;
	color: #FFFFFF;
	justify-content:center;
	.text {
		color: #FFFFFF;
		font-size: 40rpx;
		display:table-cell;
		text-align:center;
		vertical-align: middle;
		font-family: 'Montserrat', sans-serif;
		src: url('../../static/fonts/Montserrat-VariableFont_wght.ttf');
	}
}
	
</style>
