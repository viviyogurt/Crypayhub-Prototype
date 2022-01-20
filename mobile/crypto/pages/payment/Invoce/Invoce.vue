<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-left">
				<view class="cuIcon-back "></view>
			</view>
			<view class="top-bar-center">
				Invoice
			</view>
		</view>
		<view class="main-panel">
			<view class="sub-panel top-main-panel">
				<view class="green-star">
					<view class="cuIcon-favorfill text-xsl text-white">
					</view>
				</view>
				<view class="top-title">
					Details
				</view>
				<view class="top-details">
					14 GB Internet + 2 GB Streaming, Active Period 30 days
				</view>
				<view class="black-panel">
					<view class="black-panel-title">
						Mega Sales Activity
					</view>
					<view class="all-col">
						<view class="col-1">
							<view class="col col-1-left">
								Periods
							</view>
							<view class="col col-1-right">
								1/4 - 4/1
							</view>
						</view>
						<view class="col-2">
							<view class="col col-2-left">
								Delivery
							</view>
							<view class="col col-2-right">
								$3500000
							</view>
						</view>
						<view class="cpl-3">
							<view class="col col-3-left">
								Discount rate
							</view>
							<view class="col col-3-right">
								20% off
							</view>
						</view>
						
					</view>
					<view class="progress-bar">
						<view class="onbar">
							
						</view>
					</view>
				</view>
			</view>
			<view class="sub-panel bottom-main-panel">
				<view class="bottom-title">
					Sunday Ecommerce Shop
				</view>
				<view class="merchant-detail">
					<view class="merchant-key">
						<view class="merchant-icon cuIcon-lock ">
							
						</view>
						<view class="key">
							HXuJ5cZ7NYfNDcWrcH2WtsVFPkdWukFxxKwBf9W4rpBc
						</view>
					</view>
					<view class="merchant-location">
						<view class="merchant-icon cuIcon-location ">
							
						</view>
						<view class="location">
							Hong Kong
						</view>
					</view>
					<view class="merchant-type">
						<view class="merchant-icon cuIcon-profile">
							
						</view>
						<view class="type">
							Verified Merchant
						</view>
					</view>
				</view>
				<view class="referer-code-panel">
					<view class="refer-icon cuIcon-appreciatefill">
						
					</view>
					<view class="referrer-code-text">
						Referrer Code
					</view>
					<view class="apply">
						Apply
					</view>
				</view>
				<view class="total-amount-block">
					<view class="total-content">
						<view class="total-text">
							Total
						</view>
						<view class="total-number">
							CPHT 50.000
						</view>
					</view>
					
				</view>
			</view>
		</view>
		<view class="swipe-block-wrap">
			<view class="swipe-block">
				
				<view class="swipe-button">
					<view class="cuIcon-right">
						
					</view>
				</view>
				<view class="swipe-text">
					Swipe To Pay
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="scss">
	@import "uview-ui/index.scss";
.content {
	background-color: $uni-bg-color-grey;
	width: 100%;
	height: 100%;
	position:absolute;
}
.top-bar {
	padding-top: 60rpx;
	padding-left: 40rpx;
	padding-bottom: 70rpx;
	width: 100%;
	display: inline-block;
}
.cuIcon-back {
	font-size: 40rpx;
	float: left;
}
.top-bar-center {
	flex:auto;
	text-align: center;
	font-size: 40rpx;
	padding-right: 60rpx;
	font-family: Poppins;
}
.sub-panel {
	width: 600rpx;
	height: 626rpx;
	border-radius: 20px;
	background-color: #FFFFFF;
	box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
	margin: 0 auto;
}
.top-main-panel {
	border-bottom: 1rpx dashed grey;
	.green-star {
		position: absolute;
		width: 60px;
		height: 60px;
		left: 163px;
		top: 68px;
		border-radius: $uni-border-radius-lg;
		box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
		background-color: #22B07D;
		.cuIcon-favorfill {
			font-size: 50rpx;
			color: #FFFFFF;
			text-align: center;
			position: relative;
			margin: 30rpx;
		}
	}
	.top-title {
		font-family: Poppins;
		font-style: normal;
		font-weight: 500;
		font-size: 20px;
		line-height: 20px;
		text-align: center;
		letter-spacing: 0.3px;
		z-index: 1001;
		padding-top: 100rpx;
	}
	.top-details {
		font-family: Poppins;
		font-style: normal;
		font-weight: normal;
		font-size: 13px;
		line-height: 162%;
		/* or 162% */
		text-align: center;
		letter-spacing: 0.3px;
		mix-blend-mode: normal;
		opacity: 0.5;
		position: absolute;
		height: 50.07px;
		left: 17.33%;
		right: 14.67%;
		
	}
	.black-panel {
		position: absolute;
		width: 275px;
		height: 119px;
		left: 56px;
		top: 245px;
		background: #4A4747;
		border-radius: 10px;
		.black-panel-title {
			font-family: Poppins;
			font-style: normal;
			font-weight: bold;
			font-size: 11px;
			line-height: 16px;
			/* identical to box height */
			padding-top: 10rpx;
			text-align: center;
			color: #FFFFFF;
		}
		.progress-bar {
			position: absolute;
			width: 223px;
			height: 7px;
			left: 32px;
			top: 100px;
			
			background: #725A87;
			border-radius: 100px;
			.onbar {
				display: flex;
				flex-direction: row;
				align-items: flex-start;
				padding: 0px;
				
				position: absolute;
				width: 176px;
				left: 0px;
				top: 0px;
				bottom: 0px;
				
				background: linear-gradient(269.49deg, #CD1D9C 0%, #6505B4 100%);
			}
		}
		.col {
			font-family: Poppins;
			font-style: normal;
			font-weight: normal;
			font-size: 11px;
			line-height: 16px;
			color: #FFFFFF;
			weight:100%;
			padding-left: 80rpx;
			padding-right: 40rpx;
			padding-top: 15rpx;
		}
		// .col-1 {
		// 	display: flex;
		// 	justify-content: space-between;
		// }
		.col-1-left {
			float: left;
			
		}
		.col-1-right {
			float: right;
		}
		.col-2-left {
			float: left;
		}
		.col-2-right {
			float: right;
		}
		.col-3-left {
			float: left;
		}
		.col-3-right {
			float: right;
		}
	}
}
.all-col {
	display: inline-block;
}
.bottom-main-panel {
	.bottom-title {
		font-family: Poppins;
		font-style: normal;
		font-weight: 500;
		font-size: 14px;
		line-height: 22px;
		padding-top: 10rpx;
		/* or 157% */
		
		text-align: center;
		letter-spacing: 0.3px;
		
		color: #273240;
	}
}
.merchant-icon {
	font-size: 50rpx;
	color: #A2A8B0
}
.merchant-key {
	padding-left: 45rpx;
	padding-top: 20rpx;
	padding-bottom: 20rpx;
	display: flex;
	justify-content: space-between;
	.cuIcon-lock {
		padding-right: 20rpx;
	}
	.key {
		font-family: Poppins;
		font-style: normal;
		font-weight: normal;
		font-size: 12px;
		line-height: 18px;
		display: flex;
		align-items: center;
		word-break: break-all;
		color: #A2A8B0;
	}
}
.merchant-location {
	padding-left: 45rpx;
	padding-top: 20rpx;
	padding-bottom: 20rpx;
	display: flex;
	.cuIcon-location {
		padding-right: 20rpx;
	}
	.location {
		font-family: Poppins;
		font-style: normal;
		font-weight: normal;
		font-size: 12px;
		line-height: 18px;
		display: flex;
		align-items: center;
		color: #A2A8B0;
	}
}
.merchant-type {
	padding-left: 45rpx;
	padding-top: 20rpx;
	padding-bottom: 20rpx;
	display: flex;
	.cuIcon-profile {
		padding-right: 20rpx;
	}
	.type {
		font-family: Poppins;
		font-style: normal;
		font-weight: normal;
		font-size: 12px;
		line-height: 18px;
		display: flex;
		align-items: center;
		color: #A2A8B0;
	}
}
.referer-code-panel {
	width: 275px;
	height: 59.6px;
	margin: 0 auto;
	background: #FFFFFF;
	// border: 1px solid #E7E7F6;
	box-sizing: border-box;
	border-radius: 15px;
	display: flex;
	justify-content: space-between;
	.cuIcon-appreciatefill {
		color: #AAAACF;
		font-size: 40rpx;
		padding-left: 20rpx;
		padding-top: 25rpx;
	}
	.referrer-code-text {
		font-family: Poppins;
		font-style: normal;
		font-weight: normal;
		font-size: 13px;
		line-height: 13px;
		/* or 100% */
		letter-spacing: 0.3px;
		color: #2C3A4B;
		mix-blend-mode: normal;
		opacity: 0.5;
		padding-top: 35rpx;
	}
	.apply {
		font-family: Poppins;
		font-style: normal;
		font-weight: 600;
		font-size: 13px;
		line-height: 13px;
		/* or 100% */
		
		letter-spacing: 0.5px;
		padding-top: 35rpx;
		color: #32A7E2;
		padding-right: 10rpx;
		mix-blend-mode: normal;

	}
}
.total-amount-block {
	width: 624rpx;
	height: 168rpx;
	display: table-cell;
	vertical-align: bottom;
	background: #E2E2F0;
	border-bottom-left-radius: 20px;
	border-bottom-right-radius: 10px;
	border-radius: 1px solid red;
	z-index: 1001;
	
	
}
.total-content {
		clear:both;
		display: flex;
		justify-content: space-between;
		padding-left: 30rpx;
		padding-right: 10rpx;
		.total-text {
			font-family: Poppins;
			font-style: normal;
			font-weight: 500;
			font-size: 16px;
			line-height: 16px;
			/* or 100% */
			
			letter-spacing: 0.3px;
			padding-bottom: 70rpx;
			color: #3F3F65;
			
		}
		.total-number {
			font-family: Poppins;
			font-style: normal;
			font-weight: 500;
			font-size: 18px;
			line-height: 22px;
			/* or 122% */
			
			text-align: right;
			
			color: #3F3F65;
		}
	}
	.swipe-block-wrap {
		padding-top: 30rpx;
		.swipe-block {
			background: #333333;
			border-radius: 36px;
			width: 630rpx;
			height: 128rpx;
			box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
			margin: 0 auto;
			.swipe-button {
				background: #FFFFFF;
				border-radius: $uni-border-radius-circle;
				width: 100rpx;
				height: 100rpx;
				margin-left: 40rpx;
				position: absolute;
				top: 91%;
				.cuIcon-right {
					font-size: 40rpx;
					padding-top: 30rpx;
					padding-left: 30rpx;
				}
				
			}
			.swipe-text {
				font-family: Poppins;
				font-style: normal;
				font-weight: 600;
				font-size: 15px;
				line-height: 26px;
				/* identical to box height, or 173% */
				
				letter-spacing: 2px;
				
				color: #FFFFFF;
				padding-top: 40rpx;
				padding-left: 250rpx;
			}
		}
	}
	
</style>
