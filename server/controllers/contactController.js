const axios = require("axios");

exports.contactUs = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body; // ✅ phone add kiya

    if (!name || !email || !message) {
      // phone optional rahega
      return res
        .status(400)
        .json({ success: false, message: "Please enter all required fields" });
    }

    // Validation for phone (if provided)
    if (phone && phone.length > 15) {
      return res
        .status(400)
        .json({ success: false, message: "Phone number is too long" });
    }

    // --- DEBUGGING ---
    console.log("---------------------------------------");
    console.log("📨 New Contact Form Submission:");
    console.log("👤 Name:", name);
    console.log("📧 Email:", email);
    console.log("📱 Phone:", phone || "Not provided");
    console.log("📝 Message:", message.substring(0, 50) + "...");
    console.log("---------------------------------------");

    // Telegram Message Format
    const text = `
📬 *New Portfolio Message*

👤 *Name:* ${name}
📧 *Email:* ${email}
${phone ? `📱 *Phone:* ${phone}\n` : ""}
📝 *Message:* 
${message}

⏰ *Time:* ${new Date().toLocaleString()}
    `.trim();

    // Send to Telegram
    await axios.post(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text: text,
        parse_mode: "Markdown",
      }
    );

    console.log("✅ Message Sent to Telegram!");

    res.status(200).json({
      success: true,
      message: "Message Sent Successfully!",
    });
  } catch (error) {
    console.log(
      "❌ TELEGRAM ERROR:",
      error.response ? error.response.data : error.message
    );

    res.status(500).json({
      success: false,
      message: "Server Error: Could not send message!",
    });
  }
};
