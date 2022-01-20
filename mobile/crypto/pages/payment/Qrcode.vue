<template>
	<view content>
		<view class="top-bar">
			<view class="top-bar-left">
				<view class="cuIcon-close"></view>
			</view>
		</view>
		<view class="content-qrcode">
			<view class="scan-squaure">
				<view class="left-top-border">
					
				</view>
				<view class="left-bottom-border">
					
				</view>
				<view class="right-top-border">
					
				</view>
				<view class="right-bottom-border">
					
				</view>
			</view>
			
		</view>
		
	</view>
</template>

<script>
	export default{
		onLoad(){
			
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
.content-qrcode {
	background-color: rgba(0,0,0,0.3);
	width: 100%;
	height: 100%;
	position:absolute;
	display: flex;
	align-items: center;
}
.scan-squaure {
	background-color: #FFFFFF;
	width: 500rpx;
	height: 500rpx;
	margin: 0 auto;
	position: relative;
	border-radius: $uni-border-radius-base;
}
.left-top-border {
	width: 50px;
	height: 50px;
	position: absolute;
	top: -10.5px;
	left: -10.5px;
	border-left: 5px solid #FFFFFF;
	border-top: 5px solid #FFFFFF;
}
.right-top-border {
	width: 50px;
	height: 50px;
	position: absolute;
	top: -10.5px;
	right: -10.5px;
	border-right: 5px solid #FFFFFF;
	border-top: 5px solid #FFFFFF;
}
.left-bottom-border {
	width: 50px;
	height: 50px;
	position: absolute;
	bottom: -10.5px;
	left: -10.5px;
	border-bottom: 5px solid #FFFFFF;
	border-left: 5px solid #FFFFFF;
}
.right-bottom-border {
	width: 50px;
	height: 50px;
	position: absolute;
	bottom: -10.5px;
	right: -10.5px;
	border-right: 5px solid #FFFFFF;
	border-bottom: 5px solid #FFFFFF;
	
}
</style>
