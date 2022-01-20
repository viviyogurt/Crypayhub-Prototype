<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-var-left">
				
			</view>
			<view class="top-bar-center">
				<view class="title">
				</view>
			</view>
			<view class="top-bar-right">
				<view class="wait-to-design">
				</view>
			</view>
		</view>
		<view class="mainPanel">
			<view class="top-panel">
				<view class="title-panel">
					<view class="account-title" style="color:#808080">
						Account Balance
					</view>
					<view class="account-balance" style="color: #FFFFFF">
						<view class="CPHT" style="font-size: 25px">
							25,000.30 <a style="font-size: 10px; padding-left: 10rpx;">  CPHT</a>
						</view>
						<view class="PAWT" style="font-size: 25px">
							230.30 <a style="font-size: 10px; padding-left: 10rpx;">  PAWT</a>
						</view>
					</view>
					<view class="account-name" style="color:#808080">
						<a class="Account">
							Account :
						</a>
						<a class="copy">
							<image src="../../static/images/copy.png" mode="" role="button" @click="onClick()"></image>
						</a>
						<a class="name" style="color:#FFFFFF">
							crypayhub.near
						</a>	
					</view>
				</view>
			</view>
			<view class="middle-panel">
				<view class="QR-code">
					<view class="btn-qr-code">
						<view class="iconfont icon-saomiao">
						</view>
					</view>
					<view class="btntext" @click="">
						QR Code
					</view>
				</view>
				<view class="Top-up">
					<view class="btn-top-up"> 
					<view class="iconfont icon-qiaqia">
					</view>
					</view>
					<view class="btntext">
						Top-up
					</view>
				</view>
				<view class="Records">
					<view class="btn-records">
						<view class="iconfont icon-wenben">
							
						</view>
					</view>
					<view class="btntext">
						Records
					</view>
				</view>
			</view>
			<view class="bottom-panel">
				<view class="bottom-panel-title">
					<a class="bottom-panel-title-text">
						Recent Transactions</a>
				</view>
				<view class="tx-list-panel">
					<view class="tx-list" v-for="(item, index) in TXs" :key="item.id">
						<view class="tx-list-left">
							<view class="display-tx-button">
								<view v-if="item.tx_type === 'Grocery'" class="iconfont icon-jingxuan">
								</view>
								<view v-else-if="item.tx_type === 'Entertainment'"class="iconfont icon-erji">
								</view>
								<view v-else-if="item.tx_type === 'Equipment'"  class="iconfont icon-liwu">
								</view>
								<view v-else-if="item.tx_type === 'Office items'"  class="iconfont icon-dianji">
								</view>
							</view>
						</view>
						<view class="tx-list-right">
							<view class="tx-list-right-top">
								<view class="tx-type">
									{{item.tx_type}}
								</view>
								<view class="tx-money-number">
									{{item.tx_money_number}}
								</view>
							</view>
							<view class="tx-list-right-bottom">
								<view class="tx-date">
									{{item.tx_date}}
								</view>
								<view class="tx-item-name">
									{{item.tx_item_name}}
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="footer">
					
					<view class="footer-panel">
						<view class="home">
							<view class="iconfont icon-wode">
								
							</view>
						</view>
						<view class="setting">
							<view class="iconfont icon-shezhi">
								
							</view>
						</view>
					</view>
					
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	import tx_datas from "../../commons/js/tx_data.js"
	export default {
		data() {
			return {
				title: 'Hello',
				TXs: []
			}
		},
		onLoad() {
			this.getTXs();
		},
		methods:{
			onClick() {
				console.log(this.CPHT)
				console.log(this.PAWT)
			},
			getTXs: function() {
				this.TXs = tx_datas.transactions();
				for (let i = 0; i < this.TXs.length; ++i) {
					this.TXs[i].tx_type_img = "../../static/images/" + this.TXs[i].tx_type_img;
				}
				console.log(this.TXs);
			}
		}
	}
</script>

<style lang="scss">
	// @import "../../commons/css/mycss.css";
	@import "uview-ui/index.scss";
.content {
	display: flex;
	height: 100%;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding-top: var(--status-bar-height);
	background-color: $uni-bg-color-grey;
}

.top-bar {
	position: fixed;
	z-index: 1001;
	top: 0;
	left: 0;
	width: 100%;
	height: 88rpx;
	padding-top: var(--status-bar-height);
	display: flex;
	background-color: $uni-bg-color-grey;
}
.top-bar-center {
	flex:auto;
	text-align: center;
	padding-top: 19px;
	.title {
		font-size: 40px;
		color:$uni-text-color;
		line-height: 88rpx  ;
	}
}
.mainPanel {
	padding-top: 118rpx;
	// z-index: 1001;
	display: flex;
	flex-direction: column;
}
.top-panel {
	margin: 0 auto;
	width: 327px;
	height: 150px;
	background: rgba(3,13,19,1);
	box-shadow: 0px 18px 20px 0px rgba(39, 40, 50, 0.1);
	border-radius: $uni-border-radius-base;
}
.title-panel {
	text-align: center;
}
.account-title {
	padding-top: 10px;
}
.account-balance {
	white-space: pre-wrap;
}
.account-name {
	flex-direction: row;
	.copy {
		
		image{
			height: 24rpx;
			width: 24rpx;
			padding-left: 20rpx;
			padding-right: 10rpx;
		}
		
	}
}
.middle-panel {
	padding-top: 45rpx;
	width: 100%;
	height: 220rpx;
	display: flex;
	justify-content: space-between;
	z-index: 1001;
	padding-left: 70rpx;
	padding-right: 70rpx;
	padding-bottom: 70rpx;
}
.btn-qr-code {
	background-color: $uni-bg-color-grey;
	width: 115rpx;
	height: 115rpx;
}
.btn-top-up {
	background-color: $uni-bg-color-grey;
	width: 115rpx;
	height: 115rpx;
}
.btn-records {
	background-color: $uni-bg-color-grey;
	width: 115rpx;
	height: 115rpx;
}
.btntext {
	padding-top: 10rpx;
	color: $uni-text-color-grey;
	font-family: 'Montserrat', sans-serif;
	src: url('../../static/fonts/Montserrat-VariableFont_wght.ttf');
}
.bottom-panel {
	background-color: $uni-bg-color;
	width: 100%;
	height: 800rpx;
	border-top-left-radius: $uni-border-radius-base;
	border-top-right-radius: $uni-border-radius-base;
	padding-top: 35rpx;
	flex-shrink: 0;
	flex-direction: column;
	box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
}
.bottom-panel-title {
	float: left;
	padding-left: 40rpx;
	padding-top: 30rpx;
	padding-bottom: 30rpx;
	color: $uni-text-color-grey;
	font-family: 'Montserrat', sans-serif;
	src: url('../../static/fonts/Montserrat-VariableFont_wght.ttf');
}
.tx-list-panel {
	padding: 98rpx $uni-spacing-col-base;
}
.tx-list {
	height: 130rpx;
	.tx-list-left {
		float: left;
		.display-tx-button {
			background-color:#FFFFFF;
			width: 115rpx;
			height: 115rpx;
		}
	}
	.tx-list-right {
		padding-left: 140rpx;
		padding-right: 20rpx;
		.tx-list-right-top {
			height: 50rpx;
			.tx-type {
				float: left;
				color: $uni-text-color;
			}
			.tx-money-number {
				float: right;
			}
		}
		.tx-list-right-bottom {
			padding-top: 10rpx;
			height: 50rpx;
			.tx-date {
				float: left;
				color: #808080;
				font-size: $uni-font-size-sm;
				line-height: 40rpx;
			}
			.tx-item-name {
				float: right;
				color: #808080;
				font-size: $uni-font-size-sm;
				line-height: 40rpx;
			}
		}
	}
}
.footer {
	height: 200rpx;
	background-color: $uni-bg-color;
	.footer-panel {
		display: flex;
		justify-content: space-between;
		text-align: center;
		padding-left: 60rpx;
		padding-right: 60rpx;
	}
}
.iconfont {
	width: 200rpx;
	height: 200rpx;
	z-index: 1001;
	margin: auto;
	padding: 30rpx;
}

</style>
