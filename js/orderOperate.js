// 将文件引入在utlis.js的下面

/**
 *
 * 订单操作
 * @param { String } _type 类型
 * @param { String } orderNo 订单号
 */
var _orderOperate = function (_type, orderNo) {

    var commonResolve = function () {
        // 操作成功的统一处理，先刷新页面，后面觉得不妥，再传回调函数外部单独处理
        window.location.reload();
    }
    var operation = {
        // 收货，参数传takeGoods
        takeGoods: function () {
            var r = window.confirm('是否确认收货');
            if (r) {
                // 收货的地址
                _utils.ajaxFun('post', '', {
                    orderNo: orderNo
                }).then(() => {
                    commonResolve();
                })
            }
        },

        // 取消订单,参数如变量名
        cancel: function () {
            var r = window.confirm('是否取消订单');
            if (r) {
                // 取消的地址
                _utils.ajaxFun('post', '', {
                    orderNo: orderNo
                }).then(() => {
                    commonResolve();
                })
            }
        },

        // 退款
        refund: function () {
            var modalHtml = '<div class="area-modal short-modal" id="_refundModal">' +
                '<div class="area-content short-modal-content">' +
                    '<div class="area-titel">' +
                        '<span>退款</span>' +
                        '<i class="area-modal-close iconfont icon-closes"></i>' +
                    '</div>' +
                    '<div class="stock-input-wrap">' +
                        '<div>退款理由</div>' +
                        '<textarea class="stock-input" id="refund"></textarea>' +
                    '</div>' +
                    '<div class="sub-button" id="refundSubmit">确定</div>' +
                '</div>' +
            '</div>';
            $('body').append(modalHtml);
            $('.area-modal-close').click(function() {
                $('#_refundModal').remove();
            });
            $('#refundSubmit').click(function() {
                var reason = $('#refund').val();
                _utils.ajaxFun('post', '', {
                    reason: reason,
                    orderNo: orderNo
                }).then(() => {
                    commonResolve();
                })
            });
        },

        // 确认消费
        confirmCons: function () {
            var r = window.confirm('是否确认消费');
            if (r) {
                // 收货的地址
                _utils.ajaxFun('post', '', {
                    orderNo: orderNo
                }).then(() => {
                    commonResolve();
                })
            }
        },

        // 拒绝退款
        confirmCons: function () {
            var r = window.confirm('是否驳回退款申请');
            if (r) {
                // 收货的地址
                _utils.ajaxFun('post', '', {
                    orderNo: orderNo
                }).then(() => {
                    commonResolve();
                })
            }
        },

        //  同意退款
        agree: function () {
            var r = window.confirm('是否同意退款申请');
            if (r) {
                // 收货的地址
                _utils.ajaxFun('post', '', {
                    orderNo: orderNo
                }).then(() => {
                    commonResolve();
                })
            }
        },

        // 发货
        sendGoods: function () {
            var modalHtml = '<div class="area-modal short-modal" id="sendModal" style="display: none;">' +
            '<div class="area-content short-modal-content send-modal">' +
                '<div class="area-titel">' +
                    '<span>发货</span>' +
                    '<i class="area-modal-close iconfont icon-closes"></i>' +
                '</div>' +
                '<input class="send-input" placeholder="请输入物流" id="sendMethod">' +
                '<input class="send-input" placeholder="请输入物流单号" id="sendNum">' +
                '<div class="sub-button send-sub-btn" id="sendSubmit">确定</div>' +
            '</div>' +
        '</div>';
            $('body').append(modalHtml);
            $('.area-modal-close').click(function() {
                $('#sendModal').remove();
            });
            $('#sendSubmit').click(function() {
                var sendMethod = $('#sendMethod').val();
                var sendNum = $('#sendNum').val();
                if (!sendMethod || !sendNum) {
                    _utils.toast('请将信息填写完整');
                    return
                }
                _utils.ajaxFun('post', '', {
                    sendMethod: sendMethod,
                    sendNum: sendNum,
                    orderNo: orderNo
                }).then(() => {
                    commonResolve();
                })
            });
        }
    }

    if (operation[_type]) {
        operation[_type]();
    } else {
        window.alert('方法名调用错误');
    }

}

