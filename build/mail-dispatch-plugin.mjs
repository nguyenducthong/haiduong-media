import nodemailer from "nodemailer";
import getRawBody from "raw-body";

export function mailDispatchPlugin() {
  return {
    name: "sites-mail-dispatch",
    configureServer(server) {
      server.middlewares.use("/__sites_mail_dispatch", async (req, res) => {
        res.setHeader("Cache-Control", "no-store");
        res.setHeader("Content-Type", "application/json");

        if (req.method !== "POST") {
          res.statusCode = 405;
          res.end(JSON.stringify({ success: false, error: "Method Not Allowed" }));
          return;
        }

        try {
          const raw = await getRawBody(req, { limit: 131072 });
          const payload = JSON.parse(new TextDecoder("utf-8").decode(raw));
          const { action, config, to, subject, html, text } = payload;

          if (!config || !config.host || !config.user || !config.pass) {
            res.statusCode = 400;
            res.end(JSON.stringify({ success: false, error: "Thiếu thông tin cấu hình SMTP." }));
            return;
          }

          const cleanPass = String(config.pass).replace(/\s+/g, "");
          const isGmail = config.host.toLowerCase().includes("gmail");
          const port = Number(config.port) || (isGmail ? 465 : 587);
          const secure = isGmail ? true : (config.secure ?? (port === 465));

          const transporter = nodemailer.createTransport({
            host: config.host.trim(),
            port,
            secure,
            auth: {
              user: config.user.trim(),
              pass: cleanPass,
            },
          });

          if (action === "verify") {
            await transporter.verify();
            console.log(`[SMTP Mailer Node] Verify OK for ${config.user.trim()} on ${config.host}:${port}`);
            res.statusCode = 200;
            res.end(JSON.stringify({ success: true, message: "Kết nối máy chủ SMTP thành công!" }));
            return;
          }

          if (action === "send") {
            const fromName = config.from ? config.from.replace(/"/g, "") : "Hệ Thống Quản Trị";
            const fromAddress = `"${fromName}" <${config.user.trim()}>`;
            const info = await transporter.sendMail({
              from: fromAddress,
              to,
              subject,
              html,
              text,
            });
            console.log(`[SMTP Mailer Node] Sent email to ${to}, messageId: ${info.messageId}`);
            res.statusCode = 200;
            res.end(JSON.stringify({ success: true, messageId: info.messageId }));
            return;
          }

          res.statusCode = 400;
          res.end(JSON.stringify({ success: false, error: "Hành động không hợp lệ" }));
        } catch (err) {
          console.error("[SMTP Mailer Node Error]:", err?.message || err);
          res.statusCode = 200;
          res.end(JSON.stringify({ success: false, error: err?.message || "Lỗi kết nối máy chủ gửi mail." }));
        }
      });
    },
  };
}
