package com.dg.deukgeun.entity;

<<<<<<< HEAD
import com.dg.deukgeun.dto.gym.TrainerDTO;

=======
>>>>>>> 60c7921400a822dc5e01e98e4e5368d3a2a03d12
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
<<<<<<< HEAD
import jakarta.persistence.ManyToOne;
=======
>>>>>>> 60c7921400a822dc5e01e98e4e5368d3a2a03d12
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "trainers")
<<<<<<< HEAD
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Trainer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer trainerId;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "gym_id")
    private Gym gym;

    private String trainerCareer;
    private String trainerAbout;
    private String trainerImage;

    public Trainer(TrainerDTO dto) {
        this.trainerId = dto.getTrainerId();
        this.user = new User();
        this.gym = new Gym();
        this.trainerCareer = dto.getTrainerCareer();
        this.trainerAbout = dto.getTrainerAbout();
        this.trainerImage = dto.getTrainerImage();
    }
}
=======
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Trainer {
    @Id
    private int trainerId;

    @OneToOne
    @JoinColumn(name= "trainerId", referencedColumnName = "userId")
    private User user;

    private String trainerCareer;
    private String trainerAbout;
    private String trainerImage;
}
>>>>>>> 60c7921400a822dc5e01e98e4e5368d3a2a03d12
