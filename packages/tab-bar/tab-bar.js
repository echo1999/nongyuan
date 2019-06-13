const Sea = require('../../packages/bigsea.js')
const app = getApp()
Component({
	data: {
	},
	attached () {
	},
	methods: {
		bindQRcode() {
			// 允许从相机和相册扫码 
			wx.scanCode({
				success(res) {
					console.log(res)
				}
			})
		}
	},
})
