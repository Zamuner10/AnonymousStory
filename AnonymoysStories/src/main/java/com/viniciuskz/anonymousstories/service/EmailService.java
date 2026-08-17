package com.viniciuskz.anonymousstories.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.base-url}")
    private String baseUrl;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendVerificationEmail(String toEmail, String token) {
        String confirmationUrl = baseUrl + "/users/verify?token=" + token;

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(toEmail);
            helper.setSubject("Ative sua conta - Anonymous Stories");

            String htmlContent = """
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%%" style="table-layout: fixed; background-color: #f1f5f9;">
        <tr>
          <td align="center" style="padding: 40px 16px;">
            
            <!-- Card Principal (Equivalent to Tailwind: bg-white rounded-2xl shadow-lg border border-slate-100) -->
            <table border="0" cellpadding="0" cellspacing="0" width="100%%" style="max-width: 480px; background-color: #ffffff; border-radius: 16px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); overflow: hidden; text-align: center;">
              
              <!-- Cabeçalho -->
              <tr>
                <td style="padding: 36px 32px 12px 32px;">
                  <h1 style="margin: 0; font-size: 24px; font-weight: 800; color: #0f172a; letter-spacing: -0.025em;">
                    Anonymous Stories
                  </h1>
                </td>
              </tr>

              <!-- Conteúdo -->
              <tr>
                <td style="padding: 12px 32px 36px 32px; color: #475569; font-size: 15px; line-height: 1.625;">
                  <p style="margin-top: 0; font-size: 18px; font-weight: 600; color: #1e293b; margin-bottom: 8px;">Confirme seu e-mail</p>
                  <p style="margin-bottom: 28px; color: #64748b; font-size: 14px;">
                    Obrigado por se cadastrar! Clique no botão abaixo para ativar sua conta e liberar o seu acesso para publicação.
                  </p>
                  
                  <!-- Botão de Ação (Equivalent to Tailwind: bg-blue-600 rounded-xl px-6 py-3.5 text-white font-semibold) -->
                  <table border="0" cellpadding="0" cellspacing="0" width="100%%">
                    <tr>
                      <td align="center">
                        <a href="%s" target="_blank" style="background-color: #2563eb; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 15px; display: inline-block; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);">
                          Ativar Minha Conta
                        </a>
                      </td>
                    </tr>
                  </table>

                  <!-- Link Alternativo -->
                  <p style="font-size: 12px; color: #94a3b8; margin-top: 32px; margin-bottom: 0;">
                    Se o botão não funcionar, copie e cole este link:<br>
                    <a href="%s" style="color: #2563eb; word-break: break-all; text-decoration: underline;">%s</a>
                  </p>
                </td>
              </tr>

              <!-- Rodapé (Equivalent to Tailwind: bg-slate-50 text-slate-400) -->
              <tr>
                <td style="background-color: #f8fafc; padding: 20px 32px; border-top: 1px solid #f1f5f9; font-size: 12px; color: #94a3b8; line-height: 1.5;">
                  Se você não solicitou este cadastro, ignore este e-mail.<br>
                  &copy; Anonymous Stories.
                </td>
              </tr>

            </table>

          </td>
        </tr>
      </table>
    </body>
    </html>
    """.formatted(confirmationUrl, confirmationUrl, confirmationUrl);
            helper.setText(htmlContent, true);

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Erro ao enviar o e-mail de ativação", e);
        }
    }
}