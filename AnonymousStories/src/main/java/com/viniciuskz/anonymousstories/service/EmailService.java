package com.viniciuskz.anonymousstories.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.base-url}")
    private String baseUrl;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Async
    public void sendVerificationEmail(String toEmail, String token) {
        // NOTA: este link continua apontando pro BACKEND de propósito
        // (não pro frontend) — é o endpoint GET /users/verify que
        // efetivamente marca a conta como verificada no banco. Depois de
        // verificar, esse endpoint mostra um botão pro frontend (isso já
        // está corrigido em UserController, usando app.frontend-url em
        // vez do endereço errado que tinha antes).
        String confirmationUrl = baseUrl + "/users/verify?token=" + token;

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(toEmail);
            helper.setSubject("Ative sua conta - Histórias Anônimas");

            // Redesenhado para seguir o mesmo padrão visual do site
            // (papel #f7f3eb, tinta #1a1208, destaque #b07030, fonte
            // Caveat) — antes era um card branco/azul genérico. A maioria
            // dos clientes de e-mail (Gmail, Outlook) bloqueia fontes
            // customizadas por padrão, então Caveat aparece só como
            // reforço quando o cliente permite — o layout (cores, botão,
            // bordas) funciona em qualquer cliente, com ou sem a fonte.
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

            <!-- Card Principal -->
            <table border="0" cellpadding="0" cellspacing="0" width="100%%" style="max-width: 460px; background-color: rgba(255,254,248,0.97); border: 2.5px solid #1a1208; border-radius: 12px; overflow: hidden; text-align: center;">

              <!-- Cabeçalho -->
              <tr>
                <td style="padding: 36px 32px 8px 32px;">
                  <h1 style="margin: 0; font-family: 'Caveat', cursive, sans-serif; font-size: 26px; font-weight: 700; color: #1a1208;">
                    Histórias <span style="color: #b07030;">Anônimas</span>
                  </h1>
                </td>
              </tr>

              <!-- Conteúdo -->
              <tr>
                <td style="padding: 12px 32px 36px 32px; color: #5a4020; font-size: 16px; line-height: 1.6;">
                  <p style="margin-top: 0; font-family: 'Caveat', cursive, sans-serif; font-size: 22px; font-weight: 700; color: #1a1208; margin-bottom: 8px;">Confirme seu e-mail</p>
                  <p style="margin-bottom: 28px; color: #5a4020; font-size: 15px;">
                    Obrigado por se cadastrar! Clique no botão abaixo para ativar sua conta e liberar o seu acesso para publicação.
                  </p>

                  <!-- Botão de Ação -->
                  <table border="0" cellpadding="0" cellspacing="0" width="100%%">
                    <tr>
                      <td align="center">
                        <a href="%s" target="_blank" style="background-color: #1a1208; color: #f7f3eb; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-family: 'Caveat', cursive, sans-serif; font-weight: 700; font-size: 18px; display: inline-block;">
                          Ativar Minha Conta
                        </a>
                      </td>
                    </tr>
                  </table>

                  <!-- Link Alternativo -->
                  <p style="font-size: 12px; color: #8a7355; margin-top: 32px; margin-bottom: 0;">
                    Se o botão não funcionar, copie e cole este link:<br>
                    <a href="%s" style="color: #b07030; word-break: break-all; text-decoration: underline;">%s</a>
                  </p>
                </td>
              </tr>

              <!-- Rodapé -->
              <tr>
                <td style="background-color: rgba(26,18,8,0.04); padding: 20px 32px; border-top: 1px solid rgba(26,18,8,0.15); font-size: 12px; color: #8a7355; line-height: 1.5;">
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
            helper.setText(htmlContent, true);

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Erro ao enviar o e-mail de ativação", e);
        }
    }

    @Async
    public void sendPasswordResetEmail(String toEmail, String resetLink){
        try{
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(toEmail);
            helper.setSubject("Passowrd Reset - Anonymous Stories");

            String htmlContent = """
                    <!DOCTYPE html>
                                    <html>
                                    <head>
                                        <meta charset="UTF-8">
                                        <style>
                                            body { font-family: 'Caveat', cursive, serif; background-color: #f7f3eb; color: #1a1208; margin: 0; padding: 20px; }
                                            .card { background-color: #fffdfc; border: 2px solid #1a1208; border-radius: 8px; max-width: 500px; margin: 0 auto; padding: 30px; text-align: center; }
                                            .title { font-size: 28px; font-weight: bold; color: #1a1208; margin-bottom: 10px; }
                                            .highlight { color: #b07030; }
                                            .text { font-size: 20px; margin-bottom: 25px; line-height: 1.5; }
                                            .btn { display: inline-block; background-color: #1a1208; color: #f7f3eb; text-decoration: none; padding: 12px 24px; font-size: 20px; font-weight: bold; border-radius: 4px; }
                                        </style>
                                    </head>
                                    <body>
                                        <div class="card">
                                            <div class="title">Histórias <span class="highlight">Anônimas</span></div>
                                            <p class="text">Recebemos uma solicitação para redefinir a senha da sua conta.</p>
                                            <p class="text">Clique no botão abaixo para escolher uma nova senha. Este link expira em <strong>30 minutos</strong>.</p>
                                            <a href="%s" class="btn">Redefinir Minha Senha</a>
                                            <p class="text" style="font-size: 16px; margin-top: 30px; opacity: 0.7;">Se você não solicitou a redefinição, apenas ignore este e-mail.</p>
                                        </div>
                                    </body>
                                    </html>
                                    """.formatted(resetLink);

                    helper.setText(htmlContent, true);
                    mailSender.send(message);
        }catch (MessagingException e) {
            throw new RuntimeException("Falied to send password reset email.", e);
        }
    }
}