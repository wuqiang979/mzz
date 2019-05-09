var _utils = {
    /**
     *
     * 下拉加载
     * @param {boolean} isAuto 是否才进入页面就触发请求
     * 外面html结构  <div id="mescroll" class="mescroll">
     *                  <div></div>   // 列表放这里面
     *              </div>
     */
    mescroll: function (type, url, data, callback, isAuto) {
        var _this = this;
        var mescroll = new MeScroll("mescroll", {
            down: {
                use: false
            },
            up: {
                callback: _downCallback,
                auto: isAuto
            },
        });

        function _downCallback() {
            _this.ajaxFun(type, url, data).then(function (res) {
                if (res.data) {
                    mescroll.endErr();
                } else {
                    // 没有数据了，不在触发
                    mescroll.endBySize(10, false);
                }
                callback(res);
            }).catch(function (err) {
                mescroll.endErr();
            });
        }
        console.log(mescroll)
        return mescroll
    },
    //  黑色提示框
    toast: function (msg) {
        var id = parseInt(Math.random() * 1000)
        var toast = '<div class="toast-msg" id=' + id + '><span>' + msg + '</span></div>'
        $('body').append(toast)
        setTimeout(function () {
            $('#' + id).remove()
        }, 3000)
    },
    // 获取URL某一个字段
    getQueryString: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    },
    // 在页面中加入导航栏
    addTab: (num) => {
        let _arrList = [{
                name: '首页',
                imgblur: './images/tab/tab_icon_sy.png',
                imgfoucs: './images/tab/tab_icon_sy_.png',
                path: './login.html'
            },
            {
                name: '商家',
                imgblur: './images/tab/tab_icon_lmsj.png',
                imgfoucs: './images/tab/tab_icon_lmsj_.png',
                path: './login.html'
            },
            {
                name: '分享',
                imgblur: './images/tab/tab_icon_fx.png',
                imgfoucs: './images/tab/tab_icon_fx_.png',
                path: './login.html'
            },
            {
                name: '个人中心',
                imgblur: './images/tab/tab_icon_grzx.png',
                imgfoucs: './images/tab/tab_icon_grzx_.png',
                path: './login.html'
            }
        ]
        let appendData = `<footer class="bottom-tab">`
        _arrList.forEach((e, index) => {
            if (num === index) {
                appendData += `<a class="bottom-tab__item">
                    <img src="${e.imgfoucs}" alt="">
                    <p class="mycolor">${e.name}</p>
                </a>`
            } else {
                appendData += `<a class="bottom-tab__item" href="${e.path}">
                    <img src="${e.imgblur}" alt="">
                    <p>${e.name}</p>
                </a>`
            }
        })
        appendData += `</footer">`
        console.log(appendData)
        $('body').append(appendData)
    },
    // 封装axjx请求
    ajaxFun: (type, url, data) => {
        let _url = url
        let _data = {}

        if (type === 'GET') {
            _url += '?'
            Object.keys(data).forEach((e) => {
                _url += e + '=' + data[e] + '&'
            })
        } else {
            _data = data
        }

        return new Promise((resolve, reject) => {
            $.ajax({
                type: type,
                dataType: 'json',
                url: _url,
                data: JSON.stringify(_data),
                timeout: 10000,
                contentType: "application/json;charset=UTF-8",
                success: (data) => {
                    console.log('这是请求成功的')
                    if (data.code === 1) {
                        resolve(data)
                    } else {
                        _utils.toast(data.msg)
                        reject(data.msg)
                    }
                },
                error: (err) => {
                    reject(err)
                }
            });
        })
    },
    // 本地存储获取
    storageData: {
        get: function () {
            console.log(localStorage.getItem('storageData'))
            if (localStorage.getItem('storageData')) {
                return JSON.parse(localStorage.getItem('storageData'))
            } else {
                return {
                    home: [], // 首页
                    food: [], // 美食
                    mall: [] // 商城
                }
            }
        },
        set: function (data) { // 1 是首页，二是 美食 三生 商城
            let _arrKeyWords = JSON.parse(localStorage.getItem('storageData'))
            console.log(data)
            if (typeof data === 'object') {
                if (data.home.length > 1) {
                    if(_arrKeyWords.home.indexOf(data.home[data.home.length - 1]) == -1){
                        _arrKeyWords.home.unshift(data.home[data.home.length - 1])
                        localStorage.setItem('storageData', JSON.stringify(_arrKeyWords))
                    }
                } else {
                    localStorage.setItem('storageData', JSON.stringify(data))
                }
            } else if (typeof data === 'string') {
                if(_arrKeyWords.home.indexOf(data) == -1){
                    _arrKeyWords.homne.unshift(data);
                    localStorage.setItem('storageData', JSON.stringify(_arrKeyWords))
                }
            }
        },
    },

    // 判断滑动方向，依赖jQuery
    startx: 0,
    starty: 0,
    touchStart(e) {
        this.startx = e.originalEvent.changedTouches[0].pageX;
        this.starty = e.originalEvent.changedTouches[0].pageY;
    },
    touchEnd(e, fn) {
        var moveEndX = e.originalEvent.changedTouches[0].pageX
        var moveEndY = e.originalEvent.changedTouches[0].pageY
        X = moveEndX - this.startx;
        Y = moveEndY - this.starty;
        fn({
            x: X,
            y: Y,
        });
    },
    // 头部搜索输入框+清空输入框功能
    inputSearch: {
        showClose: function (_this, selector) {
            if (_this.val()) {
                $(selector).show();
            } else {
                $(selector).hide();
            }
        },
        closeWords: function (_this, selector) {
            $(selector).val('');
            _this.hide();
        }
    },
    // 定位
    getLocal: () => {
        return new Promise((resolve, reject) => {
            // if (/MicroMessenger/.test(window.navigator.userAgent)) {
                wx.getLocation({
                    type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                    success: function (res) {
                        // var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                        // var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                        // var speed = res.speed; // 速度，以米/每秒计
                        // var accuracy = res.accuracy; // 位置精度
                        resolve(res)
                    }
                });
            // } else {
            //     _utils.toast('请微信浏览器无法定位')
            // }
        })
    },
    // 记录搜索历史
    recordKeyWord(keyWord, keyType = 'storeKeyWords') {
        var string_keyWords = window.localStorage.getItem(keyType);
        var arr_keyWords = [];
        if (string_keyWords) {
            arr_keyWords = string_keyWords.split(',');
            if (arr_keyWords.indexOf(keyWord) == -1) {
                arr_keyWords.unshift(keyWord);
                arr_keyWords = arr_keyWords.slice(0, 20);
                window.localStorage.setItem(keyType, arr_keyWords.join(','));
            }
        } else {
            window.localStorage.setItem(keyType, keyWord);
        };
    },
    // confirm确认框
    comConfirm: {
        _this: this,
        open: function (msg, callback) {
            var confirmHtml = `<div class="confirm-model">
                                <div class="confirm-content-box">
                                <p class="msg">${msg}</p>
                                <div class="btn-box">
                                    <span class="btn-sure">确认</span><span class="btn-cancel">取消</span>
                                </div>
                                </div>
                            </div>`
            $('body').append(confirmHtml);
            $('body').on('click', '.btn-sure', function () {
                callback();
            }),
            $('body').on('click', '.btn-cancel', function () {
                _utils.comConfirm.close();
            })
        },
        close: function () {
            $('body').find('.confirm-model').remove();
        }
    }
}