package com.dg.deukgeun.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.dg.deukgeun.entity.Membership;
import com.dg.deukgeun.entity.Qna;
import com.dg.deukgeun.repository.MembershipRepository;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private MembershipRepository membershipRepository;

    @Value("${admin.email}")
    private String adminEmail;

    public void sendVerificationEmail(String toEmail, String verificationCode) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("[득근] 이메일 인증");
        message.setText("아래 인증번호를 입력해주세요. \n\n" + verificationCode);
        mailSender.send(message);
    }

    public void sendResetPasswordEmail(String toEmail, String resetToken) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("[득근] 비밀번호 재설정 요청");
        message.setText("비밀번호 재설정을 위해 아래 링크를 클릭하세요: \n"
                + "http://localhost3000/api/user/resetPW?token=" + resetToken);
        mailSender.send(message);
    }

    public boolean isValidEmailAddress(String email) {
        String emailRegex = "^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$";
        return email != null && email.matches(emailRegex);
    }

    // @Scheduled(cron = "0 0 9 * * ?")
    @Scheduled(cron = "0 23 14 * * ?")
    public void sendExpiringNotifications() {
        LocalDate today = LocalDate.now();
        String expirationDate = today.plusDays(7).toString();
        List<Membership> expiringMemberships = membershipRepository.findByExpDate(expirationDate);

        List<String> toEmails = new ArrayList<>();
        for (Membership membership : expiringMemberships) {
            toEmails.add(membership.getUser().getEmail());
        }

        String subject = "[득근] 회원권 만료 예정 알림";
        String body = "득근을 이용해 주셔서 감사합니다.\n\n회원님의 회원권이 7일 뒤 만료가 됨을 알려드립니다.\n\nPT가 남아있는 경우, 만료 이전에 모두 사용하시길 바랍니다.\n\n'득근' 내정보에서 회원권을 간편하게 연장하실 수 있습니다.\n\n회원님의 건강을 위한 '득근'이 되겠습니다.";

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmails.toArray(new String[toEmails.size()]));
        message.setSubject(subject);
        message.setText(body);

        mailSender.send(message);

    }

    @Scheduled(cron = "0 0 9 * * ?")
    public void sendExpiredNotifications() {
        LocalDate today = LocalDate.now();
        String expirationDate = today.toString();
        List<Membership> expiringMemberships = membershipRepository.findByExpDate(expirationDate);

        List<String> toEmails = new ArrayList<>();
        for (Membership membership : expiringMemberships) {
            toEmails.add(membership.getUser().getEmail());
        }

        String subject = "[득근] 회원권 만료 알림";
        String body = "득근을 이용해 주셔서 감사합니다.\n\n회원님의 회원권이 만료 됐음을 알려드립니다.\n\n'득근' 내정보에서 회원권을 간편하게 회원권 및 PT를 연장하실 수 있습니다.\n\n회원님의 건강을 위한 '득근'이 되겠습니다.";

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmails.toArray(new String[toEmails.size()]));
        message.setSubject(subject);
        message.setText(body);

        mailSender.send(message);

    }

    public void sendQnaRegisterNotification(Qna qna) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(qna.getEmail());
        message.setSubject("[득근] 문의 등록 완료 알림");
        message.setText(
                "득근을 이용해 주셔서 감사합니다.\n\n문의 등록이 완료 됐음을 알려드립니다.\n\n영업일 기준 48시간 이내에 이메일로 답변 알림을 보내드립니다.\n\n\n=================\n\n제목:\n"
                        + qna.getTitle() + "\n\n등록된 문의:\n"
                        + qna.getContent());
        mailSender.send(message);
        sendQnaRegistraionNotificationToAdmin(qna);
    }

    private void sendQnaRegistraionNotificationToAdmin(Qna qna) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(adminEmail);
        message.setSubject("[득근] 문의 등록 알림");
        message.setText(
                "문의가 등록 됐음을 알려드립니다.\n\n영업일 기준 48시간 이내에 답변 부탁드립니다.\n\n\n=================\n\n제목:\n"
                        + qna.getTitle() + "\n\n등록된 문의:\n"
                        + qna.getContent());
        mailSender.send(message);
    }

    public void sendQnaReplyNotification(Qna qna) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(qna.getEmail());
        message.setSubject("[득근] 문의 답변 완료 알림");
        message.setText(
                "득근을 이용해 주셔서 감사합니다.\n\n문의 등록이 완료 됐음을 알려드립니다.\n\n영업일 기준 48시간 이내에 이메일로 답변 알림을 보내드립니다.\n\n\n=================\n\n제목:\n"
                        + qna.getTitle() + "등록된 문의:\n"
                        + qna.getContent() + "\n\n답변:\n" + qna.getReply());
        mailSender.send(message);
    }

}
