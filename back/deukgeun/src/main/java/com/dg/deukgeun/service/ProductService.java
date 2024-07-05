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
import lombok.extern.log4j.Log4j2;

@Log4j2
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
            dto.setStatus(result.get(i).isStatus());
            dtoList.add(dto);
        }
        return dtoList;
    }

    public ProductDTO get(Integer productId){
        Optional<Product> result = productRepository.findById(productId);
        Product product = result.orElseThrow();
        ProductDTO dto = modelMapper.map(product,ProductDTO.class);
        return dto;
    }

    @Transactional
    public Map<String,String> insertList (List<ProductDTO> dtoList){
        List<Product> productList = new ArrayList<>();
        for (ProductDTO dto : dtoList) {
            Product product = new Product(); // ModelMapper 대신 수동으로 매핑
                product.setDays(dto.getDays());
                product.setPrice(dto.getPrice());
                product.setProductName(dto.getProductName());
                product.setPtCountTotal(dto.getPtCountTotal());
                product.setStatus(true);
            // Gym 조회
            Optional<Gym> result = gymRepository.findById(dto.getGymId());
            Gym gym = result.orElseThrow(() -> new RuntimeException("해당 gymId에 해당하는 헬스장이 존재하지 않습니다."));
            
            // Product에 Gym 설정
            product.setGym(gym);
            
            productList.add(product);
        }
        productRepository.saveAll(productList);
        return Map.of("RESULT","SUCCESS");
    }

    // public void deleteByGymId(Integer gymId){
    //     productRepository.deleteBygymGymId(gymId);
    // }

    @Transactional
    public void deleteProductByGymId(Integer gymId){
        try {
            List<Product> products = productRepository.findAllBygymGymId(gymId);
            log.info("Found {} products for gymId: {}", products.size(), gymId);
            
            for (Product product : products) {
                product.setStatus(false);
                log.info("Setting status to false for product: {}", product.getProductId());
            }
            
            List<Product> savedProducts = productRepository.saveAll(products);
            log.info("Saved {} products", savedProducts.size());
        } catch (Exception e) {
            log.error("Error while deleting products for gymId: " + gymId, e);
            throw new RuntimeException("Failed to delete products", e);
        }
    }
    public void deleteProductByProductId(Integer productId){
        Optional<Product> result = productRepository.findById(productId);
        Product product = result.orElseThrow();
        product.setStatus(false);
        productRepository.save(product);
    }
}
