const VIEW_ID = '1.23452384164.123412415';
let watermarkView;
export default {
	data() {
		return {
			showCanvas: true,
			canvasText: '',
			canvasText2: '',
			canvasSize: uni.upx2px(350),
			canvasFontSize: uni.upx2px(24),
			canvasTextColor: 'rgba(200, 200, 200, 0.50)',
			canvasRotate: -30 * Math.PI / 180,
			canvasTextAlign: 'left',
			canvasTextBaseline: 'middle',
			canvasTextFillX: uni.upx2px(-50),
			canvasTextFillY: uni.upx2px(170),
			canvasTextFillY2: uni.upx2px(200)
		}
	},
	
	watch: {
		canvasText(newVal) {
			this.updateWatermark()
		}
	},
	
	methods: {
		show() {
			// #ifdef APP-PLUS
			plus.nativeObj.View.getViewById(VIEW_ID) !== null && plus.nativeObj.View.getViewById(VIEW_ID).show();
			// #endif

			// #ifdef H5
			if (document.getElementById(VIEW_ID)) {
				document.getElementById(VIEW_ID).style.visibility = "visible";
			}
			// #endif
		},
		
		hide() {
			// #ifdef APP-PLUS
			plus.nativeObj.View.getViewById(VIEW_ID) !== null && plus.nativeObj.View.getViewById(VIEW_ID).hide();
			// #endif

			// #ifdef H5
			if (document.getElementById(VIEW_ID)) {
				document.getElementById(VIEW_ID).style.visibility = "hidden";
			}
			// #endif
		},
		
		updateWatermark() {
			if (!this.canvasText) throw new Error('canvasText is Requied!');
			
			// #ifdef APP-PLUS  
			watermarkView && watermarkView.reset();
			this.drawAppWaterMark(VIEW_ID);
			// #endif  
			
			// #ifdef H5  
			this.drawH5WaterMark(VIEW_ID);
			// #endif  
		},
		
		initWatermark() {
			if (!this.canvasText) throw new Error('canvasText is Requied!');
			
			// #ifdef APP-PLUS  
			this.drawAppWaterMark(VIEW_ID);
			// #endif  
			
			// #ifdef H5  
			this.drawH5WaterMark(VIEW_ID);
			// #endif  
			
			uni.$off('ly-show-watermar');
			uni.$off('ly-hide-watermark');
			
			// 全局监听事件，触发水印显示
			uni.$on('ly-show-watermark', () => {
				this.show();
			});
			
			// 全局监听事件，触发水印隐藏
			uni.$on('ly-hide-watermark', () => {
				this.hide();
			});
		},
		
		// #ifdef APP-PLUS
		drawAppWaterMark(id) {
			plus.nativeObj.View.getViewById(id) && plus.nativeObj.View.getViewById(id).close();

			let cans = uni.createCanvasContext('watermarkCanvas');
			
			cans.rotate(this.canvasRotate);
			cans.setFontSize(this.canvasFontSize);
			cans.setFillStyle(this.canvasTextColor);
			cans.setTextAlign(this.canvasTextAlign);
			cans.setTextBaseline(this.canvasTextBaseline);
			cans.fillText(this.canvasText, this.canvasTextFillX, this.canvasTextFillY);
			cans.fillText(this.canvasText2, this.canvasTextFillX, this.canvasTextFillY2,350);
			cans.draw(false);
			this.canvasDrawCallFn(id);
		},
		
		// 利用canvas生成水印图片
		canvasDrawCallFn(id) {
			// 适当的延时确保绘制完毕
			setTimeout(() => {
				uni.canvasToTempFilePath({
					canvasId: "watermarkCanvas",
					success: res => {
						let viewList = this.getWaterMarkWebview(res);
						watermarkView = new plus.nativeObj.View(id, {
							top: '0',
							left: '0',
							right: '0',
							bottom: '0'
						}, viewList);
				
						// 拦截View控件的触屏事件,将事件穿透给下一层view  
						watermarkView.interceptTouchEvent(false);
						watermarkView.show();
						// this.showCanvas = false;
					}
				});
			}, 100);
		},
		
		// 创建webview页面水印样式
		getWaterMarkWebview(res) {
			let sysInfo = uni.getSystemInfoSync(),
				row = Math.ceil(sysInfo.windowHeight / this.canvasSize), // 水印排列行数
				imgList = [];

			for (let i = 0; i < row; i++) {
				for (let j = 0; j < 3; j++) {
					imgList.push({
						tag: 'img',
						src: res.tempFilePath,
						position: {
							top: (this.canvasSize * i) + 'px',
							left: (this.canvasSize * j) + 'px',
							width: this.canvasSize + 'px',
							height: this.canvasSize + 'px'
						}
					});
				}
			}

			return imgList;
		},
		// #endif
		
		// #ifdef H5
		drawH5WaterMark(id) {
			document.getElementById(id) && document.body.removeChild(document.getElementById(id));

			let can = document.createElement('canvas');
			let cans = can.getContext('2d');
			let div = document.createElement('div');

			can.width = this.canvasSize;
			can.height = this.canvasSize;

			cans.rotate(this.canvasRotate);
			cans.font = this.canvasFontSize + 'px sans-serif';
			cans.fillStyle = this.canvasTextColor;
			cans.textAlign = this.canvasTextAlign;
			cans.textBaseline = this.canvasTextBaseline;
			cans.fillText(this.canvasText, this.canvasTextFillX, this.canvasTextFillY);
			cans.fillText(this.canvasText2, this.canvasTextFillX, this.canvasTextFillY2,500);

			div.id = id;
			div.style.pointerEvents = 'none';
			div.style.top = '0';
			div.style.left = '0';
			div.style.bottom = '0';
			div.style.right = '0';
			div.style.position = 'fixed';
			div.style.zIndex = '10000';
			div.style.background = 'url(' + can.toDataURL('image/png') + ') left top repeat';
			document.body.appendChild(div);
		}
		// #endif
	}
}
