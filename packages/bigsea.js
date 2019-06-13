const log = console.log.bind(console, '>>>')
const config = {
	host: 'https://api.echo1999.com',
}
module.exports = {
	config: config,
	system: wx.getSystemInfoSync(),
	price(n) {
		return this.float(Number(n) / 100)
	},
	float(n) {
		return parseFloat(n.toFixed(10))
	},
	Ajax(request) {
		let req = {
			url: request.url,
			data: request.data || {},
			header: request.header || {},
			method: (request.method || 'GET').toUpperCase(),
		}
		if (!req.url.startsWith('http')) {
			req.url = config.host + req.url
		}
		if (!req.data.openid) {
			req.data.openid = wx.getStorageSync('token')
		}
		req.header['Content-Type'] = 'application/json'
		return new Promise(function(success) {
			wx.request({
				url: req.url,
				data: req.data,
				header: req.header,
				method: req.method,
				success(res) {
					success(res.data)
				},
				fail(err) {
					if (err.errMsg === 'request:fail timeout') {
						Sea.tip('您的网络有点慢，请稍后尝试', null, 2500)
					}
				},
			})
		})
	},
	// 页面
	path(str, obj, redirectTo) {
		let query = ''
		if (typeof obj === 'object') {
			query = this.query(obj)
		}
		// 跳转页面
		if (typeof str === 'string') {
			// 补全 /
			if (str.slice(0, 5) == 'pages') {
				str = '/' + str
			}
			if (redirectTo === true) {
				wx.redirectTo({
					url: str + query,
				})
			} else {
				wx.navigateTo({
					url: str + query,
				})
			}
		}
	},
	// 后退
	back(n = 1) {
		let pages = getCurrentPages()
		// 销毁所有页面
		if (pages.length > 9) {
			wx.reLaunch({
				url: '/pages/index/index',
			})
		} else {
			if (pages.length > n) {
				wx.navigateBack({
					delta: n,
				})
			} else {
				wx.reLaunch({
					url: '/pages/index/index',
				})
			}
		}
	},
	// search
	query(obj) {
		if (typeof obj === 'string') {
			let result = {}
			let i = obj.indexOf('?')
			if (i === -1) {
				return result
			} else {
				obj = obj.slice(i + 1)
			}
			for (let e of obj.split('&')) {
				let a = e.split('=')
				result[a[0]] = a[1]
			}
			return result
		} else {
			let arr = []
			for (let key in obj) {
				let val = obj[key]
				arr.push([key, val].join('='))
			}
			if (arr.length) {
				return '?' + arr.join('&')
			} else {
				return ''
			}
		}
	},
	// 换算 px
	px(number) {
		return (number * this.system.windowWidth) / 750
	},
	// 对象 判断
	has(obj, path) {
		if (obj && path) {
			const arr = path.split('.')
			for (const k of arr) {
				if (typeof obj === 'object' && k in obj) {
					obj = obj[k]
				} else {
					return false
				}
			}
			return Boolean(obj)
		}
	},
	// 加载
	loading(str, icon, time) {
		if (typeof str === 'string') {
			wx.showToast({
				title: str,
				mask: true,
				icon: icon || 'loading',
				duration: time || 6000,
			})
		} else {
			wx.hideToast()
		}
	},
	// 提示
	tip(str, icon, time) {
		icon = icon || ''
		let option = {
			title: str,
			mask: true,
			duration: time || 1500,
		}
		if (icon.split('.')[1]) {
			option.image = icon
		} else {
			option.icon = icon || 'none'
		}
		wx.showToast(option)
	},
	alert(content, callback) {
		wx.showModal({
			title: '提示',
			showCancel: false,
			content: content || '',
			success: callback || function() {},
		})
	},
	formatProvince(province) {
		const arr = ['省', '自治区', '市']
		for (const e of arr) {
			if (province.endsWith(e)) {
				return province.replace(e, '')
			}
		}
		return province
	},
	formatCity(city) {
		const arr = ['市', '自治州', '州', '地区', '盟', '县']
		for (const e of arr) {
			if (city.endsWith(e)) {
				return city.replace(e, '')
			}
		}
		return city
	},
	formatContent(content) {
		let step = 0
		let str = ''
		for (let s of content) {
			if (s === '\n') {
				// 清零
				step = 0
			} else {
				step++
			}
			if (step === 21) {
				s = s + '\n'
				step = 0
			}
			str = str + s
		}
		return str
	},
	getKilometers(A, B) {
		const EARTH_RADIUS = 6378137.0 //单位 m
		let f = (Math.PI * ((A.lat + B.lat) / 2)) / 180.0
		let g = (Math.PI * ((A.lat - B.lat) / 2)) / 180.0
		let l = (Math.PI * ((A.lng - B.lng) / 2)) / 180.0
		let sg = Math.sin(g)
		let sl = Math.sin(l)
		let sf = Math.sin(f)
		let s, c, w, r, d, h1, h2
		let a = EARTH_RADIUS
		let fl = 1 / 298.257
		sg = sg * sg
		sl = sl * sl
		sf = sf * sf
		s = sg * (1 - sl) + (1 - sf) * sl
		c = (1 - sg) * (1 - sl) + sf * sl
		w = Math.atan(Math.sqrt(s / c))
		r = Math.sqrt(s * c) / w
		d = 2 * w * a
		h1 = (3 * r - 1) / 2 / c
		h2 = (3 * r + 1) / 2 / s
		let meter = d * (1 + fl * (h1 * sf * (1 - sg) - h2 * (1 - sf) * sg)) || 0
		meter = Math.round(meter)
		if (meter < 1000) {
			return String(meter) + 'm'
		} else {
			return String(parseFloat((meter / 1000).toFixed(1))) + 'km'
		}
	},
}
