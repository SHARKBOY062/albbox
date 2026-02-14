export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    const { amount, name, document, phone, external_id } = req.body || {};

    if (!amount || !name || !document || !phone || !external_id) {
      return res.status(400).json({ success: false, error: "Missing fields" });
    }

    const baseUrl = "https://bsxnex.live/api/transaction/pix";

    const r = await fetch(baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Auth-Key": process.env.BSX_AUTH_KEY,
        "X-Secret-Key": process.env.BSX_SECRET_KEY,
      },
      body: JSON.stringify({
        amount: Number(amount),
        name,
        document,
        phone,
        external_id,
      }),
    });

    const data = await r.json().catch(() => ({}));

    if (!r.ok || !data?.success) {
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
    return res.status(500).json({ success: false, error: "Server error" });
  }
}
