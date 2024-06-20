package com.dg.deukgeun.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dg.deukgeun.entity.Gym;
import com.dg.deukgeun.repository.GymRepository;

@Service
public class SearchService {

    @Autowired
    private GymRepository gymRepository;

    public List<Gym> searchGyms(String keyword) {
        String processedKeyword = keyword.replaceAll("\\s+", "").toLowerCase();
        return gymRepository.searchGyms(processedKeyword);
    }
    
}
