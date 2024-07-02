package com.dg.deukgeun.config;

import org.modelmapper.ModelMapper;
import org.modelmapper.PropertyMap;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.dg.deukgeun.dto.WorkoutSessionDTO;
import com.dg.deukgeun.entity.WorkoutSession;

@Configuration
public class ModelMapperConfig {

    @Bean
    public ModelMapper modelMapper() {
        ModelMapper modelMapper = new ModelMapper();
        modelMapper.addMappings(new PropertyMap<WorkoutSessionDTO, WorkoutSession>() {
            @Override
            protected void configure() {
                map().setUser(source.getPtSession().getPt().getUser());
            }
        });
        return modelMapper;
    }
}
