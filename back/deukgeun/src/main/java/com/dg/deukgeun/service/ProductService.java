package com.dg.deukgeun.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dg.deukgeun.dto.ProductDTO;
import com.dg.deukgeun.entity.Gym;
import com.dg.deukgeun.entity.Product;
import com.dg.deukgeun.repository.GymRepository;
import com.dg.deukgeun.repository.ProductRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class ProductService {
    private final ModelMapper modelMapper;
    private final ProductRepository productRepository;
    private final GymRepository gymRepository;

    public List<ProductDTO> getList(Integer gymId){
        List<Product> result = productRepository.findAllBygymGymId(gymId);
        List<ProductDTO> dtoList = new ArrayList<>();
        for(int i=0;i<result.size();i++){
            ProductDTO dto = new ProductDTO();
            dto.setDays(result.get(i).getDays());
            dto.setGymId(gymId);
            dto.setPrice(result.get(i).getPrice());
            dto.setProductId(result.get(i).getProductId());
            dto.setProductName(result.get(i).getProductName());
            dto.setPtCountTotal(result.get(i).getPtCountTotal());
            dtoList.add(dto);
        }
        return dtoList;
    }

    public Map<String,String> insertList (List<ProductDTO> dtoList){
        List<Product> productList = new ArrayList<>();
        for(int i=0;i<dtoList.size();i++){
            Product product = new Product(dtoList.get(i));
            Optional<Gym> result = gymRepository.findById(dtoList.get(i).getGymId());
            Gym gym = result.orElseThrow();
            product.setGym(gym);
            productList.add(product);
        }
        productRepository.saveAll(productList);
        return Map.of("RESULT","SUCCESS");
    }
}
