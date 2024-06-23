package com.dg.deukgeun.service;

import java.util.ArrayList;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dg.deukgeun.dto.ProductDTO;
import com.dg.deukgeun.entity.Product;
import com.dg.deukgeun.repository.ProductRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class ProductService {
    private final ModelMapper modelMapper;
    private final ProductRepository productRepository;

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
}
