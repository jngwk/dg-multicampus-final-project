package com.dg.deukgeun.entity;
import com.dg.deukgeun.dto.ProductDTO;

//작성자 : 허승돈
//수정자 : 허승돈
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name="product")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer productId;
    
    @ManyToOne
    @JoinColumn(name="gym_id")
    private Gym gym;
    private Integer price;
    private Integer days;
    private String productName;
    private Integer ptCountTotal;

    public Product(ProductDTO dto){
        this.gym = new Gym();
        this.price = dto.getPrice();
        this.days = dto.getDays();
        this.productName = dto.getProductName();
        this.ptCountTotal = dto.getPtCountTotal();
    }
}
