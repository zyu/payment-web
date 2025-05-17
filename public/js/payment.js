/**
 * payment.js - 流浪动物救助项目支付处理脚本
 * 根据设备类型(PC/移动端)提供不同的支付体验，并连接后端支付API
 */

const API_BASE_URL = 'http://localhost:8000'; // 根据实际情况修改

// 设备检测函数
function isMobileDevice() {
  return (
    window.innerWidth <= 768 ||
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  );
}

// 创建加载中UI
function createLoadingUI() {
  const loadingEl = document.createElement("div");
  loadingEl.className = "payment-loading";
  loadingEl.innerHTML = `
    <div class="loading-overlay"></div>
    <div class="loading-content">
      <div class="spinner"></div>
      <p>正在加载支付...</p>
    </div>
  `;
  document.body.appendChild(loadingEl);

  // 添加样式
  if (!document.querySelector("#payment-loading-style")) {
    const style = document.createElement("style");
    style.id = "payment-loading-style";
    style.textContent = `
      .payment-loading {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 9999;
      }
      .loading-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
      }
      .loading-content {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: white;
        padding: 20px;
        border-radius: 5px;
        text-align: center;
      }
      .spinner {
        border: 4px solid rgba(0, 0, 0, 0.1);
        width: 36px;
        height: 36px;
        border-radius: 50%;
        border-left-color: #09f;
        margin: 0 auto 15px;
        animation: spin 1s linear infinite;
      }
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }

  return loadingEl;
}

// 创建二维码弹窗UI (用于PC端展示支付二维码)
function createQRCodeUI(qrContent, paymentType) {
  // 移除之前的支付UI（如果有）
  removePaymentUI();

  // 确定支付方式的颜色和标题
  const color = paymentType === "wechat" ? "#07c160" : "#1678ff";
  const title = paymentType === "wechat" ? "微信支付" : "支付宝支付";

  const qrModal = document.createElement("div");
  qrModal.className = "qr-modal";
  qrModal.innerHTML = `
    <div class="qr-overlay"></div>
    <div class="qr-content">
      <div class="qr-close">&times;</div>
      <h3 style="color: ${color};">${title}</h3>
      <div class="qr-code-container" id="qrcode"></div>
      <p class="qr-tip">请使用${
        paymentType === "wechat" ? "微信" : "支付宝"
      }扫描二维码完成支付</p>
      <p class="qr-amount">支付金额: <span class="amount">${getSelectedAmount()}</span> 元</p>
      <p class="payment-status">等待支付...</p>
    </div>
  `;
  document.body.appendChild(qrModal);

  // 添加关闭事件
  const closeBtn = qrModal.querySelector(".qr-close");
  closeBtn.addEventListener("click", () => {
    document.body.removeChild(qrModal);
    // Optionally, also stop payment status checking if needed
    // For now, let the polling timeout or succeed.
  });

  // 添加样式
  if (!document.querySelector("#qr-modal-style")) {
    const style = document.createElement("style");
    style.id = "qr-modal-style";
    style.textContent = `
      .qr-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 9999;
      }
      .qr-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
      }
      .qr-content {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: white;
        padding: 30px;
        border-radius: 10px;
        text-align: center;
        max-width: 90%;
        width: 320px;
      }
      .qr-close {
        position: absolute;
        top: 10px;
        right: 15px;
        font-size: 24px;
        cursor: pointer;
        color: #999;
      }
      .qr-close:hover {
        color: #333;
      }
      .qr-code-container {
        margin: 20px auto;
        width: 200px;
        height: 200px;
      }
      .qr-tip {
        margin-top: 15px;
        color: #666;
        font-size: 14px;
      }
      .qr-amount {
        margin-top: 10px;
        font-weight: bold;
        color: #ff6b6b;
      }
      .payment-status {
        margin-top: 10px;
        color: #666;
        font-size: 14px;
      }
    `;
    document.head.appendChild(style);
  }

  // 生成二维码
  generateQRCode("qrcode", qrContent);

  return qrModal;
}

// 生成二维码的函数
function generateQRCode(elementId, text) {
  // 尝试直接使用QRCode库
  if (typeof QRCode !== "undefined") {
    new QRCode(document.getElementById(elementId), {
      text: text,
      width: 200,
      height: 200,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H,
    });
  } else {
    // 如果未加载，则显示错误信息
    const qrcodeEl = document.getElementById(elementId);
    qrcodeEl.innerHTML =
      '<div style="color:red; padding:20px;">二维码生成失败，请确认已加载QRCode库</div>';
    console.error("QRCode库未加载，请确保引入了qrcode.min.js");

    // 尝试动态加载QRCode库
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js";
    script.onload = () => {
      // 库加载完成后创建QR码
      qrcodeEl.innerHTML = "";
      new QRCode(qrcodeEl, {
        text: text,
        width: 200,
        height: 200,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H,
      });
    };
    document.head.appendChild(script);
  }
}

// 移除支付UI
function removePaymentUI() {
  const loadingEl = document.querySelector(".payment-loading");
  if (loadingEl) {
    document.body.removeChild(loadingEl);
  }

  const qrModal = document.querySelector(".qr-modal");
  if (qrModal) {
    document.body.removeChild(qrModal);
  }
}

// 获取当前订单号 (仍可用于查询状态，但不由支付处理函数直接获取并使用)
function getOrderIdFromInput() {
  const orderIdInput = document.querySelector('input[name="WIDout_trade_no"]');
  return orderIdInput ? orderIdInput.value : "";
}

// 获取当前选择的金额
function getSelectedAmount() {
  const amountElement = document.querySelector(".donate-amount");
  // Fallback if .donate-amount is not found or empty, try WIDtotal_fee
  if (amountElement && amountElement.textContent && parseFloat(amountElement.textContent) > 0) {
    return amountElement.textContent;
  }
  const amountInput = document.querySelector('input[name="WIDtotal_fee"]');
  return amountInput ? amountInput.value : "50"; // Default to 50 if everything fails
}


// 生成订单 - 此函数将由支付处理函数调用
async function createOrder(paymentType) {
  const amount = getSelectedAmount();
  const loading = createLoadingUI(); // Show loading for order creation

  try {
    // 调用创建订单API
    const response = await fetch(`${API_BASE_URL}/api/orders/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: parseFloat(amount),
        title: "流浪动物救助项目捐款",
        description: `捐款金额${amount}元`,
        user_id: "anonymous", // 可以替换为实际用户ID
        payment_type: paymentType, // 'wechat' 或 'alipay'
      }),
    });

    removePaymentUI(); // Remove loading for order creation before handling response

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: "创建订单失败，请检查网络或联系管理员" }));
      throw new Error(errorData.detail || "创建订单失败");
    }

    const orderData = await response.json();

    // 更新订单ID输入框 (用于后续状态查询或显示)
    const orderIdInput = document.querySelector(
      'input[name="WIDout_trade_no"]'
    );
    if (orderIdInput) {
      orderIdInput.value = orderData.order_id;
    }

    return orderData; // orderData should contain order_id
  } catch (error) {
    console.error("创建订单出错:", error);
    removePaymentUI(); // Ensure loading UI is removed on error
    alert(error.message || "创建订单失败，请稍后重试");
    return null;
  }
}

// 处理微信支付
async function handleWechatPay() {
  const isMobile = isMobileDevice();
  const amount = getSelectedAmount();

  console.log(
    `微信支付 - 设备类型: ${
      isMobile ? "移动端" : "PC端"
    }, 金额: ${amount}元`
  );

  // 1. 创建新订单
  const orderData = await createOrder("wechat");
  if (!orderData || !orderData.order_id) {
    // createOrder function already shows an alert on failure.
    // Loading UI is handled by createOrder.
    return; 
  }
  const orderId = orderData.order_id; // Use the newly created order_id
  console.log(`新创建的微信支付订单ID: ${orderId}`);


  // 2. 显示支付处理的加载中
  const paymentLoading = createLoadingUI();

  try {
    // 构建请求参数
    const requestBody = {
      openid: "", // 如果有openid，可以在这里提供（例如通过微信授权获取）
      trade_type: isMobile ? "MWEB" : "NATIVE", // 移动端用MWEB，PC端用NATIVE
    };
    // 调用微信支付API
    const response = await fetch(`${API_BASE_URL}/api/payment/wechat/pay/${orderId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });
    
    removePaymentUI(); // Remove payment processing loading UI

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: "获取微信支付参数失败" }));
      throw new Error(errorData.detail || "获取微信支付参数失败");
    }

    const paymentData = await response.json();


    if (isMobile) {
      // 移动端 - 直接拉起微信支付
      const ua = navigator.userAgent.toLowerCase();

      if (ua.indexOf("micromessenger") !== -1) {
        // 微信内浏览器 - 调用JSAPI支付
        if (typeof WeixinJSBridge !== "undefined") {
          WeixinJSBridge.invoke(
            "getBrandWCPayRequest",
            paymentData.payment_params, // payment_params should come from your backend
            function (res) {
              if (res.err_msg === "get_brand_wcpay_request:ok") {
                alert("支付成功");
                // Update status on QR modal if it exists (though unlikely for mobile JSAPI)
                const statusEl = document.querySelector(".payment-status");
                if (statusEl) statusEl.textContent = "支付成功！";
                window.location.reload();
              } else {
                alert("支付取消或失败: " + res.err_msg);
              }
            }
          );
        } else {
          alert("请在微信环境中打开或JSBridge未加载");
        }
      } else {
        // 其他移动浏览器 - 尝试拉起微信App
        if (paymentData.payment_params && paymentData.payment_params.mweb_url) {
          // 使用H5支付链接
          window.location.href = paymentData.payment_params.mweb_url;
        } else {
          // 回退方案 - 显示二维码 (if code_url is provided for MWEB as fallback)
          if (paymentData.code_url) {
            createQRCodeUI(paymentData.code_url, "wechat");
            startCheckingPaymentStatus(orderId, "wechat");
          } else {
            alert("无法获取支付参数，请稍后重试");
          }
        }
      }
    } else {
      // PC端 - 展示支付二维码
      if (paymentData.code_url) {
        createQRCodeUI(paymentData.code_url, "wechat");
        // 开始轮询支付状态
        startCheckingPaymentStatus(orderId, "wechat");
      } else {
        alert("无法获取支付二维码，请稍后重试");
      }
    }
  } catch (error) {
    console.error("微信支付处理出错:", error);
    removePaymentUI(); // Ensure loading UI is removed on error
    alert(error.message || "微信支付请求出错，请稍后再试");
  }
}

// 处理支付宝支付
async function handleAlipay() {
  const isMobile = isMobileDevice();
  const amount = getSelectedAmount();

  console.log(
    `支付宝支付 - 设备类型: ${
      isMobile ? "移动端" : "PC端"
    }, 金额: ${amount}元`
  );

  // 1. 创建新订单
  const orderData = await createOrder("alipay");
  if (!orderData || !orderData.order_id) {
    // createOrder function already shows an alert on failure.
    return;
  }
  const orderId = orderData.order_id; // Use the newly created order_id
  console.log(`新创建的支付宝订单ID: ${orderId}`);

  // 2. 显示支付处理的加载中
  const paymentLoading = createLoadingUI();

  try {
    // 构建请求参数
    const requestBody = {
      return_url: window.location.href, // 支付成功后返回当前页面
      // For mobile, you might want to pass a specific product_code if your backend needs it
      // product_code: isMobile ? "QUICK_WAP_WAY" : "FAST_INSTANT_TRADE_PAY" (example, depends on backend)
    };

    // 调用支付宝API
    // For PC, backend usually returns QR content.
    // For Mobile, backend usually returns a form or a redirect URL.
    // The endpoint might differ or backend handles it based on User-Agent or a flag.
    // Assuming backend provides `payment_url` for mobile redirect or `form_html` for mobile form submission,
    // and `qr_code` content for PC.
    const alipayApiUrl = isMobile 
        ? `${API_BASE_URL}/api/payment/alipay/pay/${orderId}/wap` // Example: specific endpoint for WAP
        : `${API_BASE_URL}/api/payment/alipay/pay/${orderId}`;    // Standard endpoint for PC (QR)


    const response = await fetch(alipayApiUrl, { // Using potentially different URL based on device
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    removePaymentUI(); // Remove payment processing loading UI

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: "获取支付宝支付参数失败" }));
      throw new Error(errorData.detail || "获取支付宝支付参数失败");
    }

    const paymentData = await response.json();


    if (isMobile) {
        // 移动端 (WAP/H5支付)
        // Backend should ideally return a direct redirect URL or HTML form to submit
        if (paymentData.payment_url) { // Scenario 1: Direct redirect URL
            window.location.href = paymentData.payment_url;
        } else if (paymentData.payment_params && paymentData.payment_params.form_html) { // Scenario 2: HTML form
            const tempDiv = document.createElement("div");
            tempDiv.style.display = "none"; // Hide it
            tempDiv.innerHTML = paymentData.payment_params.form_html;
            document.body.appendChild(tempDiv);
            const form = tempDiv.querySelector("form");
            if (form) {
                form.submit();
            } else {
                alert("支付宝支付表单错误，请稍后重试。");
            }
        } else {
             // Fallback or if backend provides QR for mobile too
            if (paymentData.payment_params && paymentData.payment_params.qr_code) {
                 createQRCodeUI(paymentData.payment_params.qr_code, "alipay");
                 startCheckingPaymentStatus(orderId, "alipay");
            } else {
                alert("无法获取支付宝支付参数，请稍后重试。");
            }
        }
    } else {
      // PC端 - 展示支付二维码
      if (paymentData.payment_params && paymentData.payment_params.qr_code) {
        // 直接使用返回的二维码内容
        createQRCodeUI(paymentData.payment_params.qr_code, "alipay");
      } else {
        // Fallback if qr_code is not directly under payment_params.qr_code
        // This part might need adjustment based on your exact backend response for PC Alipay
        const qrContent = paymentData.qr_code || JSON.stringify(paymentData.payment_params);
        createQRCodeUI(qrContent, "alipay");
      }
      // 开始轮询支付状态
      startCheckingPaymentStatus(orderId, "alipay");
    }
  } catch (error) {
    console.error("支付宝支付处理出错:", error);
    removePaymentUI(); // Ensure loading UI is removed on error
    alert(error.message || "支付宝支付请求出错，请稍后再试");
  }
}


// 开始轮询检查支付状态
// It's important that orderId passed here is the one from the newly created order
function startCheckingPaymentStatus(
  orderId,
  paymentType,
  interval = 3000,
  maxAttempts = 40 // Increased attempts for longer waiting time (2 minutes)
) {
  console.log(`开始检查${paymentType}支付状态，订单ID: ${orderId}`);

  let attempts = 0;
  let statusCheckerIntervalId = null; // To store the interval ID

  // Function to stop polling
  const stopPolling = () => {
    if (statusCheckerIntervalId) {
      clearInterval(statusCheckerIntervalId);
      statusCheckerIntervalId = null;
      console.log(`停止检查${paymentType}支付状态，订单ID: ${orderId}`);
    }
  };
  
  // Add event listener to QR modal close button to stop polling
  const qrModalCloseBtn = document.querySelector(".qr-modal .qr-close");
  if (qrModalCloseBtn) {
    // Remove previous listener if any to avoid multiple executions
    const newCloseBtn = qrModalCloseBtn.cloneNode(true);
    qrModalCloseBtn.parentNode.replaceChild(newCloseBtn, qrModalCloseBtn);
    newCloseBtn.addEventListener('click', () => {
        stopPolling();
        removePaymentUI(); // Also remove the UI
    });
  }


  statusCheckerIntervalId = setInterval(async () => {
    // If QR modal is gone, stop polling (e.g., user closed it manually)
    if (!document.querySelector(".qr-modal")) {
        stopPolling();
        return;
    }
    attempts++;

    try {
      // 根据支付类型选择查询接口
      const endpoint =
        paymentType === "wechat"
          ? `${API_BASE_URL}/api/payment/wechat/query/${orderId}`
          : `${API_BASE_URL}/api/payment/alipay/query/${orderId}`;

      const response = await fetch(endpoint);

      // Don't throw error on 404 or other non-200 for query, backend might return specific status
      const statusData = await response.json();

      // 更新状态显示
      const statusEl = document.querySelector(".payment-status");
      if (statusEl) {
        statusEl.textContent = `等待支付...（${attempts}/${maxAttempts}）`;
      }

      // 检查支付状态
      let paid = false;
      if (paymentType === "wechat") {
        if (statusData.status === "paid" || statusData.trade_state === "SUCCESS") { // Wechat might use trade_state
          paid = true;
        }
      } else {
        // 支付宝状态检查
        if (
          statusData.order_status === "paid" ||
          (statusData.alipay_query_result &&
            statusData.alipay_query_result.trade_status === "TRADE_SUCCESS")
        ) {
          paid = true;
        }
      }

      if (paid) {
        stopPolling();
        if (statusEl) {
          statusEl.textContent = "支付成功！正在跳转...";
          statusEl.style.color = paymentType === "wechat" ? "#07c160" : "#1678ff";
        }
        setTimeout(() => {
          alert("支付成功！");
          window.location.reload(); // Or redirect to a success page
        }, 1500);
        return;
      }

      // 达到最大检查次数后停止
      if (attempts >= maxAttempts) {
        stopPolling();
        if (statusEl) {
          statusEl.textContent = "支付超时，请刷新页面或关闭弹窗后重试";
          statusEl.style.color = "#f44336";
        }
      }
    } catch (error) {
      console.error("查询支付状态出错:", error);
      // Don't stop polling on fetch error, could be a temporary network issue.
      // But if it happens too many times, it will eventually timeout.
      if (attempts >= maxAttempts) {
        stopPolling();
         const statusEl = document.querySelector(".payment-status");
        if (statusEl) {
          statusEl.textContent = "查询状态失败，请关闭弹窗重试";
          statusEl.style.color = "#f44336";
        }
      }
    }
  }, interval);

  return statusCheckerIntervalId;
}

// 初始化支付按钮
function initPaymentButtons() {
  console.log("初始化支付按钮");

  // Helper to safely add event listeners by replacing the button
  function reattachEventListener(selector, eventType, handler) {
    const button = document.querySelector(selector);
    if (button) {
      const newButton = button.cloneNode(true);
      button.parentNode.replaceChild(newButton, button);
      newButton.addEventListener(eventType, handler);
      return newButton;
    }
    return null;
  }

  reattachEventListener(".default-donate-btn", "click", function () {
    const amount = getSelectedAmount();
    console.log(`默认支付按钮点击，金额: ${amount}元`);
    if (isMobileDevice()) {
      handleWechatPay();
    } else {
      handleAlipay();
    }
  });

  reattachEventListener(".wechat-donate-btn", "click", handleWechatPay);
  reattachEventListener(".alipay-donate-btn", "click", handleAlipay);

  // 初始化金额选择功能
  initPriceSelectors();
}

// 初始化金额选择器
function initPriceSelectors() {
  const priceItems = document.querySelectorAll(".my-price-item");

  priceItems.forEach((item) => {
    // 克隆并替换按钮以移除所有事件监听器
    const newItem = item.cloneNode(true);
    item.parentNode.replaceChild(newItem, item);

    // 添加新的点击事件
    newItem.addEventListener("click", function () {
      document.querySelectorAll(".my-price-item").forEach((i) => {
        i.classList.remove("checked");
      });
      this.classList.add("checked");

      let selectedAmountText = this.dataset.amount || this.textContent.trim(); // Prefer data-amount
      let selectedAmount;

      if (selectedAmountText.toLowerCase() === "随缘" || selectedAmountText.toLowerCase() === "随缘爱心") {
        selectedAmount = Math.floor(Math.random() * (10000 - 10 + 1) + 10); // Random between 10 and 10000
      } else {
        selectedAmount = parseFloat(selectedAmountText.replace(/元/g, "").trim());
      }
      
      if (isNaN(selectedAmount) || selectedAmount <=0) {
          console.warn("Invalid amount selected, defaulting to 50");
          selectedAmount = 50;
      }


      const amountInput = document.querySelector('input[name="WIDtotal_fee"]');
      if (amountInput) {
        amountInput.value = selectedAmount;
      }

      const amountElements = document.querySelectorAll(".donate-amount");
      amountElements.forEach((el) => {
        el.textContent = selectedAmount;
      });

      console.log(`选择金额: ${selectedAmount}元`);
    });
  });

  // Ensure a default amount is selected and displayed on load if nothing is checked
  const checkedItem = document.querySelector(".my-price-item.checked");
  if (!checkedItem && priceItems.length > 0) {
      // Click the first item to trigger amount update
      priceItems[0].click();
  } else if (checkedItem) {
      // If an item is already checked (e.g. by HTML), trigger its click to update amount displays
      checkedItem.click();
  } else {
      // Fallback: if no price items, ensure default amount is set
      const defaultAmount = 50;
      const amountInput = document.querySelector('input[name="WIDtotal_fee"]');
      if (amountInput) amountInput.value = defaultAmount;
      document.querySelectorAll(".donate-amount").forEach(el => el.textContent = defaultAmount);
  }
}

// 页面加载完成后初始化
document.addEventListener("DOMContentLoaded", function () {
  console.log("页面加载完成，初始化支付功能");
  console.log(`当前设备类型: ${isMobileDevice() ? "移动端" : "PC端"}`);
  // DOM is ready, safe to initialize buttons and price selectors
  initPaymentButtons();
});

// Fallback for window.onload if other scripts might overwrite DOMContentLoaded
const originalOnload = window.onload;
window.onload = function () {
  if (typeof originalOnload === "function") {
    originalOnload();
  }
  // Re-initialize, this can act as a fallback or for dynamically loaded content
  // Be cautious if initPaymentButtons can be called multiple times without proper cleanup
  console.log("window.onload: 再次尝试初始化支付功能");
  initPaymentButtons(); // initPaymentButtons now handles listener cleanup
};