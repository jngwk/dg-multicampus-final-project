package com.dg.deukgeun.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "chartdata")
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor

public class Chart {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String label;
    private int value;

    //setters

    public void setId(Long id) {
        this.id = id;
    }
    
    public void setLabel(String label) {
        this.label = label;
    }

    public void setValue(int value) {
        this.value = value;
    }
}
