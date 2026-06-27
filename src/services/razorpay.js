// Razorpay SDK Simulation
// Provides a simulated Razorpay payment experience for testing without live keys.

export const loadRazorpay = () => {
  return new Promise((resolve) => {
    // Simulates successful script loading
    setTimeout(() => {
      resolve(true);
    }, 300);
  });
};

export class RazorpaySimulation {
  constructor(options) {
    this.options = options;
  }

  open() {
    // We create and mount a premium glassmorphic modal directly in the body
    const modalContainer = document.createElement("div");
    modalContainer.id = "razorpay-simulation-modal";
    modalContainer.className = "fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in";
    
    const amountInRupees = (this.options.amount / 100).toFixed(2);
    
    modalContainer.innerHTML = `
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100 transform scale-95 transition-transform duration-300">
        <!-- Header -->
        <div class="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="h-8 w-8 rounded-lg bg-red-600 flex items-center justify-center font-bold text-lg text-white">AK</div>
            <div>
              <h3 class="font-bold text-sm leading-tight">${this.options.name || 'ANUMEET KATPIECE'}</h3>
              <p class="text-xs text-slate-400">Secure Payment Gateway</p>
            </div>
          </div>
          <div class="text-right">
            <p class="text-xs text-slate-400">Amount to Pay</p>
            <h4 class="font-bold text-base text-gold-gradient">₹${amountInRupees}</h4>
          </div>
        </div>

        <!-- Body -->
        <div id="rzp-body" class="p-6">
          <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Select Payment Method</p>
          
          <div class="space-y-3">
            <!-- UPI Option -->
            <button id="rzp-opt-upi" class="w-full flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-red-600 hover:bg-red-50/20 text-left transition-all group">
              <div class="flex items-center gap-3">
                <span class="text-lg">⚡</span>
                <div>
                  <h4 class="font-semibold text-sm text-slate-800">UPI / QR Code</h4>
                  <p class="text-xs text-slate-500">Google Pay, PhonePe, Paytm</p>
                </div>
              </div>
              <span class="text-slate-400 group-hover:text-red-600">→</span>
            </button>

            <!-- Card Option -->
            <button id="rzp-opt-card" class="w-full flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-red-600 hover:bg-red-50/20 text-left transition-all group">
              <div class="flex items-center gap-3">
                <span class="text-lg">💳</span>
                <div>
                  <h4 class="font-semibold text-sm text-slate-800">Credit / Debit Card</h4>
                  <p class="text-xs text-slate-500">Visa, Mastercard, RuPay, Maestro</p>
                </div>
              </div>
              <span class="text-slate-400 group-hover:text-red-600">→</span>
            </button>
          </div>

          <div class="mt-6 flex justify-between items-center text-xs text-slate-400">
            <span class="flex items-center gap-1">🔒 256-bit SSL encryption</span>
            <button id="rzp-cancel" class="text-red-600 hover:underline font-semibold">Cancel Payment</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modalContainer);

    // Dynamic state modifiers
    const cleanup = () => {
      const modal = document.getElementById("razorpay-simulation-modal");
      if (modal) modal.remove();
    };

    document.getElementById("rzp-cancel").onclick = () => {
      cleanup();
      if (this.options.modal && this.options.modal.ondismiss) {
        this.options.modal.ondismiss();
      }
    };

    // Option: UPI Selected
    document.getElementById("rzp-opt-upi").onclick = () => {
      const body = document.getElementById("rzp-body");
      body.innerHTML = `
        <div class="text-center py-4 space-y-4">
          <div class="flex justify-center">
            <!-- Simulated QR -->
            <div class="p-3 bg-white border border-slate-200 rounded-xl">
              <div class="w-40 h-40 bg-slate-100 flex flex-col items-center justify-center border-2 border-dashed border-slate-300 relative">
                <span class="text-3xl">📱</span>
                <span class="text-[10px] text-slate-500 mt-2 font-mono">ANUMEET@upi</span>
                <div class="absolute inset-0 bg-slate-900/10 flex items-center justify-center backdrop-blur-[1px]">
                  <span class="bg-slate-900 text-white text-[9px] px-2 py-0.5 rounded font-bold">SCAN FOR DEMO</span>
                </div>
              </div>
            </div>
          </div>
          <div>
            <p class="text-xs text-slate-500">Scan QR Code using any UPI App to pay</p>
            <h5 class="font-bold text-sm text-slate-800 mt-1">OR</h5>
          </div>
          <div class="max-w-xs mx-auto">
            <input id="rzp-upi-id" type="text" placeholder="enter-your-name@upi" class="w-full text-center px-4 py-2 border border-slate-200 rounded-lg text-sm mb-3" />
            <button id="rzp-upi-pay" class="w-full bg-slate-900 hover:bg-red-600 text-white py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all">Verify & Pay</button>
          </div>
          <button id="rzp-back-upi" class="text-xs text-slate-400 hover:text-slate-600 underline">← Back to Options</button>
        </div>
      `;

      document.getElementById("rzp-back-upi").onclick = () => this.open();
      document.getElementById("rzp-upi-pay").onclick = () => {
        const upiId = document.getElementById("rzp-upi-id").value;
        if (!upiId) return alert("Please enter a UPI ID");
        showProcessing();
      };
    };

    // Option: Card Selected
    document.getElementById("rzp-opt-card").onclick = () => {
      const body = document.getElementById("rzp-body");
      body.innerHTML = `
        <form id="rzp-card-form" class="space-y-4 text-left">
          <!-- Card details with autocomplete formatting -->
          <div>
            <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Card Number</label>
            <input id="rzp-card-num" type="text" autocomplete="cc-number" placeholder="4111 2222 3333 4444" required class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Expiry Date</label>
              <input id="rzp-card-exp" type="text" autocomplete="cc-exp" placeholder="MM/YY" required class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
            </div>
            <div>
              <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">CVV</label>
              <input id="rzp-card-cvv" type="password" autocomplete="cc-csc" placeholder="•••" required class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
            </div>
          </div>
          <div>
            <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Cardholder Name</label>
            <input id="rzp-card-name" type="text" autocomplete="cc-name" placeholder="Sunita Sharma" required class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
          </div>

          <button type="submit" class="w-full bg-slate-900 hover:bg-red-600 text-white py-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all mt-4">Pay ₹${amountInRupees}</button>
          
          <div class="text-center">
            <button type="button" id="rzp-back-card" class="text-xs text-slate-400 hover:text-slate-600 underline">← Back to Options</button>
          </div>
        </form>
      `;

      document.getElementById("rzp-back-card").onclick = () => this.open();
      document.getElementById("rzp-card-form").onsubmit = (e) => {
        e.preventDefault();
        showProcessing();
      };
    };

    const showProcessing = () => {
      const body = document.getElementById("rzp-body");
      body.innerHTML = `
        <div class="text-center py-8 space-y-4">
          <div class="inline-block h-10 w-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
          <div>
            <h4 class="font-bold text-sm text-slate-800">Processing Payment...</h4>
            <p class="text-xs text-slate-500">Please do not refresh this page or click back.</p>
          </div>
        </div>
      `;

      setTimeout(() => {
        showOtpScreen();
      }, 1500);
    };

    const showOtpScreen = () => {
      const body = document.getElementById("rzp-body");
      body.innerHTML = `
        <div class="text-center py-4 space-y-4">
          <div class="h-10 w-10 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto text-lg">🔑</div>
          <div>
            <h4 class="font-bold text-sm text-slate-800">Enter OTP</h4>
            <p class="text-xs text-slate-500">A one-time password has been sent to your registered mobile number. Enter <span class="font-bold">123456</span> for demo success.</p>
          </div>
          <div class="max-w-xs mx-auto">
            <input id="rzp-otp-code" type="text" placeholder="123456" class="w-full text-center px-4 py-2 border border-slate-200 rounded-lg text-sm mb-3 tracking-[0.5em] font-bold" />
            <button id="rzp-otp-submit" class="w-full bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all">Submit OTP</button>
          </div>
          <p class="text-[10px] text-slate-400">Didn't receive the OTP? <span class="text-slate-600 font-semibold cursor-pointer">Resend OTP</span></p>
        </div>
      `;

      document.getElementById("rzp-otp-submit").onclick = () => {
        const code = document.getElementById("rzp-otp-code").value;
        if (code === "123456") {
          showSuccess();
        } else {
          alert("Invalid OTP! For demo success, enter 123456.");
        }
      };
    };

    const showSuccess = () => {
      const body = document.getElementById("rzp-body");
      body.innerHTML = `
        <div class="text-center py-8 space-y-4">
          <div class="h-14 w-14 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto text-2xl animate-bounce">✓</div>
          <div>
            <h4 class="font-bold text-base text-slate-800">Payment Successful!</h4>
            <p class="text-xs text-slate-500">Redirecting you back to the merchant...</p>
          </div>
        </div>
      `;

      setTimeout(() => {
        cleanup();
        const paymentResponse = {
          razorpay_payment_id: "pay_sim_" + Math.random().toString(36).substr(2, 9),
          razorpay_order_id: this.options.order_id || "order_sim_" + Math.random().toString(36).substr(2, 9),
          razorpay_signature: "sig_sim_" + Math.random().toString(36).substr(2, 16)
        };
        this.options.handler(paymentResponse);
      }, 1500);
    };
  }
}
export default loadRazorpay;
