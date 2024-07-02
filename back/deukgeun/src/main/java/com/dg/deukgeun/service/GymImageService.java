//gachudon has made this file.

package com.dg.deukgeun.service;

import java.util.ArrayList;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dg.deukgeun.dto.gym.GymImageDTO;
import com.dg.deukgeun.entity.GymImage;
import com.dg.deukgeun.repository.GymImageRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
@Transactional
@RequiredArgsConstructor
public class GymImageService {
    private final ModelMapper modelMapper;
    @Autowired
    private GymImageRepository gymImageRepository;

    //헬스장 이미지 입력
    public void insertList(List<GymImageDTO> dtoList){
        List<GymImage> gymImageList = new ArrayList<GymImage>();
        for(int i = 0;i<dtoList.size();i++){
            gymImageList.add(modelMapper.map(dtoList.get(i),GymImage.class));
        }
        log.info("Inserted {} gym images", gymImageList.size());
        gymImageRepository.saveAll(gymImageList);
    }

    public List<GymImageDTO> getByGymId(Integer gymId){
        List<GymImage> result = gymImageRepository.findByGymId(gymId);
        List<GymImageDTO> dtoList = new ArrayList<GymImageDTO>();
        for(int i=0;i<result.size();i++){
            dtoList.add(modelMapper.map(result.get(i),GymImageDTO.class));
        }
        return dtoList;
    }
    public void remove(String gymImage){
        gymImageRepository.deleteById(gymImage);
    }
}
