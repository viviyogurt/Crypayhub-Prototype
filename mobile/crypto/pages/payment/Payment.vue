
<template>
	<view>
		<view class="uni-padding-wrap">
			<view style="background:#FFF; padding:50rpx 0;">
				<view class="uni-hello-text uni-center font-lg text-danger">{{ vipName }}</view>
				<view class="uni-h1 uni-center uni-common-mt">
					<span class="price">￥{{ price }}</span>
				</view>
			</view>
			<view class="uni-btn-v uni-common-mt">
				<!-- #ifdef H5 -->
				<button type="primary" @click="scanCodePay" :loading="loading" class="flex align-center justify-center">
					<image :src="getImgUrl('/files/static/common/wx.png')" style="width: 60rpx;height: 60rpx;"></image>
					<span class="pl-1">微信扫码支付</span>
				</button>
				<!-- #endif -->
			</view>
		</view>
		<uni-popup id="popup" ref="popup" type="center" :animation="false" @change="change1">
			<view class="flex flex-column bg-white py-2">
				<view class="flex align-center justify-center"><image :src="codeUrl"></image></view>
				<view class="flex align-center justify-center" style="color: #7B7B7B;">请使用微信扫描二维码以完成支付</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import uniPopup from '@/components/uni-popup/uni-popup.vue';
	export default {
		components: { uniPopup },
		data() {
			return {
				title: 'request-payment',
				loading: false,
				typeId: 0,
				vipName: '',
				price: 1,
				providerList: [],
				user: '',
				baseLocation: '',
				memberCardOrders: [],
				codeUrl: '',
				header: { 'Content-Type': 'application/x-www-form-urlencoded' }
			};
		},
		onLoad: function(e) {
			this.baseLocation = getApp().globalData.BaseUrl;
			this.user = uni.getStorageSync('user');
			if (e.id) {
				this.typeId = e.id;
			}
			if (e.typeName) {
				this.vipName = e.typeName;
			}
			if (e.currentPrice) {
						this.price = e.currentPrice;
					}
				},
				methods: {
					//登录
					async login() {
						// #ifdef APP-PLUS || H5
						this.$loginForAppAndH5();
						// #endif
			 
						// #ifdef MP-WEIXIN
						this.$loginForWeiXinApplet();
						// #endif
					},
					//扫码支付
					async scanCodePay() {
						if (this.user) {
							this.loading = true;
							const res = await this.$ajaxRequest({
								url: '/api/client/pay/scanCodePay',
								data: {
									memberCardTypeId: this.typeId,
									payType: 'SCANCODEPAY',
									orderAmount: this.price,
									memberCardTypeName: this.vipName
								}
							});
				if (res.data.code === 200) {
					this.codeUrl = res.data.codeUrl;
					this.$refs.popup.open();
					var interval = setInterval(function() {
						uni.request({
							url: 'https://你的域名/api/client/pay/selectPayResultForScanCodePay',
							header: {
								'Content-Type': 'application/x-www-form-urlencoded'
							},
							method: 'GET',
							dataType: 'json',
							data: {
								orderNo: res.data.orderNo
							},
							success: res => {
								if (res.data.code === 200) {
									uni.showToast({
										title: '支付成功，3s后将进入会员中心页！',
										icon: 'none',
										duration: 3000
									});
									clearInterval(interval);
									setTimeout(function() {
										uni.navigateTo({
											url: 'membercenter'
										});
									}, 3000);
								}
							},
							fail: err => {
								uni.showToast({
									title: err,
									icon: 'none',
									duration: 3000
								});
								return false;
							}
						});
					}, 3000);
					return true;
				} else {
					uni.showToast({
						title: res.data.message,
						icon: 'none',
						duration: 3000
					});
					return false;
				}
			} else {
				this.login();
			}
		}
	}
};



</script>

<style>
	.rmbLogo {
		font-size: 40rpx;
	}
	 
	button {
		background-color: #007aff;
		color: #ffffff;
	}
	 
	.uni-h1.uni-center {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: flex-end;
	}
	 
	.price {
		width: 200rpx;
		height: 80rpx;
		padding-bottom: 4rpx;
	}
	 
	.ipaPayBtn {
		margin-top: 30rpx;
	}
</style>
