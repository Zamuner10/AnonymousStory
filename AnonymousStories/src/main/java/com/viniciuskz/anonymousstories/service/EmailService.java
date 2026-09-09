package com.viniciuskz.anonymousstories.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class EmailService {

    @Value("${app.base-url}")
    private String baseUrl;

    @Value("${resend.api.key}")
    private String apiKey;

    @Value("${resend.from.email:onboarding@resend.dev}")
    private String mailFrom;

    private final RestTemplate restTemplate;

    public EmailService() {
        this.restTemplate = new RestTemplate();
    }

    @Async
    public void sendVerificationEmail(String toEmail, String token) {
        String confirmationUrl = baseUrl + "/users/verify?token=" + token;

        String htmlContent = """
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&display=swap" rel="stylesheet">
    </head>
    <body style="margin: 0; padding: 0; background-color: #f7f3eb; font-family: 'Caveat', cursive, ui-sans-serif, system-ui;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%%" style="table-layout: fixed; background-color: #f7f3eb;">
        <tr>
          <td align="center" style="padding: 40px 16px;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%%" style="max-width: 460px; background-color: rgba(255,254,248,0.97); border: 2.5px solid #1a1208; border-radius: 12px; overflow: hidden; text-align: center;">
              <tr>
                <td style="padding: 36px 32px 8px 32px;">
                  <h1 style="margin: 0; font-family: 'Caveat', cursive, sans-serif; font-size: 28px; font-weight: 700; color: #1a1208;">
                    Histórias <span style="color: #b07030;">Anônimas</span>
                  </h1>
                </td>
              </tr>
              <tr>
                <td style="padding: 12px 32px 36px 32px; color: #1a1208; font-size: 16px; line-height: 1.6;">
                  <p style="margin-top: 0; font-family: 'Caveat', cursive, sans-serif; font-size: 24px; font-weight: 700; color: #1a1208; margin-bottom: 8px;">Confirme seu e-mail</p>
                  <p style="margin-bottom: 28px; color: #1a1208; font-size: 17px; font-weight: 600;">
                    Obrigado por se cadastrar! Clique no botão abaixo para ativar sua conta e liberar o seu acesso para publicação.
                  </p>
                  <table border="0" cellpadding="0" cellspacing="0" width="100%%">
                    <tr>
                      <td align="center">
                        <a href="%s" target="_blank" style="background-color: #2563eb; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; border: 2.5px solid #1a1208; font-family: 'Caveat', cursive, sans-serif; font-weight: 700; font-size: 20px; display: inline-block;">
                          Ativar Minha Conta
                        </a>
                      </td>
                    </tr>
                  </table>
                  <p style="font-size: 14px; color: #5a4020; margin-top: 32px; margin-bottom: 0;">
                    Se o botão não funcionar, copie e cole este link:<br>
                    <a href="%s" style="color: #2563eb; word-break: break-all; text-decoration: underline; font-weight: 700;">%s</a>
                  </p>
                </td>
              </tr>
              <tr>
                <td style="background-color: rgba(26,18,8,0.04); padding: 20px 32px; border-top: 1px solid rgba(26,18,8,0.15); font-size: 13px; color: #5a4020; line-height: 1.5;">
                  Se você não solicitou este cadastro, ignore este e-mail.<br>
                  &copy; Histórias Anônimas.
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    """.formatted(confirmationUrl, confirmationUrl, confirmationUrl);

        executeResendSend(toEmail, "Ative sua conta - Histórias Anônimas", htmlContent);
    }

    @Async
    public void sendPasswordResetEmail(String toEmail, String resetLink) {
        String htmlContent = """
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&display=swap" rel="stylesheet">
                    <style>
                        body { font-family: 'Caveat', cursive, sans-serif; background-color: #f7f3eb; color: #1a1208; margin: 0; padding: 20px; }
                        .card { background-color: #fffdfc; border: 2.5px solid #1a1208; border-radius: 8px; max-width: 500px; margin: 0 auto; padding: 30px; text-align: center; }
                        .title { font-size: 30px; font-weight: bold; color: #1a1208; margin-bottom: 10px; }
                        .highlight { color: #b07030; }
                        .text { font-size: 20px; color: #1a1208; margin-bottom: 25px; line-height: 1.5; font-weight: 600; }
                        .btn { display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 26px; font-size: 20px; font-weight: bold; border-radius: 6px; border: 2.5px solid #1a1208; }
                    </style>
                </head>
                <body>
                    <div class="card">
                        <div class="title">Histórias <span class="highlight">Anônimas</span></div>
                        <p class="text">Recebemos uma solicitação para redefinir a senha da sua conta.</p>
                        <p class="text">Clique no botão abaixo para escolher uma nova senha. Este link expira em <strong>30 minutos</strong>.</p>
                        <a href="%s" class="btn">Redefinir Minha Senha</a>
                        <p class="text" style="font-size: 16px; margin-top: 30px; color: #5a4020;">Se você não solicitou a redefinição, apenas ignore este e-mail.</p>
                    </div>
                </body>
                </html>
                """.formatted(resetLink);

        executeResendSend(toEmail, "Redefinição de Senha - Histórias Anônimas", htmlContent);
    }

    private void executeResendSend(String toEmail, String subject, String htmlBody) {
        try {
            String url = "https://api.resend.com/emails";

            Map<String, Object> payload = new HashMap<>();
            payload.put("from", "Histórias Anônimas <" + mailFrom + ">");
            payload.put("to", new String[]{toEmail});
            payload.put("subject", subject);
            payload.put("html", htmlBody);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                System.out.println(">>> E-MAIL ENVIADO COM SUCESSO VIA RESEND PARA: " + toEmail);
            } else {
                System.err.println(">>> FALHA NO DISPARO VIA RESEND PARA " + toEmail + ". Status: " + response.getStatusCode());
            }

        } catch (Exception e) {
            System.err.println(">>> ERRO CRÍTICO NO DISPARO DE E-MAIL RESEND PARA " + toEmail + ": " + e.getMessage());
            e.printStackTrace();
        }
    }
}