package com.dg.deukgeun.Entity;

import com.dg.deukgeun.dto.gym.GymSignUpDTO;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "gym")
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Gym {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer gymId;
    private String gymName;
    private String crNumber;
    private String phoneNumber;
    private String address;
    private String detailAddress;
    private String operatingHours;
    private String prices;
    private String introduce;
    private Integer userId;

    public Gym(GymSignUpDTO dto) {
        this.userId = dto.getUserId();
        this.gymName = dto.getGymName();
        this.crNumber = dto.getCrNumber();
        this.phoneNumber = dto.getPhoneNumber();
        this.address = dto.getAddress();
        this.detailAddress = dto.getDetailAddress();
        this.operatingHours = dto.getOperatingHours();
        this.prices = dto.getPrices();
        this.introduce = dto.getIntroduce();
    }
}
