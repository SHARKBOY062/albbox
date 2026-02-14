export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed",
    });
  }

  try {
    const { amount, name, document, phone, external_id } = req.body || {};

    if (!amount || !name || !document || !phone || !external_id) {
      return res.status(400).json({
        success: false,
        error: "Missing fields",
      });
    }

    // 🔐 Validação ENV
    if (!process.env.BSXNEX_AUTH_KEY || !process.env.BSXNEX_SECRET_KEY) {
      return res.status(500).json({
        success: false,
        error: "Environment variables not configured",
      });
    }

    const response = await fetch(
      "https://bsxnex.live/api/transaction/pix",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Key": process.env.BSXNEX_AUTH_KEY,
          "X-Secret-Key": process.env.BSXNEX_SECRET_KEY,
        },
        body: JSON.stringify({
          amount: Number(amount),
          name,
          document,
          phone,
          external_id,
        }),
      }
    );

    const data = await response.json().catch(() => ({}));

    if (!response.ok || !data?.success) {
      return res.status(400).json({
        success: false,
        error: data?.error || "PIX error",
        raw: data,
      });
    }

    return res.status(200).json({
      success: true,
      qr_code_text: data.qr_code_text,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
}
