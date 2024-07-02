package com.dg.deukgeun.service;

import java.util.ArrayList;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dg.deukgeun.dto.review.ReviewImageDTO;
import com.dg.deukgeun.entity.ReviewImage;
import com.dg.deukgeun.repository.ReviewImageRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class ReviewImageService {
    private final ModelMapper modelMapper;
    @Autowired
    private ReviewImageRepository reviewImageRepository;
    public void insertList(List<ReviewImageDTO> dtoList){
        List<ReviewImage> reviewImageList = new ArrayList<ReviewImage>();
        for(int i = 0;i<dtoList.size();i++){
            reviewImageList.add(modelMapper.map(dtoList.get(i),ReviewImage.class));
        }
        reviewImageRepository.saveAll(reviewImageList);
    }

    public List<ReviewImageDTO> getByReviewId(Integer reviewId){
        List<ReviewImage> result = reviewImageRepository.findByReviewId(reviewId);
        List<ReviewImageDTO> dtoList = new ArrayList<ReviewImageDTO>();
        for(int i=0;i<result.size();i++){
            dtoList.add(modelMapper.map(result.get(i),ReviewImageDTO.class));
        }
        return dtoList;
    }
    public void remove(String reviewImage){
        reviewImageRepository.deleteById(reviewImage);
    }
}
